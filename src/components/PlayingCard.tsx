import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "motion/react";
import { Heart } from "lucide-react";
import { useGame, type DrawnCard } from "@/lib/store";
import { CATEGORY_META, EDITION_META, editionForCategory } from "@/data/questions";
import { UNFILTERED_LEVELS } from "@/data/unfiltered";
import { CardArt, DISPLAY_FONT, FRONT_STYLES, FrontSymbol, patternFor } from "./CardArt";

const FAV_RED = "#C1121F";

function categoryLabelFor(card: DrawnCard, lang: "pl" | "en") {
  if (card.category === "unfiltered") {
    const lvl = card.unfilteredLevel ?? "love_spice";
    return UNFILTERED_LEVELS[lvl].label[lang];
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
  const front = FRONT_STYLES[pattern];
  const primary = lang === "pl" ? card.pl : card.en;
  const secondary = lang === "pl" ? card.en : card.pl;

  const edition = EDITION_META[editionForCategory(card.category)][lang];
  const categoryLabel = categoryLabelFor(card, lang);
  const hint = lang === "pl" ? "dotknij, aby odkryć" : "tap to reveal";
  const flipLabel = lang === "pl"
    ? (flipped ? `Karta odwrócona, pytanie: ${primary}` : `Karta zakryta, kategoria: ${categoryLabel}. Naciśnij Enter, aby odkryć.`)
    : (flipped ? `Card revealed, question: ${primary}` : `Card hidden, category: ${categoryLabel}. Press Enter to reveal.`);
  const favLabel = lang === "pl"
    ? (isFav ? "Usuń z ulubionych" : "Dodaj do ulubionych")
    : (isFav ? "Remove from favorites" : "Add to favorites");

  // Shrink the question until it fits the card (long questions, small phones).
  useEffect(() => {
    const box = questionRef.current;
    if (!box) return;
    const fit = () => {
      const primaryText = box.querySelector<HTMLElement>("[data-primary-question]");
      const secondaryText = box.querySelector<HTMLElement>("[data-secondary-question]");
      if (!primaryText || !secondaryText) return;
      for (let size = 26; size >= 15; size--) {
        primaryText.style.fontSize = `${size}px`;
        secondaryText.style.fontSize = `${Math.max(12, Math.round(size * 0.58))}px`;
        if (box.scrollHeight <= box.clientHeight + 1) break;
      }
    };
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    fit();
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [primary, secondary]);

  useEffect(() => () => {
    if (clickTimer.current) clearTimeout(clickTimer.current);
  }, []);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 70 || Math.abs(info.offset.y) > 70) {
      if (!flipped) flip();
    }
  };

  const favorite = () => {
    toggleFavorite(card.id);
    setHeartBurst((n) => n + 1);
  };

  const handleTap = () => {
    if (clickTimer.current) {
      // double-tap → favorite
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      favorite();
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

  const shadow = "0 24px 48px -20px rgba(101,15,35,0.45)";

  return (
    <div className="playing-card relative mx-auto select-none" style={{ perspective: use3d ? 1600 : undefined, aspectRatio: "5 / 7" }}>
      <motion.div
        className="preserve-3d transform-gpu will-change-transform relative h-full w-full cursor-pointer rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{ willChange: "transform" }}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipLabel}
        onKeyDown={handleKeyDown}
        onClick={handleTap}
        drag={use3d}
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
        {/* BACK — shown first */}
        <motion.div
          className="backface-hidden transform-gpu absolute inset-0 overflow-hidden rounded-[28px]"
          style={{
            boxShadow: isFav ? `${shadow}, 0 0 0 3px ${FAV_RED}` : shadow,
            willChange: "transform",
            pointerEvents: flipped ? "none" : "auto",
          }}
          aria-hidden={flipped}
          animate={{ opacity: use3d ? 1 : flipped ? 0 : 1 }}
          transition={{ duration: use3d ? 0 : 0.18 }}
        >
          <CardArt pattern={pattern} edition={edition} category={categoryLabel} hint={hint} />
        </motion.div>

        {/* FRONT — calm: one symbol, the question in the middle, a quiet footer */}
        <motion.div
          className="backface-hidden transform-gpu absolute inset-0 flex flex-col items-center overflow-hidden rounded-[28px] px-[9%] pb-[7%] pt-[8%] text-center"
          style={{
            transform: use3d ? "rotateY(180deg)" : "none",
            background: front.bg,
            boxShadow: shadow,
            willChange: "transform",
            pointerEvents: flipped ? "auto" : "none",
          }}
          aria-hidden={!flipped}
          animate={{ opacity: use3d ? 1 : flipped ? 1 : 0 }}
          transition={{ duration: use3d ? 0 : 0.18 }}
        >
          <div className="shrink-0">
            <FrontSymbol symbol={front.symbol} color={front.symbolColor} size={24} />
          </div>

          <div
            ref={questionRef}
            className="question-copy my-4 flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 overflow-hidden"
          >
            <p
              data-primary-question
              className="text-balance leading-[1.2]"
              style={{ fontFamily: DISPLAY_FONT, fontSize: 26, color: front.ink }}
            >
              {primary}
            </p>
            <p
              data-secondary-question
              className="text-balance font-medium leading-[1.38]"
              style={{ fontSize: 15, color: front.sub }}
            >
              {secondary}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1.5" style={{ color: front.foot }}>
            <span className="text-[12px] tracking-[0.04em]" style={{ fontFamily: DISPLAY_FONT }}>
              between us
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">
              {categoryLabel} · {edition}
            </span>
          </div>

          {/* Favourite button — visible on the front */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              favorite();
            }}
            aria-label={favLabel}
            aria-pressed={isFav}
            tabIndex={flipped ? 0 : -1}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ background: "rgba(101,15,35,0.07)" }}
          >
            <Heart
              className="h-5 w-5"
              fill={isFav ? FAV_RED : "none"}
              stroke={isFav ? FAV_RED : front.ink}
              strokeWidth={2.2}
            />
          </button>
        </motion.div>

        {/* Double-tap heart burst — inside the 3D wrapper so it turns with the card */}
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
                fill={isFav ? FAV_RED : "rgba(255,255,255,0.8)"}
                stroke={isFav ? FAV_RED : "#ffffff"}
                strokeWidth={1.5}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
