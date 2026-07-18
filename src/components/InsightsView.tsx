import { useGame } from "@/lib/store";
import { CATEGORY_META, type CategoryId } from "@/data/questions";
import { UNFILTERED_LEVELS, levelForProgress } from "@/data/unfiltered";
import { GuestBanner } from "./GuestBanner";

const t = {
  pl: {
    title: "Statystyki",
    empty: "Zagraj kilka rund, żeby zobaczyć swoje statystyki.",
    total: "Wylosowane karty",
    rounds: "Rozegrane rundy",
    favs: "Ulubione pytania",
    depth: "Głębokość relacji",
    cats: "Najczęściej losowane kategorie",
    unfiltered: "Unfiltered",
  },
  en: {
    title: "Insights",
    empty: "Play a few rounds to see your stats.",
    total: "Cards drawn",
    rounds: "Rounds played",
    favs: "Favorite questions",
    depth: "Relationship depth",
    cats: "Most drawn categories",
    unfiltered: "Unfiltered",
  },
};

export function InsightsView() {
  const lang = useGame((s) => s.lang);
  const stats = useGame((s) => s.stats);
  const favorites = useGame((s) => s.favorites);
  const history = useGame((s) => s.history);
  const progress = useGame((s) => s.progress);
  const c = t[lang];

  const level = levelForProgress(progress);
  const lvlMeta = UNFILTERED_LEVELS[level];

  const entries = Object.entries(stats.categoryCounts).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] ?? 1;

  function catLabel(key: string): string {
    if (key === "unfiltered") return c.unfiltered;
    const meta = CATEGORY_META[key as CategoryId];
    return meta ? meta.label[lang] : key;
  }
  function catColor(key: string): string {
    if (key === "unfiltered") return "var(--accent)";
    return `var(--color-cat-${key})`;
  }

  return (
    <div className="px-1 pb-4 pt-2">
      <GuestBanner />
      <h2 className="mb-3 text-lg font-extrabold">{c.title}</h2>

      {stats.totalDraws === 0 ? (
        <p className="rounded-2xl p-4 text-sm" style={{ background: "var(--panel)", color: "var(--muted-text)" }}>
          {c.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Stat label={c.total} value={stats.totalDraws} />
            <Stat label={c.rounds} value={history.length + 1} />
            <Stat label={c.favs} value={favorites.length} />
            <Stat label={c.depth} value={`${lvlMeta.emoji} ${progress}%`} />
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>
              {c.cats}
            </p>
            <div className="flex flex-col gap-2">
              {entries.map(([key, count]) => {
                const pct = Math.round((count / stats.totalDraws) * 100);
                const w = Math.max(6, Math.round((count / max) * 100));
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-28 shrink-0 truncate text-xs font-semibold">{catLabel(key)}</span>
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full" style={{ background: "var(--panel-2)" }}>
                      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${w}%`, background: catColor(key) }} />
                    </div>
                    <span className="w-10 shrink-0 text-right text-[11px] font-bold tabular-nums" style={{ color: "var(--muted-text)" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="glass rounded-2xl p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>{label}</p>
      <p className="mt-1 text-xl font-extrabold">{value}</p>
    </div>
  );
}