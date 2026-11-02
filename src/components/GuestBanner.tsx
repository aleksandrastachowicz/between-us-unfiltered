import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/useAuth";
import { useGame } from "@/lib/store";

const t = {
  pl: { text: "Grasz bez konta, więc po zamknięciu strony to zniknie.", link: "Zaloguj się, żeby zapisać" },
  en: { text: "You are playing without an account, so this disappears when you close the page.", link: "Sign in to keep it" },
};

/** One-line guest notice with a link to the single sign-in page. */
export function GuestBanner() {
  const { user, ready } = useAuth();
  const lang = useGame((s) => s.lang);
  if (!ready || user) return null;
  const c = t[lang];
  return (
    <p
      role="status"
      className="mb-4 rounded-[16px] px-4 py-3 text-[13px] leading-snug lg:text-[15px]"
      style={{ background: "var(--panel-2)", color: "var(--sub-text)" }}
    >
      {c.text}{" "}
      <Link to="/auth" className="font-extrabold underline underline-offset-2" style={{ color: "var(--ink)" }}>
        {c.link}
      </Link>
    </p>
  );
}
