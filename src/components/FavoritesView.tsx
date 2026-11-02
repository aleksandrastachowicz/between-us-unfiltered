import { useGame, type DrawnCard } from "@/lib/store";
import { QUESTIONS } from "@/data/questions";
import { GuestBanner } from "./GuestBanner";
import { EmptyState, QuestionRow, ViewHeader } from "./QuestionRow";

const t = {
  pl: { title: "Ulubione", eyebrow: (n: number) => `Zapisane pytania · ${n}`, empty: "Stuknij serce na karcie albo stuknij odkrytą kartę dwa razy, żeby zapisać pytanie tutaj." },
  en: { title: "Favourites", eyebrow: (n: number) => `Saved questions · ${n}`, empty: "Tap the heart on a card, or double-tap a revealed card, to save a question here." },
};

export function FavoritesView() {
  const lang = useGame((s) => s.lang);
  const favorites = useGame((s) => s.favorites);
  const favoriteCards = useGame((s) => s.favoriteCards);
  const c = t[lang];

  // Newest first. Older favourites (saved before full cards were stored) fall back to the question bank.
  const items = [...favorites]
    .reverse()
    .map((id): DrawnCard | undefined => {
      if (favoriteCards[id]) return favoriteCards[id];
      const q = QUESTIONS.find((x) => x.id === id);
      return q ? { id: q.id, pl: q.pl, en: q.en, category: q.category } : undefined;
    })
    .filter((x): x is DrawnCard => Boolean(x));

  return (
    <section className="w-full max-w-2xl self-center pb-4">
      <ViewHeader eyebrow={items.length ? c.eyebrow(items.length) : undefined} title={c.title} />
      <GuestBanner />
      {items.length === 0 ? (
        <EmptyState>{c.empty}</EmptyState>
      ) : (
        <ul className="flex flex-col gap-2.5 lg:gap-3">
          {items.map((q) => (
            <QuestionRow key={q.id} card={q} />
          ))}
        </ul>
      )}
    </section>
  );
}
