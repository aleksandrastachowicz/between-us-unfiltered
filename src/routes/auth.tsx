import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useGame } from "@/lib/store";
import { GoogleGlyph } from "@/components/GoogleSignInButton";
import { DISPLAY_FONT } from "@/components/CardArt";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign In — Between Us" },
    { name: "description", content: "Sign in to Between Us to save your players and conversation game preferences." },
    { property: "og:title", content: "Sign In — Between Us" },
    { property: "og:description", content: "Keep your Between Us players and conversation preferences together." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const target = safeNext(search.next);
      throw redirect({ href: target });
    }
  },
  component: AuthPage,
});

function safeNext(next: string): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

const T = {
  pl: {
    back: "Wróć",
    tagline: "Pytania, które zbliżają.",
    title: "Zaloguj się",
    why: "Zapiszemy Twoją historię, ulubione pytania i graczy, żeby czekały na Ciebie na każdym urządzeniu.",
    google: "Kontynuuj z Google",
    preferEmail: "Wolę zalogować się e-mailem",
    email: "E-mail",
    password: "Hasło (min. 6 znaków)",
    signIn: "Zaloguj się",
    signUp: "Załóż konto",
    toSignUp: "Nie masz konta? Załóż je",
    toSignIn: "Masz już konto? Zaloguj się",
    check: "Sprawdź skrzynkę i potwierdź konto linkiem z e-maila.",
    guest: "Możesz też grać bez konta. Wtedy nic nie zapisujemy.",
    guestLink: "Graj bez logowania",
    privacy: "To, co mówicie w grze, zostaje między Wami. Nie zapisujemy Waszych odpowiedzi.",
  },
  en: {
    back: "Back",
    tagline: "Questions that bring you closer.",
    title: "Sign in",
    why: "We will save your history, favourite questions and players so they are waiting for you on every device.",
    google: "Continue with Google",
    preferEmail: "I would rather use email",
    email: "Email",
    password: "Password (min. 6 characters)",
    signIn: "Sign in",
    signUp: "Create account",
    toSignUp: "No account yet? Create one",
    toSignIn: "Already have an account? Sign in",
    check: "Check your inbox and confirm your account with the link in the email.",
    guest: "You can also play without an account. Then we save nothing.",
    guestLink: "Play without signing in",
    privacy: "What you say in the game stays between you. We never store your answers.",
  },
};

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const returnTo = safeNext(next);
  const lang = useGame((s) => s.lang);
  const theme = useGame((s) => s.theme);
  const c = T[lang];
  const [showEmail, setShowEmail] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    void useGame.persist.rehydrate();
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: returnTo, replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [returnTo, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const emailRedirectTo = `${window.location.origin}/auth?next=${encodeURIComponent(returnTo)}`;
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo } });
        if (error) throw error;
        setInfo(c.check);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    setBusy(true);
    const redirect_uri = `${window.location.origin}/auth?next=${encodeURIComponent(returnTo)}`;
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri });
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
    }
  }

  const input =
    "h-12 w-full rounded-[14px] px-4 text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";
  const inputStyle = { background: "#FFFFFF", border: "1.5px solid var(--border)", color: "var(--text)" };

  return (
    <main
      className={`theme-${theme} min-h-dvh w-full`}
      style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div
        className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))", paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex h-11 items-center gap-1.5 rounded-full pl-3 pr-4 text-[13px] font-extrabold"
            style={{ background: "var(--panel)", color: "var(--ink)" }}
          >
            <span aria-hidden="true">←</span> {c.back}
          </Link>
        </div>

        <div className="pb-7 pt-10">
          <h1 className="whitespace-nowrap text-[38px] leading-none" style={{ color: "var(--ink)" }}>
            <Logo />
          </h1>
          <p className="mt-3 text-[16px]" style={{ color: "var(--muted-text)" }}>
            {c.tagline}
          </p>
        </div>

        <section className="flex flex-col gap-4 rounded-[24px] p-5" style={{ background: "var(--panel)" }}>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[22px]" style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}>
              {mode === "signup" && showEmail ? c.signUp : c.title}
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--sub-text)" }}>
              {c.why}
            </p>
          </div>

          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-[18px] text-[16px] font-extrabold transition-opacity disabled:opacity-60"
            style={{ background: "#FFFFFF", color: "#1F1F1F", border: "1.5px solid var(--border)" }}
          >
            <GoogleGlyph className="h-5 w-5" />
            {c.google}
          </button>

          {!showEmail ? (
            <button
              type="button"
              onClick={() => setShowEmail(true)}
              className="min-h-[44px] text-[14px] font-bold underline underline-offset-4"
              style={{ color: "var(--ink)" }}
            >
              {c.preferEmail}
            </button>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-2.5">
              <label className="sr-only" htmlFor="auth-email">{c.email}</label>
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                placeholder={c.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={input}
                style={inputStyle}
              />
              <label className="sr-only" htmlFor="auth-password">{c.password}</label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder={c.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={input}
                style={inputStyle}
              />
              <button
                type="submit"
                disabled={busy}
                className="h-12 rounded-[16px] text-[16px] transition-opacity disabled:opacity-60"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }}
              >
                {mode === "signin" ? c.signIn : c.signUp}
              </button>
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="min-h-[44px] text-[14px] font-bold"
                style={{ color: "var(--ink)" }}
              >
                {mode === "signin" ? c.toSignUp : c.toSignIn}
              </button>
            </form>
          )}

          {error && (
            <p role="alert" className="rounded-[12px] px-3 py-2 text-[13px] font-semibold" style={{ background: "#FDE7EA", color: "#8E0B20" }}>
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="rounded-[12px] px-3 py-2 text-[13px] font-semibold" style={{ background: "#E4EDDD", color: "#22382B" }}>
              {info}
            </p>
          )}
        </section>

        <div className="mt-6 flex flex-col items-center gap-1 text-center">
          <p className="text-[13px]" style={{ color: "var(--muted-text)" }}>{c.guest}</p>
          <Link to="/" className="min-h-[44px] pt-2 text-[14px] font-extrabold underline underline-offset-4" style={{ color: "var(--ink)" }}>
            {c.guestLink}
          </Link>
        </div>

        <p className="mt-auto pt-8 text-center text-[12px] leading-relaxed" style={{ color: "var(--muted-text)" }}>
          {c.privacy}
        </p>
      </div>
    </main>
  );
}
