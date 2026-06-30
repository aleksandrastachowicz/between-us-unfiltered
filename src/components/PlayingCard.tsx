import { motion, type PanInfo } from "motion/react";
import { useGame, type DrawnCard } from "@/lib/store";
import { CATEGORY_META } from "@/data/questions";
import { UNFILTERED_LEVELS } from "@/data/unfiltered";
import { CardArt, patternFor } from "./CardArt";

const accentVar: Record<string, string> = {
  love: "var(--color-cat-love)",
  friendship: "var(--color-cat-friendship)",
  selfdev: "var(--color-cat-selfdev)",
  passions: "var(--color-cat-passions)",
  introspection: "var(--color-cat-introspection)",
  plus_love: "var(--color-cat-plus)",
  plus_spice: "var(--color-cat-plus)",
  unfiltered: "var(--color-cat-unfiltered)",
};

function labelFor(card: DrawnCard, lang: "pl" | "en") {
  if (card.category === "unfiltered") {
    const lvl = card.unfilteredLevel ?? "love_spice";
    return `${UNFILTERED_LEVELS[lvl].emoji} ${UNFILTERED_LEVELS[lvl].label[lang]}`;
  }
  return CATEGORY_META[card.category].label[lang];
}

export function PlayingCard({ card }: { card: DrawnCard }) {
  const { lang, flipped, flip, animations } = useGame();
  const pattern = patternFor(card.category);
  const primary = lang === "pl" ? card.pl : card.en;
  const secondary = lang === "pl" ? card.en : card.pl;
  const accent = accentVar[card.category];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 70 || Math.abs(info.offset.y) > 70) {
      if (!flipped) flip();
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px]" style={{ perspective: 1600, aspectRatio: "5 / 7" }}>
      <motion.div
        className="preserve-3d relative h-full w-full cursor-pointer"
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
          <CardArt pattern={pattern} unfilteredLevel={card.unfilteredLevel} />
          <span
            className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.32em]"
            style={{ color: pattern === "aura" || pattern === "daisyGrid" ? "#3a2a18" : "#fff", opacity: 0.45 }}
          >
            {labelFor(card, lang)}
          </span>
          <span className="absolute right-4 top-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/40">
            tap to reveal
          </span>
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
          <div className="flex items-center justify-between">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ background: accent, color: "#fff" }}
            >
              {labelFor(card, lang)}
            </span>
            {card.intensity ? (
              <span className="flex gap-0.5">
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
