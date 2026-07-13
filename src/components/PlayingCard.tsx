import { useRef, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import { Heart } from "lucide-react";
import { useGame, type DrawnCard } from "@/lib/store";
import { CATEGORY_META, EDITION_META, editionForCategory } from "@/data/questions";
import { UNFILTERED_LEVELS } from "@/data/unfiltered";
import { CardArt, patternFor } from "./CardArt";

const accentVar: Record<string, string> = {
  love: "var(--color-cat-love)",
  friendship: "var(--color-cat-friendship)",
  selfdev: "var(--color-cat-selfdev)",
  passions: "var(--color-cat-passions)",
  introspection: "var(--color-cat-introspection)",
  plus_love: "var(--color-cat-plus_love)",
  plus_spice: "var(--color-cat-plus_spice)",
  plus_deep: "var(--color-cat-plus_deep)",
  plus_kinky: "var(--color-cat-plus_kinky)",
  unfiltered: "var(--color-cat-unfiltered)",
};

function categoryLabelFor(card: DrawnCard, lang: "pl" | "en") {
  if (card.category === "unfiltered") {
    const lvl = card.unfilteredLevel ?? "love_spice";
    return `${UNFILTERED_LEVELS[lvl].emoji} ${UNFILTERED_LEVELS[lvl].label[lang]}`;
  }
  return CATEGORY_META[card.category].label[lang];
}

export function PlayingCard({ card }: { card: DrawnCard }) {
  const { lang, flipped, flip, animations, reducedMotion, favorites, toggleFavorite } = useGame();
  const isFav = favorites.includes(card.id);
  const [heartBurst, setHeartBurst] = useState(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const use3d = animations && !reducedMotion;
  const pattern = patternFor(card.category, card.unfilteredLevel);
  const primary = lang === "pl" ? card.pl : card.en;
  const secondary = lang === "pl" ? card.en : card.pl;
  const accent = accentVar[card.category];

  const edition = EDITION_META[editionForCategory(card.category)][lang];
  const categoryLabel = categoryLabelFor(card, lang);
  const hint = lang === "pl" ? "dotknij, aby odkryć" : "tap to reveal";
  const flipLabel = lang === "pl"
    ? (flipped ? `Karta odwrócona, pytanie: ${primary}` : `Karta zakryta, kategoria: ${categoryLabel}. Naciśnij Enter, aby odkryć.`)
    : (flipped ? `Card revealed, question: ${primary}` : `Card hidden, category: ${categoryLabel}. Press Enter to reveal.`);
  const favLabel = lang === "pl"
    ? (isFav ? "Usuń z ulubionych" : "Dodaj do ulubionych")
    : (isFav ? "Remove from favorites" : "Add to favorites");

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 70 || Math.abs(info.offset.y) > 70) {
      if (!flipped) flip();
    }
  };

  const handleTap = () => {
    if (clickTimer.current) {
      // double-tap → favorite
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      toggleFavorite(card.id);
      setHeartBurst((n) => n + 1);
      return;
    }
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      flip();
    }, 220);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px] select-none" style={{ perspective: 1600, aspectRatio: "5 / 7" }}>
      <motion.div
        className="preserve-3d transform-gpu will-change-transform relative h-full w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-[32px]"
        style={{ willChange: "transform" }}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipLabel}
        onKeyDown={handleKeyDown}
        onClick={handleTap}
        drag={use3d ? true : false}
        dragSnapToOrigin
        dragElastic={0.18}
        onDragEnd={onDragEnd}
        animate={use3d ? { rotateY: flipped ? 180 : 0, opacity: 1 } : { rotateY: flipped ? 180 : 0, opacity: 1 }}
        transition={
          use3d
            ? { type: "spring", stiffness: 120, damping: 14 }
            : { duration: 0.18, ease: "easeOut" }
        }
        whileTap={use3d ? { scale: 0.97 } : undefined}
      >
        {/* BACK (reverse) — shown first */}
        <div
          className="backface-hidden transform-gpu absolute inset-0 overflow-hidden rounded-[32px] shadow-2xl"
          style={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4)", willChange: "transform" }}
        >
          <CardArt
            pattern={pattern}
            edition={edition}
            category={categoryLabel}
            hint={hint}
          />

        </div>

        {/* FRONT (facing) */}
        <div
          className="backface-hidden transform-gpu absolute inset-0 flex flex-col rounded-[32px] p-7"
          style={{
            transform: "rotateY(180deg)",
            background: "var(--card-surface)",
            color: "var(--card-ink)",
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35)",
            willChange: "transform",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span
                className="text-[9px] font-bold uppercase tracking-[0.34em]"
                style={{ color: "var(--muted-text)" }}
              >
                {edition}
              </span>
              <span
                className="w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ background: accent, color: "#fff" }}
              >
                {categoryLabel}
              </span>
            </div>
            {card.intensity ? (
              <span className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: i < (card.intensity ?? 0) ? accent : "var(--border)" }}
                  />
                ))}
              </span>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-balance text-[26px] font-extrabold leading-tight tracking-tight">
              {primary}
            </p>
            <p className="mt-4 text-balance text-[16px] font-medium leading-snug" style={{ opacity: 0.6 }}>
              {secondary}
            </p>
          </div>

          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ opacity: 0.35 }}>
            Between Us
          </p>
        </div>
      </motion.div>

      {/* Screen-reader-only favorite toggle (double-tap works for pointer users) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(card.id);
          setHeartBurst((n) => n + 1);
        }}
        aria-label={favLabel}
        aria-pressed={isFav}
        className="sr-only focus:not-sr-only focus:absolute focus:right-2 focus:top-2 focus:z-30 focus:rounded-full focus:bg-black/70 focus:px-3 focus:py-1 focus:text-xs focus:text-white"
      >
        {favLabel}
      </button>

      {/* Persistent tiny favorite indicator */}
      {isFav && (
        <div className="pointer-events-none absolute right-4 top-4 z-20">
          <Heart className="h-5 w-5" fill="#ff3b6b" stroke="#ff3b6b" />
        </div>
      )}

      {/* Double-tap heart burst */}
      <AnimatePresence>
        {heartBurst > 0 && (
          <motion.div
            key={heartBurst}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.6 }}
            onAnimationComplete={() => setHeartBurst(0)}
          >
            <Heart
              className="h-32 w-32 drop-shadow-2xl"
              fill={isFav ? "#ff3b6b" : "rgba(255,255,255,0.75)"}
              stroke={isFav ? "#ff3b6b" : "#ffffff"}
              strokeWidth={1.5}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
