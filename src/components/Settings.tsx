import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Sun, Moon, Users, Wifi, Copy, Check } from "lucide-react";
import { useGame, type ThemeId } from "@/lib/store";
import { useMultiplayer } from "@/lib/multiplayer";
import { useAuth, signInWithGoogle, signOut } from "@/lib/useAuth";
import type { Lang } from "@/data/questions";

const t = {
  pl: {
    settings: "Ustawienia",
    language: "Język główny",
    anim: "Animacje",
    animD: "Płynne efekty 3D",
    haptics: "Wibracje",
    hapticsD: "Delikatny feedback przy obrocie karty",
    reduced: "Ograniczenie ruchu",
    reducedD: "Zastąp animacje 3D prostym fade",
    appearance: "Wygląd",
    light: "Jasny",
    dark: "Ciemny",
    theme: "Motyw",
    players: "Gracze",
    playersD: "Dodaj imiona, by śledzić tury",
    add: "Dodaj gracza",
    name: "Imię gracza",
    mp: "Gra wieloosobowa",
    mpD: "Graj razem w czasie rzeczywistym. Utwórz pokój lub dołącz kodem.",
    mpCreate: "Utwórz pokój",
    mpJoin: "Dołącz",
    mpCode: "KOD",
    mpConnected: "Połączono",
    mpLeave: "Rozłącz",
    mpNotFound: "Nie znaleziono pokoju",
    mpShare: "Podaj ten kod partnerowi:",
    themes: { rose: "Różany Pastel", fairy: "Wróżkowa Zieleń", violet: "Fiolet", spicy: "Spicy Red" },
  },
  en: {
    settings: "Settings",
    language: "Primary language",
    anim: "Animations",
    animD: "Smooth 3D effects",
    haptics: "Haptic feedback",
    hapticsD: "Gentle vibrations on flip & turn",
    reduced: "Reduced motion",
    reducedD: "Replace 3D animations with fades",
    appearance: "Appearance",
    light: "Light",
    dark: "Dark",
    theme: "Theme",
    players: "Players",
    playersD: "Add names to track turns",
    add: "Add player",
    name: "Player name",
    mp: "Multiplayer",
    mpD: "Play together in real time. Create a room or join with a code.",
    mpCreate: "Create room",
    mpJoin: "Join",
    mpCode: "CODE",
    mpConnected: "Connected",
    mpLeave: "Leave",
    mpNotFound: "Room not found",
    mpShare: "Share this code with your partner:",
    themes: { rose: "Rose Pastel", fairy: "Fairy Green", violet: "Violet", spicy: "Spicy Red" },
  },
};

const themeSwatch: Record<ThemeId, string[]> = {
  rose: ["#ff3ea5", "#ff8fd0", "#ffd76e"],
  fairy: ["#12b981", "#5ff0c0", "#d9f99d"],
  violet: ["#7c3aed", "#a78bfa", "#22d3ee"],
  spicy: ["#e0392b", "#ff6a3d", "#ffb347"],
};


export function Settings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    lang, setLang, theme, setTheme, mode, setMode,
    animations, toggleAnimations,
    hapticsEnabled, toggleHaptics,
    reducedMotion, toggleReducedMotion,
    players, setPlayers,
  } = useGame();
  const [draft, setDraft] = useState("");
  const [mpInput, setMpInput] = useState("");
  const [mpCopied, setMpCopied] = useState(false);
  const { code: mpCode, status: mpStatus, createRoom, joinRoom, leaveRoom, error: mpError } = useMultiplayer();
  const c = t[lang];

  const addPlayer = () => {
    // Strip control chars, collapse whitespace, cap length to prevent
    // storage bloat and mitigate injection into shared-state payloads.
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
            className="glass fixed inset-y-0 right-0 z-50 w-[88%] max-w-sm overflow-y-auto p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">{c.settings}</h2>
              <button onClick={onClose} className="rounded-full p-2" style={{ background: "var(--panel-2)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Language */}
            <Section title={c.language}>
              <div className="flex rounded-2xl p-1" style={{ background: "var(--panel-2)" }}>
                {(["pl", "en"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className="flex-1 rounded-xl py-2 text-sm font-bold uppercase transition-all"
                    style={{ background: lang === l ? "var(--accent)" : "transparent", color: lang === l ? "var(--accent-ink)" : "var(--muted-text)" }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Section>

            {/* Multiplayer */}
            <Section title={c.mp}>
              {mpCode ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs" style={{ color: "var(--muted-text)" }}>{c.mpShare}</p>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(mpCode);
                      setMpCopied(true);
                      setTimeout(() => setMpCopied(false), 1500);
                    }}
                    className="flex items-center justify-between rounded-2xl px-4 py-3"
                    style={{ background: "var(--panel-2)" }}
                  >
                    <span className="text-2xl font-black tracking-[0.3em]">{mpCode}</span>
                    {mpCopied ? (
                      <Check className="h-5 w-5" style={{ color: "var(--accent)" }} />
                    ) : (
                      <Copy className="h-5 w-5 opacity-60" />
                    )}
                  </button>
                  <span className="flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                    <Wifi className="h-4 w-4" /> {c.mpConnected}
                  </span>
                  <button
                    onClick={leaveRoom}
                    className="rounded-2xl py-2.5 text-sm font-bold"
                    style={{ background: "var(--panel-2)", color: "var(--text)" }}
                  >
                    {c.mpLeave}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-xs" style={{ color: "var(--muted-text)" }}>{c.mpD}</p>
                  <button
                    onClick={() => createRoom()}
                    disabled={mpStatus === "connecting"}
                    className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-extrabold disabled:opacity-50"
                    style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                  >
                    <Users className="h-4 w-4" /> {c.mpCreate}
                  </button>
                  <div className="flex gap-2">
                    <input
                      value={mpInput}
                      onChange={(e) => setMpInput(e.target.value.toUpperCase().slice(0, 4))}
                      maxLength={4}
                      placeholder={c.mpCode}
                      aria-label={c.mpCode}
                      className="flex-1 rounded-2xl px-4 py-2.5 text-center text-lg font-bold tracking-[0.25em] outline-none"
                      style={{ background: "var(--panel-2)", color: "var(--text)" }}
                    />
                    <button
                      onClick={() => void joinRoom(mpInput)}
                      disabled={mpStatus === "connecting" || mpInput.length < 4}
                      className="rounded-2xl px-5 text-sm font-bold disabled:opacity-40"
                      style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                    >
                      {c.mpJoin}
                    </button>
                  </div>
                  {mpError && mpStatus === "error" && (
                    <p className="text-xs font-semibold" style={{ color: "#e05252" }}>{c.mpNotFound}</p>
                  )}
                </div>
              )}
            </Section>

            {/* Animations */}
            <Section title={c.anim}>
              <div className="flex flex-col gap-2">
                <Toggle label={c.animD} on={animations} onToggle={toggleAnimations} />
                <Toggle label={c.reduced + " — " + c.reducedD} on={reducedMotion} onToggle={toggleReducedMotion} />
                <Toggle label={c.haptics + " — " + c.hapticsD} on={hapticsEnabled} onToggle={toggleHaptics} />
              </div>
            </Section>

            {/* Appearance (light / dark) */}
            <Section title={c.appearance}>
              <div className="flex rounded-2xl p-1" style={{ background: "var(--panel-2)" }}>
                {(["light", "dark"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold transition-all"
                    style={{
                      background: mode === m ? "var(--accent)" : "transparent",
                      color: mode === m ? "var(--accent-ink)" : "var(--muted-text)",
                    }}
                  >
                    {m === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {m === "light" ? c.light : c.dark}
                  </button>
                ))}
              </div>
            </Section>

            {/* Theme */}
            <Section title={c.theme}>

              <div className="flex flex-col gap-2">
                {(Object.keys(themeSwatch) as ThemeId[]).map((th) => (
                  <button
                    key={th}
                    onClick={() => setTheme(th)}
                    className="flex items-center justify-between rounded-2xl p-3 transition-all"
                    style={{ background: "var(--panel-2)", outline: theme === th ? "2px solid var(--accent)" : "2px solid transparent" }}
                  >
                    <span className="text-sm font-semibold">{c.themes[th]}</span>
                    <span className="flex gap-1">
                      {themeSwatch[th].map((col) => (
                        <span key={col} className="h-4 w-4 rounded-full" style={{ background: col }} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </Section>

            {/* Players */}
            <Section title={c.players}>
              <p className="mb-2 text-xs" style={{ color: "var(--muted-text)" }}>{c.playersD}</p>
              <div className="mb-3 flex flex-col gap-2">
                {players.map((p, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--panel-2)" }}>
                    <span className="text-sm font-semibold">{p}</span>
                    <button onClick={() => setPlayers(players.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4" style={{ color: "var(--muted-text)" }} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, 24))}
                  onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                  placeholder={c.name}
                  maxLength={24}
                  className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                  style={{ background: "var(--panel-2)", color: "var(--text)" }}
                />
                <button onClick={addPlayer} className="rounded-xl px-3" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </Section>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--muted-text)" }}>{title}</p>
      {children}
    </div>
  );
}

function Toggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left"
      style={{ background: "var(--panel-2)" }}
    >
      <span className="text-sm" style={{ color: "var(--muted-text)" }}>{label}</span>
      <span
        className="relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
        style={{ background: on ? "var(--accent)" : "var(--border)" }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
        />
      </span>
    </button>
  );
}
