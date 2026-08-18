import type { ReactNode } from "react";
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
      {/* liquid displacement for the checkerboard waves */}
      <filter id={`liq-${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      {/* heavy print grain */}
      <filter id={`grain-${id}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" result="g" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      {/* soft aura wash */}
      <radialGradient id={`wash-${id}`} cx="50%" cy="36%" r="72%">
        <stop offset="0%" stopColor={p.wash} stopOpacity="0.85" />
        <stop offset="100%" stopColor={p.wash} stopOpacity="0" />
      </radialGradient>
      {/* checkerboard tile */}
      <pattern id={`chk-${id}`} width="48" height="48" patternUnits="userSpaceOnUse">
        <rect width="48" height="48" fill={p.base} />
        <rect width="24" height="24" fill={p.check} fillOpacity="0.9" />
        <rect x="24" y="24" width="24" height="24" fill={p.check} fillOpacity="0.9" />
      </pattern>
      {/* retro daisy grid tile */}
      <pattern id={`daisy-${id}`} width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill={p.base} />
        <g transform="translate(30 30)" fill={p.check}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse key={i} rx="5.5" ry="12" transform={`rotate(${i * 45}) translate(0 -12)`} />
          ))}
          <circle r="5" fill={p.wash} />
        </g>
      </pattern>
      {/* pulsating aura gradient field */}
      <radialGradient id={`aura-${id}`} cx="50%" cy="34%" r="88%">
        <stop offset="0%" stopColor={p.check} stopOpacity="0.95" />
        <stop offset="45%" stopColor={p.wash} stopOpacity="0.7" />
        <stop offset="100%" stopColor={p.base} stopOpacity="1" />
      </radialGradient>
      {/* psychedelic fluid field */}
      <linearGradient id={`fluid-${id}`} x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor={p.check} stopOpacity="0.85" />
        <stop offset="55%" stopColor={p.wash} stopOpacity="0.8" />
        <stop offset="100%" stopColor={p.base} stopOpacity="1" />
      </linearGradient>
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
            <path d={retroHeart} transform="scale(0.48)" strokeWidth="0.9" opacity="0.45" />
          </g>
        );
      case "friendship": // floral grid bloom + sun rays
        return (
          <g {...stroke}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse key={i} rx="9" ry="22" transform={`rotate(${i * 45}) translate(0 -14)`} opacity="0.85" />
            ))}
            <circle r="8" />
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return <line key={i} x1={Math.cos(a) * 42} y1={Math.sin(a) * 42} x2={Math.cos(a) * 48} y2={Math.sin(a) * 48} strokeWidth="1" />;
            })}
          </g>
        );
      case "selfdev": // aura heart + sun-eye
        return (
          <g {...stroke}>
            <path d={retroHeart} transform="scale(0.92)" opacity="0.9" />
            <path d="M-26 0 C-13 -15 13 -15 26 0 C13 15 -13 15 -26 0 Z" transform="translate(0 -2) scale(0.72)" />
            <circle cy="-1.5" r="6" />
            <circle cy="-1.5" r="2.2" fill={ink} stroke="none" />
          </g>
        );
      case "passions": // star line-work
        return (
          <g {...stroke}>
            <path d="M0 -34 C3 -13 13 -3 34 0 C13 3 3 13 0 34 C-3 13 -13 3 -34 0 C-13 -3 -3 -13 0 -34 Z" />
            <path d="M0 -20 C2 -8 8 -2 20 0 C8 2 2 8 0 20 C-2 8 -8 2 -20 0 C-8 -2 -2 -8 0 -20 Z" strokeWidth="1" opacity="0.7" />
            <Spark x={30} y={-28} s={0.8} ink={ink} />
            <Spark x={-30} y={26} s={0.7} ink={ink} />
          </g>
        );
      case "introspection": // mystic eye
        return (
          <g {...stroke}>
            <path d="M-36 0 C-18 -22 18 -22 36 0 C18 22 -18 22 -36 0 Z" />
            <circle r="11" />
            <circle r="4" fill={ink} stroke="none" />
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={-32 + i * 8} y1="14" x2={-34 + i * 8} y2="22" strokeWidth="1" opacity="0.65" />
            ))}
            <Spark x={0} y={-30} s={0.8} ink={ink} />
          </g>
        );
      case "plus_love": // kissing silhouettes
        return (
          <g {...stroke}>
            <path d="M-6 -30 C-16 -26 -22 -14 -20 -2 C-18 10 -12 20 -6 28" />
            <path d="M6 -30 C16 -26 22 -14 20 -2 C18 10 12 20 6 28" />
            <path d="M-6 -6 C-3 -9 -1 -9 0 -6 C1 -9 3 -9 6 -6 C4 0 -4 0 -6 -6 Z" />
            <Spark x={0} y={-26} s={0.9} ink={ink} />
          </g>
        );
      case "plus_spice": // retro heart on waves
        return (
          <g {...stroke}>
            <path d={retroHeart} />
            <path d="M-34 14 C-20 4 -12 24 0 14 C12 4 20 24 34 14" strokeWidth="1.1" opacity="0.7" />
            <path d="M-34 24 C-20 14 -12 34 0 24 C12 14 20 34 34 24" strokeWidth="1" opacity="0.45" />
          </g>
        );
      case "plus_deep": // procedural heart, fine linework
        return (
          <g {...stroke}>
            <path d={retroHeart} transform="scale(1.04)" />
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={i} d={retroHeart} transform={`scale(${0.9 - i * 0.14})`} strokeWidth="0.8" opacity={0.55 - i * 0.06} />
            ))}
          </g>
        );
      case "plus_kinky": // heart + scattered line work
        return (
          <g {...stroke}>
            <path d={retroHeart} transform="scale(0.9)" />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return <line key={i} x1={Math.cos(a) * 34} y1={Math.sin(a) * 34} x2={Math.cos(a) * 46} y2={Math.sin(a) * 46} strokeWidth="1" opacity="0.7" />;
            })}
            <Spark x={34} y={-30} s={0.8} ink={ink} />
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
            <Spark x={-22} y={-42} s={0.7} ink={gold!} />
            <Spark x={22} y={-40} s={0.6} ink={gold!} />
          </g>
        );
      case "uf_after_dark": // heart with gold border lines
        return (
          <g {...stroke} stroke={gold}>
            <path d={retroHeart} transform="scale(0.95)" />
            <path d={retroHeart} transform="scale(0.66)" strokeWidth="1" opacity="0.7" />
            <path d="M-46 -46 L-30 -46 M-46 -46 L-46 -30 M46 46 L30 46 M46 46 L46 30" strokeWidth="1.2" opacity="0.8" />
          </g>
        );
      case "uf_no_limits": // heart + retro waves + scattered work
        return (
          <g {...stroke} stroke={gold}>
            <path d={retroHeart} transform="scale(0.85)" />
            <path d="M-40 22 C-26 12 -14 32 0 22 C14 12 26 32 40 22" strokeWidth="1.1" opacity="0.75" />
            <path d="M-40 32 C-26 22 -14 42 0 32 C14 22 26 42 40 32" strokeWidth="1" opacity="0.5" />
            <Spark x={-34} y={-32} s={0.8} ink={gold!} />
            <Spark x={34} y={-30} s={0.7} ink={gold!} />
          </g>
        );
    }
  };

  return (
    <g transform="translate(150 200) scale(1.12)">
      <Halo ink={ink} gold={gold} />
      {body()}
    </g>
  );
}

/* ---------------- full reverse artwork ---------------- */
function Field({ id, p }: { id: string; p: Palette }) {
  const family = p.bg ?? "checker";
  if (family === "daisy") {
    return (
      <>
        <rect width="300" height="420" fill={`url(#daisy-${id})`} opacity="0.9" />
        <g fill="none" stroke={p.line} strokeWidth="0.9" opacity="0.16">
          {Array.from({ length: 7 }).map((_, i) => (
            <path key={i} d={`M-30 ${30 + i * 62} Q 90 ${0 + i * 62} 150 ${30 + i * 62} T 330 ${30 + i * 62}`} />
          ))}
        </g>
      </>
    );
  }
  if (family === "aura") {
    return (
      <>
        <rect width="300" height="420" fill={`url(#aura-${id})`} />
        <g fill="none" stroke={p.line} strokeWidth="0.8" opacity="0.2">
          {Array.from({ length: 7 }).map((_, i) => (
            <circle key={i} cx="150" cy="150" r={54 + i * 26} />
          ))}
        </g>
      </>
    );
  }
  if (family === "fluid") {
    return (
      <>
        <rect width="300" height="420" fill={`url(#fluid-${id})`} />
        <g fill="none" stroke={p.line} strokeWidth="1.1" opacity="0.26" filter={`url(#liq-${id})`}>
          {Array.from({ length: 13 }).map((_, i) => (
            <path key={i} d={`M-30 ${10 + i * 36} Q 70 ${-24 + i * 36} 150 ${10 + i * 36} T 330 ${10 + i * 36}`} />
          ))}
        </g>
      </>
    );
  }
  return (
    <>
      <g filter={`url(#liq-${id})`} opacity="0.5">
        <rect x="-40" y="-40" width="380" height="500" fill={`url(#chk-${id})`} />
      </g>
      <g fill="none" stroke={p.line} strokeWidth="0.9" opacity="0.18" filter={`url(#liq-${id})`}>
        {Array.from({ length: 11 }).map((_, i) => (
          <path key={i} d={`M-30 ${18 + i * 42} Q 80 ${-8 + i * 42} 150 ${18 + i * 42} T 330 ${18 + i * 42}`} />
        ))}
      </g>
      <rect width="300" height="420" fill={`url(#wash-${id})`} opacity="0.55" />
    </>
  );
}

function DeckArt({ pattern }: { pattern: PatternKey }) {
  const id = pattern;
  const p = PALETTE[pattern];
  return (
    <svg
      viewBox="0 0 300 420"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <Defs id={id} p={p} />
      <rect width="300" height="420" fill={p.base} />

      {/* per-deck background family: checker | daisy | aura | fluid */}
      <Field id={id} p={p} />

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

      {/* heavy procedural print grain */}
      <rect width="300" height="420" filter={`url(#grain-${id})`} opacity="0.22" style={{ mixBlendMode: "overlay" }} />
      <rect width="300" height="420" filter={`url(#grain-${id})`} opacity="0.1" style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}

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

export function CardArt({
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
}

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
