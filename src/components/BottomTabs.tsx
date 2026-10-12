import { Play, Clock, Heart, BarChart3 } from "lucide-react";
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

  const items: { id: Tab; icon: typeof Play; label: string }[] = [
    { id: "play", icon: Play, label: l.play },
    { id: "history", icon: Clock, label: l.history },
    { id: "favorites", icon: Heart, label: l.favorites },
    { id: "insights", icon: BarChart3, label: l.insights },
  ];

  return (
    <nav
      className="glass mx-auto mt-3 flex w-full max-w-sm items-center justify-around rounded-2xl p-1"
      aria-label={lang === "pl" ? "Nawigacja" : "Navigation"}
    >
      {items.map((it) => {
        const on = active === it.id;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            aria-current={on ? "page" : undefined}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[11px] font-bold transition-colors"
            style={{
              background: on ? "var(--accent)" : "transparent",
              color: on ? "var(--accent-ink)" : "var(--muted-text)",
            }}
          >
            <Icon className="h-4 w-4" />
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}