import { motion, type PanInfo } from "motion/react";
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
  const { lang, flipped, flip, animations } = useGame();
  const pattern = patternFor(card.category, card.unfilteredLevel);
  const primary = lang === "pl" ? card.pl : card.en;
  const secondary = lang === "pl" ? card.en : card.pl;
  const accent = accentVar[card.category];

  const edition = EDITION_META[editionForCategory(card.category)][lang];
  const categoryLabel = categoryLabelFor(card, lang);
  const hint = lang === "pl" ? "dotknij, aby odkryć" : "tap to reveal";

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 70 || Math.abs(info.offset.y) > 70) {
      if (!flipped) flip();
    }
  };

  return (
    <div
      className="relative mx-auto w-full"
      style={{ perspective: 1600, aspectRatio: "5 / 7", height: "100%", maxHeight: "100%", maxWidth: 340, width: "auto" }}
    >
      <motion.div
        className="preserve-3d transform-gpu relative h-full w-full cursor-pointer"
        style={{ willChange: "transform" }}
        onClick={flip}
        drag={animations ? true : false}
        dragSnapToOrigin
        dragElastic={0.18}
        onDragEnd={onDragEnd}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={
          animations
            ? { type: "spring", stiffness: 120, damping: 14 }
            : { duration: 0 }
        }
        whileTap={animations ? { scale: 0.97 } : undefined}
      >
        {/* BACK (reverse) — shown first */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-[32px] shadow-2xl"
          style={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4)" }}
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
          className="backface-hidden absolute inset-0 flex flex-col rounded-[32px] p-7"
          style={{
            transform: "rotateY(180deg)",
            background: "var(--card-surface)",
            color: "var(--card-ink)",
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35)",
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
    </div>
  );
}
