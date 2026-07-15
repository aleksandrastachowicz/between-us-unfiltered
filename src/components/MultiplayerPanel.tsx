import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Copy, Check, X, Wifi } from "lucide-react";
import { useMultiplayer } from "@/lib/multiplayer";
import { useGame } from "@/lib/store";

const t = {
  pl: {
    title: "Gra wieloosobowa",
    desc: "Graj razem w czasie rzeczywistym. Utwórz pokój lub dołącz kodem.",
    create: "Utwórz pokój",
    join: "Dołącz",
    placeholder: "KOD",
    room: "Pokój",
    connected: "Połączono",
    leave: "Rozłącz",
    notfound: "Nie znaleziono pokoju",
    copied: "Skopiowano",
    share: "Podaj ten kod partnerowi:",
  },
  en: {
    title: "Multiplayer",
    desc: "Play together in real time. Create a room or join with a code.",
    create: "Create room",
    join: "Join",
    placeholder: "CODE",
    room: "Room",
    connected: "Connected",
    leave: "Leave",
    notfound: "Room not found",
    copied: "Copied",
    share: "Share this code with your partner:",
  },
};

export function MultiplayerPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const lang = useGame((s) => s.lang);
  const screen = useGame((s) => s.screen);
  const { code, status, createRoom, joinRoom, leaveRoom, error } = useMultiplayer();
  const c = t[lang];

  const copy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={c.title}
        className={
          screen === "game"
            ? "fixed left-4 z-30 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold shadow-lg backdrop-blur"
            : "fixed right-4 top-4 z-30 flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold shadow-lg backdrop-blur"
        }
        style={{
          background: code ? "var(--accent)" : "var(--panel)",
          color: code ? "var(--accent-ink)" : "var(--text)",
          border: "1px solid var(--border)",
          ...(screen === "game"
            ? { bottom: "calc(env(safe-area-inset-bottom) + 5.5rem)" }
            : {}),
        }}
      >
        {code ? <Wifi className="h-4 w-4" /> : <Users className="h-4 w-4" />}
        {code ? code : c.title}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-t-3xl p-6 sm:rounded-3xl"
              style={{ background: "var(--panel)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-extrabold">{c.title}</h3>
                <button onClick={() => setOpen(false)} className="opacity-60">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {code ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm" style={{ color: "var(--muted-text)" }}>{c.share}</p>
                  <button
                    onClick={copy}
                    className="flex items-center justify-between rounded-2xl px-5 py-4"
                    style={{ background: "var(--panel-2)" }}
                  >
                    <span className="text-3xl font-black tracking-[0.3em]">{code}</span>
                    {copied ? <Check className="h-5 w-5" style={{ color: "var(--accent)" }} /> : <Copy className="h-5 w-5 opacity-60" />}
                  </button>
                  <span className="flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                    <Wifi className="h-4 w-4" /> {c.connected}
                  </span>
                  <button
                    onClick={() => { leaveRoom(); setOpen(false); }}
                    className="rounded-2xl py-3 text-sm font-bold"
                    style={{ background: "var(--panel-2)", color: "var(--text)" }}
                  >
                    {c.leave}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm" style={{ color: "var(--muted-text)" }}>{c.desc}</p>
                  <button
                    onClick={() => createRoom()}
                    disabled={status === "connecting"}
                    className="rounded-2xl py-4 text-base font-extrabold disabled:opacity-50"
                    style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                  >
                    {c.create}
                  </button>
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value.toUpperCase())}
                      maxLength={4}
                      placeholder={c.placeholder}
                      className="flex-1 rounded-2xl px-4 py-3 text-center text-lg font-bold tracking-[0.25em] outline-none"
                      style={{ background: "var(--panel-2)", color: "var(--text)", border: "1px solid var(--border)" }}
                    />
                    <button
                      onClick={async () => {
                        const ok = await joinRoom(input);
                        if (ok) setOpen(false);
                      }}
                      disabled={status === "connecting" || input.length < 4}
                      className="rounded-2xl px-6 text-sm font-bold disabled:opacity-40"
                      style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                    >
                      {c.join}
                    </button>
                  </div>
                  {error && status === "error" && (
                    <p className="text-xs font-semibold" style={{ color: "#e05252" }}>{c.notfound}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
