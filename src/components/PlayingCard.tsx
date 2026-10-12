import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "motion/react";
import { Button } from "./ui/button";
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
  const systemReducedMotion = useReducedMotion();
  const use3d = animations && !reducedMotion && !systemReducedMotion;
  const questionRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const box = questionRef.current;
    if (!box) return;
    const fit = () => {
      const primaryText = box.querySelector<HTMLElement>("[data-primary-question]");
      const secondaryText = box.querySelector<HTMLElement>("[data-secondary-question]");
      if (!primaryText || !secondaryText) return;
      for (let size = 26; size >= 16; size--) {
        primaryText.style.fontSize = `${size}px`;
        secondaryText.style.fontSize = `${Math.max(12, Math.round(size * 0.6))}px`;
        if (box.scrollHeight <= box.clientHeight + 1) break;
      }
    };
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    fit();
    document.fonts.ready.then(fit);
    return () => observer.disconnect();
  }, [primary, secondary, categoryLabel]);

  useEffect(() => () => {
    if (clickTimer.current) clearTimeout(clickTimer.current);
  }, []);

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
    <div className="playing-card relative mx-auto select-none" style={{ perspective: use3d ? 1600 : undefined, aspectRatio: "5 / 7" }}>
      <motion.div
        className="preserve-3d transform-gpu will-change-transform relative h-full w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-[32px]"
        style={{ willChange: "transform" }}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-expanded={flipped}
        aria-label={flipLabel}
        onKeyDown={handleKeyDown}
        onClick={handleTap}
        drag={use3d ? true : false}
        dragSnapToOrigin
        dragElastic={0.14}
        onDragEnd={onDragEnd}
        animate={{ rotateY: use3d && flipped ? 180 : 0, opacity: 1 }}
        transition={
          use3d
            ? { type: "spring", stiffness: 140, damping: 18, mass: 0.9 }
            : { duration: 0.18, ease: "easeOut" }
        }
        whileTap={use3d ? { scale: 0.98 } : undefined}
      >
        {/* BACK (reverse) — shown first */}
        <motion.div
          className="backface-hidden transform-gpu absolute inset-0 overflow-hidden rounded-[32px] shadow-2xl"
          style={{
            boxShadow: isFav
              ? "0 30px 60px -20px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,59,107,0.55), 0 0 40px -6px rgba(255,59,107,0.55)"
              : "0 30px 60px -20px rgba(0,0,0,0.4)",
            willChange: "transform",
            pointerEvents: flipped ? "none" : "auto",
          }}
          aria-hidden={flipped}
          animate={{ opacity: use3d ? 1 : flipped ? 0 : 1 }}
          transition={{ duration: use3d ? 0 : 0.18 }}
        >
          <CardArt
            pattern={pattern}
            edition={edition}
            category={categoryLabel}
            hint={hint}
          />

        </motion.div>

        {/* FRONT (facing) */}
        <motion.div
          className="backface-hidden transform-gpu absolute inset-0 flex flex-col rounded-[32px] p-5 sm:p-7"
          style={{
            transform: use3d ? "rotateY(180deg)" : "none",
            background: "var(--card-surface)",
            color: "var(--card-ink)",
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35)",
            willChange: "transform",
            pointerEvents: flipped ? "auto" : "none",
          }}
          aria-hidden={!flipped}
          animate={{ opacity: use3d ? 1 : flipped ? 1 : 0 }}
          transition={{ duration: use3d ? 0 : 0.18 }}
        >
          <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
            <div className="flex min-w-0 flex-col gap-1.5">
              <span
                className="text-[9px] font-bold uppercase tracking-[0.34em]"
                style={{ color: "var(--muted-text)" }}
              >
                {edition}
              </span>
              <span
                className="max-w-full w-fit rounded-lg px-2 py-1 text-[10px] font-bold leading-snug"
                style={{ background: accent, color: `var(--cat-ink-${card.category})` }}
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

          <div ref={questionRef} className="question-copy my-3 min-h-0 flex-1 overflow-y-auto text-center">
            <p data-primary-question className="text-balance text-[26px] font-extrabold leading-tight">
              {primary}
            </p>
            <p data-secondary-question className="mt-3 text-balance text-[16px] font-medium leading-snug" style={{ color: "var(--muted-text)" }}>
              {secondary}
            </p>
          </div>

          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ opacity: 0.35 }}>
            Between Us
          </p>
          {/* Favorite indicator — top-right of the FRONT face. */}
          {isFav && (
            <div className="pointer-events-none absolute right-4 top-4 z-20">
              <Heart className="h-5 w-5" fill="#ff3b6b" stroke="#ff3b6b" />
            </div>
          )}
        </motion.div>

        {/* Double-tap heart burst — nested inside 3D wrapper so it rotates with the card */}
        <AnimatePresence>
          {heartBurst > 0 && (
            <motion.div
              key={heartBurst}
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
              style={{ transform: `rotateY(${use3d && flipped ? 180 : 0}deg) translateZ(4px)`, backfaceVisibility: "hidden" }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.05, 1.1, 1.2] }}
              transition={{ duration: 0.7, times: [0, 0.25, 0.55, 1], ease: "easeOut" }}
              onAnimationComplete={() => setHeartBurst(0)}
            >
              <Heart
                className="h-28 w-28 drop-shadow-2xl"
                fill={isFav ? "#ff3b6b" : "rgba(255,255,255,0.75)"}
                stroke={isFav ? "#ff3b6b" : "#ffffff"}
                strokeWidth={1.5}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Screen-reader-only favorite toggle (double-tap works for pointer users) */}
      <Button variant="secondary"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(card.id);
          setHeartBurst((n) => n + 1);
        }}
        aria-label={favLabel}
        aria-pressed={isFav}
        className="sr-only focus:not-sr-only focus:absolute focus:right-2 focus:top-2 focus:z-30 focus:whitespace-normal focus:text-xs"
      >
        {favLabel}
      </Button>
    </div>
  );
}
