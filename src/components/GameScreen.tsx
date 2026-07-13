import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings as Cog, ChevronLeft, Shuffle, Undo2 } from "lucide-react";
import { useGame } from "@/lib/store";
import { PlayingCard } from "./PlayingCard";
import { Settings } from "./Settings";
import { UNFILTERED_LEVELS, levelForProgress } from "@/data/unfiltered";

const t = {
  pl: { next: "Następna karta", turn: "Tura", progress: "Poziom intymności", draw: "Dobierz kartę", prev: "Poprzednia" },
  en: { next: "Next card", turn: "Turn", progress: "Intimacy level", draw: "Draw a card", prev: "Previous" },
};

export function GameScreen() {
  const { lang, card, flipped, drawCard, goBack, history, backToDecks, players, currentPlayer, decks, progress, setProgress } = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const c = t[lang];
  const level = levelForProgress(progress);
  const lvlMeta = UNFILTERED_LEVELS[level];
  const canGoBack = history.length > 0;

  const handleNext = () => {
    if (decks.unfiltered) setProgress(Math.min(100, progress + 4));
    drawCard();
  };

  return (
    <div
      className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 sm:px-5"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <header className="mb-2 flex items-center justify-between">
        <button onClick={backToDecks} className="rounded-full p-2.5" style={{ background: "var(--panel)" }}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        {players.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPlayer + players[currentPlayer]}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-full px-4 py-2 text-sm font-bold"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              {c.turn}: {players[currentPlayer]}
            </motion.div>
          </AnimatePresence>
        ) : (
          <span className="text-sm font-extrabold tracking-tight">Between Us</span>
        )}
        <button onClick={() => setSettingsOpen(true)} className="rounded-full p-2.5" style={{ background: "var(--panel)" }}>
          <Cog className="h-5 w-5" />
        </button>
      </header>

      {decks.unfiltered && (
        <div className="mb-4 rounded-2xl p-3" style={{ background: "var(--panel)" }}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-bold">{lvlMeta.emoji} {lvlMeta.label[lang]}</span>
            <span style={{ color: "var(--muted-text)" }}>{c.progress}: {progress}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {card && (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="w-full"
            >
              <PlayingCard card={card} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <AnimatePresence initial={false}>
          {canGoBack && (
            <motion.button
              key="prev"
              initial={{ opacity: 0, width: 0, scale: 0.9 }}
              animate={{ opacity: 1, width: "auto", scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.9 }}
              onClick={goBack}
              aria-label={c.prev}
              className="flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl px-4 py-4 text-sm font-bold"
              style={{ background: "var(--panel)", color: "var(--text)" }}
            >
              <Undo2 className="h-4 w-4" />
              <span className="hidden sm:inline">{c.prev}</span>
            </motion.button>
          )}
        </AnimatePresence>
        <button
          onClick={handleNext}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold transition-all"
          style={{
            background: flipped ? "var(--accent)" : "var(--panel)",
            color: flipped ? "var(--accent-ink)" : "var(--text)",
            boxShadow: flipped ? "0 16px 36px -16px var(--accent)" : "none",
          }}
        >
          <Shuffle className="h-4 w-4" />
          {flipped ? c.next : c.draw}
        </button>
      </div>

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
