import { LogOut } from "lucide-react";
import { useAuth, signOut } from "@/lib/useAuth";
import { useGame } from "@/lib/store";
import { GoogleSignInButton } from "./GoogleSignInButton";

const t = {
  pl: {
    signIn: "Zaloguj przez Google",
    signOut: "Wyloguj",
    saved: "Dane zapisane w chmurze",
    guest: "Grasz jako gość",
  },
  en: {
    signIn: "Sign in with Google",
    signOut: "Sign out",
    saved: "Progress saved to the cloud",
    guest: "Playing as guest",
  },
};

export function AccountPanel({
  variant = "compact",
}: {
  variant?: "compact" | "hero";
}) {
  const { user, ready } = useAuth();
  const lang = useGame((s) => s.lang);
  const c = t[lang];
  if (!ready) return null;

  if (user) {
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const avatar = (meta.avatar_url as string) || (meta.picture as string) || "";
    const name =
      (meta.full_name as string) ||
      (meta.name as string) ||
      user.email ||
      "You";
    const initial = name.trim().charAt(0).toUpperCase() || "U";
    return (
      <div
        className="glass flex items-center gap-3 rounded-2xl p-3"
        style={{ border: "1px solid var(--border)" }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt=""
            referrerPolicy="no-referrer"
            className="h-10 w-10 shrink-0 rounded-full object-cover"
            style={{ boxShadow: "0 0 0 2px var(--accent)" }}
          />
        ) : (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            {initial}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{name}</p>
          <p className="truncate text-[11px]" style={{ color: "var(--muted-text)" }}>
            {c.saved}
          </p>
        </div>
        <button
          onClick={() => void signOut()}
          className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95"
          style={{
            background: "var(--panel-2)",
            color: "var(--muted-text)",
            border: "1px solid var(--border)",
          }}
          aria-label={c.signOut}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{c.signOut}</span>
        </button>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div
        className="glass rounded-3xl p-5 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--muted-text)" }}>
          {c.guest}
        </p>
        <GoogleSignInButton label={c.signIn} variant="outline" />
      </div>
    );
  }

  return <GoogleSignInButton label={c.signIn} variant="solid" />;
}