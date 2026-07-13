import { Heart, Share2 } from "lucide-react";
import { useGame } from "@/lib/store";
import { shareOrDownloadStory } from "@/lib/storyExport";

const t = {
  pl: {
    title: "Ulubione pytania",
    empty: "Podwójnie stuknij w kartę podczas gry, aby ją tu zapisać.",
    remove: "Usuń z ulubionych",
    share: "Udostępnij",
  },
  en: {
    title: "Favorite questions",
    empty: "Double-tap a card during play to save it here.",
    remove: "Remove from favorites",
    share: "Share",
  },
};

export function FavoritesView() {
  const lang = useGame((s) => s.lang);
  const favorites = useGame((s) => s.favorites);
  const history = useGame((s) => s.history);
  const card = useGame((s) => s.card);
  const toggleFavorite = useGame((s) => s.toggleFavorite);
  const c = t[lang];

  // Resolve full card content from history + current card.
  const seen = new Map<string, { id: string; pl: string; en: string }>();
  for (const h of history) seen.set(h.card.id, h.card);
  if (card) seen.set(card.id, card);

  const items = favorites
    .map((id) => seen.get(id))
    .filter((x): x is { id: string; pl: string; en: string } => Boolean(x));

  return (
    <div className="w-full">
      <h2 className="mb-3 text-lg font-extrabold tracking-tight">{c.title}</h2>
      {items.length === 0 ? (
        <p className="rounded-2xl p-6 text-center text-sm" style={{ background: "var(--panel)", color: "var(--muted-text)" }}>
          {c.empty}
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((q) => {
            const primary = lang === "pl" ? q.pl : q.en;
            const secondary = lang === "pl" ? q.en : q.pl;
            return (
              <li key={q.id} className="glass rounded-2xl p-4">
                <div className="mb-1 flex items-center justify-end gap-1">
                  <button
                    onClick={() => toggleFavorite(q.id)}
                    aria-label={c.remove}
                    className="rounded-full p-1.5"
                    style={{ background: "var(--panel-2)" }}
                  >
                    <Heart className="h-4 w-4" fill="#ff3b6b" stroke="#ff3b6b" />
                  </button>
                  <button
                    onClick={() => void shareOrDownloadStory(q as never, lang)}
                    aria-label={c.share}
                    className="rounded-full p-1.5"
                    style={{ background: "var(--panel-2)" }}
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
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