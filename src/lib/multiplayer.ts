// Between Us — realtime multiplayer session syncing.
// A room is a single shared game state row keyed by a short code. All connected
// players read/write the same row; Supabase Realtime broadcasts every change so
// draws, flips, turns, language swaps and deck selections stay in sync.
// The row also serves as durable persistence: rejoining a code resumes exactly.
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
  });
  // release on next tick so the resulting store notification is ignored
  setTimeout(() => {
    applyingRemote = false;
  }, 0);
}

function randomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
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
}

async function pushNow(code: string) {
  const shared = snapshot();
  const serialized = JSON.stringify(shared);
  if (serialized === lastPushed) return;
  lastPushed = serialized;
  const { error } = await supabase
    .from("game_sessions")
    .update({ state: shared as unknown as never })
    .eq("code", code);
  if (error) console.warn("multiplayer push failed", error);
}

function startSyncing(code: string) {
  // Push local shared-state changes (debounced) to the room.
  unsubStore = useGame.subscribe(() => {
    if (applyingRemote) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => void pushNow(code), 150);
  });

  // Apply remote changes as they arrive.
  channel = supabase
    .channel(`room:${code}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "game_sessions", filter: `code=eq.${code}` },
      (payload) => {
        const row = payload.new as { state?: SharedState } | null;
        if (!row?.state) return;
        const incoming = row.state;
        const serialized = JSON.stringify(incoming);
        if (serialized === lastPushed) return; // our own echo
        lastPushed = serialized;
        if (!shallowEqShared(incoming, snapshot())) applyShared(incoming);
      },
    )
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
    const code = randomCode();
    const shared = snapshot();
    lastPushed = JSON.stringify(shared);
    const { error } = await supabase
      .from("game_sessions")
      .insert({ code, state: shared as unknown as never });
    if (error) {
      set({ status: "error", error: error.message });
      return null;
    }
    startSyncing(code);
    set({ code, status: "connected", isHost: true });
    return code;
  },

  joinRoom: async (raw: string) => {
    const code = raw.trim().toUpperCase();
    if (!code) return false;
    set({ status: "connecting", error: null });
    teardown();
    const { data, error } = await supabase
      .from("game_sessions")
      .select("state")
      .eq("code", code)
      .maybeSingle();
    if (error || !data) {
      set({ status: "error", error: error?.message ?? "Room not found" });
      return false;
    }
    // Resume from persisted state.
    lastPushed = JSON.stringify(data.state);
    applyShared(data.state as unknown as SharedState);
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
