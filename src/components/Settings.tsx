import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { X, Plus, Users, Wifi, Copy, Check, LogOut, UserRound, BookOpen, ChevronRight } from "lucide-react";
import { useGame, THEMES, type ThemeId } from "@/lib/store";
import { useMultiplayer } from "@/lib/multiplayer";
import { useAuth, signOut } from "@/lib/useAuth";
import type { Lang } from "@/data/questions";
import { ConfirmDialog } from "./ConfirmDialog";
import { RulesSheet } from "./RulesSheet";
import { InstallCard } from "./InstallApp";
import { DISPLAY_FONT } from "./CardArt";

const t = {
  pl: {
    settings: "Ustawienia",
    close: "Zamknij",
    account: "Konto",
    saved: "Historia i ulubione zapisane w chmurze",
    guest: "Grasz bez konta",
    guestD: "Zaloguj się, żeby historia, ulubione i gracze czekali na Ciebie na każdym urządzeniu.",
    signIn: "Zaloguj się",
    signOut: "Wyloguj",
    outTitle: "Wylogować się?",
    outBody: "Wrócisz do gry bez konta. Bieżąca rozmowa i imiona graczy znikną z tego urządzenia.",
    cancel: "Anuluj",
    langTheme: "Język i motyw",
    themes: { rose: "Róż", sage: "Szałwia", lavender: "Lawenda" } as Record<ThemeId, string>,
    players: "Gracze",
    playersD: "Dodaj imiona, a gra pokaże, czyja jest kolej.",
    add: "Dodaj",
    name: "Imię gracza",
    remove: "Usuń",
    mp: "Gra na dwóch telefonach",
    mpD: "Każde z Was widzi tę samą kartę na swoim telefonie.",
    mpCreate: "Utwórz pokój",
    mpJoin: "Dołącz",
    mpCode: "Kod pokoju",
    mpConnected: "Połączono",
    mpLeave: "Rozłącz",
    mpNotFound: "Nie ma pokoju o tym kodzie.",
    mpShare: "Podaj ten kod drugiej osobie:",
    copied: "Skopiowano",
    motion: "Ruch i wibracje",
    anim: "Animacje 3D",
    reduced: "Ogranicz ruch",
    haptics: "Wibracje",
    app: "Aplikacja na telefon",
    rules: "Zasady gry",
    rulesD: "Jak grać i co zostaje między nami",
  },
  en: {
    settings: "Settings",
    close: "Close",
    account: "Account",
    saved: "History and favourites saved in the cloud",
    guest: "Playing without an account",
    guestD: "Sign in so your history, favourites and players wait for you on every device.",
    signIn: "Sign in",
    signOut: "Sign out",
    outTitle: "Sign out?",
    outBody: "You will go back to playing without an account. The current conversation and player names will be removed from this device.",
    cancel: "Cancel",
    langTheme: "Language and theme",
    themes: { rose: "Rose", sage: "Sage", lavender: "Lavender" } as Record<ThemeId, string>,
    players: "Players",
    playersD: "Add names and the game will show whose turn it is.",
    add: "Add",
    name: "Player name",
    remove: "Remove",
    mp: "Play on two phones",
    mpD: "Each of you sees the same card on your own phone.",
    mpCreate: "Create room",
    mpJoin: "Join",
    mpCode: "Room code",
    mpConnected: "Connected",
    mpLeave: "Leave",
    mpNotFound: "There is no room with this code.",
    mpShare: "Give this code to the other person:",
    copied: "Copied",
    motion: "Motion and vibration",
    anim: "3D animations",
    reduced: "Reduce motion",
    haptics: "Vibration",
    app: "App on your phone",
    rules: "Game rules",
    rulesD: "How to play and what stays between us",
  },
};

const SWATCH: Record<ThemeId, [string, string]> = {
  rose: ["#F2BCCB", "#9A1A35"],
  sage: ["#BFCEB5", "#2F4A3A"],
  lavender: ["#CFC4EC", "#4B2A8C"],
};

export function Settings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    lang, setLang, theme, setTheme,
    animations, toggleAnimations,
    hapticsEnabled, toggleHaptics,
    reducedMotion, toggleReducedMotion,
    players, setPlayers, flushGuestSession,
  } = useGame();
  const { user, ready } = useAuth();
  const [draft, setDraft] = useState("");
  const [mpInput, setMpInput] = useState("");
  const [mpCopied, setMpCopied] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const { code: mpCode, status: mpStatus, createRoom, joinRoom, leaveRoom, error: mpError } = useMultiplayer();
  const c = t[lang];

  const addPlayer = () => {
    // Strip control chars, collapse whitespace, cap length.
    const v = draft
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F<>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 24);
    if (v && players.length < 12) {
      setPlayers([...players, v]);
      setDraft("");
    }
  };

  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const name = (meta.full_name as string) || (meta.name as string) || user?.email || "";
  const avatar = (meta.avatar_url as string) || (meta.picture as string) || "";

  const card = "rounded-[20px] p-4 lg:p-5";
  const cardStyle = { background: "var(--card-surface)", border: "1px solid var(--border)" };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={c.settings}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col gap-5 overflow-y-auto px-4 pb-8 sm:max-w-md lg:max-w-lg lg:gap-6 lg:px-8"
            style={{ background: "var(--bg)", paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div className="flex items-center justify-between pt-2 lg:pt-6">
              <h2 className="text-[28px] leading-none lg:text-[38px]" style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}>
                {c.settings}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label={c.close}
                className="flex h-12 w-12 items-center justify-center rounded-full lg:h-14 lg:w-14"
                style={{ background: "var(--panel)", color: "var(--ink)" }}
              >
                <X className="h-6 w-6" strokeWidth={2.4} />
              </button>
            </div>

            {/* Account */}
            <Section title={c.account}>
              {ready && user ? (
                <div className={`${card} flex items-center gap-3`} style={cardStyle}>
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-[20px]"
                    style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }}
                  >
                    {avatar ? (
                      <img src={avatar} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                    ) : (
                      name.trim().charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="truncate text-[16px] font-bold lg:text-[17px]" style={{ color: "var(--text)" }}>{name}</p>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--sub-text)" }}>{c.saved}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmOut(true)}
                    className="flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-extrabold"
                    style={{ background: "var(--panel-2)", color: "var(--ink)" }}
                  >
                    <LogOut className="h-4 w-4" /> {c.signOut}
                  </button>
                </div>
              ) : (
                <div className={`${card} flex flex-col gap-3`} style={cardStyle}>
                  <div className="flex flex-col gap-1">
                    <p className="text-[16px] font-bold lg:text-[17px]" style={{ color: "var(--text)" }}>{c.guest}</p>
                    <p className="text-[14px] leading-snug lg:text-[15px]" style={{ color: "var(--sub-text)" }}>{c.guestD}</p>
                  </div>
                  <Link
                    to="/auth"
                    className="flex h-12 items-center justify-center gap-2 rounded-[16px] text-[16px]"
                    style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }}
                  >
                    <UserRound className="h-5 w-5" /> {c.signIn}
                  </Link>
                </div>
              )}
            </Section>

            {/* Rules */}
            <button
              type="button"
              onClick={() => setRulesOpen(true)}
              className="flex min-h-[64px] items-center gap-3 rounded-[20px] px-4 text-left lg:px-5"
              style={{ background: "var(--card-surface)", border: "1px solid var(--border)" }}
            >
              <BookOpen className="h-6 w-6 shrink-0" style={{ color: "var(--ink)" }} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[16px] font-bold lg:text-[17px]" style={{ color: "var(--text)" }}>{c.rules}</span>
                <span className="text-[13px] lg:text-[14px]" style={{ color: "var(--sub-text)" }}>{c.rulesD}</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0" style={{ color: "var(--ink)" }} />
            </button>

            {/* Language and theme */}
            <Section title={c.langTheme}>
              <div className="flex gap-2.5">
                <div className="flex flex-1 rounded-[16px] p-1" style={{ background: "var(--panel)" }} role="radiogroup" aria-label="Język / Language">
                  {(["pl", "en"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      role="radio"
                      aria-checked={lang === l}
                      onClick={() => setLang(l)}
                      className="h-11 flex-1 rounded-[12px] text-[15px] font-extrabold uppercase"
                      style={{ background: lang === l ? "var(--accent)" : "transparent", color: lang === l ? "var(--accent-ink)" : "var(--sub-text)" }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <div className="flex flex-1 items-center justify-around rounded-[16px] p-1" style={{ background: "var(--panel)" }} role="radiogroup" aria-label={c.langTheme}>
                  {THEMES.map((th) => (
                    <button
                      key={th}
                      type="button"
                      role="radio"
                      aria-checked={theme === th}
                      aria-label={c.themes[th]}
                      title={c.themes[th]}
                      onClick={() => setTheme(th)}
                      className="flex h-11 w-11 items-center justify-center rounded-full"
                      style={{
                        background: SWATCH[th][0],
                        boxShadow: theme === th ? "0 0 0 3px var(--ink)" : "inset 0 0 0 1.5px rgba(0,0,0,0.18)",
                      }}
                    >
                      <span className="h-3 w-3 rounded-full" style={{ background: SWATCH[th][1] }} />
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-2 px-1 text-[13px] font-semibold" style={{ color: "var(--muted-text)" }}>
                {c.themes[theme]}
              </p>
            </Section>

            {/* Install as an app */}
            <Section title={c.app}>
              <InstallCard />
            </Section>

            {/* Players */}
            <Section title={c.players}>
              <div className={`${card} flex flex-col gap-3`} style={cardStyle}>
                <p className="text-[14px] leading-snug lg:text-[15px]" style={{ color: "var(--sub-text)" }}>{c.playersD}</p>
                {players.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {players.map((p, i) => (
                      <li key={`${p}-${i}`} className="flex h-10 items-center gap-1 rounded-full pl-4 pr-1 text-[15px] font-bold" style={{ background: "var(--chip)", color: "var(--chip-ink)" }}>
                        {p}
                        <button
                          type="button"
                          onClick={() => setPlayers(players.filter((_, j) => j !== i))}
                          aria-label={`${c.remove}: ${p}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full"
                        >
                          <X className="h-4 w-4" strokeWidth={2.6} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-2">
                  <label className="sr-only" htmlFor="player-name">{c.name}</label>
                  <input
                    id="player-name"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value.slice(0, 24))}
                    onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                    placeholder={c.name}
                    maxLength={24}
                    className="h-12 min-w-0 flex-1 rounded-[14px] px-4 text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    style={{ background: "var(--panel)", color: "var(--text)", border: "1px solid var(--border)" }}
                  />
                  <button
                    type="button"
                    onClick={addPlayer}
                    className="flex h-12 items-center gap-1.5 rounded-[14px] px-4 text-[15px] font-extrabold"
                    style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                  >
                    <Plus className="h-5 w-5" /> {c.add}
                  </button>
                </div>
              </div>
            </Section>

            {/* Two phones */}
            <Section title={c.mp}>
              <div className={`${card} flex flex-col gap-3`} style={cardStyle}>
                {mpCode ? (
                  <>
                    <p className="text-[14px]" style={{ color: "var(--sub-text)" }}>{c.mpShare}</p>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(mpCode);
                        setMpCopied(true);
                        setTimeout(() => setMpCopied(false), 1500);
                      }}
                      className="flex h-14 items-center justify-between rounded-[16px] px-5"
                      style={{ background: "var(--panel-2)", color: "var(--ink)" }}
                      aria-label={mpCopied ? c.copied : mpCode}
                    >
                      <span className="text-[26px] tracking-[0.3em]" style={{ fontFamily: DISPLAY_FONT }}>{mpCode}</span>
                      {mpCopied ? <Check className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
                    </button>
                    <span className="flex items-center gap-2 text-[14px] font-bold" style={{ color: "var(--ink)" }}>
                      <Wifi className="h-5 w-5" /> {c.mpConnected}
                    </span>
                    <button
                      type="button"
                      onClick={leaveRoom}
                      className="h-12 rounded-[14px] text-[15px] font-extrabold"
                      style={{ border: "1.5px solid var(--ink)", color: "var(--ink)" }}
                    >
                      {c.mpLeave}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[14px] leading-snug lg:text-[15px]" style={{ color: "var(--sub-text)" }}>{c.mpD}</p>
                    <button
                      type="button"
                      onClick={() => createRoom()}
                      disabled={mpStatus === "connecting"}
                      className="flex h-12 items-center justify-center gap-2 rounded-[14px] text-[15px] font-extrabold disabled:opacity-50"
                      style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                    >
                      <Users className="h-5 w-5" /> {c.mpCreate}
                    </button>
                    <div className="flex gap-2">
                      <input
                        value={mpInput}
                        onChange={(e) => setMpInput(e.target.value.toUpperCase().slice(0, 4))}
                        maxLength={4}
                        placeholder="KOD"
                        aria-label={c.mpCode}
                        className="h-12 min-w-0 flex-1 rounded-[14px] px-4 text-center text-[18px] tracking-[0.3em] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        style={{ background: "var(--panel)", color: "var(--text)", border: "1px solid var(--border)", fontFamily: DISPLAY_FONT }}
                      />
                      <button
                        type="button"
                        onClick={() => void joinRoom(mpInput)}
                        disabled={mpStatus === "connecting" || mpInput.length < 4}
                        className="h-12 rounded-[14px] px-5 text-[15px] font-extrabold disabled:opacity-50"
                        style={{ border: "1.5px solid var(--ink)", color: "var(--ink)" }}
                      >
                        {c.mpJoin}
                      </button>
                    </div>
                    {mpError && mpStatus === "error" && (
                      <p role="alert" className="text-[14px] font-bold" style={{ color: "#8E0B20" }}>{c.mpNotFound}</p>
                    )}
                  </>
                )}
              </div>
            </Section>

            {/* Motion */}
            <Section title={c.motion}>
              <div className="overflow-hidden rounded-[20px]" style={cardStyle}>
                <Toggle label={c.anim} on={animations} onToggle={toggleAnimations} />
                <Toggle label={c.reduced} on={reducedMotion} onToggle={toggleReducedMotion} divider />
                <Toggle label={c.haptics} on={hapticsEnabled} onToggle={toggleHaptics} divider />
              </div>
            </Section>
          </motion.aside>

          <RulesSheet open={rulesOpen} onClose={() => setRulesOpen(false)} />
          <ConfirmDialog
            open={confirmOut}
            title={c.outTitle}
            body={c.outBody}
            confirmLabel={c.signOut}
            cancelLabel={c.cancel}
            onCancel={() => setConfirmOut(false)}
            onConfirm={() => {
              setConfirmOut(false);
              flushGuestSession();
              void signOut();
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 px-1 text-[12px] font-extrabold uppercase tracking-[0.22em] lg:text-[13px]" style={{ color: "var(--muted-text)" }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Toggle({ label, on, onToggle, divider }: { label: string; on: boolean; onToggle: () => void; divider?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 text-left lg:px-5"
      style={{ background: "var(--card-surface)", borderTop: divider ? "1px solid var(--border)" : "none" }}
    >
      <span className="text-[15px] font-semibold lg:text-[16px]" style={{ color: "var(--text)" }}>{label}</span>
      <span className="relative flex h-7 w-12 shrink-0 items-center rounded-full transition-colors" style={{ background: on ? "var(--accent)" : "var(--panel-2)", boxShadow: on ? "none" : "inset 0 0 0 1.5px var(--border)" }}>
        <span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: on ? "translateX(24px)" : "translateX(4px)" }}
        />
      </span>
    </button>
  );
}
