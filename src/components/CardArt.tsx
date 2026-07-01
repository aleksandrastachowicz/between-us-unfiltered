import type { ReactNode } from "react";
import type { CategoryId } from "@/data/questions";
import type { UnfilteredQuestion } from "@/data/unfiltered";

type PatternKey =
  | "wavyChecker"
  | "daisyGrid"
  | "aura"
  | "liquidStars"
  | "sunMoon"
  | "burgundy"
  | "unfiltered";

const ID = () => Math.random().toString(36).slice(2, 8);

/* ============================================================
   Shared premium frame: art layer + readable labels/monogram
   ============================================================ */
function CardBack({
  art,
  ink,
  monogram,
  edition,
  category,
  hint,
  frameOpacity = 0.22,
}: {
  art: ReactNode;
  ink: string;
  monogram: string;
  edition: string;
  category: string;
  hint: string;
  frameOpacity?: number;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {art}
      <div
        className="pointer-events-none absolute inset-[10px] rounded-[24px]"
        style={{ border: `1.5px solid ${ink}`, opacity: 0.28 }}
      />
      <div
        className="relative z-10 flex h-full flex-col items-center justify-between px-6 py-7 text-center"
        style={{ color: ink }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.42em]" style={{ opacity: 0.75 }}>
          {edition}
        </span>

        <div className="flex flex-1 items-center justify-center">
          <span
            className="font-black leading-none"
            style={{ fontSize: "128px", opacity: frameOpacity, letterSpacing: "-0.04em" }}
          >
            {monogram}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="max-w-[85%] text-balance text-[17px] font-extrabold leading-tight tracking-tight">
            {category}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.34em]" style={{ opacity: 0.5 }}>
            {hint}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Love & Relationships: romantic rose + floating hearts ---------- */
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
      <g fill="none" stroke="#ffd9e2" strokeWidth="2" opacity="0.5">
        {[[46, 74, 0.9], [246, 120, 0.7], [60, 336, 0.8], [238, 320, 0.6], [150, 60, 0.5]].map(
          ([x, y, s], i) => (
            <path
              key={i}
              transform={`translate(${x} ${y}) scale(${s})`}
              d="M0 6 C -12 -8 -26 4 0 24 C 26 4 12 -8 0 6 Z"
            />
          ),
        )}
      </g>
    </svg>
  );
}

/* ---------- Friendship & Family: warm coral sunset + retro daisies ---------- */
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
      <g opacity="0.7">
        {[[52, 70, 0.9], [250, 90, 0.7], [40, 250, 0.75], [262, 320, 0.85], [150, 380, 0.6]].map(
          ([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              {Array.from({ length: 8 }).map((_, j) => (
                <ellipse key={j} cx="0" cy="-15" rx="6.5" ry="14" fill="#fff2d6" transform={`rotate(${j * 45})`} />
              ))}
              <circle r="8" fill="#ffcf5a" />
            </g>
          ),
        )}
      </g>
    </svg>
  );
}

/* ---------- Self-Development: calm sage aura rings ---------- */
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
        <g transform="translate(150 200)" fill="none" stroke="#4d6b34" strokeWidth="1.6" opacity="0.4">
          {[42, 66, 92, 120].map((r) => (
            <circle key={r} r={r} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ---------- Passions & Dreams: dreamy cobalt + four-point stars ---------- */
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
        <filter id={`pw-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.016" numOctaves="3" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="34" />
        </filter>
      </defs>
      <rect width="300" height="420" fill={`url(#pa-${id})`} />
      <g filter={`url(#pw-${id})`} stroke="#cdddff" strokeWidth="4" fill="none" opacity="0.4">
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={`M-20 ${58 + i * 62} Q 90 ${24 + i * 62} 160 ${58 + i * 62} T 330 ${58 + i * 62}`} />
        ))}
      </g>
      <g fill="#ffffff" opacity="0.92">
        {[[54, 92, 1.1], [244, 150, 0.8], [78, 322, 0.9], [222, 352, 1], [150, 240, 0.7]].map(([x, y, s], i) => (
          <path
            key={i}
            transform={`translate(${x} ${y}) scale(${s})`}
            d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z"
          />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Introspection: mystical violet + sun/moon eye ---------- */
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
      <g transform="translate(150 200)" stroke="#efe6ff" strokeWidth="2.2" fill="none" opacity="0.7">
        <path d="M-82 0 Q0 -56 82 0 Q0 56 -82 0 Z" />
        <circle r="27" />
        <circle r="11" fill="#efe6ff" stroke="none" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="0" y1="-42" x2="0" y2="-52" transform={`rotate(${i * 30})`} strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Edition Plus: burgundy luxe waves + heart ---------- */
function BurgundyArt() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bu-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9a2444" />
          <stop offset="55%" stopColor="#6c1330" />
          <stop offset="100%" stopColor="#3f0a19" />
        </linearGradient>
        <filter id={`bw-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="28" />
        </filter>
      </defs>
      <rect width="300" height="420" fill={`url(#bu-${id})`} />
      <g filter={`url(#bw-${id})`} stroke="#f0c3cf" strokeWidth="4" fill="none" opacity="0.4">
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={i} d={`M-20 ${44 + i * 58} Q 90 ${12 + i * 58} 160 ${44 + i * 58} T 330 ${44 + i * 58}`} />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Unfiltered: obsidian + gold celestial ---------- */
function UnfilteredArt({ level }: { level?: UnfilteredQuestion["level"] }) {
  const id = ID();
  const speed = level === "no_limits" ? 5 : level === "after_dark" ? 9 : 15;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#0b0a0e" }}>
      <div
        className="pointer-events-none absolute inset-2 rounded-[24px]"
        style={{
          border: "1.5px solid #d9b25a",
          boxShadow: "0 0 20px rgba(217,178,90,0.55), inset 0 0 18px rgba(217,178,90,0.22)",
          animation: `hueShift ${speed}s linear infinite`,
        }}
      />
      <svg viewBox="0 0 300 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g stroke="#d9b25a" strokeWidth="1.4" fill="none" opacity="0.85">
          <g transform="translate(150 128)">
            <circle r="46" opacity="0.45" />
            <circle r="34" opacity="0.3" />
            <path d="M0 -40 L7 -7 L40 0 L7 7 L0 40 L-7 7 L-40 0 L-7 -7 Z" fill="#d9b25a" stroke="none" />
            <path d="M52 -8 a18 18 0 1 0 16 30 a14 14 0 0 1 -16 -30z" fill="#d9b25a" stroke="none" opacity="0.8" />
          </g>
        </g>
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={(i * 53) % 300} cy={(i * 97) % 420} r={i % 4 === 0 ? 1.8 : 1} fill="#d9b25a" opacity="0.5" />
        ))}
      </svg>
    </div>
  );
}

const INK: Record<PatternKey, string> = {
  wavyChecker: "#ffe4ec",
  daisyGrid: "#3a1526",
  aura: "#2f4020",
  liquidStars: "#eaf1ff",
  sunMoon: "#f3ecff",
  burgundy: "#f6d3dc",
  unfiltered: "#e7c877",
};

function artFor(pattern: PatternKey, level?: UnfilteredQuestion["level"]): ReactNode {
  switch (pattern) {
    case "wavyChecker":
      return <LoveArt />;
    case "daisyGrid":
      return <FriendshipArt />;
    case "aura":
      return <SelfDevArt />;
    case "liquidStars":
      return <PassionsArt />;
    case "sunMoon":
      return <IntrospectionArt />;
    case "burgundy":
      return <BurgundyArt />;
    case "unfiltered":
      return <UnfilteredArt level={level} />;
  }
}

export function CardArt({
  pattern,
  monogram,
  edition,
  category,
  hint,
  unfilteredLevel,
}: {
  pattern: PatternKey;
  monogram: string;
  edition: string;
  category: string;
  hint: string;
  unfilteredLevel?: UnfilteredQuestion["level"];
}) {
  return (
    <CardBack
      art={artFor(pattern, unfilteredLevel)}
      ink={INK[pattern]}
      monogram={monogram}
      edition={edition}
      category={category}
      hint={hint}
      frameOpacity={pattern === "unfiltered" ? 0.32 : 0.22}
    />
  );
}

export function patternFor(category: CategoryId | "unfiltered"): PatternKey {
  switch (category) {
    case "love":
      return "wavyChecker";
    case "friendship":
      return "daisyGrid";
    case "selfdev":
      return "aura";
    case "passions":
      return "liquidStars";
    case "introspection":
      return "sunMoon";
    case "plus_love":
    case "plus_spice":
      return "burgundy";
    case "unfiltered":
      return "unfiltered";
  }
}
