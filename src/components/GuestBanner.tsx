import { useAuth } from "@/lib/useAuth";
import { useGame } from "@/lib/store";

const t = {
  pl: "Grając jako gość, Twój postęp zostanie utracony po zamknięciu sesji.",
  en: "Playing as a guest, your progress will be lost when the session closes.",
};

/** One-line guest notice — the single auth panel lives on the start screen. */
export function GuestBanner() {
  const { user, ready } = useAuth();
  const lang = useGame((s) => s.lang);
  if (!ready || user) return null;
  return (
    <p
      role="status"
      className="mb-3 rounded-xl px-3 py-2 text-[11px] leading-snug"
      style={{ background: "var(--panel-2)", color: "var(--muted-text)" }}
    >
      {t[lang]}
    </p>
  );
}
