import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Check, UserRound } from "lucide-react";
import { useGame } from "@/lib/store";
import { BASIC_CATEGORIES, PLUS_CATEGORIES, type CategoryId, type DeckId, type UnfilteredLevel } from "@/data/questions";
import { LEVEL_ORDER, UNFILTERED_LEVELS } from "@/data/unfiltered";
import { BACK_COLORS, DISPLAY_FONT, DeckArt, patternFor, type PatternKey } from "./CardArt";
import { Settings } from "./Settings";
import { useAuth } from "@/lib/useAuth";

const t = {
  pl: {
    tagline: "Pytania, które zbliżają.",
    pick: "Wybierz talie",
    login: "Zaloguj",
    account: "Konto i ustawienia",
    basic: "Podstawowa",
    basicD: "Miłość, przyjaźń, rozwój, marzenia i emocje. Dla każdego.",
    plus: "Love & Spice",
    plusD: "Miłość, bliskość i odrobina pikanterii. Dla par.",
    unf: "Bez filtra",
    unfD: "Trzy poziomy, coraz głębiej. Nowe pytania w każdej grze. 18+",
    startLevel: "Zacznij od poziomu",
    play: "Zagraj",
    none: "Wybierz przynajmniej jedną talię",
  },
  en: {
    tagline: "Questions that bring you closer.",
    pick: "Choose your decks",
    login: "Sign in",
    account: "Account and settings",
    basic: "Basic",
    basicD: "Love, friendship, growth, dreams and emotions. For everyone.",
    plus: "Love & Spice",
    plusD: "Love, closeness and a little spice. For couples.",
    unf: "Unfiltered",
    unfD: "Three levels, ever deeper. New questions every game. 18+",
    startLevel: "Start at level",
    play: "Play",
    none: "Choose at least one deck",
  },
};

/** Short chip labels (the full names live in CATEGORY_META). */
const SHORT: Record<CategoryId, { pl: string; en: string }> = {
  love: { pl: "Miłość", en: "Love" },
  friendship: { pl: "Przyjaźń", en: "Friendship" },
  selfdev: { pl: "Rozwój", en: "Growth" },
  passions: { pl: "Pasje", en: "Passions" },
  introspection: { pl: "Introspekcja", en: "Introspection" },
  plus_love: { pl: "Miłość", en: "Love" },
  plus_spice: { pl: "Pikantne", en: "Spicy" },
  plus_deep: { pl: "Głęboka więź", en: "Deep bond" },
  plus_kinky: { pl: "Kinky", en: "Kinky" },
};

const ROMAN = ["I", "II", "III"];

function MiniFan({ patterns }: { patterns: PatternKey[] }) {
  const spots = [
    { x: 4, y: 8, r: -10 },
    { x: 30, y: 6, r: 8 },
    { x: 16, y: 2, r: 0 },
  ];
  return (
    <div className="relative h-[70px] w-[78px] shrink-0" aria-hidden="true">
      {patterns.slice(0, 3).map((p, i) => (
        <div
          key={p + i}
          className="absolute overflow-hidden rounded-[8px]"
          style={{
            left: spots[i].x,
            top: spots[i].y,
            width: 44,
            height: 62,
            transform: `rotate(${spots[i].r}deg)`,
            background: BACK_COLORS[p].base,
            border: "2px solid #FFFFFF",
            boxShadow: "0 4px 10px -4px rgba(0,0,0,0.35)",
          }}
        >
          <DeckArt pattern={p} />
        </div>
      ))}
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-pressed={on}
      className="min-h-[32px] rounded-full px-3 text-[12px] font-bold transition-colors"
      style={
        on
          ? { background: "var(--chip)", color: "var(--chip-ink)", border: "1px solid transparent" }
          : { background: "transparent", color: "var(--sub-text)", border: "1px solid var(--border)" }
      }
    >
      {children}
    </button>
  );
}

function DeckCard({
  id,
  title,
  desc,
  fan,
  children,
}: {
  id: DeckId;
  title: string;
  desc: string;
  fan: PatternKey[];
  children: React.ReactNode;
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
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleDeck(id);
        }
      }}
      whileTap={{ scale: 0.99 }}
      className="flex w-full cursor-pointer flex-col gap-2.5 rounded-[20px] p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        background: "var(--card-surface)",
        border: active ? "2px solid var(--ink)" : "2px solid var(--border)",
      }}
    >
      <div className="flex items-center gap-3.5">
        <MiniFan patterns={fan} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="text-[17px] leading-tight" style={{ fontFamily: DISPLAY_FONT, color: "var(--text)" }}>
            {title}
          </h3>
          <p className="text-[12.5px] leading-snug" style={{ color: "var(--sub-text)" }}>
            {desc}
          </p>
        </div>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={active ? { background: "var(--ink)" } : { border: "2px solid var(--border)" }}
        >
          {active && <Check className="h-4 w-4" color="#FFFFFF" strokeWidth={3.2} />}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </motion.div>
  );
}

function AccountButton({ onOpen }: { onOpen: () => void }) {
  const { user, ready } = useAuth();
  const lang = useGame((s) => s.lang);
  const c = t[lang];
  if (!ready) return <span className="h-11 w-11" />;
  if (!user) {
    return (
      <Link
        to="/auth"
        className="flex h-11 items-center gap-2 rounded-full pl-3 pr-4 text-[13px] font-extrabold"
        style={{ background: "var(--panel-2)", color: "var(--chip-ink)" }}
      >
        <UserRound className="h-[18px] w-[18px]" />
        {c.login}
      </Link>
    );
  }
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const name = (meta.full_name as string) || (meta.name as string) || user.email || "?";
  const avatar = (meta.avatar_url as string) || (meta.picture as string) || "";
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={c.account}
      className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full text-[18px]"
      style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }}
    >
      {avatar ? (
        <img src={avatar} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
      ) : (
        name.trim().charAt(0).toUpperCase()
      )}
    </button>
  );
}

export function DeckSelector() {
  const { lang, decks, categories, toggleCategory, toggleDeck, ufLevel, setUfLevel, startGame, flushGuestSession } = useGame();
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const c = t[lang];
  const anyDeck = decks.basic || decks.plus || decks.unfiltered;

  const handleStart = () => {
    if (!user) flushGuestSession();
    startGame();
  };

  const toggleCat = (deck: DeckId, cat: CategoryId) => {
    if (!decks[deck]) toggleDeck(deck);
    toggleCategory(cat);
  };

  const pickLevel = (lvl: UnfilteredLevel) => {
    if (!decks.unfiltered) toggleDeck("unfiltered");
    setUfLevel(lvl);
  };

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-lg flex-col"
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
    >
      <header className="flex items-center justify-between px-5 pt-6">
        <h1 className="text-[26px] leading-none" style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}>
          between us
        </h1>
        <AccountButton onOpen={() => setSettingsOpen(true)} />
      </header>
      <p className="px-5 pt-2 text-[14px]" style={{ color: "var(--muted-text)" }}>
        {c.tagline}
      </p>

      <h2
        className="px-5 pb-3 pt-6 text-[11px] font-extrabold uppercase tracking-[0.24em]"
        style={{ color: "var(--muted-text)" }}
      >
        {c.pick}
      </h2>

      <div className="flex flex-col gap-3 px-4 pb-36">
        <DeckCard id="basic" title={c.basic} desc={c.basicD} fan={["friendship", "introspection", "love"]}>
          {BASIC_CATEGORIES.map((cat) => (
            <Chip key={cat} on={decks.basic && categories[cat]} onClick={() => toggleCat("basic", cat)}>
              {SHORT[cat][lang]}
            </Chip>
          ))}
        </DeckCard>

        <DeckCard id="plus" title={c.plus} desc={c.plusD} fan={["plus_spice", "plus_kinky", "plus_love"]}>
          {PLUS_CATEGORIES.map((cat) => (
            <Chip key={cat} on={decks.plus && categories[cat]} onClick={() => toggleCat("plus", cat)}>
              {SHORT[cat][lang]}
            </Chip>
          ))}
        </DeckCard>

        <DeckCard
          id="unfiltered"
          title={c.unf}
          desc={c.unfD}
          fan={[patternFor("unfiltered", "after_dark"), patternFor("unfiltered", "no_limits"), patternFor("unfiltered", "love_spice")]}
        >
          <span className="sr-only">{c.startLevel}</span>
          {LEVEL_ORDER.map((lvl, i) => (
            <Chip key={lvl} on={decks.unfiltered && ufLevel === lvl} onClick={() => pickLevel(lvl)}>
              {ROMAN[i]} · {UNFILTERED_LEVELS[lvl].label[lang]}
            </Chip>
          ))}
        </DeckCard>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-20"
        style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
      >
        <div className="mx-auto w-full max-w-lg px-4 pt-3.5" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
          <button
            type="button"
            disabled={!anyDeck}
            onClick={handleStart}
            className="h-14 w-full rounded-[18px] text-[18px] transition-opacity disabled:opacity-50"
            style={{ background: "var(--accent)", color: "var(--accent-ink)", fontFamily: DISPLAY_FONT }}
          >
            {anyDeck ? c.play : c.none}
          </button>
        </div>
      </div>

      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
