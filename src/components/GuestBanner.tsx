import { LogIn, AlertTriangle } from "lucide-react";
import { useAuth, signInWithGoogle } from "@/lib/useAuth";
import { useGame } from "@/lib/store";

const t = {
  pl: {
    msg:
      "Grasz jako gość. Jeśli opuścisz aplikację bez zalogowania się przez Google, Twoja historia gier, ulubione pytania i postęp w rozgrywce zostaną bezpowrotnie utracone.",
    cta: "Zaloguj przez Google",
  },
  en: {
    msg:
      "You are playing as a guest. If you leave the app without logging in with Google, your game history, favorites, and progress will be permanently lost.",
    cta: "Sign in with Google",
  },
};

export function GuestBanner({ compact = false }: { compact?: boolean }) {
  const { user, ready } = useAuth();
  const lang = useGame((s) => s.lang);
  if (!ready || user) return null;
  const c = t[lang];
  return (
    <div
      role="status"
      className="glass mb-3 flex items-start gap-3 rounded-2xl p-3"
      style={{ border: "1px solid var(--border)" }}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
      <div className="min-w-0 flex-1">
        <p className="text-[12px] leading-snug" style={{ color: "var(--muted-text)" }}>
          {c.msg}
        </p>
        {!compact && (
          <button
            onClick={() => void signInWithGoogle()}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            <LogIn className="h-3.5 w-3.5" /> {c.cta}
          </button>
        )}
      </div>
    </div>
  );
}