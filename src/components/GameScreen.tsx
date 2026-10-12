import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings as Cog, ChevronLeft, Shuffle, Undo2 } from "lucide-react";
import { useGame } from "@/lib/store";
import { PlayingCard } from "./PlayingCard";
import { Settings } from "./Settings";
import { UNFILTERED_LEVELS, levelForProgress } from "@/data/unfiltered";
import { BottomTabs } from "./BottomTabs";
import { HistoryView } from "./HistoryView";
import { FavoritesView } from "./FavoritesView";
import { InsightsView } from "./InsightsView";
import { useAuth } from "@/lib/useAuth";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "./ui/button";

const t = {
  pl: {
    next: "Następna karta", turn: "Tura", progress: "Poziom intymności", draw: "Dobierz kartę", prev: "Poprzednia",
    resetTitle: "Zresetować talię?",
    resetGuest: "Grasz jako gość — bieżąca sesja, imiona graczy i postęp zostaną bezpowrotnie usunięte.",
    resetUser: "Wrócisz do wyboru talii. Bieżąca runda zostanie zakończona, a Twoje dane pozostaną zapisane w chmurze.",
    resetOk: "Resetuj",
    cancel: "Anuluj",
  },
  en: {
    next: "Next card", turn: "Turn", progress: "Intimacy level", draw: "Draw a card", prev: "Previous",
    resetTitle: "Reset deck?",
    resetGuest: "You are playing as a guest — the current session, player names and progress will be permanently deleted.",
    resetUser: "You will return to deck selection. The current round ends, but your data stays saved in the cloud.",
    resetOk: "Reset",
    cancel: "Cancel",
  },
};

export function GameScreen() {
  const { lang, card, flipped, drawCard, goBack, history, backToDecks, players, currentPlayer, decks, progress, setProgress, activeTab, flushGuestSession } = useGame();
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const c = t[lang];
  const level = levelForProgress(progress);
  const lvlMeta = UNFILTERED_LEVELS[level];
  const canGoBack = history.length > 0;

  const handleBack = () => setConfirmReset(true);

  const doReset = () => {
    setConfirmReset(false);
    backToDecks();
    if (!user) flushGuestSession();
  };

  const handleNext = () => {
    if (decks.unfiltered) setProgress(Math.min(100, progress + 4));
    drawCard();
  };

  return (
    <div
      className="game-screen relative mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 sm:px-5"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <header className="mb-2 grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <Button variant="secondary" size="icon" aria-label={lang === "pl" ? "Wróć do wyboru talii" : "Back to deck selection"} onClick={handleBack} className="h-11 w-11 rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        {players.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPlayer + players[currentPlayer]}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="min-w-0 truncate rounded-full px-3 py-2 text-center text-sm font-bold"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              {c.turn}: {players[currentPlayer]}
            </motion.div>
          </AnimatePresence>
        ) : (
          <button
            onClick={handleBack}
            className="text-sm font-extrabold tracking-tight"
            style={{ fontFamily: "Helvetica, Inter, system-ui, sans-serif" }}
            aria-label={lang === "pl" ? "Wróć do wyboru talii" : "Back to deck selection"}
          >
            Between Us
          </button>
        )}
        <Button variant="secondary" size="icon" aria-label={lang === "pl" ? "Ustawienia" : "Settings"} onClick={() => setSettingsOpen(true)} className="h-11 w-11 rounded-full">
          <Cog className="h-5 w-5" />
        </Button>
      </header>

      {activeTab === "play" && decks.unfiltered && (
        <div className="mb-4 rounded-2xl p-3" style={{ background: "var(--panel)" }}>
          <div className="mb-1.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-xs">
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
            aria-label={c.progress}
          />
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-visible py-1">
        {activeTab === "play" && (
          <AnimatePresence mode="wait">
            {card && (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className="w-full px-2 py-2"
              >
                <PlayingCard card={card} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        {activeTab === "history" && <HistoryView />}
        {activeTab === "favorites" && <FavoritesView />}
        {activeTab === "insights" && <InsightsView />}
      </div>

      {activeTab === "play" && (
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
      )}

      <BottomTabs />

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <ConfirmDialog
        open={confirmReset}
        title={c.resetTitle}
        body={user ? c.resetUser : c.resetGuest}
        confirmLabel={c.resetOk}
        cancelLabel={c.cancel}
        onCancel={() => setConfirmReset(false)}
        onConfirm={doReset}
      />
    </div>
  );
}
