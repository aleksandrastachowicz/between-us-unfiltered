import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useGame } from "@/lib/store";
import { DISPLAY_FONT } from "./CardArt";

const T = {
  pl: {
    eyebrow: "Zanim zaczniecie",
    title: "Zasady",
    promise: "To, co mówimy w grze, zostaje między nami.",
    promiseD:
      "Stąd nazwa. Nic, co ktoś opowie podczas gry, nie wychodzi poza Wasze grono, chyba że wszyscy się na to zgodzą.",
    rules: [
      ["Odkryj kartę", "Osoba, której jest kolej, czyta pytanie i odpowiada. Gra się we dwoje albo w większym gronie."],
      ["Odpowiedz albo przejdź dalej", "Nie trzeba odpowiadać na każde pytanie. Możesz po prostu przejść do następnej karty, bez tłumaczenia się."],
      ["„A Ty?”", "Chcesz usłyszeć drugą stronę? Zapytaj „A Ty?”, a pytanie wróci do osoby, która je zadała."],
      ["Bez oceniania", "Każdy ma swoje doświadczenia. Słuchamy, zamiast komentować czy wyśmiewać."],
      ["Szanujemy granice", "Jeśli ktoś nie chce o czymś mówić, przyjmujemy to bez naciskania."],
      ["Rozmowa, nie rywalizacja", "Nie ma wygranych ani przegranych. Chodzi o to, żeby lepiej się poznać."],
      ["Bądźcie obecni", "Odłóżcie inne telefony i powiadomienia. Zostaje tylko ten z grą."],
    ],
    tips: "Przesuń kartę w lewo, żeby wylosować następną, w prawo, żeby wrócić. Odkrytą kartę stuknij dwa razy, żeby zapisać ją w ulubionych.",
    start: "Zaczynamy",
    close: "Zamknij",
  },
  en: {
    eyebrow: "Before you start",
    title: "The rules",
    promise: "What we say in the game stays between us.",
    promiseD:
      "That's where the name comes from. Nothing anyone shares during the game leaves your circle unless everyone agrees.",
    rules: [
      ["Reveal a card", "Whoever's turn it is reads the question and answers. Play as a pair or in a bigger group."],
      ["Answer or move on", "You don't have to answer every question. Just go to the next card, no explanation needed."],
      ["“What about you?”", "Want to hear the other side? Ask “What about you?” and the question goes back to whoever asked it."],
      ["No judgment", "Everyone has their own story. We listen instead of commenting or laughing."],
      ["Respect boundaries", "If someone doesn't want to talk about something, we accept it without pushing."],
      ["Conversation, not competition", "There are no winners or losers. It's about getting to know each other."],
      ["Be present", "Put other phones and notifications away. Only the one with the game stays."],
    ],
    tips: "Swipe a card left for the next one, right to go back. Double-tap a revealed card to save it to favourites.",
    start: "Let's play",
    close: "Close",
  },
};

export function RulesSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lang = useGame((s) => s.lang);
  const c = T[lang];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[57] bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-title"
            className="fixed inset-x-0 bottom-0 z-[58] mx-auto flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[28px] md:bottom-auto md:top-1/2 md:max-h-[86dvh] md:-translate-y-1/2 md:rounded-[28px]"
            style={{ background: "var(--panel)" }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-start justify-between gap-3 px-5 pt-6 lg:px-8 lg:pt-8">
              <div className="flex flex-col gap-1">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.22em] lg:text-[13px]" style={{ color: "var(--sub-text)" }}>
                  {c.eyebrow}
                </p>
                <h2 id="rules-title" className="text-[30px] leading-none lg:text-[40px]" style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}>
                  {c.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={c.close}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--panel-2)", color: "var(--ink)" }}
              >
                <X className="h-6 w-6" strokeWidth={2.4} />
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto px-5 pb-4 pt-5 lg:px-8">
              <div className="rounded-[20px] p-4 lg:p-5" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
                <p className="text-[19px] leading-snug lg:text-[22px]" style={{ fontFamily: DISPLAY_FONT }}>
                  {c.promise}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed lg:text-[15px]" style={{ opacity: 0.92 }}>
                  {c.promiseD}
                </p>
              </div>

              <ol className="flex flex-col gap-3">
                {c.rules.map(([title, body], i) => (
                  <li key={title} className="flex gap-3.5">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px]"
                      style={{ background: "var(--chip)", color: "var(--chip-ink)", fontFamily: DISPLAY_FONT }}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-0.5 pt-1">
                      <p className="text-[16px] font-extrabold lg:text-[17px]" style={{ color: "var(--text)" }}>{title}</p>
                      <p className="text-[14px] leading-relaxed lg:text-[15px]" style={{ color: "var(--sub-text)" }}>{body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="rounded-[16px] px-4 py-3 text-[13px] leading-relaxed lg:text-[14px]" style={{ background: "var(--panel-2)", color: "var(--sub-text)" }}>
                {c.tips}
              </p>
            </div>

            <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 lg:px-8 lg:pb-8">
              <button
                type="button"
                onClick={onClose}
                className="h-14 w-full rounded-[18px] text-[19px]"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }}
              >
                {c.start}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
