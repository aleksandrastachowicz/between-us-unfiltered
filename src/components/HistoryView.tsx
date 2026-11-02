import { useGame } from "@/lib/store";
import { GuestBanner } from "./GuestBanner";
import { EmptyState, QuestionRow, ViewHeader } from "./QuestionRow";

const t = {
  pl: { title: "Historia", cards: (n: number) => `Ta rozmowa · ${n} ${n === 1 ? "karta" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "karty" : "kart"}`, empty: "Tu pojawią się pytania, które już padły w tej rozmowie." },
  en: { title: "History", cards: (n: number) => `This conversation · ${n} ${n === 1 ? "card" : "cards"}`, empty: "Questions you have already asked in this conversation will show up here." },
};

export function HistoryView() {
  const lang = useGame((s) => s.lang);
  const history = useGame((s) => s.history);
  const card = useGame((s) => s.card);
  const players = useGame((s) => s.players);
  const currentPlayer = useGame((s) => s.currentPlayer);
  const c = t[lang];

  // Newest first, including the card that is on the table now.
  const entries = [...history, ...(card ? [{ card, currentPlayer }] : [])].reverse();

  return (
    <section className="w-full max-w-2xl self-center pb-4">
      <ViewHeader eyebrow={entries.length ? c.cards(entries.length) : undefined} title={c.title} />
      <GuestBanner />
      {entries.length === 0 ? (
        <EmptyState>{c.empty}</EmptyState>
      ) : (
        <ul className="flex flex-col gap-2.5 lg:gap-3">
          {entries.map((h, i) => (
            <QuestionRow key={`${h.card.id}-${i}`} card={h.card} player={players[h.currentPlayer]} />
          ))}
        </ul>
      )}
    </section>
  );
}
