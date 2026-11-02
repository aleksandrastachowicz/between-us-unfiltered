import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
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
  const { lang, flipped, flip, drawCard, goBack, history, animations, reducedMotion, favorites, toggleFavorite } = useGame();
  // Swipe left: next card. Swipe right: back to the previous card. Same gesture on phone, tablet and with a mouse.
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; id: number; horizontal: boolean | null } | null>(null);
  const swiped = useRef(false);
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
      const max = Math.round(Math.min(38, Math.max(24, box.clientWidth * 0.095)));
      for (let size = max; size >= 15; size--) {
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

  const favorite = () => {
    toggleFavorite(card.id);
    setHeartBurst((n) => n + 1);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button[aria-pressed]:not([role])")) return;
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, horizontal: null };
    swiped.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const mx = e.clientX - d.x;
    const my = e.clientY - d.y;
    if (d.horizontal === null && Math.hypot(mx, my) > 8) {
      d.horizontal = Math.abs(mx) > Math.abs(my);
      if (d.horizontal) {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setDragging(true);
      }
    }
    if (d.horizontal) {
      swiped.current = true;
      // Nothing to go back to: resist a right swipe instead of following the finger.
      setDx(mx > 0 && history.length === 0 ? mx * 0.25 : mx);
    }
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.horizontal) return;
    setDragging(false);
    const mx = e.clientX - d.x;
    if (mx < -90) {
      setDx(-(window.innerWidth + 200));
      window.setTimeout(() => drawCard(), 240);
    } else if (mx > 90 && history.length > 0) {
      setDx(window.innerWidth + 200);
      window.setTimeout(() => goBack(), 240);
    } else {
      setDx(0);
    }
  };

  const handleTap = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    // Hidden card: reveal at once, no waiting (the flip must feel instant on every device).
    if (!flipped) {
      flip();
      return;
    }
    // Revealed card: a double tap adds it to favourites, a single tap turns it back.
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      favorite();
      return;
    }
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null;
      flip();
    }, 240);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      drawCard();
    } else if (e.key === "ArrowLeft" && history.length > 0) {
      e.preventDefault();
      goBack();
    }
  };

  const shadow = "0 24px 48px -20px rgba(101,15,35,0.45)";
  // Scale the small symbol with the card (bigger cards on tablets and desktops).
  const [symbolSize, setSymbolSize] = useState(24);
  useEffect(() => {
    const box = questionRef.current;
    if (!box) return;
    const ro = new ResizeObserver(() => setSymbolSize(Math.round(Math.min(34, Math.max(22, box.clientWidth * 0.08)))));
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  // One flip for every device: a plain CSS 3D rotation (GPU-friendly, the same on iOS, Android and desktop).
  // With reduced motion (app setting or system setting) the two faces cross-fade instead.
  const flipStyle: React.CSSProperties = use3d
    ? {
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        transform: `rotateY(${flipped ? 180 : 0}deg)`,
        transition: "transform 620ms cubic-bezier(0.22, 0.9, 0.24, 1)",
      }
    : {};
  const face: React.CSSProperties = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };
  const fade = (visible: boolean): React.CSSProperties =>
    use3d ? {} : { opacity: visible ? 1 : 0, transition: "opacity 260ms ease-out" };

  return (
    <div
      className="playing-card relative mx-auto select-none"
      style={{
        perspective: use3d ? 1400 : undefined,
        aspectRatio: "5 / 7",
        touchAction: "pan-y",
        transform: dx ? `translateX(${dx}px) rotate(${use3d ? dx * 0.04 : 0}deg)` : undefined,
        transition: dragging ? "none" : "transform 260ms cubic-bezier(0.22, 0.9, 0.24, 1)",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <div
        className="relative h-full w-full cursor-pointer rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{ ...flipStyle, WebkitTapHighlightColor: "transparent" }}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={flipLabel}
        onKeyDown={handleKeyDown}
        onClick={handleTap}
      >
        {/* BACK — shown first */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[28px]"
          style={{
            ...face,
            ...fade(!flipped),
            boxShadow: isFav ? `${shadow}, 0 0 0 3px ${FAV_RED}` : shadow,
            pointerEvents: flipped ? "none" : "auto",
          }}
          aria-hidden={flipped}
        >
          <CardArt pattern={pattern} edition={edition} category={categoryLabel} hint={hint} />
        </div>

        {/* FRONT — calm: one symbol, the question in the middle, a quiet footer */}
        <div
          className="absolute inset-0 flex flex-col items-center overflow-hidden rounded-[28px] px-[9%] pb-[7%] pt-[8%] text-center"
          style={{
            ...face,
            ...fade(flipped),
            transform: use3d ? "rotateY(180deg)" : undefined,
            background: front.bg,
            boxShadow: shadow,
            containerType: "inline-size",
            pointerEvents: flipped ? "auto" : "none",
          }}
          aria-hidden={!flipped}
        >
          <div className="shrink-0">
            <FrontSymbol symbol={front.symbol} color={front.symbolColor} size={symbolSize} />
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
            <span className="tracking-[0.04em]" style={{ fontFamily: DISPLAY_FONT, fontSize: "clamp(12px, 3.8cqw, 16px)" }}>
              between us
            </span>
            <span className="font-semibold uppercase tracking-[0.2em]" style={{ fontSize: "clamp(9.5px, 2.9cqw, 13px)" }}>
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
        </div>

        {/* Double-tap heart burst — inside the 3D wrapper so it turns with the card */}
        <AnimatePresence>
          {heartBurst > 0 && (
            <div
              key={heartBurst}
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
              style={{ ...face, transform: `rotateY(${use3d && flipped ? 180 : 0}deg) translateZ(4px)` }}
            >
              <motion.div
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
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
