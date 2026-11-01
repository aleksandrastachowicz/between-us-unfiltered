import { motion, AnimatePresence } from "motion/react";
import { useGame } from "@/lib/store";
import { LEVEL_ORDER, LEVEL_UP_CARD, UNFILTERED_LEVELS, nextLevel } from "@/data/unfiltered";
import { BACK_COLORS, DISPLAY_FONT, patternFor } from "./CardArt";

const PAPER = "#FFF6F0";
const ROMAN = ["I", "II", "III"];

/** "Krok głębiej" — offered every few cards in Unfiltered. Everyone at the table decides together. */
export function LevelUpCard() {
  const { lang, ufLevel, levelUpOpen, acceptLevelUp, declineLevelUp } = useGame();
  const next = nextLevel(ufLevel);
  const other = lang === "pl" ? "en" : "pl";
  const color = BACK_COLORS[patternFor("unfiltered", ufLevel)].base;
  const current = LEVEL_ORDER.indexOf(ufLevel);
  const nextLabel = next ? `${ROMAN[LEVEL_ORDER.indexOf(next)]} · ${UNFILTERED_LEVELS[next].label[lang]}` : "";

  return (
    <AnimatePresence>
      {levelUpOpen && next && (
        <>
          <motion.div
            className="fixed inset-0 z-[55]"
            style={{ background: "rgba(30,12,20,0.62)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="level-up-title"
            className="fixed inset-0 z-[56] flex items-center justify-center p-6"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <div
              className="relative flex w-full max-w-[320px] flex-col items-center justify-between overflow-hidden rounded-[28px] px-5 pb-5 pt-6 text-center"
              style={{
                aspectRatio: "5 / 7",
                background: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1.2px, transparent 1.6px) 0 0 / 22px 22px, ${color}`,
                boxShadow: "0 30px 60px -20px rgba(0,0,0,0.55)",
              }}
            >
              <span
                className="rounded-full px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.3em]"
                style={{ background: PAPER, color }}
              >
                {lang === "pl" ? "Bez filtra" : "Unfiltered"}
              </span>

              {/* Level path: done, next, still ahead */}
              <div className="flex items-center gap-2.5" aria-hidden="true">
                {LEVEL_ORDER.map((lvl, i) => {
                  const done = i <= current;
                  const isNext = lvl === next;
                  return (
                    <div key={lvl} className="flex items-center gap-2.5">
                      {i > 0 && <span className="h-0.5 w-5 rounded-full" style={{ background: "rgba(255,241,224,0.5)" }} />}
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-extrabold"
                        style={{
                          background: done ? PAPER : "transparent",
                          color: done ? color : PAPER,
                          border: done ? "none" : `2px ${isNext ? "solid" : "dashed"} rgba(255,241,224,${isNext ? 1 : 0.6})`,
                        }}
                      >
                        {ROMAN[i]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex w-full flex-col items-center gap-4 rounded-[20px] px-4 pb-4 pt-5" style={{ background: PAPER }}>
                <div className="flex flex-col items-center gap-1.5">
                  <h2 id="level-up-title" className="text-[24px] uppercase leading-none" style={{ fontFamily: DISPLAY_FONT, color }}>
                    {LEVEL_UP_CARD.title[lang]}
                  </h2>
                  <p className="text-[16px] font-extrabold leading-snug" style={{ color: "#24161C" }}>
                    {LEVEL_UP_CARD.body[lang]}
                  </p>
                  <p className="text-[12.5px] leading-snug" style={{ color: "#6E5A60" }}>
                    {LEVEL_UP_CARD.body[other]}
                  </p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: "#6E5A60" }}>
                    {(lang === "pl" ? "Dalej: " : "Next: ") + nextLabel}
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <button
                    type="button"
                    onClick={acceptLevelUp}
                    className="h-11 rounded-full text-[14px] font-extrabold"
                    style={{ background: color, color: PAPER }}
                  >
                    {LEVEL_UP_CARD.yes[lang]}
                  </button>
                  <button
                    type="button"
                    onClick={declineLevelUp}
                    className="h-11 rounded-full text-[14px] font-bold"
                    style={{ border: `1.5px solid ${color}`, color }}
                  >
                    {LEVEL_UP_CARD.no[lang]}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
