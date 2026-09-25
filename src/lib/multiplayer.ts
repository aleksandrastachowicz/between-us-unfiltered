// Between Us — realtime multiplayer session syncing.
// Access to game_sessions is gated by SECURITY DEFINER RPCs:
//   - create_session → returns a fresh 4-char code and a secret host_token
//   - join_session   → given a code, returns state + host_token
//   - update_session → requires code + host_token to write state
// State propagates between peers via Realtime Broadcast (no direct table
// SELECT grant is needed), and every write is authorized by the per-room
// token that only callers who joined via the code have ever seen.
import { create } from "zustand";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useGame, type DrawnCard } from "@/lib/store";
import type { CategoryId, DeckId, Lang } from "@/data/questions";

export interface SharedState {
  lang: Lang;
  decks: Record<DeckId, boolean>;
  categories: Record<CategoryId, boolean>;
  screen: "deck" | "game";
  currentPlayer: number;
  progress: number;
  card: DrawnCard | null;
  flipped: boolean;
  discard: string[];
  drawCount: number;
  players: string[];
  history: { card: DrawnCard; currentPlayer: number }[];
}

function snapshot(): SharedState {
  const s = useGame.getState();
  return {
    lang: s.lang,
    decks: s.decks,
    categories: s.categories,
    screen: s.screen,
    currentPlayer: s.currentPlayer,
    progress: s.progress,
    card: s.card,
    flipped: s.flipped,
    discard: [...s.discard],
    drawCount: s.drawCount,
    players: s.players,
    history: s.history,
  };
}

function shallowEqShared(a: SharedState, b: SharedState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

let applyingRemote = false;

function applyShared(state: SharedState) {
  applyingRemote = true;
  useGame.setState({
    lang: state.lang,
    decks: state.decks,
    categories: state.categories,
    screen: state.screen,
    currentPlayer: state.currentPlayer,
    progress: state.progress,
    card: state.card,
    flipped: state.flipped,
    discard: new Set(state.discard ?? []),
    drawCount: state.drawCount,
    players: state.players ?? [],
    history: state.history ?? [],
  });
  setTimeout(() => {
    applyingRemote = false;
  }, 0);
}

interface MpState {
  code: string | null;
  status: "idle" | "connecting" | "connected" | "error";
  isHost: boolean;
  error: string | null;
  createRoom: () => Promise<string | null>;
  joinRoom: (code: string) => Promise<boolean>;
  leaveRoom: () => void;
}

let channel: RealtimeChannel | null = null;
let unsubStore: (() => void) | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let lastPushed: string = "";
let hostToken: string | null = null;

function teardown() {
  if (channel) {
    void supabase.removeChannel(channel);
    channel = null;
  }
  if (unsubStore) {
    unsubStore();
    unsubStore = null;
  }
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  hostToken = null;
}

async function pushNow(code: string) {
  if (!hostToken) return;
  const shared = snapshot();
  const serialized = JSON.stringify(shared);
  if (serialized === lastPushed) return;
  lastPushed = serialized;
  // Persist via SECURITY DEFINER RPC — server verifies the room token.
  const { error } = await supabase.rpc("update_session", {
    _code: code,
    _host_token: hostToken,
    _state: shared as unknown as never,
  });
  if (error) console.warn("multiplayer push failed", error);
  // Fan out to peers via Realtime Broadcast for low-latency updates.
  if (channel) {
    void channel.send({ type: "broadcast", event: "state", payload: shared });
  }
}

function startSyncing(code: string) {
  unsubStore = useGame.subscribe(() => {
    if (applyingRemote) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => void pushNow(code), 150);
  });

  channel = supabase
    .channel(`room:${code}`)
    .on("broadcast", { event: "state" }, (msg) => {
      const incoming = (msg as { payload?: SharedState }).payload;
      if (!incoming) return;
      const serialized = JSON.stringify(incoming);
      if (serialized === lastPushed) return;
      lastPushed = serialized;
      if (!shallowEqShared(incoming, snapshot())) applyShared(incoming);
    })
    .subscribe();
}

export const useMultiplayer = create<MpState>((set) => ({
  code: null,
  status: "idle",
  isHost: false,
  error: null,

  createRoom: async () => {
    set({ status: "connecting", error: null });
    teardown();
    const shared = snapshot();
    lastPushed = JSON.stringify(shared);
    const { data, error } = await supabase.rpc("create_session", {
      _state: shared as unknown as never,
    });
    const row = (Array.isArray(data) ? data[0] : data) as
      | { code: string; host_token: string }
      | null;
    if (error || !row?.code || !row?.host_token) {
      set({ status: "error", error: error?.message ?? "Could not create room" });
      return null;
    }
    hostToken = row.host_token;
    startSyncing(row.code);
    set({ code: row.code, status: "connected", isHost: true });
    return row.code;
  },

  joinRoom: async (raw: string) => {
    const code = raw.trim().toUpperCase();
    if (!/^[A-Z0-9]{4}$/.test(code)) return false;
    set({ status: "connecting", error: null });
    teardown();
    const { data, error } = await supabase.rpc("join_session", { _code: code });
    const row = (Array.isArray(data) ? data[0] : data) as
      | { state: SharedState; host_token: string }
      | null;
    if (error || !row?.state || !row?.host_token) {
      set({ status: "error", error: error?.message ?? "Room not found" });
      return false;
    }
    hostToken = row.host_token;
    lastPushed = JSON.stringify(row.state);
    applyShared(row.state);
    startSyncing(code);
    set({ code, status: "connected", isHost: false });
    return true;
  },

  leaveRoom: () => {
    teardown();
    lastPushed = "";
    set({ code: null, status: "idle", isHost: false, error: null });
  },
}));
