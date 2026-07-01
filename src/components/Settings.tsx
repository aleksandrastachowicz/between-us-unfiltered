import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2 } from "lucide-react";
import { useGame, type ThemeId } from "@/lib/store";
import type { Lang } from "@/data/questions";

const t = {
  pl: {
    settings: "Ustawienia",
    language: "Język główny",
    anim: "Animacje",
    animD: "Płynne efekty 3D",
    theme: "Motyw",
    players: "Gracze",
    playersD: "Dodaj imiona, by śledzić tury",
    add: "Dodaj gracza",
    name: "Imię gracza",
    themes: { acid: "Acid Pastel", solar: "Solar Flare", velvet: "Deep Velvet", midnight: "Midnight (Dark)" },
  },
  en: {
    settings: "Settings",
    language: "Primary language",
    anim: "Animations",
    animD: "Smooth 3D effects",
    theme: "Theme",
    players: "Players",
    playersD: "Add names to track turns",
    add: "Add player",
    name: "Player name",
    themes: { acid: "Acid Pastel", solar: "Solar Flare", velvet: "Deep Velvet", midnight: "Midnight (Dark)" },
  },
};

const themeSwatch: Record<ThemeId, string[]> = {
  acid: ["#ff3ea5", "#b59cff", "#cae774"],
  solar: ["#d2652a", "#d4a72c", "#3f7e78"],
  velvet: ["#b673ff", "#00e0c6", "#b6ff3e"],
};

export function Settings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, setLang, theme, setTheme, animations, toggleAnimations, players, setPlayers } = useGame();
  const [draft, setDraft] = useState("");
  const c = t[lang];

  const addPlayer = () => {
    const v = draft.trim();
    if (v) {
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

            {/* Animations */}
            <Section title={c.anim}>
              <button onClick={toggleAnimations} className="flex w-full items-center justify-between rounded-2xl p-4" style={{ background: "var(--panel-2)" }}>
                <span className="text-sm" style={{ color: "var(--muted-text)" }}>{c.animD}</span>
                <span className="flex h-6 w-11 items-center rounded-full p-0.5" style={{ background: animations ? "var(--accent)" : "var(--border)" }}>
                  <motion.span layout className="h-5 w-5 rounded-full bg-white shadow" style={{ marginLeft: animations ? "auto" : 0 }} />
                </span>
              </button>
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
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                  placeholder={c.name}
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
