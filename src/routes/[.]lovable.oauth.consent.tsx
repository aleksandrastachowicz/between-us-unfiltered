import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Beta auth.oauth namespace — minimal typed wrapper.
type AuthDetails = {
  client?: { name?: string; redirect_uri?: string } | null;
  scope?: string | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
};
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthDetails | null; error: { message: string } | null }>;
};
const oauth = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  head: () => ({ meta: [
    { title: "Authorize a Connection — Between Us" },
    { name: "description", content: "Review and authorize an app connection to your Between Us account." },
    { property: "og:title", content: "Authorize a Connection — Between Us" },
    { property: "og:description", content: "Review access before connecting an app to Between Us." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const id = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth.getAuthorizationDetails(id);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={h1Style}>Authorization error</h1>
        <p style={{ color: "#c0392b" }}>{String((error as Error)?.message ?? error)}</p>
      </div>
    </main>
  ),
});

const pageStyle: React.CSSProperties = {
  minHeight: "100dvh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1.5rem",
  background: "var(--panel, #fcf7fb)",
};
const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 440,
  padding: "1.5rem",
  borderRadius: 20,
  background: "#fff",
  boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
};
const h1Style: React.CSSProperties = { fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" };

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "an app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorization_id)
      : await oauth.denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={h1Style}>Connect {clientName} to Between Us</h1>
        <p style={{ color: "#555", marginBottom: "1rem", fontSize: "0.95rem" }}>
          This lets {clientName} use Between Us as you.
        </p>
        <p style={{ color: "#777", marginBottom: "1.25rem", fontSize: "0.85rem" }}>
          This does not bypass this app's permissions or backend policies.
        </p>
        {error && (
          <p role="alert" style={{ color: "#c0392b", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: 12,
              border: "1px solid #ddd",
              background: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            disabled={busy}
            onClick={() => decide(true)}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: 12,
              border: "none",
              background: "var(--accent, #ff3ea5)",
              color: "var(--accent-ink, #fff)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Approve
          </button>
        </div>
      </div>
    </main>
  );
}