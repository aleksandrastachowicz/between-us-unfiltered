import { useRef, useState } from "react";
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
import { RulesSheet } from "./RulesSheet";
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
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full [&_svg]:h-6 [&_svg]:w-6"
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
        className="flex h-8 items-center gap-1.5 rounded-full px-3.5"
        style={{ background: "#17121A" }}
      >
        <span className="text-[11px] font-extrabold uppercase tracking-[0.08em]" style={{ color: "#E6C487" }}>
          {UNFILTERED_LEVELS[ufLevel].label[lang]}
        </span>
        {LEVEL_ORDER.map((l, i) => (
          <span
            key={l}
            className="h-2 w-2 rounded-full"
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
  const { lang, card, drawCard, goBack, history, backToDecks, players, currentPlayer, decks, activeTab, flushGuestSession, seenRules, setSeenRules } = useGame();
  const [rulesOpen, setRulesOpen] = useState(!seenRules);
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const c = t[lang];
  const canGoBack = history.length > 0;
  const playerName = players.length > 0 ? players[currentPlayer] : null;
  // A fresh key every time a card is shown (also when going back), so a card that just flew away is never reused.
  const seq = useRef(0);
  const lastCard = useRef(card);
  // Which way the deck moves: forward (new card comes in from the right) or back (from the left).
  const dir = useRef<1 | -1>(1);
  const lastHistory = useRef(history.length);
  if (lastCard.current !== card) {
    dir.current = history.length < lastHistory.current ? -1 : 1;
    lastCard.current = card;
    seq.current += 1;
  }
  lastHistory.current = history.length;

  const doReset = () => {
    setConfirmReset(false);
    backToDecks();
    if (!user) flushGuestSession();
  };

  return (
    <div
      className="game-screen relative mx-auto flex h-dvh w-full max-w-lg flex-col px-4 [--chrome:330px] md:max-w-2xl md:[--chrome:335px] lg:[--card-max:580px] lg:[--chrome:228px] lg:[--controls-max:380px]"
      style={{
        // The card is the hero; the buttons line up with its width, the tab bar spans the screen.
        ["--card-w" as string]: "min(100%, var(--card-max, 460px), calc((100dvh - var(--chrome, 300px)) * 5 / 7))",
        ["--controls-w" as string]: "min(100%, var(--controls-max, 9999px), max(340px, min(460px, calc((100dvh - var(--chrome, 300px)) * 5 / 7))))",
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
                <span className="text-[11px] font-extrabold uppercase tracking-[0.22em]" style={{ color: "var(--muted-text)" }}>
                  {c.nowAnswers}
                </span>
                <span className="max-w-full truncate text-[22px] leading-tight lg:text-[24px]" style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}>
                  {playerName}
                </span>
              </motion.div>
            </AnimatePresence>
          ) : (
            <span className="pt-3 text-[20px] leading-none lg:text-[22px]" style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}>
              between us
            </span>
          )}
          {decks.unfiltered && activeTab === "play" && <LevelChip />}
        </div>
        <RoundButton label={c.settings} onClick={() => setSettingsOpen(true)}>
          <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
        </RoundButton>
      </header>

      <div className={`flex min-h-0 flex-1 flex-col items-center py-4 ${activeTab === "play" ? "justify-center" : "justify-start overflow-y-auto"}`}>
        {activeTab === "play" && (
          <AnimatePresence mode="popLayout" initial={false}>
            {card && (
              <motion.div
                key={`${card.id}-${seq.current}`}
                custom={dir.current}
                initial={{ opacity: 0, x: 70 * dir.current, rotate: 4 * dir.current, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.14 } }}
                transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.8 }}
                className="px-1"
                style={{ width: "var(--card-w)" }}
              >
                <PlayingCard card={card} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        {activeTab === "play" && (
        <div className="mt-6 flex shrink-0 gap-2.5 md:mt-8 lg:mt-7" style={{ width: "var(--controls-w)" }}>
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            aria-label={c.prev}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] transition-opacity disabled:opacity-40 lg:h-12 lg:w-12 lg:rounded-2xl"
            style={{ background: "var(--panel)", border: "1.5px solid var(--border)", color: "var(--ink)" }}
          >
            <Undo2 className="h-6 w-6" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={drawCard}
            className="h-14 flex-1 rounded-[18px] text-[19px] lg:h-12 lg:rounded-2xl lg:text-[17px]"
            style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }}
          >
            {c.next}
          </button>
        </div>
        )}
        {activeTab === "history" && <HistoryView />}
        {activeTab === "favorites" && <FavoritesView />}
        {activeTab === "insights" && <InsightsView />}
      </div>

      <BottomTabs />

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <LevelUpCard />
      <RulesSheet
        open={rulesOpen}
        onClose={() => {
          setRulesOpen(false);
          setSeenRules(true);
        }}
      />

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
