import { Share2, Heart } from "lucide-react";
import { useGame } from "@/lib/store";
import { shareOrDownloadStory } from "@/lib/storyExport";

const t = {
  pl: {
    title: "Historia rundy",
    empty: "Historia jest pusta. Zagraj kilka kart, aby zobaczyć je tutaj.",
    share: "Udostępnij",
    fav: "Ulubione",
  },
  en: {
    title: "Round history",
    empty: "No history yet. Play a few cards to see them here.",
    share: "Share",
    fav: "Favorite",
  },
};

export function HistoryView() {
  const lang = useGame((s) => s.lang);
  const history = useGame((s) => s.history);
  const players = useGame((s) => s.players);
  const favorites = useGame((s) => s.favorites);
  const toggleFavorite = useGame((s) => s.toggleFavorite);
  const c = t[lang];

  const entries = [...history].reverse();

  return (
    <div className="w-full">
      <h2 className="mb-3 text-lg font-extrabold tracking-tight">{c.title}</h2>
      {entries.length === 0 ? (
        <p className="rounded-2xl p-6 text-center text-sm" style={{ background: "var(--panel)", color: "var(--muted-text)" }}>
          {c.empty}
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {entries.map((h, i) => {
            const primary = lang === "pl" ? h.card.pl : h.card.en;
            const secondary = lang === "pl" ? h.card.en : h.card.pl;
            const player = players[h.currentPlayer];
            const isFav = favorites.includes(h.card.id);
            return (
              <li key={`${h.card.id}-${i}`} className="glass rounded-2xl p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  {player ? (
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                    >
                      {player}
                    </span>
                  ) : <span />}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(h.card.id)}
                      aria-label={c.fav}
                      aria-pressed={isFav}
                      className="rounded-full p-1.5"
                      style={{ background: "var(--panel-2)" }}
                    >
                      <Heart
                        className="h-4 w-4"
                        fill={isFav ? "#ff3b6b" : "none"}
                        stroke={isFav ? "#ff3b6b" : "currentColor"}
                      />
                    </button>
                    <button
                      onClick={() => void shareOrDownloadStory(h.card, lang)}
                      aria-label={c.share}
                      className="rounded-full p-1.5"
                      style={{ background: "var(--panel-2)" }}
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold leading-snug">{primary}</p>
                <p className="mt-1 text-xs leading-snug" style={{ color: "var(--muted-text)" }}>
                  {secondary}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}