import { RectangleVertical, Clock, Heart, BarChart3 } from "lucide-react";
import { useGame, type Tab } from "@/lib/store";

const labels = {
  pl: { play: "Gra", history: "Historia", favorites: "Ulubione", insights: "Statystyki" },
  en: { play: "Play", history: "History", favorites: "Favorites", insights: "Insights" },
};

export function BottomTabs() {
  const lang = useGame((s) => s.lang);
  const active = useGame((s) => s.activeTab);
  const setTab = useGame((s) => s.setTab);
  const l = labels[lang];

  const items: { id: Tab; icon: typeof Clock; label: string }[] = [
    { id: "play", icon: RectangleVertical, label: l.play },
    { id: "history", icon: Clock, label: l.history },
    { id: "favorites", icon: Heart, label: l.favorites },
    { id: "insights", icon: BarChart3, label: l.insights },
  ];

  return (
    <nav
      className="mt-2 flex h-[70px] w-full shrink-0 items-center justify-around rounded-[22px] px-1.5 md:fixed md:left-5 md:top-1/2 md:mt-0 md:h-auto md:w-[84px] md:-translate-y-1/2 md:flex-col md:justify-center md:gap-1 md:rounded-[20px] md:px-1.5 md:py-2 lg:left-8 lg:w-[88px]"
      style={{ background: "var(--panel)", border: "1.5px solid var(--border)" }}
      aria-label={lang === "pl" ? "Nawigacja" : "Navigation"}
    >
      {items.map((it) => {
        const on = active === it.id;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => setTab(it.id)}
            aria-current={on ? "page" : undefined}
            className="flex min-w-0 flex-col items-center gap-1 rounded-2xl px-3.5 py-2 text-[12px] transition-colors md:w-full md:px-1 md:py-2 md:text-[11px] md:[&_svg]:h-5 md:[&_svg]:w-5"
            style={{
              background: on ? "var(--accent)" : "transparent",
              color: on ? "var(--accent-ink)" : "var(--muted-text)",
              fontWeight: on ? 800 : 700,
            }}
          >
            <Icon className="h-6 w-6" strokeWidth={2.1} />
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}
