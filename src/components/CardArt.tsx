import type { ReactNode } from "react";
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

/* ---------- Love & Relationships: romantic rose ---------- */
function LoveArt() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`lv-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e85a7f" />
          <stop offset="55%" stopColor="#c02749" />
          <stop offset="100%" stopColor="#7d0f2a" />
        </linearGradient>
        <radialGradient id={`lvg-${id}`} cx="50%" cy="34%" r="65%">
          <stop offset="0%" stopColor="#ff9db6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff9db6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="420" fill={`url(#lv-${id})`} />
      <rect width="300" height="420" fill={`url(#lvg-${id})`} />
      <g fill="none" stroke="#ffd9e2" strokeWidth="2" opacity="0.45">
        {[[46, 74, 0.9], [246, 120, 0.7], [60, 336, 0.8], [238, 320, 0.6]].map(([x, y, s], i) => (
          <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0 6 C -12 -8 -26 4 0 24 C 26 4 12 -8 0 6 Z" />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Friendship & Family: warm coral sunset ---------- */
function FriendshipArt() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`fr-${id}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffb15c" />
          <stop offset="52%" stopColor="#ff7a6b" />
          <stop offset="100%" stopColor="#f0517f" />
        </linearGradient>
      </defs>
      <rect width="300" height="420" fill={`url(#fr-${id})`} />
      <g opacity="0.35" fill="none" stroke="#fff2d6" strokeWidth="2">
        {[[40, 90, 0.9], [262, 320, 0.85]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            {Array.from({ length: 8 }).map((_, j) => (
              <ellipse key={j} cx="0" cy="-15" rx="6.5" ry="14" transform={`rotate(${j * 45})`} />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- Self-Development: calm sage aura ---------- */
function SelfDevArt() {
  const id = ID();
  return (
    <div className="grain absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 300 420" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`sd-${id}`} cx="50%" cy="42%" r="70%">
            <stop offset="0%" stopColor="#f4fbcf" />
            <stop offset="46%" stopColor="#c6e488" />
            <stop offset="100%" stopColor="#7fb45d" />
          </radialGradient>
        </defs>
        <rect
          width="300"
          height="420"
          fill={`url(#sd-${id})`}
          style={{ transformOrigin: "center", animation: "auraPulse 8s ease-in-out infinite" }}
        />
        <g transform="translate(150 210)" fill="none" stroke="#4d6b34" strokeWidth="1.4" opacity="0.3">
          {[70, 100, 130, 160].map((r) => (
            <circle key={r} r={r} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ---------- Passions & Dreams: dreamy cobalt ---------- */
function PassionsArt() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`pa-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ba6ff" />
          <stop offset="52%" stopColor="#4b5ce6" />
          <stop offset="100%" stopColor="#2a1c8f" />
        </linearGradient>
      </defs>
      <rect width="300" height="420" fill={`url(#pa-${id})`} />
      <g fill="#ffffff" opacity="0.55">
        {[[54, 92, 0.9], [244, 150, 0.7], [78, 322, 0.8], [222, 352, 0.85]].map(([x, y, s], i) => (
          <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Introspection: mystical violet ---------- */
function IntrospectionArt() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`in-${id}`} cx="50%" cy="40%" r="72%">
          <stop offset="0%" stopColor="#d9c7ff" />
          <stop offset="52%" stopColor="#8f6bf0" />
          <stop offset="100%" stopColor="#432c9c" />
        </radialGradient>
      </defs>
      <rect width="300" height="420" fill={`url(#in-${id})`} />
      <g transform="translate(150 210)" stroke="#efe6ff" strokeWidth="1.4" fill="none" opacity="0.35">
        {[60, 96, 132].map((r) => (
          <circle key={r} r={r} />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Plus · Love & Relationships: burgundy luxe ---------- */
function PlusLoveArt() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`pl-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9a2444" />
          <stop offset="55%" stopColor="#6c1330" />
          <stop offset="100%" stopColor="#3f0a19" />
        </linearGradient>
      </defs>
      <rect width="300" height="420" fill={`url(#pl-${id})`} />
      <g stroke="#f0c3cf" strokeWidth="3" fill="none" opacity="0.28">
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={i} d={`M-20 ${44 + i * 58} Q 90 ${12 + i * 58} 160 ${44 + i * 58} T 330 ${44 + i * 58}`} />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Plus · Spicy & Intimate: fiery scarlet ---------- */
function PlusSpiceArt() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`ps-${id}`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ff6a3d" />
          <stop offset="50%" stopColor="#e01f3d" />
          <stop offset="100%" stopColor="#7a0821" />
        </linearGradient>
        <radialGradient id={`psg-${id}`} cx="50%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#ffd07a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffd07a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="420" fill={`url(#ps-${id})`} />
      <rect width="300" height="420" fill={`url(#psg-${id})`} />
      <g stroke="#ffd9c2" strokeWidth="2.4" fill="none" opacity="0.3">
        {[70, 150, 230, 310].map((y, i) => (
          <path key={i} d={`M-10 ${y} C 80 ${y - 40} 130 ${y + 40} 320 ${y - 10}`} />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Plus · Deep & Emotional: indigo-teal tide ---------- */
function PlusDeepArt() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`pd-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2ec6c0" />
          <stop offset="52%" stopColor="#2c5fb8" />
          <stop offset="100%" stopColor="#1a2452" />
        </linearGradient>
      </defs>
      <rect width="300" height="420" fill={`url(#pd-${id})`} />
      <g stroke="#c9f2ee" strokeWidth="2.2" fill="none" opacity="0.28">
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={`M-20 ${52 + i * 50} Q 150 ${20 + i * 50} 320 ${52 + i * 50}`} />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Plus · Kinky & Fantasy: electric magenta ---------- */
function PlusKinkyArt() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`pk-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff4fd8" />
          <stop offset="50%" stopColor="#a01ec0" />
          <stop offset="100%" stopColor="#3d0a5c" />
        </linearGradient>
      </defs>
      <rect width="300" height="420" fill={`url(#pk-${id})`} />
      <g stroke="#ffd6f7" strokeWidth="1.6" fill="none" opacity="0.28">
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d={`M${-20 + i * 4} 0 L${60 + i * 26} 420`} />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Unfiltered I · Love & Spice: warm ember rose ---------- */
function UfLoveSpiceArt() {
  const id = ID();
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#2a0d1a" }}>
      <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`u1-${id}`} cx="50%" cy="46%" r="70%">
            <stop offset="0%" stopColor="#ff8fa8" />
            <stop offset="48%" stopColor="#c93b63" />
            <stop offset="100%" stopColor="#2a0d1a" />
          </radialGradient>
        </defs>
        <rect width="300" height="420" fill={`url(#u1-${id})`} />
        <g fill="#ffd9c2" opacity="0.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={(i * 71) % 300} cy={(i * 113) % 420} r={i % 3 === 0 ? 2 : 1.2} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ---------- Unfiltered II · After Dark: crimson-violet night ---------- */
function UfAfterDarkArt() {
  const id = ID();
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#160616" }}>
      <div
        className="pointer-events-none absolute inset-2 rounded-[24px]"
        style={{ border: "1.5px solid #e0629b", boxShadow: "0 0 20px rgba(224,98,155,0.45), inset 0 0 18px rgba(224,98,155,0.2)", animation: "hueShift 12s linear infinite" }}
      />
      <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`u2-${id}`} cx="50%" cy="40%" r="72%">
            <stop offset="0%" stopColor="#8a2b6d" />
            <stop offset="60%" stopColor="#3a0f38" />
            <stop offset="100%" stopColor="#160616" />
          </radialGradient>
        </defs>
        <rect width="300" height="420" fill={`url(#u2-${id})`} />
        <g fill="#e0629b" opacity="0.45">
          {Array.from({ length: 18 }).map((_, i) => (
            <circle key={i} cx={(i * 53) % 300} cy={(i * 97) % 420} r={i % 4 === 0 ? 1.8 : 1} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ---------- Unfiltered III · No Limits: obsidian + gold ---------- */
function UfNoLimitsArt() {
  const id = ID();
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#0b0a0e" }}>
      <div
        className="pointer-events-none absolute inset-2 rounded-[24px]"
        style={{ border: "1.5px solid #d9b25a", boxShadow: "0 0 20px rgba(217,178,90,0.55), inset 0 0 18px rgba(217,178,90,0.22)", animation: "hueShift 6s linear infinite" }}
      />
      <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g fill="#d9b25a" opacity="0.5">
          {Array.from({ length: 22 }).map((_, i) => (
            <circle key={i} cx={(i * 53) % 300} cy={(i * 97) % 420} r={i % 4 === 0 ? 1.8 : 1} />
          ))}
        </g>
      </svg>
    </div>
  );
}

const INK: Record<PatternKey, string> = {
  love: "#ffe4ec",
  friendship: "#3a1526",
  selfdev: "#2f4020",
  passions: "#eaf1ff",
  introspection: "#f3ecff",
  plus_love: "#f6d3dc",
  plus_spice: "#ffe0d0",
  plus_deep: "#d6f5f1",
  plus_kinky: "#ffdcf6",
  uf_love_spice: "#ffe0cf",
  uf_after_dark: "#f6cfe4",
  uf_no_limits: "#e7c877",
};

function artFor(pattern: PatternKey): ReactNode {
  switch (pattern) {
    case "love":
      return <LoveArt />;
    case "friendship":
      return <FriendshipArt />;
    case "selfdev":
      return <SelfDevArt />;
    case "passions":
      return <PassionsArt />;
    case "introspection":
      return <IntrospectionArt />;
    case "plus_love":
      return <PlusLoveArt />;
    case "plus_spice":
      return <PlusSpiceArt />;
    case "plus_deep":
      return <PlusDeepArt />;
    case "plus_kinky":
      return <PlusKinkyArt />;
    case "uf_love_spice":
      return <UfLoveSpiceArt />;
    case "uf_after_dark":
      return <UfAfterDarkArt />;
    case "uf_no_limits":
      return <UfNoLimitsArt />;
  }
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
      return HeartEmblem(ink);
    case "plus_spice":
      return FlameEmblem(ink);
    case "plus_deep":
      return InfinityEmblem(ink);
    case "plus_kinky":
      return KeyEmblem(ink);
    case "uf_love_spice":
      return FlameEmblem(ink);
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
