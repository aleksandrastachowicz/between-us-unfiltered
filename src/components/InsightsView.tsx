import { useGame } from "@/lib/store";
import { CATEGORY_META, type CategoryId } from "@/data/questions";
import { UNFILTERED_LEVELS } from "@/data/unfiltered";
import { GuestBanner } from "./GuestBanner";
import { EmptyState, ViewHeader } from "./QuestionRow";
import { DISPLAY_FONT, FRONT_STYLES, patternFor } from "./CardArt";

const t = {
  pl: {
    title: "Statystyki",
    eyebrow: "Wasze rozmowy",
    empty: "Zagrajcie kilka kart, a tu zobaczycie, o czym rozmawiacie najczęściej.",
    total: "Wylosowane karty",
    favs: "Ulubione pytania",
    top: "Najczęstszy temat",
    level: "Poziom Bez filtra",
    cats: "O czym rozmawiacie",
    unfiltered: "Bez filtra",
  },
  en: {
    title: "Insights",
    eyebrow: "Your conversations",
    empty: "Play a few cards and you will see what you talk about most.",
    total: "Cards drawn",
    favs: "Favourite questions",
    top: "Top topic",
    level: "Unfiltered level",
    cats: "What you talk about",
    unfiltered: "Unfiltered",
  },
};

export function InsightsView() {
  const lang = useGame((s) => s.lang);
  const stats = useGame((s) => s.stats);
  const favorites = useGame((s) => s.favorites);
  const ufLevel = useGame((s) => s.ufLevel);
  const decks = useGame((s) => s.decks);
  const c = t[lang];

  const entries = Object.entries(stats.categoryCounts).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] ?? 1;

  const label = (key: string) =>
    key === "unfiltered" ? c.unfiltered : CATEGORY_META[key as CategoryId]?.label[lang] ?? key;
  const color = (key: string) =>
    key === "unfiltered" ? "#A3101E" : FRONT_STYLES[patternFor(key as CategoryId)]?.symbolColor ?? "var(--accent)";

  return (
    <section className="w-full max-w-2xl self-center pb-4">
      <ViewHeader eyebrow={c.eyebrow} title={c.title} />
      <GuestBanner />
      {stats.totalDraws === 0 ? (
        <EmptyState>{c.empty}</EmptyState>
      ) : (
        <div className="flex flex-col gap-3 lg:gap-4">
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <Stat label={c.total} value={String(stats.totalDraws)} />
            <Stat label={c.favs} value={String(favorites.length)} />
            <Stat label={c.top} value={entries[0] ? label(entries[0][0]) : "–"} small />
            <Stat label={c.level} value={decks.unfiltered ? UNFILTERED_LEVELS[ufLevel].label[lang] : "–"} small />
          </div>

          <div className="rounded-[20px] p-4 lg:p-6" style={{ background: "var(--card-surface)", border: "1px solid var(--border)" }}>
            <p className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.2em] lg:text-[13px]" style={{ color: "var(--muted-text)" }}>
              {c.cats}
            </p>
            <ul className="flex flex-col gap-3.5">
              {entries.map(([key, count]) => {
                const pct = Math.round((count / stats.totalDraws) * 100);
                const w = Math.max(4, Math.round((count / max) * 100));
                return (
                  <li key={key} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[14px] font-bold lg:text-[16px]" style={{ color: "var(--text)" }}>{label(key)}</span>
                      <span className="text-[13px] font-extrabold tabular-nums lg:text-[15px]" style={{ color: "var(--sub-text)" }}>{pct}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full lg:h-3" style={{ background: "var(--panel-2)" }}>
                      <div className="h-full rounded-full" style={{ width: `${w}%`, background: color(key) }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-[20px] p-4 lg:p-5" style={{ background: "var(--card-surface)", border: "1px solid var(--border)" }}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] lg:text-[12px]" style={{ color: "var(--muted-text)" }}>{label}</p>
      <p
        className={small ? "text-[18px] leading-tight lg:text-[22px]" : "text-[32px] leading-none lg:text-[42px]"}
        style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}
      >
        {value}
      </p>
    </div>
  );
}
