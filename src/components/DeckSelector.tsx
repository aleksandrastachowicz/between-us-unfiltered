import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useGame } from "@/lib/store";
import { CATEGORY_META, BASIC_CATEGORIES, PLUS_CATEGORIES, type DeckId } from "@/data/questions";
import { UNFILTERED_LEVELS } from "@/data/unfiltered";
import { CardArtPreview, patternFor } from "./CardArt";
import { GuestBanner } from "./GuestBanner";

const t = {
  pl: {
    title: "Between Us",
    sub: "Gra konwersacyjna dla głębokich relacji. Stworzona dla przyjaciół, par i każdego, kto chce naprawdę poznać drugą osobę.",
    pick: "Wybierz talie",
    basic: "Edycja Podstawowa",
    basicD: "Codzienna więź, rozwój emocjonalny i refleksja. 5 klasycznych kategorii.",
    plus: "Edition Plus: Love & Spice",
    plusD: "Premium — romantyczna więź i zmysłowa, intymna komunikacja.",
    unf: "Between Us: Unfiltered",
    unfD: "Progresywna, 3-poziomowa podróż, która dostosowuje się do poziomu intimności.",
    cats: "Kategorie",
    levels: "Poziomy intymności",
    unfNote:
      "Poziom wybierasz w trakcie gry — steruje intensywnością i wpływa też na pozostałe losowane pytania.",
    start: "Rozpocznij grę",
    none: "Wybierz przynajmniej jedną talię",
    adult: "18+",
  },
  en: {
    title: "Between Us",
    sub: "A conversation game for deep connections. Designed for friends, couples, and anyone wanting to truly know each other.",
    pick: "Choose your decks",
    basic: "Basic Edition",
    basicD: "Daily connection, emotional growth & reflection. 5 classic categories.",
    plus: "Edition Plus: Love & Spice",
    plusD: "Premium — romantic connection meets sensual, intimate communication.",
    unf: "Between Us: Unfiltered",
    unfD: "A progressive 3-level journey that adapts to the intimacy of the players.",
    cats: "Categories",
    levels: "Intimacy levels",
    unfNote:
      "You pick the level during play — it drives intensity and also shapes the other questions drawn.",
    start: "Start playing",
    none: "Select at least one deck",
    adult: "18+",
  },
};

function DeckCard({
  id,
  title,
  desc,
  badge,
  children,
}: {
  id: DeckId;
  title: string;
  desc: string;
  badge?: string;
  children?: React.ReactNode;
}) {
  const active = useGame((s) => s.decks[id]);
  const toggleDeck = useGame((s) => s.toggleDeck);
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={title}
      onClick={() => toggleDeck(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleDeck(id);
        }
      }}
      whileTap={{ scale: 0.985 }}
      className="glass w-full cursor-pointer rounded-3xl p-4 text-left transition-[outline,box-shadow] duration-200 sm:p-6"
      style={{
        outline: active ? "2px solid var(--accent)" : "2px solid transparent",
        boxShadow: active ? "0 18px 40px -22px var(--accent)" : "none",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-extrabold tracking-tight sm:text-lg">{title}</h3>
            {badge && (
              <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] leading-snug sm:text-sm" style={{ color: "var(--muted-text)" }}>{desc}</p>
        </div>
        <span
          className="mt-1 flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors"
          style={{ background: active ? "var(--accent)" : "var(--panel-2)" }}
        >
          <span
            className="h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
            style={{ transform: active ? "translateX(20px)" : "translateX(0)" }}
          />
        </span>
      </div>
      {children}
    </motion.div>
  );
}

export function DeckSelector() {
  const { lang, decks, categories, toggleCategory, startGame } = useGame();
  const c = t[lang];
  const anyDeck = decks.basic || decks.plus || decks.unfiltered;

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-24 pt-4 sm:px-5 sm:pt-8">
      <div className="mb-3 text-center sm:mb-6">
        <div className="mb-1.5 flex items-center justify-center gap-2 sm:mb-2">
          <Heart className="h-5 w-5" style={{ color: "var(--accent)" }} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight velvet-glow sm:text-4xl">{c.title}</h1>
        <p className="mx-auto mt-1.5 max-w-sm text-[12px] leading-snug sm:mt-2 sm:text-sm" style={{ color: "var(--muted-text)" }}>{c.sub}</p>
      </div>

      <GuestBanner />

      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] sm:mb-4 sm:text-xs" style={{ color: "var(--muted-text)" }}>{c.pick}</p>

      <div className="flex flex-col gap-2.5 sm:gap-4">
        <DeckCard id="basic" title={c.basic} desc={c.basicD}>
          {decks.basic && (
            <div className="mt-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex gap-3 overflow-x-auto pb-1">
                {BASIC_CATEGORIES.map((cat, i) => (
                  <CardArtPreview key={cat} index={i} pattern={patternFor(cat)} label={CATEGORY_META[cat].label[lang]} />
                ))}
              </div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>{c.cats}</p>
              <div className="flex flex-wrap gap-2">
                {BASIC_CATEGORIES.map((cat) => {
                  const on = categories[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                      style={{
                        background: on ? `var(--color-cat-${cat})` : "var(--panel-2)",
                        color: on ? "#fff" : "var(--muted-text)",
                        opacity: on ? 1 : 0.7,
                      }}
                    >
                      {CATEGORY_META[cat].label[lang]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </DeckCard>

        <DeckCard id="plus" title={c.plus} desc={c.plusD}>
          {decks.plus && (
            <div className="mt-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex gap-3 overflow-x-auto pb-1">
                {PLUS_CATEGORIES.map((cat, i) => (
                  <CardArtPreview key={cat} index={i} pattern={patternFor(cat)} label={CATEGORY_META[cat].label[lang]} />
                ))}
              </div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>{c.cats}</p>
              <div className="flex flex-wrap gap-2">
                {PLUS_CATEGORIES.map((cat) => {
                  const on = categories[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                      style={{
                        background: on ? `var(--color-cat-${cat})` : "var(--panel-2)",
                        color: on ? "#fff" : "var(--muted-text)",
                        opacity: on ? 1 : 0.7,
                      }}
                    >
                      {CATEGORY_META[cat].label[lang]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </DeckCard>
        <DeckCard id="unfiltered" title={c.unf} desc={c.unfD} badge={c.adult}>
          {decks.unfiltered && (
            <div className="mt-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex gap-3 overflow-x-auto pb-1">
                {(Object.keys(UNFILTERED_LEVELS) as (keyof typeof UNFILTERED_LEVELS)[]).map((lvl, i) => (
                  <CardArtPreview
                    key={lvl}
                    index={i}
                    pattern={patternFor("unfiltered", lvl)}
                    label={`${UNFILTERED_LEVELS[lvl].emoji} ${UNFILTERED_LEVELS[lvl].label[lang]}`}
                  />
                ))}
              </div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--muted-text)" }}>{c.levels}</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(UNFILTERED_LEVELS) as (keyof typeof UNFILTERED_LEVELS)[]).map((lvl) => (
                  <span
                    key={lvl}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{ background: "var(--panel-2)", color: "var(--muted-text)" }}
                  >
                    {UNFILTERED_LEVELS[lvl].emoji} {UNFILTERED_LEVELS[lvl].label[lang]}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-snug" style={{ color: "var(--muted-text)" }}>
                {c.unfNote}
              </p>
            </div>
          )}
        </DeckCard>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 px-5 pb-6 pt-3" style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}>
        <button
          disabled={!anyDeck}
          onClick={startGame}
          className="mx-auto block w-full max-w-lg rounded-2xl py-4 text-base font-extrabold transition-all disabled:opacity-40"
          style={{ background: "var(--accent)", color: "var(--accent-ink)", boxShadow: "0 16px 36px -16px var(--accent)" }}
        >
          {anyDeck ? c.start : c.none}
        </button>
      </div>
    </div>
  );
}
