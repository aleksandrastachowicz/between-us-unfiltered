import { memo } from "react";
import { CARD_TEXTURES } from "./card-textures";
import { motion } from "motion/react";
import type { CategoryId } from "@/data/questions";
import type { UnfilteredQuestion } from "@/data/unfiltered";

export type PatternKey =
  | CategoryId
  | "uf_love_spice"
  | "uf_after_dark"
  | "uf_no_limits";

/* ============================================================
   TAROT LINE-ART REVERSE SYSTEM
   One coherent metaphysical family: liquid checkerboard waves,
   scattered retro line-art starbursts, heavy procedural grain.
   Decks differ only by central symbol + colour scheme.
   ============================================================ */

type Palette = {
  base: string; // deep field
  check: string; // checker squares
  wash: string; // aura wash
  line: string; // line-art ink
  ink: string; // label ink
  gold?: string; // shimmering accent (unfiltered)
  bg?: "checker" | "daisy" | "aura" | "fluid" | "canvas" | "wave" | "stardust"; // background family
};

const PALETTE: Record<PatternKey, Palette> = {
  // A. Edycja podstawowa
  love: { base: "#A21836", check: "#FFC2D6", wash: "#FF6E9C", line: "#FFE7EF", ink: "#FFF0F5" },
  friendship: { base: "#E8A200", check: "#FFCF7A", wash: "#FFD429", line: "#FFF6E2", ink: "#FFF8EC", bg: "daisy" },
  selfdev: { base: "#5E8F1F", check: "#CAE774", wash: "#A8DB49", line: "#FBFFE9", ink: "#FCFFF0", bg: "aura" },
  passions: { base: "#1B3FCB", check: "#A4C7FF", wash: "#4C86FF", line: "#EAF2FF", ink: "#F0F6FF", bg: "fluid" },
  introspection: { base: "#5B34C7", check: "#D3C0FF", wash: "#9A7BFF", line: "#F4EEFF", ink: "#F8F2FF", bg: "canvas" },
  // B. Love & Spice
  plus_love: { base: "#5E0A22", check: "#B02244", wash: "#8E1435", line: "#FFD9E3", ink: "#FFE9F0" },
  plus_spice: { base: "#A21836", check: "#FFB7CE", wash: "#E8305C", line: "#FFE4EC", ink: "#FFF0F5", bg: "wave" },
  plus_deep: { base: "#B0526B", check: "#FFC7D5", wash: "#E58AA3", line: "#FFEDF2", ink: "#FFF4F7", bg: "canvas" },
  plus_kinky: { base: "#5C0A55", check: "#C21FA8", wash: "#93168A", line: "#FFD8F7", ink: "#FFE9FB" },
  // C. Unfiltered
  uf_love_spice: { base: "#070C0D", check: "#0E5455", wash: "#063A38", line: "#FFE47A", ink: "#EAFFFA", gold: "#FFD84D", bg: "canvas" },
  uf_after_dark: { base: "#131217", check: "#5A0F2C", wash: "#2A0A18", line: "#FFE685", ink: "#FFEAF2", gold: "#FFDC5C" },
  uf_no_limits: { base: "#08070A", check: "#1A1720", wash: "#12101A", line: "#FFE788", ink: "#FFF0EE", gold: "#FFD94F", bg: "stardust" },
};

/* ---------------- procedural defs ---------------- */
function Defs({ id, p }: { id: string; p: Palette }) {
  return (
    <defs>
      {/* legibility scrim so category text always reads on the field */}
      <linearGradient id={`scrim-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={p.base} stopOpacity="0.55" />
        <stop offset="30%" stopColor={p.base} stopOpacity="0.05" />
        <stop offset="70%" stopColor={p.base} stopOpacity="0.25" />
        <stop offset="100%" stopColor={p.base} stopOpacity="0.78" />
      </linearGradient>
      {p.gold ? (
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.gold} stopOpacity="0.15" />
          <stop offset="45%" stopColor={p.gold} stopOpacity="0.85" />
          <stop offset="100%" stopColor={p.gold} stopOpacity="0.2" />
        </linearGradient>
      ) : null}
    </defs>
  );
}

/* scattered retro line-art starburst */
function Starburst({ x, y, s = 1, ink, rays = 12 }: { x: number; y: number; s?: number; ink: string; rays?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink} strokeWidth="1" strokeLinecap="round" fill="none">
      {Array.from({ length: rays }).map((_, i) => {
        const a = (i / rays) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={Math.cos(a) * 3.5}
            y1={Math.sin(a) * 3.5}
            x2={Math.cos(a) * (i % 2 ? 9 : 13)}
            y2={Math.sin(a) * (i % 2 ? 9 : 13)}
          />
        );
      })}
      <circle r="2" fill={ink} stroke="none" />
    </g>
  );
}

/* four-point retro sparkle */
function Spark({ x, y, s = 1, ink }: { x: number; y: number; s?: number; ink: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -7 C0.7 -2.4 2.4 -0.7 7 0 C2.4 0.7 0.7 2.4 0 7 C-0.7 2.4 -2.4 0.7 -7 0 C-2.4 -0.7 -0.7 -2.4 0 -7 Z"
      fill={ink}
      opacity="0.8"
    />
  );
}

/* ---------------- central symbols (clean line-art) ---------------- */
const retroHeart =
  "M0 26 C-5 19 -30 8 -30 -10 C-30 -25 -13 -29 -3 -17 C-1.5 -15 0 -12 0 -10 C0 -12 1.5 -15 3 -17 C13 -29 30 -25 30 -10 C30 8 5 19 0 26 Z";

function Halo({ ink, gold }: { ink: string; gold?: string }) {
  return (
    <g fill="none" stroke={gold ?? ink} strokeWidth="0.9" opacity={gold ? 0.7 : 0.42}>
      <circle r="52" />
      <circle r="60" strokeDasharray="1 6" opacity="0.6" />
    </g>
  );
}

function Symbol({ pattern, p }: { pattern: PatternKey; p: Palette }) {
  const ink = p.line;
  const gold = p.gold;
  const stroke = { stroke: ink, fill: "none", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  const body = () => {
    switch (pattern) {
      case "love": // retro heart lines + "Amor"
        return (
          <g {...stroke}>
            <path d={retroHeart} />
            <path d={retroHeart} transform="scale(0.74)" strokeWidth="1.1" opacity="0.7" />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              stroke="none"
              fill={ink}
              opacity="0.85"
              style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, letterSpacing: "0.26em" }}
            >
              AMOR
            </text>
          </g>
        );
      case "friendship": // minimal line-art sunburst
        return (
          <g {...stroke}>
            <circle r="17" />
            <circle r="24" strokeWidth="1" opacity="0.5" />
            {Array.from({ length: 20 }).map((_, i) => {
              const a = (i / 20) * Math.PI * 2;
              const outer = i % 2 ? 36 : 46;
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * 28}
                  y1={Math.sin(a) * 28}
                  x2={Math.cos(a) * outer}
                  y2={Math.sin(a) * outer}
                  strokeWidth={i % 2 ? 1 : 1.5}
                  opacity={i % 2 ? 0.6 : 0.9}
                />
              );
            })}
          </g>
        );
      case "selfdev": // anatomical heart blended with an eye
        return (
          <g {...stroke}>
            <path d={retroHeart} transform="scale(1.02)" opacity="0.9" />
            <path d="M-14 -22 C-10 -32 2 -32 4 -22 M8 -24 C14 -30 24 -26 22 -18" strokeWidth="1.2" opacity="0.7" />
            <path d="M-26 0 C-13 -14 13 -14 26 0 C13 14 -13 14 -26 0 Z" transform="translate(0 -1) scale(0.7)" />
            <circle cy="-1" r="5.5" />
            <circle cy="-1" r="2" fill={ink} stroke="none" />
            <path d="M-8 16 C-4 22 4 22 8 16" strokeWidth="1" opacity="0.6" />
          </g>
        );
      case "passions": // sharp 4-pointed star vector
        return (
          <g {...stroke}>
            <path d="M0 -46 L9 -9 L46 0 L9 9 L0 46 L-9 9 L-46 0 L-9 -9 Z" strokeWidth="1.8" />
            <path d="M0 -26 L5 -5 L26 0 L5 5 L0 26 L-5 5 L-26 0 L-5 -5 Z" strokeWidth="1" opacity="0.65" />
            <Spark x={32} y={-30} s={0.8} ink={ink} />
            <Spark x={-32} y={28} s={0.7} ink={ink} />
          </g>
        );
      case "introspection": // third eye nestled in a crescent moon
        return (
          <g {...stroke}>
            <path d="M22 -40 A46 46 0 1 0 22 40 A36 36 0 1 1 22 -40 Z" strokeWidth="1.3" opacity="0.75" />
            <path d="M-30 0 C-15 -18 15 -18 30 0 C15 18 -15 18 -30 0 Z" />
            <circle r="9.5" />
            <circle r="3.5" fill={ink} stroke="none" />
            <Spark x={0} y={-30} s={0.75} ink={ink} />
            <Spark x={26} y={22} s={0.6} ink={ink} />
          </g>
        );
      case "plus_love": // kissing lips silhouette
        return (
          <g {...stroke}>
            <path d="M-34 0 C-24 -16 -10 -18 0 -8 C10 -18 24 -16 34 0 C22 16 -22 16 -34 0 Z" strokeWidth="1.8" />
            <path d="M-34 0 C-18 -5 18 -5 34 0" strokeWidth="1.1" opacity="0.8" />
            <path d="M-22 8 C-10 12 10 12 22 8" strokeWidth="1" opacity="0.5" />
            <Spark x={0} y={-28} s={0.85} ink={ink} />
          </g>
        );
      case "plus_spice": // flame with starbursts
        return (
          <g {...stroke}>
            <path d="M0 -40 C16 -18 26 -8 26 6 C26 22 14 32 0 32 C-14 32 -26 22 -26 6 C-26 -6 -16 -14 -10 -26 C-8 -14 -2 -12 0 -18 C2 -24 0 -32 0 -40 Z" strokeWidth="1.8" />
            <path d="M0 -10 C8 2 12 8 12 14 C12 22 6 26 0 26 C-6 26 -12 22 -12 14 C-12 6 -6 0 0 -10 Z" strokeWidth="1" opacity="0.7" />
            <Spark x={-30} y={-24} s={0.75} ink={ink} />
            <Spark x={30} y={-18} s={0.65} ink={ink} />
          </g>
        );
      case "plus_deep": // two intertwined hands
        return (
          <g {...stroke}>
            <path d="M-34 22 C-30 8 -22 -2 -10 -8 C-4 -11 2 -10 6 -6" strokeWidth="1.7" />
            <path d="M34 -22 C30 -8 22 2 10 8 C4 11 -2 10 -6 6" strokeWidth="1.7" />
            <path d="M-14 -6 C-8 -12 0 -14 8 -12 M14 6 C8 12 0 14 -8 12" strokeWidth="1.1" opacity="0.75" />
            <path d="M-6 -2 C-2 -6 2 -6 6 -2 C2 2 -2 2 -6 -2 Z" strokeWidth="1" opacity="0.85" />
            <Spark x={26} y={26} s={0.7} ink={ink} />
            <Spark x={-26} y={-26} s={0.6} ink={ink} />
          </g>
        );
      case "plus_kinky": // abstract silhouette figures
        return (
          <g {...stroke}>
            <circle cx="-14" cy="-24" r="8" />
            <path d="M-14 -16 C-26 -12 -30 2 -26 18 C-24 26 -18 30 -12 30" strokeWidth="1.7" />
            <circle cx="14" cy="-20" r="8" />
            <path d="M14 -12 C26 -8 30 6 26 22 C24 28 18 32 12 32" strokeWidth="1.7" />
            <path d="M-12 4 C-2 -2 6 -2 14 4" strokeWidth="1.1" opacity="0.75" />
            <Spark x={34} y={-32} s={0.75} ink={ink} />
          </g>
        );
      case "uf_love_spice": // hand holding torch + starry smoke
        return (
          <g {...stroke} stroke={gold}>
            <path d="M-4 34 L-4 6 M6 34 L6 6" />
            <path d="M-10 6 C-10 -2 10 -2 10 6 C10 12 -10 12 -10 6 Z" />
            <path d="M0 -4 C-12 -12 -10 -26 0 -34 C10 -26 12 -12 0 -4 Z" />
            <path d="M0 -10 C-5 -16 -4 -23 0 -28 C4 -23 5 -16 0 -10 Z" strokeWidth="1" opacity="0.8" />
            <path d="M-18 -18 C-26 -26 -22 -36 -14 -40 M18 -18 C26 -26 22 -36 14 -40" strokeWidth="1" opacity="0.6" />
            <Spark x={-22} y={-42} s={0.7} ink={gold ?? ink} />
            <Spark x={22} y={-40} s={0.6} ink={gold ?? ink} />
          </g>
        );
      case "uf_after_dark": // third eye in a crescent moon, gold frame
        return (
          <g {...stroke} stroke={gold}>
            <path d="M20 -42 A46 46 0 1 0 20 42 A36 36 0 1 1 20 -42 Z" strokeWidth="1.3" opacity="0.8" />
            <path d="M-28 0 C-14 -17 14 -17 28 0 C14 17 -14 17 -28 0 Z" strokeWidth="1.7" />
            <circle r="9" strokeWidth="1.4" />
            <circle r="3.4" fill={gold} stroke="none" />
            <Spark x={0} y={-32} s={0.7} ink={gold ?? ink} />
          </g>
        );
      case "uf_no_limits": // geometric 8-pointed starburst
        return (
          <g {...stroke} stroke={gold}>
            {Array.from({ length: 8 }).map((_, i) => (
              <path key={i} d="M0 -46 L7 -8 L0 0 L-7 -8 Z" transform={`rotate(${i * 45})`} strokeWidth="1.4" />
            ))}
            <circle r="9" strokeWidth="1.2" />
            <circle r="3" fill={gold} stroke="none" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = ((i + 0.5) / 8) * Math.PI * 2;
              return (
                <line key={`r${i}`} x1={Math.cos(a) * 16} y1={Math.sin(a) * 16} x2={Math.cos(a) * 30} y2={Math.sin(a) * 30} strokeWidth="1" opacity="0.6" />
              );
            })}
          </g>
        );
    }
  };

  return (
    <g transform="translate(150 200) scale(1.12)" data-central-symbol={pattern}>
      <Halo ink={ink} gold={gold} />
      {body()}
    </g>
  );
}

/* ---------------- full reverse artwork ---------------- */
const DeckArt = memo(function DeckArt({ pattern }: { pattern: PatternKey }) {
  const id = pattern;
  const p = PALETTE[pattern];
  return (
    <svg
      viewBox="0 0 300 420"
      className="absolute inset-0 h-full w-full transform-gpu"
      data-card-pattern={pattern}
      data-background-family={p.bg ?? "checker"}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <Defs id={id} p={p} />
      {/* Grain and displacement are baked once, decoded/cached by the browser. */}
      <image
        href={CARD_TEXTURES[pattern]}
        width="300"
        height="420"
        preserveAspectRatio="xMidYMid slice"
        data-cached-texture={pattern}
      />

      {/* scattered retro starbursts */}
      <g opacity="0.8">
        <Starburst x={46} y={64} s={1} ink={p.line} />
        <Starburst x={252} y={110} s={0.7} ink={p.line} rays={10} />
        <Starburst x={40} y={330} s={0.8} ink={p.line} rays={10} />
        <Starburst x={258} y={362} s={1} ink={p.line} />
        <Spark x={150} y={44} s={0.9} ink={p.line} />
        <Spark x={150} y={382} s={0.9} ink={p.line} />
        <Spark x={274} y={220} s={0.7} ink={p.line} />
        <Spark x={26} y={208} s={0.7} ink={p.line} />
      </g>

      <Symbol pattern={pattern} p={p} />

      {/* gold shimmer smoke for unfiltered */}
      {p.gold ? (
        <g opacity="0.4" fill="none" stroke={`url(#gold-${id})`} strokeWidth="1.2">
          <path d="M40 400 C90 340 60 280 110 230 C150 190 120 130 160 80" />
          <path d="M262 396 C220 340 250 290 210 240 C176 198 206 140 176 92" opacity="0.7" />
        </g>
      ) : null}

      {/* legibility scrim under the top/bottom typography */}
      <rect width="300" height="420" fill={`url(#scrim-${id})`} />

    </svg>
  );
});

function CardBack({
  pattern,
  edition,
  category,
  hint,
}: {
  pattern: PatternKey;
  edition: string;
  category: string;
  hint: string;
}) {
  const p = PALETTE[pattern];
  const ink = p.ink;
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: p.base }}>
      <DeckArt pattern={pattern} />
      <div
        className="pointer-events-none absolute inset-[10px] rounded-[24px]"
        style={{ border: `1.5px solid ${p.gold ?? ink}`, opacity: p.gold ? 0.55 : 0.34 }}
      />
      <div
        className="relative z-10 flex h-full flex-col items-center justify-between px-6 py-7 text-center"
        style={{
          color: ink,
          fontFamily: "var(--font-sans)",
          textShadow: `0 1px 10px ${p.base}, 0 0 2px ${p.base}`,
        }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.42em]" style={{ opacity: 0.85 }}>
          {edition}
        </span>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-2">
          <span className="max-w-[85%] text-balance text-[16px] font-extrabold uppercase leading-tight tracking-[0.08em]">
            {category}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.34em]" style={{ opacity: 0.75 }}>
            {hint}
          </span>
        </div>
      </div>
    </div>
  );
}

export const CardArt = memo(function CardArt({
  pattern,
  edition,
  category,
  hint,
}: {
  pattern: PatternKey;
  edition: string;
  category: string;
  hint: string;
}) {
  return <CardBack pattern={pattern} edition={edition} category={category} hint={hint} />;
});

/* Compact card-back preview for the deck selector. */
export function CardArtPreview({
  pattern,
  label,
  index = 0,
}: {
  pattern: PatternKey;
  label?: string;
  index?: number;
}) {
  const p = PALETTE[pattern];
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ perspective: 700 }}>
      <motion.div
        className="preserve-3d relative overflow-hidden rounded-2xl"
        style={{ width: 74, aspectRatio: "5 / 7", background: p.base, boxShadow: "0 10px 22px -12px rgba(0,0,0,0.45)" }}
        initial={{ rotateY: -14, opacity: 0 }}
        animate={{ rotateY: [-6, 6, -6], opacity: 1 }}
        transition={{
          rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.35 },
          opacity: { duration: 0.5, delay: index * 0.08 },
        }}
        whileHover={{ scale: 1.04, rotateY: 0 }}
      >
        <DeckArt pattern={pattern} />
        <div
          className="pointer-events-none absolute inset-[5px] rounded-[14px]"
          style={{ border: `1px solid ${p.gold ?? p.ink}`, opacity: 0.4 }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 48%, transparent 66%)",
            mixBlendMode: "overlay",
          }}
          initial={{ x: "-130%" }}
          animate={{ x: "130%" }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut", delay: index * 0.4 }}
        />
      </motion.div>
      {label ? (
        <span
          className="max-w-[80px] text-center text-[9px] font-semibold leading-tight"
          style={{ color: "var(--muted-text)" }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

export function patternFor(
  category: CategoryId | "unfiltered",
  level?: UnfilteredQuestion["level"],
): PatternKey {
  if (category === "unfiltered") {
    if (level === "no_limits") return "uf_no_limits";
    if (level === "after_dark") return "uf_after_dark";
    return "uf_love_spice";
  }
  return category;
}
