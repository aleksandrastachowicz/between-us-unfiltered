import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { CategoryId } from "@/data/questions";
import type { UnfilteredQuestion } from "@/data/unfiltered";

export type PatternKey =
  | CategoryId
  | "uf_love_spice"
  | "uf_after_dark"
  | "uf_no_limits";

const ID = () => Math.random().toString(36).slice(2, 8);

/* ============================================================
   Shared premium frame: art layer + readable labels (no big
   background monogram — purely graphic reverse per category).
   ============================================================ */
function CardBack({
  art,
  ink,
  emblem,
  edition,
  category,
  hint,
}: {
  art: ReactNode;
  ink: string;
  emblem: ReactNode;
  edition: string;
  category: string;
  hint: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {art}
      <div
        className="pointer-events-none absolute inset-[10px] rounded-[24px]"
        style={{ border: `1.5px solid ${ink}`, opacity: 0.32 }}
      />
      <div
        className="relative z-10 flex h-full flex-col items-center justify-between px-6 py-7 text-center"
        style={{ color: ink }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.42em]" style={{ opacity: 0.8 }}>
          {edition}
        </span>

        <div className="flex flex-1 items-center justify-center">{emblem}</div>

        <div className="flex flex-col items-center gap-2">
          <span className="max-w-[85%] text-balance text-[17px] font-extrabold leading-tight tracking-tight">
            {category}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.34em]" style={{ opacity: 0.55 }}>
            {hint}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Emblems: smooth tarot-style motifs (no letters) ----------
   Refined line-art with soft fills, a delicate double halo and orbiting
   sparkles so every category reads as an elegant sigil.                    */
function Sparkle({ x, y, s = 1, ink }: { x: number; y: number; s?: number; ink: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -6 C0.6 -2 2 -0.6 6 0 C2 0.6 0.6 2 0 6 C-0.6 2 -2 0.6 -6 0 C-2 -0.6 -0.6 -2 0 -6 Z"
      fill={ink}
      stroke="none"
      opacity="0.85"
    />
  );
}

function Emblem({ ink, children }: { ink: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width="140"
      height="140"
      fill="none"
      stroke={ink}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="60" cy="60" r="52" strokeWidth="0.7" opacity="0.28" />
      <circle cx="60" cy="60" r="46" strokeWidth="0.5" opacity="0.16" strokeDasharray="1 5" />
      <Sparkle x={60} y={4} s={1.1} ink={ink} />
      <Sparkle x={112} y={68} s={0.7} ink={ink} />
      <Sparkle x={12} y={54} s={0.8} ink={ink} />
      {children}
    </svg>
  );
}

const HeartEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <path
      transform="translate(60 62)"
      d="M0 24 C-4 18 -30 6 -30 -12 C-30 -26 -14 -30 -4 -18 C-2 -15 0 -12 0 -10 C0 -12 2 -15 4 -18 C14 -30 30 -26 30 -12 C30 6 4 18 0 24 Z"
      strokeWidth="1.8"
      fill={ink}
      fillOpacity="0.12"
    />
  </Emblem>
);
const DaisyEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)">
      {Array.from({ length: 8 }).map((_, j) => (
        <path
          key={j}
          transform={`rotate(${j * 45})`}
          d="M0 -8 C7 -14 7 -28 0 -34 C-7 -28 -7 -14 0 -8 Z"
          strokeWidth="1.5"
          fill={ink}
          fillOpacity="0.1"
        />
      ))}
      <circle r="8" strokeWidth="1.6" fill={ink} fillOpacity="0.16" />
    </g>
  </Emblem>
);
const LeafEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)">
      <path d="M0 30 C0 6 0 -14 0 -32" strokeWidth="1.6" />
      <path d="M0 -6 C-16 -10 -26 -22 -24 -36 C-10 -36 2 -24 0 -6 Z" strokeWidth="1.5" fill={ink} fillOpacity="0.12" />
      <path d="M0 8 C16 4 26 -8 24 -22 C10 -22 -2 -10 0 8 Z" strokeWidth="1.5" fill={ink} fillOpacity="0.12" />
    </g>
  </Emblem>
);
const StarEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)">
      <path
        d="M0 -32 C3 -12 12 -3 32 0 C12 3 3 12 0 32 C-3 12 -12 3 -32 0 C-12 -3 -3 -12 0 -32 Z"
        strokeWidth="1.4"
        fill={ink}
        fillOpacity="0.14"
      />
      <circle r="4" fill={ink} stroke="none" />
    </g>
  </Emblem>
);
const EyeEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)">
      <path d="M-32 0 C-16 -20 16 -20 32 0 C16 20 -16 20 -32 0 Z" strokeWidth="1.6" />
      <circle r="10" strokeWidth="1.6" fill={ink} fillOpacity="0.14" />
      <circle r="3.5" fill={ink} stroke="none" />
      <path d="M-36 -12 C-40 -18 -40 -18 -42 -22 M36 -12 C40 -18 40 -18 42 -22" strokeWidth="1.2" opacity="0.5" />
    </g>
  </Emblem>
);
const FlameEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)">
      <path
        d="M0 30 C-18 22 -22 2 -6 -18 C-8 -30 2 -34 4 -30 C2 -18 14 -18 10 -6 C22 0 18 22 0 30 Z"
        strokeWidth="1.6"
        fill={ink}
        fillOpacity="0.12"
      />
      <path d="M0 24 C-8 18 -8 6 0 -4 C6 4 6 16 0 24 Z" strokeWidth="1.2" opacity="0.55" />
    </g>
  </Emblem>
);
const InfinityEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)" strokeWidth="1.8">
      <path
        d="M0 0 C-8 -14 -30 -14 -30 0 C-30 14 -8 14 0 0 C8 -14 30 -14 30 0 C30 14 8 14 0 0 Z"
        fill={ink}
        fillOpacity="0.1"
      />
    </g>
  </Emblem>
);
const KeyEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)" strokeWidth="1.8">
      <circle cx="0" cy="-16" r="12" fill={ink} fillOpacity="0.12" />
      <circle cx="0" cy="-16" r="4.5" strokeWidth="1.4" />
      <path d="M0 -4 L0 30" />
      <path d="M0 16 L9 16 M0 24 L7 24" />
    </g>
  </Emblem>
);
const MoonEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)">
      <path
        d="M10 -26 C-6 -20 -16 -4 -12 12 C-8 24 4 30 16 28 C4 24 -2 12 -2 0 C-2 -12 4 -22 10 -26 Z"
        strokeWidth="1.6"
        fill={ink}
        fillOpacity="0.16"
      />
      <Sparkle x={16} y={-14} s={0.9} ink={ink} />
    </g>
  </Emblem>
);
const DiamondEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)" strokeWidth="1.6">
      <path d="M-18 -10 L18 -10 L26 -2 L0 30 L-26 -2 Z" fill={ink} fillOpacity="0.12" />
      <path d="M-26 -2 L26 -2 M-18 -10 L-8 -2 L0 30 L8 -2 L18 -10 M-8 -2 L8 -2" strokeWidth="1" opacity="0.5" />
    </g>
  </Emblem>
);
const RingsEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)" strokeWidth="1.8">
      <circle cx="-12" cy="4" r="18" fill={ink} fillOpacity="0.1" />
      <circle cx="12" cy="4" r="18" fill={ink} fillOpacity="0.1" />
      <path d="M0 -24 C-3 -20 -3 -20 0 -16 C3 -20 3 -20 0 -24 Z" strokeWidth="1.2" fill={ink} />
      <path d="M-30 -14 C-24 -20 -18 -22 -12 -22 M30 -14 C24 -20 18 -22 12 -22" strokeWidth="1" opacity="0.45" />
    </g>
  </Emblem>
);
const LipsEmblem = (ink: string) => (
  <Emblem ink={ink}>
    <g transform="translate(60 60)" strokeWidth="1.6">
      <path
        d="M-30 0 C-22 -14 -10 -14 -4 -6 C-2 -3 2 -3 4 -6 C10 -14 22 -14 30 0 C20 16 -20 16 -30 0 Z"
        fill={ink}
        fillOpacity="0.14"
      />
      <path d="M-30 0 L30 0" strokeWidth="1.1" opacity="0.55" />
      <Sparkle x={26} y={-16} s={0.8} ink={ink} />
    </g>
  </Emblem>
);

/* ============================================================
   Unified reverse system — every deck shares the same
   composition (deep gradient, top halo, guilloché arc weave,
   corner star dust). Only the palette + motif differ, so all
   card backs read as one family.
   ============================================================ */
type Palette = { from: string; via: string; to: string; glow: string; line: string };

// Vivid, saturated palettes — one balanced luminance family per deck so the
// whole set reads as equally bright and colourful.
const PALETTE: Record<PatternKey, Palette> = {
  love: { from: "#ff86b3", via: "#ff2d78", to: "#8a0f43", glow: "#ffd0e2", line: "#fff0f6" },
  friendship: { from: "#ffd166", via: "#ff7a45", to: "#b02a5b", glow: "#ffeab5", line: "#fff6e6" },
  selfdev: { from: "#b6f36a", via: "#22c55e", to: "#0d5c3c", glow: "#e2ffc7", line: "#f2fff0" },
  passions: { from: "#8fd0ff", via: "#3b5bff", to: "#141a7a", glow: "#cfe6ff", line: "#f0f6ff" },
  introspection: { from: "#d9b6ff", via: "#8b3dff", to: "#33127a", glow: "#ecdcff", line: "#f8f2ff" },
  plus_love: { from: "#ff9ec4", via: "#e01f6b", to: "#6d0733", glow: "#ffd4e5", line: "#fff0f7" },
  plus_spice: { from: "#ffb066", via: "#ff2f3f", to: "#75061f", glow: "#ffddb8", line: "#fff1e4" },
  plus_deep: { from: "#79f2e4", via: "#149fdc", to: "#0a2a63", glow: "#c9fdf6", line: "#effffc" },
  plus_kinky: { from: "#ff8ef0", via: "#b419e0", to: "#41086b", glow: "#ffd2fa", line: "#ffeffd" },
  uf_love_spice: { from: "#ffa3a3", via: "#ff2e63", to: "#5c0a2a", glow: "#ffd6d6", line: "#fff0ee" },
  uf_after_dark: { from: "#d95cc0", via: "#6d1a8a", to: "#1a0626", glow: "#f3b9e6", line: "#fde3f5" },
  uf_no_limits: { from: "#ffe08a", via: "#c9962a", to: "#171018", glow: "#ffeec2", line: "#ffe9a8" },
};

function DeckArt({ pattern }: { pattern: PatternKey }) {
  const id = ID();
  const p = PALETTE[pattern];
  return (
    <svg
      viewBox="0 0 300 420"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={p.from} />
          <stop offset="52%" stopColor={p.via} />
          <stop offset="100%" stopColor={p.to} />
        </linearGradient>
        <radialGradient id={`h-${id}`} cx="50%" cy="34%" r="68%">
          <stop offset="0%" stopColor={p.glow} stopOpacity="0.5" />
          <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="300" height="420" fill={`url(#g-${id})`} />
      <rect width="300" height="420" fill={`url(#h-${id})`} />

      {/* guilloché arc weave — identical geometry across every deck */}
      <g fill="none" stroke={p.line} strokeWidth="1.1" opacity="0.22">
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={`a${i}`} d={`M-20 ${34 + i * 48} Q 150 ${-4 + i * 48} 320 ${34 + i * 48}`} />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={`b${i}`} d={`M-20 ${58 + i * 48} Q 150 ${96 + i * 48} 320 ${58 + i * 48}`} />
        ))}
      </g>

      {/* concentric halo behind the emblem */}
      <g transform="translate(150 196)" fill="none" stroke={p.line} strokeWidth="1" opacity="0.2">
        <circle r="86" />
        <circle r="112" strokeDasharray="1 6" />
      </g>

      {/* corner star dust */}
      <g fill={p.line} opacity="0.5">
        {[[38, 52, 1.8], [262, 78, 1.2], [44, 366, 1.3], [258, 344, 1.8], [150, 30, 1], [150, 392, 1]].map(
          ([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} />
          ),
        )}
      </g>
    </svg>
  );
}

const INK: Record<PatternKey, string> = {
  love: "#fff0f6",
  friendship: "#fff6e6",
  selfdev: "#f2fff0",
  passions: "#f0f6ff",
  introspection: "#f8f2ff",
  plus_love: "#fff0f7",
  plus_spice: "#fff1e4",
  plus_deep: "#effffc",
  plus_kinky: "#ffeffd",
  uf_love_spice: "#fff0ee",
  uf_after_dark: "#fde3f5",
  uf_no_limits: "#ffe9a8",
};

function artFor(pattern: PatternKey): ReactNode {
  return <DeckArt pattern={pattern} />;
}

function emblemFor(pattern: PatternKey, ink: string): ReactNode {
  switch (pattern) {
    case "love":
      return HeartEmblem(ink);
    case "friendship":
      return DaisyEmblem(ink);
    case "selfdev":
      return LeafEmblem(ink);
    case "passions":
      return StarEmblem(ink);
    case "introspection":
      return EyeEmblem(ink);
    case "plus_love":
      return RingsEmblem(ink);
    case "plus_spice":
      return FlameEmblem(ink);
    case "plus_deep":
      return InfinityEmblem(ink);
    case "plus_kinky":
      return KeyEmblem(ink);
    case "uf_love_spice":
      return LipsEmblem(ink);
    case "uf_after_dark":
      return MoonEmblem(ink);
    case "uf_no_limits":
      return DiamondEmblem(ink);
  }
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
  const ink = INK[pattern];
  return (
    <CardBack
      art={artFor(pattern)}
      ink={ink}
      emblem={emblemFor(pattern, ink)}
      edition={edition}
      category={category}
      hint={hint}
    />
  );
}

/* Compact card-back preview for the deck selector (art + emblem, no copy).
   Gently flips and catches a shimmer sweep while the user browses decks. */
export function CardArtPreview({
  pattern,
  label,
  index = 0,
}: {
  pattern: PatternKey;
  label?: string;
  index?: number;
}) {
  const ink = INK[pattern];
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ perspective: 700 }}>
      <motion.div
        className="preserve-3d relative overflow-hidden rounded-2xl shadow-lg"
        style={{ width: 74, aspectRatio: "5 / 7", boxShadow: "0 10px 22px -12px rgba(0,0,0,0.45)" }}
        initial={{ rotateY: -14, opacity: 0 }}
        animate={{ rotateY: [-6, 6, -6], opacity: 1 }}
        transition={{
          rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.35 },
          opacity: { duration: 0.5, delay: index * 0.08 },
        }}
        whileHover={{ scale: 1.04, rotateY: 0 }}
      >
        {artFor(pattern)}
        <div
          className="pointer-events-none absolute inset-[5px] rounded-[14px]"
          style={{ border: `1px solid ${ink}`, opacity: 0.32 }}
        />
        <div className="absolute inset-0 flex items-center justify-center" style={{ color: ink }}>
          <div style={{ transform: "scale(0.6)" }}>{emblemFor(pattern, ink)}</div>
        </div>
        {/* Shimmer sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.55) 48%, transparent 66%)",
            mixBlendMode: "overlay",
          }}
          initial={{ x: "-130%" }}
          animate={{ x: "130%" }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatDelay: 2.6,
            ease: "easeInOut",
            delay: index * 0.4,
          }}
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
