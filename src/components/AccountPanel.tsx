import { useState } from "react";
import { LogOut, Mail, Loader2 } from "lucide-react";
import { useAuth, signOut } from "@/lib/useAuth";
import { useGame } from "@/lib/store";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { ConfirmDialog } from "./ConfirmDialog";
import { supabase } from "@/integrations/supabase/client";

const t = {
  pl: {
    signIn: "Zaloguj przez Google",
    signOut: "Wyloguj",
    saved: "Zapisano w chmurze",
    email: "E-mail",
    password: "Hasło",
    signInMail: "Zaloguj mailem",
    signUp: "Załóż konto",
    toSignUp: "Nie masz konta? Zarejestruj się",
    toSignIn: "Masz konto? Zaloguj się",
    check: "Sprawdź skrzynkę, aby potwierdzić konto.",
    guestNote: "Grając jako gość, Twój postęp zostanie utracony po zamknięciu sesji.",
    or: "lub",
    outTitle: "Wylogować?",
    outBody:
      "Po wylogowaniu wrócisz do trybu gościa — bieżąca sesja, imiona graczy i postęp zostaną bezpowrotnie usunięte.",
    cancel: "Anuluj",
  },
  en: {
    signIn: "Sign in with Google",
    signOut: "Sign out",
    saved: "Saved to the cloud",
    email: "Email",
    password: "Password",
    signInMail: "Sign in with email",
    signUp: "Create account",
    toSignUp: "No account? Sign up",
    toSignIn: "Have an account? Sign in",
    check: "Check your email to confirm your account.",
    guestNote: "Playing as a guest, your progress will be lost when the session closes.",
    or: "or",
    outTitle: "Sign out?",
    outBody:
      "Signing out returns you to guest mode — the current session, player names and progress will be permanently deleted.",
    cancel: "Cancel",
  },
};

export function AccountPanel({ variant = "compact" }: { variant?: "compact" | "hero" }) {
  const { user, ready } = useAuth();
  const lang = useGame((s) => s.lang);
  const flushGuestSession = useGame((s) => s.flushGuestSession);
  const c = t[lang];
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [confirmOut, setConfirmOut] = useState(false);

  if (!ready) return null;

  if (user) {
    const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const avatar = (meta.avatar_url as string) || (meta.picture as string) || "";
    const name = (meta.full_name as string) || (meta.name as string) || user.email || "You";
    const initial = name.trim().charAt(0).toUpperCase() || "U";
    return (
      <>
        <div
          className="glass flex items-center gap-2.5 rounded-2xl p-2.5"
          style={{ border: "1px solid var(--border)" }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="h-8 w-8 shrink-0 rounded-full object-cover"
              style={{ boxShadow: "0 0 0 2px var(--accent)" }}
            />
          ) : (
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              {initial}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold">{name}</p>
            <p className="truncate text-[10px]" style={{ color: "var(--muted-text)" }}>
              {c.saved}
            </p>
          </div>
          <button
            onClick={() => setConfirmOut(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold active:scale-95"
            style={{ background: "var(--panel-2)", color: "var(--muted-text)", border: "1px solid var(--border)" }}
            aria-label={c.signOut}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{c.signOut}</span>
          </button>
        </div>
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
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMsg(c.check);
      }
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : String(e2));
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = {
    background: "var(--panel-2)",
    color: "var(--text)",
    border: "1px solid var(--border)",
  } as const;

  return (
    <div
      className={
        "glass rounded-2xl " + (variant === "hero" ? "p-4" : "p-3")
      }
      style={{ border: "1px solid var(--border)" }}
    >
      <GoogleSignInButton label={c.signIn} variant="outline" className="!py-2.5 !text-[13px]" />

      <div className="my-2.5 flex items-center gap-2">
        <span className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--muted-text)" }}>
          {c.or}
        </span>
        <span className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <form onSubmit={submit} className="flex flex-col gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={c.email}
          aria-label={c.email}
          className="rounded-xl px-3 py-2 text-[13px] outline-none"
          style={inputStyle}
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={c.password}
          aria-label={c.password}
          className="rounded-xl px-3 py-2 text-[13px] outline-none"
          style={inputStyle}
        />
        {err && <p className="text-[11px] font-semibold" style={{ color: "#e05252" }}>{err}</p>}
        {msg && <p className="text-[11px] font-semibold" style={{ color: "var(--accent)" }}>{msg}</p>}
        <button
          type="submit"
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-extrabold disabled:opacity-50"
          style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mail className="h-3.5 w-3.5" />}
          {mode === "signin" ? c.signInMail : c.signUp}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-2 w-full text-center text-[11px] font-semibold"
        style={{ color: "var(--muted-text)" }}
      >
        {mode === "signin" ? c.toSignUp : c.toSignIn}
      </button>

      <p className="mt-2.5 text-center text-[11px] leading-snug" style={{ color: "var(--muted-text)" }}>
        {c.guestNote}
      </p>
    </div>
  );
}
