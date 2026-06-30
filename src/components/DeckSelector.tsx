import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useGame } from "@/lib/store";
import { CATEGORY_META, BASIC_CATEGORIES, type DeckId } from "@/data/questions";

const t = {
  pl: {
    title: "Between Us",
    sub: "Intymna gra rozmów dla par i bliskich.",
    pick: "Wybierz talie",
    basic: "Edycja Podstawowa",
    basicD: "Codzienna więź, rozwój emocjonalny i refleksja. 5 klasycznych kategorii.",
    plus: "Edition Plus: Love & Spice",
    plusD: "Premium — romantyczna więź i zmysłowa, intymna komunikacja.",
    unf: "Between Us: Unfiltered",
    unfD: "Progresywna, 3-poziomowa podróż, która dostosowuje się do poziomu intimności.",
    cats: "Kategorie",
    start: "Rozpocznij grę",
    none: "Wybierz przynajmniej jedną talię",
    adult: "18+",
  },
  en: {
    title: "Between Us",
    sub: "An intimate conversation game for couples & close connections.",
    pick: "Choose your decks",
    basic: "Basic Edition",
    basicD: "Daily connection, emotional growth & reflection. 5 classic categories.",
    plus: "Edition Plus: Love & Spice",
    plusD: "Premium — romantic connection meets sensual, intimate communication.",
    unf: "Between Us: Unfiltered",
    unfD: "A progressive 3-level journey that adapts to the intimacy of the players.",
    cats: "Categories",
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
      layout
      role="button"
      tabIndex={0}
      onClick={() => toggleDeck(id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleDeck(id)}
      whileTap={{ scale: 0.985 }}
      className="glass w-full cursor-pointer rounded-3xl p-6 text-left transition-all"
      style={{
        outline: active ? "2px solid var(--accent)" : "2px solid transparent",
        boxShadow: active ? "0 18px 40px -22px var(--accent)" : "none",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-extrabold tracking-tight">{title}</h3>
            {badge && (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "var(--accent)", color: "var(--accent-ink)" }}>
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm" style={{ color: "var(--muted-text)" }}>{desc}</p>
        </div>
        <span
          className="mt-1 flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors"
          style={{ background: active ? "var(--accent)" : "var(--panel-2)" }}
        >
          <motion.span layout className="h-5 w-5 rounded-full bg-white shadow" style={{ marginLeft: active ? "auto" : 0 }} />
        </span>
      </div>
      {children}
    </motion.button>
  );
}

export function DeckSelector() {
  const { lang, decks, categories, toggleCategory, startGame } = useGame();
  const c = t[lang];
  const anyDeck = decks.basic || decks.plus || decks.unfiltered;

  return (
    <div className="mx-auto w-full max-w-lg px-5 pb-28 pt-10">
      <div className="mb-8 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Heart className="h-5 w-5" style={{ color: "var(--accent)" }} fill="currentColor" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight velvet-glow">{c.title}</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm" style={{ color: "var(--muted-text)" }}>{c.sub}</p>
      </div>

      <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "var(--muted-text)" }}>{c.pick}</p>

      <div className="flex flex-col gap-4">
        <DeckCard id="basic" title={c.basic} desc={c.basicD}>
          {decks.basic && (
            <div className="mt-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
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

        <DeckCard id="plus" title={c.plus} desc={c.plusD} />
        <DeckCard id="unfiltered" title={c.unf} desc={c.unfD} badge={c.adult} />
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
