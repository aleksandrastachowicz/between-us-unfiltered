import { Download, Heart } from "lucide-react";
import type { DrawnCard } from "@/lib/store";
import { useGame } from "@/lib/store";
import { CATEGORY_META } from "@/data/questions";
import { UNFILTERED_LEVELS } from "@/data/unfiltered";
import { shareOrDownloadStory } from "@/lib/storyExport";
import { BACK_COLORS, DISPLAY_FONT, DeckArt, patternFor } from "./CardArt";

const FAV_RED = "#C1121F";

export function categoryName(card: DrawnCard, lang: "pl" | "en") {
  if (card.category === "unfiltered") return UNFILTERED_LEVELS[card.unfilteredLevel ?? "love_spice"].label[lang];
  return CATEGORY_META[card.category]?.label[lang] ?? "";
}

/** One saved question: a tiny card back, the question, who answered, favourite + save as image. */
export function QuestionRow({ card, player }: { card: DrawnCard; player?: string }) {
  const lang = useGame((s) => s.lang);
  const favorites = useGame((s) => s.favorites);
  const toggleFavorite = useGame((s) => s.toggleFavorite);
  const isFav = favorites.includes(card.id);
  const pattern = patternFor(card.category, card.unfilteredLevel);
  const primary = lang === "pl" ? card.pl : card.en;
  const secondary = lang === "pl" ? card.en : card.pl;
  const meta = [player, categoryName(card, lang)].filter(Boolean).join(" · ");
  const l = lang === "pl"
    ? { fav: isFav ? "Usuń z ulubionych" : "Dodaj do ulubionych", share: "Zapisz jako obrazek" }
    : { fav: isFav ? "Remove from favourites" : "Add to favourites", share: "Save as an image" };

  return (
    <li
      className="flex items-center gap-3.5 rounded-[20px] p-3.5 lg:gap-4 lg:p-4"
      style={{ background: "var(--card-surface)", border: "1px solid var(--border)" }}
    >
      <div
        className="relative h-[58px] w-[42px] shrink-0 overflow-hidden rounded-[9px] lg:h-[64px] lg:w-[46px]"
        style={{ background: BACK_COLORS[pattern].base }}
        aria-hidden="true"
      >
        <DeckArt pattern={pattern} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-[15px] font-bold leading-snug md:text-[16px]" style={{ color: "var(--text)" }}>
          {primary}
        </p>
        <p className="text-[13px] leading-snug lg:text-[14px]" style={{ color: "var(--sub-text)" }}>
          {secondary}
        </p>
        {meta && (
          <p className="pt-0.5 text-[12px] font-bold lg:text-[13px]" style={{ color: "var(--muted-text)" }}>
            {meta}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col gap-1">
        <button
          type="button"
          onClick={() => toggleFavorite(card.id)}
          aria-label={l.fav}
          aria-pressed={isFav}
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: "var(--panel-2)" }}
        >
          <Heart className="h-5 w-5" fill={isFav ? FAV_RED : "none"} stroke={isFav ? FAV_RED : "var(--ink)"} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={() => void shareOrDownloadStory(card, lang)}
          aria-label={l.share}
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: "var(--panel-2)", color: "var(--ink)" }}
        >
          <Download className="h-5 w-5" strokeWidth={2.1} />
        </button>
      </div>
    </li>
  );
}

/** Title block shared by History, Favourites and Stats. */
export function ViewHeader({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mb-4 flex flex-col gap-1 lg:mb-6">
      {eyebrow && (
        <p className="text-[12px] font-extrabold uppercase tracking-[0.22em] lg:text-[13px]" style={{ color: "var(--muted-text)" }}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-[28px] leading-none lg:text-[32px]" style={{ fontFamily: DISPLAY_FONT, color: "var(--ink)" }}>
        {title}
      </h2>
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="rounded-[20px] p-6 text-center text-[15px] leading-relaxed lg:text-[16px]"
      style={{ background: "var(--panel)", color: "var(--sub-text)" }}
    >
      {children}
    </p>
  );
}
