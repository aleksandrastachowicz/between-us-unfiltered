import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  QUESTIONS,
  type CategoryId,
  type DeckId,
  type Lang,
  type Question,
} from "@/data/questions";
import { generateUnfiltered, type UnfilteredQuestion } from "@/data/unfiltered";

export type ThemeId = "acid" | "solar" | "velvet" | "midnight";
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

function pickStatic(state: State): Question | null {
  const pool = QUESTIONS.filter((q) => {
    if (!state.decks[q.deck]) return false;
    if (q.deck === "basic" && !state.categories[q.category]) return false;
    return !state.discard.has(q.id);
  });
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const useGame = create<State>()(
  persist(
    (set, get) => ({
      lang: "pl",
      theme: "acid",
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
      toggleAnimations: () => set((s) => ({ animations: !s.animations })),
      setPlayers: (players) => set({ players }),
      toggleDeck: (d) =>
        set((s) => ({ decks: { ...s.decks, [d]: !s.decks[d] } })),
      toggleCategory: (c) =>
        set((s) => ({ categories: { ...s.categories, [c]: !s.categories[c] } })),

      startGame: () => {
        set({ screen: "game", card: null, flipped: false, discard: new Set(), drawCount: 0, currentPlayer: 0 });
        get().drawCard();
      },
      backToDecks: () => set({ screen: "deck" }),

      drawCard: () => {
        const s = get();
        const anyStatic = s.decks.basic || s.decks.plus;
        const useUnfiltered =
          s.decks.unfiltered && (!anyStatic || Math.random() < 0.5);

        let card: DrawnCard | null = null;
        if (useUnfiltered) {
          const q = generateUnfiltered(s.progress);
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
            const u = generateUnfiltered(s.progress);
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
      },

      flip: () => set((s) => ({ flipped: !s.flipped })),
      setProgress: (n) => set({ progress: Math.max(0, Math.min(100, n)) }),
    }),
    {
      name: "between-us",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        lang: s.lang,
        theme: s.theme,
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
