import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  QUESTIONS,
  type CategoryId,
  type DeckId,
  type Lang,
  type Question,
} from "@/data/questions";
import { type UnfilteredQuestion } from "@/data/unfiltered";
import { nextUnfiltered, primeUnfiltered } from "@/lib/unfilteredClient";
import { haptic, HAPTIC } from "@/lib/haptics";

export type ThemeId = "rose" | "fairy" | "violet" | "spicy";
export type Mode = "light" | "dark";
export type Screen = "deck" | "game";

export interface DrawnCard {
  id: string;
  pl: string;
  en: string;
  category: CategoryId | "unfiltered";
  unfilteredLevel?: UnfilteredQuestion["level"];
  intensity?: number;
}

interface State {
  // settings
  lang: Lang;
  theme: ThemeId;
  mode: Mode;
  animations: boolean;
  players: string[];
  // decks
  decks: Record<DeckId, boolean>;
  categories: Record<CategoryId, boolean>;
  // session
  screen: Screen;
  currentPlayer: number;
  progress: number; // relationship_progress 0-100
  card: DrawnCard | null;
  flipped: boolean;
  discard: Set<string>;
  drawCount: number;

  // actions
  setLang: (l: Lang) => void;
  setTheme: (t: ThemeId) => void;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
  toggleAnimations: () => void;
  setPlayers: (p: string[]) => void;
  toggleDeck: (d: DeckId) => void;
  toggleCategory: (c: CategoryId) => void;
  startGame: () => void;
  backToDecks: () => void;
  drawCard: () => void;
  flip: () => void;
  setProgress: (n: number) => void;
}

// Draw-variety trackers (module-scoped; reset on reload).
let lastStaticCategory: CategoryId | null = null;
let lastWasUnfiltered = false;

/**
 * Picks a static question with strong category variety: choose a category
 * first (uniformly, avoiding the previous one when possible) so decks with
 * many questions in one category don't dominate the draw.
 */
function pickStatic(state: State): Question | null {
  const avail = QUESTIONS.filter((q) => {
    if (!state.decks[q.deck]) return false;
    if (!state.categories[q.category]) return false;
    return !state.discard.has(q.id);
  });
  if (avail.length === 0) return null;

  const cats = Array.from(new Set(avail.map((q) => q.category)));
  let choices = cats;
  if (cats.length > 1 && lastStaticCategory) {
    const filtered = cats.filter((c) => c !== lastStaticCategory);
    if (filtered.length) choices = filtered;
  }
  const cat = choices[Math.floor(Math.random() * choices.length)];
  lastStaticCategory = cat;

  const inCat = avail.filter((q) => q.category === cat);
  return inCat[Math.floor(Math.random() * inCat.length)];
}

export const useGame = create<State>()(
  persist(
    (set, get) => ({
      lang: "pl",
      theme: "rose",
      mode: "light",
      animations: true,
      players: [],
      decks: { basic: true, plus: false, unfiltered: false },
      categories: {
        love: true,
        friendship: true,
        selfdev: true,
        passions: true,
        introspection: true,
        plus_love: true,
        plus_spice: true,
        plus_deep: true,
        plus_kinky: true,
      },
      screen: "deck",
      currentPlayer: 0,
      progress: 0,
      card: null,
      flipped: false,
      discard: new Set<string>(),
      drawCount: 0,

      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((s) => ({ mode: s.mode === "light" ? "dark" : "light" })),
      toggleAnimations: () => set((s) => ({ animations: !s.animations })),
      setPlayers: (players) => set({ players }),
      toggleDeck: (d) =>
        set((s) => ({ decks: { ...s.decks, [d]: !s.decks[d] } })),
      toggleCategory: (c) =>
        set((s) => ({ categories: { ...s.categories, [c]: !s.categories[c] } })),

      startGame: () => {
        const s = get();
        if (s.decks.unfiltered) primeUnfiltered(s.progress);
        set({ screen: "game", card: null, flipped: false, discard: new Set(), drawCount: 0, currentPlayer: 0 });
        get().drawCard();
      },
      backToDecks: () => set({ screen: "deck" }),

      drawCard: () => {
        const s = get();
        const anyStatic = s.decks.basic || s.decks.plus;
        let useUnfiltered: boolean;
        if (!s.decks.unfiltered) useUnfiltered = false;
        else if (!anyStatic) useUnfiltered = true;
        else useUnfiltered = Math.random() < (lastWasUnfiltered ? 0.3 : 0.55);
        lastWasUnfiltered = useUnfiltered;

        let card: DrawnCard | null = null;
        if (useUnfiltered) {
          const q = nextUnfiltered(s.progress);
          card = {
            id: q.id,
            pl: q.pl,
            en: q.en,
            category: "unfiltered",
            unfilteredLevel: q.level,
            intensity: q.intensity,
          };
        } else {
          const q = pickStatic(s);
          if (q) {
            card = { id: q.id, pl: q.pl, en: q.en, category: q.category };
          } else if (s.decks.unfiltered) {
            const u = nextUnfiltered(s.progress);
            card = { id: u.id, pl: u.pl, en: u.en, category: "unfiltered", unfilteredLevel: u.level, intensity: u.intensity };
          }
        }

        if (!card) {
          // pool exhausted: reset discard and retry once
          set({ discard: new Set() });
          const q = pickStatic({ ...s, discard: new Set() } as State);
          if (q) card = { id: q.id, pl: q.pl, en: q.en, category: q.category };
        }

        set((st) => {
          const nextDiscard = new Set(st.discard);
          if (card) nextDiscard.add(card.id);
          const nextPlayer =
            st.players.length > 0 && st.drawCount > 0
              ? (st.currentPlayer + 1) % st.players.length
              : st.currentPlayer;
          return {
            card,
            flipped: false,
            discard: nextDiscard,
            drawCount: st.drawCount + 1,
            currentPlayer: nextPlayer,
          };
        });
        if (get().decks.unfiltered) primeUnfiltered(get().progress);
      },

      flip: () => set((s) => ({ flipped: !s.flipped })),
      setProgress: (n) => set({ progress: Math.max(0, Math.min(100, n)) }),
    }),
    {
      name: "between-us",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted) => {
        const s = (persisted ?? {}) as Record<string, unknown>;
        const validThemes: ThemeId[] = ["rose", "fairy", "violet", "spicy"];
        if (!validThemes.includes(s.theme as ThemeId)) s.theme = "rose";
        if (s.mode !== "light" && s.mode !== "dark") s.mode = "light";
        const cats = (s.categories ?? {}) as Record<string, boolean>;
        if (typeof cats.plus_deep !== "boolean") cats.plus_deep = true;
        if (typeof cats.plus_kinky !== "boolean") cats.plus_kinky = true;
        s.categories = cats;
        return s;
      },
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
        mode: s.mode,
        animations: s.animations,
        players: s.players,
        decks: s.decks,
        categories: s.categories,
        progress: s.progress,
      }),
      skipHydration: true,
    },
  ),
);
