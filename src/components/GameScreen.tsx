import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Shuffle, Undo2, Heart, Share2 } from "lucide-react";
import { useGame } from "@/lib/store";
import { PlayingCard } from "./PlayingCard";
import { CATEGORY_META, EDITION_META, editionForCategory } from "@/data/questions";
import { UNFILTERED_LEVELS, levelForProgress } from "@/data/unfiltered";
import { generateShareCard, accentHexFor } from "@/lib/shareCard";

const t = {
  pl: { turn: "Tura", progress: "Poziom intymności", draw: "Dobierz kartę", next: "Następna karta", prev: "Poprzednia", save: "Zapisz", share: "Udostępnij" },
  en: { turn: "Turn", progress: "Intimacy level", draw: "Draw a card", next: "Next card", prev: "Previous", save: "Save", share: "Share" },
};

export function GameScreen() {
  const { lang, card, flipped, drawCard, goBack, history, backToDecks, players, currentPlayer, decks, progress, setProgress, favorites, toggleFavorite } = useGame();
  const c = t[lang];
  const level = levelForProgress(progress);
  const lvlMeta = UNFILTERED_LEVELS[level];
  const canGoBack = history.length > 0;
  const isFav = card ? favorites.some((f) => f.id === card.id) : false;

  const handleNext = () => {
    if (decks.unfiltered) setProgress(Math.min(100, progress + 4));
    drawCard();
  };

  const handleShare = () => {
    if (!card) return;
    void generateShareCard({
      primary: lang === "pl" ? card.pl : card.en,
      secondary: lang === "pl" ? card.en : card.pl,
      category:
        card.category === "unfiltered"
          ? `${UNFILTERED_LEVELS[card.unfilteredLevel ?? "love_spice"].emoji} ${UNFILTERED_LEVELS[card.unfilteredLevel ?? "love_spice"].label[lang]}`
          : CATEGORY_META[card.category].label[lang],
      edition: EDITION_META[editionForCategory(card.category)][lang],
      accent: accentHexFor(card.category),
    });
  };

  return (
    <div className="relative mx-auto flex h-[100dvh] w-full max-w-lg flex-col overflow-hidden px-5 pb-5 pt-[calc(env(safe-area-inset-top)+4rem)]">
      {/* Compact header — sits below the global top nav */}
      <header className="mb-2 flex h-10 shrink-0 items-center justify-between gap-2">
        <button onClick={backToDecks} aria-label="Back" className="rounded-full p-2.5" style={{ background: "var(--panel)" }}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        {players.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPlayer + players[currentPlayer]}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="truncate rounded-full px-4 py-2 text-sm font-bold"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              {c.turn}: {players[currentPlayer]}
            </motion.div>
          </AnimatePresence>
        ) : (
          <span className="text-sm font-extrabold tracking-tight">Between Us</span>
        )}
        <span className="w-10" aria-hidden />
      </header>

      {decks.unfiltered && (
        <div className="mb-2 shrink-0 rounded-2xl p-3" style={{ background: "var(--panel)" }}>
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

      {/* Card zone — flexible, with generous safe space above/below for swipe gestures */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-2">
        <AnimatePresence mode="wait">
          {card && (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="flex min-h-0 w-full flex-1 items-center justify-center"
            >
              <PlayingCard card={card} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discrete actions bar under the card */}
        <div className="mt-3 flex shrink-0 items-center gap-2">
          <button
            onClick={() => card && toggleFavorite(card)}
            aria-label={c.save}
            className="flex items-center justify-center rounded-full p-3 transition-transform active:scale-90"
            style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
          >
            <Heart
              className="h-5 w-5 transition-colors"
              style={{ color: isFav ? "var(--accent)" : "var(--muted-text)" }}
              fill={isFav ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={handleShare}
            aria-label={c.share}
            className="flex items-center justify-center rounded-full p-3 transition-transform active:scale-90"
            style={{ background: "var(--panel)", border: "1px solid var(--border)" }}
          >
            <Share2 className="h-5 w-5" style={{ color: "var(--muted-text)" }} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex shrink-0 items-center gap-3">
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
    </div>
  );
}
