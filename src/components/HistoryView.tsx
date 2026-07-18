import { useRef } from "react";
import { Share2, Heart } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useGame } from "@/lib/store";
import { shareOrDownloadStory } from "@/lib/storyExport";
import { GuestBanner } from "./GuestBanner";

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
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 132,
    overscan: 6,
  });

  return (
    <div className="w-full">
      <GuestBanner />
      <h2 className="mb-3 text-lg font-extrabold tracking-tight">{c.title}</h2>
      {entries.length === 0 ? (
        <p className="rounded-2xl p-6 text-center text-sm" style={{ background: "var(--panel)", color: "var(--muted-text)" }}>
          {c.empty}
        </p>
      ) : (
        <div ref={parentRef} className="max-h-[60dvh] overflow-y-auto">
          <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative", width: "100%" }}>
            {rowVirtualizer.getVirtualItems().map((vi) => {
              const h = entries[vi.index];
              const primary = lang === "pl" ? h.card.pl : h.card.en;
              const secondary = lang === "pl" ? h.card.en : h.card.pl;
              const player = players[h.currentPlayer];
              const isFav = favorites.includes(h.card.id);
              return (
                <div
                  key={`${h.card.id}-${vi.index}`}
                  ref={rowVirtualizer.measureElement}
                  data-index={vi.index}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${vi.start}px)`, paddingBottom: 10 }}
                >
                  <div className="glass rounded-2xl p-4">
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}