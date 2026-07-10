import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Share2, Trash2 } from "lucide-react";
import { useGame, type DrawnCard } from "@/lib/store";
import { CATEGORY_META, EDITION_META, editionForCategory } from "@/data/questions";
import { UNFILTERED_LEVELS } from "@/data/unfiltered";
import { generateShareCard, accentHexFor } from "@/lib/shareCard";

const t = {
  pl: {
    title: "Ulubione",
    empty: "Nie masz jeszcze zapisanych pytań.",
    emptyHint: "Dotknij serca pod kartą, aby zapisać pytanie.",
    share: "Udostępnij",
    remove: "Usuń",
  },
  en: {
    title: "Favorites",
    empty: "You haven't saved any questions yet.",
    emptyHint: "Tap the heart under a card to save a question.",
    share: "Share",
    remove: "Remove",
  },
};

function labelFor(card: DrawnCard, lang: "pl" | "en") {
  if (card.category === "unfiltered") {
    const lvl = card.unfilteredLevel ?? "love_spice";
    return `${UNFILTERED_LEVELS[lvl].emoji} ${UNFILTERED_LEVELS[lvl].label[lang]}`;
  }
  return CATEGORY_META[card.category].label[lang];
}

export function FavoritesPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lang = useGame((s) => s.lang);
  const favorites = useGame((s) => s.favorites);
  const toggleFavorite = useGame((s) => s.toggleFavorite);
  const c = t[lang];

  const share = (card: DrawnCard) => {
    void generateShareCard({
      primary: lang === "pl" ? card.pl : card.en,
      secondary: lang === "pl" ? card.en : card.pl,
      category: labelFor(card, lang),
      edition: EDITION_META[editionForCategory(card.category)][lang],
      accent: accentHexFor(card.category),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="glass fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-extrabold">
                <Heart className="h-5 w-5" style={{ color: "var(--accent)" }} fill="currentColor" />
                {c.title}
              </h2>
              <button onClick={onClose} className="rounded-full p-2" style={{ background: "var(--panel-2)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {favorites.length === 0 ? (
              <div className="mt-16 text-center">
                <Heart className="mx-auto mb-4 h-10 w-10 opacity-30" />
                <p className="text-sm font-semibold">{c.empty}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted-text)" }}>{c.emptyHint}</p>
              </div>
            ) : (
              <div className="-mr-2 flex flex-1 flex-col gap-3 overflow-y-auto pr-2">
                <AnimatePresence initial={false}>
                  {favorites.map((card) => (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="rounded-2xl p-4"
                      style={{ background: "var(--panel-2)" }}
                    >
                      <span
                        className="mb-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                        style={{ background: `var(--color-cat-${card.category})`, color: "#fff" }}
                      >
                        {labelFor(card, lang)}
                      </span>
                      <p className="text-sm font-extrabold leading-snug">
                        {lang === "pl" ? card.pl : card.en}
                      </p>
                      <p className="mt-1 text-xs leading-snug" style={{ color: "var(--muted-text)" }}>
                        {lang === "pl" ? card.en : card.pl}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => share(card)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold"
                          style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
                        >
                          <Share2 className="h-3.5 w-3.5" /> {c.share}
                        </button>
                        <button
                          onClick={() => toggleFavorite(card)}
                          aria-label={c.remove}
                          className="rounded-xl px-3 py-2"
                          style={{ background: "var(--panel)" }}
                        >
                          <Trash2 className="h-4 w-4" style={{ color: "var(--muted-text)" }} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
