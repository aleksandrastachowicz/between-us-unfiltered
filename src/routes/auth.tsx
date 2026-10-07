import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

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

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const returnTo = safeNext(next);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

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
        setInfo("Check your email to confirm your account.");
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

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "var(--panel, #fcf7fb)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.25rem" }}>Between Us</h1>
        <p style={{ color: "var(--muted-text, #666)", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
          {mode === "signin" ? "Sign in to continue." : "Create an account to continue."}
        </p>

        <button
          onClick={google}
          disabled={busy}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "#fff",
            fontWeight: 600,
            marginBottom: "1rem",
            cursor: "pointer",
          }}
        >
          Continue with Google
        </button>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "0.7rem 0.9rem", borderRadius: 10, border: "1px solid #ddd" }}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "0.7rem 0.9rem", borderRadius: 10, border: "1px solid #ddd" }}
          />
          {error && <p style={{ color: "#c0392b", fontSize: "0.85rem" }}>{error}</p>}
          {info && <p style={{ color: "#2e7d32", fontSize: "0.85rem" }}>{info}</p>}
          <button
            type="submit"
            disabled={busy}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 12,
              border: "none",
              background: "var(--accent, #ff3ea5)",
              color: "var(--accent-ink, #fff)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          style={{
            marginTop: "1rem",
            background: "transparent",
            border: "none",
            color: "var(--muted-text, #666)",
            fontSize: "0.85rem",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}