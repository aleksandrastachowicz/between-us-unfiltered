import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, SlidersHorizontal, Undo2, Check } from "lucide-react";
import { useGame } from "@/lib/store";
import { PlayingCard } from "./PlayingCard";
import { Settings } from "./Settings";
import { LEVEL_ORDER, UNFILTERED_LEVELS } from "@/data/unfiltered";
import { BottomTabs } from "./BottomTabs";
import { HistoryView } from "./HistoryView";
import { FavoritesView } from "./FavoritesView";
import { InsightsView } from "./InsightsView";
import { LevelUpCard } from "./LevelUpCard";
import { useAuth } from "@/lib/useAuth";
import { ConfirmDialog } from "./ConfirmDialog";
import { DISPLAY_FONT } from "./CardArt";

const ROMAN = ["I", "II", "III"];

const t = {
  pl: {
    next: "Następna karta",
    nowAnswers: "Teraz odpowiada",
    prev: "Poprzednia karta",
    back: "Wróć do wyboru talii",
    settings: "Ustawienia",
    level: "Poziom Bez filtra",
    pickLevel: "Wybierz poziom",
    resetTitle: "Wrócić do wyboru talii?",
    resetGuest: "Grasz jako gość, więc ta rozmowa, imiona graczy i postęp zostaną usunięte.",
    resetUser: "Ta runda się zakończy. Twoje dane zostają zapisane w chmurze.",
    resetOk: "Wróć",
    cancel: "Zostań",
  },
  en: {
    next: "Next card",
    nowAnswers: "Now answering",
    prev: "Previous card",
    back: "Back to deck selection",
    settings: "Settings",
    level: "Unfiltered level",
    pickLevel: "Choose a level",
    resetTitle: "Back to deck selection?",
    resetGuest: "You are playing as a guest, so this conversation, player names and progress will be deleted.",
    resetUser: "This round will end. Your data stays saved in the cloud.",
    resetOk: "Go back",
    cancel: "Stay",
  },
};

function RoundButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      style={{ background: "var(--panel)", color: "var(--ink)" }}
    >
      {children}
    </button>
  );
}

/** Small chip under the player's name: current Unfiltered level, tap to change it (also to go back a level). */
function LevelChip() {
  const { lang, ufLevel, setUfLevel } = useGame();
  const [open, setOpen] = useState(false);
  const c = t[lang];
  const idx = LEVEL_ORDER.indexOf(ufLevel);
  return (
    <div className="relative mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${c.level}: ${UNFILTERED_LEVELS[ufLevel].label[lang]}. ${c.pickLevel}`}
        className="flex h-7 items-center gap-1.5 rounded-full px-3"
        style={{ background: "#17121A" }}
      >
        <span className="text-[10px] font-extrabold uppercase tracking-[0.08em]" style={{ color: "#E6C487" }}>
          {UNFILTERED_LEVELS[ufLevel].label[lang]}
        </span>
        {LEVEL_ORDER.map((l, i) => (
          <span
            key={l}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: i <= idx ? "#D9B26F" : "rgba(217,178,111,0.3)" }}
          />
        ))}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute left-1/2 top-9 z-40 w-64 -translate-x-1/2 rounded-2xl p-1.5 text-left"
              style={{ background: "var(--panel)", boxShadow: "0 18px 40px -16px rgba(0,0,0,0.45)" }}
            >
              {LEVEL_ORDER.map((l, i) => {
                const on = l === ufLevel;
                return (
                  <li key={l}>
                    <button
                      type="button"
                      onClick={() => {
                        setUfLevel(l);
                        setOpen(false);
                      }}
                      className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left"
                      style={{ background: on ? "var(--panel-2)" : "transparent" }}
                    >
                      <span className="mt-0.5 w-6 shrink-0 text-[12px] font-extrabold" style={{ color: "var(--ink)" }}>
                        {ROMAN[i]}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-[14px] font-extrabold" style={{ color: "var(--text)" }}>
                          {UNFILTERED_LEVELS[l].label[lang]}
                        </span>
                        <span className="text-[12px] leading-snug" style={{ color: "var(--sub-text)" }}>
                          {UNFILTERED_LEVELS[l].description[lang]}
                        </span>
                      </span>
                      {on && <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--ink)" }} />}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GameScreen() {
  const { lang, card, drawCard, goBack, history, backToDecks, players, currentPlayer, decks, activeTab, flushGuestSession } = useGame();
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const c = t[lang];
  const canGoBack = history.length > 0;
  const playerName = players.length > 0 ? players[currentPlayer] : null;

  const doReset = () => {
    setConfirmReset(false);
    backToDecks();
    if (!user) flushGuestSession();
  };

  return (
    <div
      className="game-screen relative mx-auto flex h-dvh w-full max-w-lg flex-col px-4 lg:max-w-xl"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
    >
      <header className="grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2 pt-2">
        <RoundButton label={c.back} onClick={() => setConfirmReset(true)}>
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </RoundButton>
        <div className="flex min-w-0 flex-col items-center">
          {playerName ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPlayer + playerName}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex min-w-0 flex-col items-center"
                aria-live="polite"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em]" style={{ color: "var(--muted-text)" }}>
                  {c.nowAnswers}
                </span>
                <span className="max-w-full truncate text-[20px] leading-tight" style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}>
                  {playerName}
                </span>
              </motion.div>
            </AnimatePresence>
          ) : (
            <span className="pt-2.5 text-[18px] leading-none" style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}>
              between us
            </span>
          )}
          {decks.unfiltered && activeTab === "play" && <LevelChip />}
        </div>
        <RoundButton label={c.settings} onClick={() => setSettingsOpen(true)}>
          <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
        </RoundButton>
      </header>

      <div className={`flex min-h-0 flex-1 flex-col items-center py-3 ${activeTab === "play" ? "justify-center" : "justify-start overflow-y-auto"}`}>
        {activeTab === "play" && (
          <AnimatePresence mode="wait">
            {card && (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -16 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className="px-1"
                style={{ width: "min(100%, 400px, calc((100dvh - 290px) * 5 / 7))" }}
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
        <div className="flex shrink-0 gap-2.5">
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            aria-label={c.prev}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] transition-opacity disabled:opacity-40"
            style={{ background: "var(--panel)", border: "1.5px solid var(--border)", color: "var(--ink)" }}
          >
            <Undo2 className="h-[22px] w-[22px]" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={drawCard}
            className="h-14 flex-1 rounded-[18px] text-[17px]"
            style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }}
          >
            {c.next}
          </button>
        </div>
      )}

      <BottomTabs />

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <LevelUpCard />

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
