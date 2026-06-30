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

/* ---------- Love & Relationships: wavy checkerboard + cherries + Amor ---------- */
function WavyChecker() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`chk-${id}`} width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <rect width="60" height="60" fill="#f6c9d8" />
          <path d="M0 0 h30 v30 h-30 z M30 30 h30 v30 h-30 z" fill="#a21836" opacity="0.92" />
        </pattern>
        <filter id={`liq-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" />
        </filter>
      </defs>
      <g filter={`url(#liq-${id})`}>
        <rect x="-30" y="-30" width="360" height="480" fill={`url(#chk-${id})`} />
      </g>
      <text x="150" y="220" textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="120" fill="#a21836" opacity="0.07" transform="rotate(-12 150 210)">Amor</text>
      {[[70, 110], [225, 300], [60, 330], [235, 120]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.85">
          <circle cx="0" cy="6" r="7" />
          <circle cx="13" cy="6" r="7" />
          <path d="M2 0 C6 -12 11 -12 13 -2" />
          <path d="M11 -10 q6 -5 11 -3" />
        </g>
      ))}
    </svg>
  );
}

/* ---------- Friendship & Family: 70s daisy power-flower grid ---------- */
function DaisyGrid() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`d-${id}`} width="75" height="75" patternUnits="userSpaceOnUse">
          <rect width="75" height="75" fill="#ffc6dd" />
          <g transform="translate(37.5 37.5)">
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse key={i} cx="0" cy="-17" rx="8" ry="16" fill="#ff47af" transform={`rotate(${i * 45})`} />
            ))}
            <circle r="9" fill="#fff3c4" />
          </g>
        </pattern>
      </defs>
      <rect width="300" height="420" fill={`url(#d-${id})`} />
    </svg>
  );
}

/* ---------- Self-Development: pulsating aura gradient + smiling face + grain ---------- */
function AuraFace() {
  const id = ID();
  return (
    <div className="relative h-full w-full grain overflow-hidden">
      <svg viewBox="0 0 300 420" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`a-${id}`} cx="50%" cy="44%" r="62%">
            <stop offset="0%" stopColor="#fff7cf" />
            <stop offset="38%" stopColor="#e9f3a0" />
            <stop offset="70%" stopColor="#cae774" />
            <stop offset="100%" stopColor="#bcd96a" />
          </radialGradient>
        </defs>
        <rect width="300" height="420" fill={`url(#a-${id})`} style={{ transformOrigin: "center", animation: "auraPulse 7s ease-in-out infinite" }} />
        <g stroke="#5f6b2e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.65" transform="translate(150 200)">
          <circle cx="-26" cy="-12" r="3.5" fill="#5f6b2e" stroke="none" />
          <circle cx="26" cy="-12" r="3.5" fill="#5f6b2e" stroke="none" />
          <path d="M-30 20 Q0 48 30 20" />
        </g>
      </svg>
    </div>
  );
}

/* ---------- Passions & Dreams: liquid cobalt/sky waves + four-point stars ---------- */
function LiquidStars() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a4c7ff" />
          <stop offset="50%" stopColor="#5d8bff" />
          <stop offset="100%" stopColor="#2f4fd6" />
        </linearGradient>
        <filter id={`w-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.018" numOctaves="3" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="40" />
        </filter>
      </defs>
      <rect width="300" height="420" fill={`url(#lg-${id})`} />
      <g filter={`url(#w-${id})`} stroke="#d8e6ff" strokeWidth="6" fill="none" opacity="0.55">
        {Array.from({ length: 7 }).map((_, i) => (
          <path key={i} d={`M-20 ${40 + i * 58} Q 75 ${10 + i * 58} 150 ${40 + i * 58} T 320 ${40 + i * 58}`} />
        ))}
      </g>
      {[[55, 90], [240, 150], [80, 320], [220, 350], [150, 210]].map(([x, y], i) => (
        <path key={i} transform={`translate(${x} ${y})`} d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#fff" opacity="0.9" />
      ))}
    </svg>
  );
}

/* ---------- Introspection: lavender aura + sun & moon line-art eye ---------- */
function SunMoon() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`sm-${id}`} cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#efe7ff" />
          <stop offset="55%" stopColor="#d3c0ff" />
          <stop offset="100%" stopColor="#b9a2f5" />
        </radialGradient>
      </defs>
      <rect width="300" height="420" fill={`url(#sm-${id})`} />
      <g transform="translate(150 200)" stroke="#5a4a86" strokeWidth="2.4" fill="none" opacity="0.75">
        <path d="M-78 0 Q0 -52 78 0 Q0 52 -78 0 Z" />
        <circle r="26" />
        <circle r="11" fill="#5a4a86" stroke="none" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="0" y1="-40" x2="0" y2="-50" transform={`rotate(${i * 30})`} strokeLinecap="round" />
        ))}
        <path d="M40 -78 a16 16 0 1 0 14 26 a12 12 0 0 1 -14 -26 z" fill="#5a4a86" stroke="none" opacity="0.8" />
      </g>
    </svg>
  );
}

/* ---------- Edition Plus: burgundy/blush sultry waves ---------- */
function Burgundy() {
  const id = ID();
  return (
    <svg viewBox="0 0 300 420" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6e1228" />
          <stop offset="55%" stopColor="#8a1f38" />
          <stop offset="100%" stopColor="#4a0c1b" />
        </linearGradient>
        <filter id={`bw-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="30" />
        </filter>
      </defs>
      <rect width="300" height="420" fill={`url(#bg-${id})`} />
      <g filter={`url(#bw-${id})`} stroke="#e7b9c4" strokeWidth="5" fill="none" opacity="0.45">
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={`M-20 ${30 + i * 54} Q 90 ${0 + i * 54} 150 ${30 + i * 54} T 330 ${30 + i * 54}`} />
        ))}
      </g>
      <g transform="translate(150 210)" stroke="#f0cdd6" strokeWidth="2" fill="none" opacity="0.65">
        <path d="M0 -34 C-26 -60 -64 -36 0 18 C64 -36 26 -60 0 -34 Z" />
      </g>
    </svg>
  );
}

/* ---------- Unfiltered: obsidian + gold hands/celestial + hue-shift neon border ---------- */
function Unfiltered({ level }: { level?: UnfilteredQuestion["level"] }) {
  const id = ID();
  const speed = level === "no_limits" ? 4 : level === "after_dark" ? 8 : 14;
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "#0b0a0e" }}>
      <div
        className="pointer-events-none absolute inset-2 rounded-[24px]"
        style={{
          border: "2px solid #d9b25a",
          boxShadow: "0 0 18px rgba(217,178,90,0.6), inset 0 0 18px rgba(217,178,90,0.25)",
          animation: `hueShift ${speed}s linear infinite`,
        }}
      />
      <svg viewBox="0 0 300 420" className="relative h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g stroke="#d9b25a" strokeWidth="1.6" fill="none" opacity="0.9">
          <g transform="translate(150 120)">
            <circle r="44" opacity="0.5" />
            <circle r="34" opacity="0.4" />
            <path d="M0 -40 L7 -7 L40 0 L7 7 L0 40 L-7 7 L-40 0 L-7 -7 Z" fill="#d9b25a" stroke="none" />
            <path d="M52 -8 a18 18 0 1 0 16 30 a14 14 0 0 1 -16 -30z" fill="#d9b25a" stroke="none" opacity="0.85" />
          </g>
          <g transform="translate(150 300)">
            <circle r="44" opacity="0.5" />
            <path d="M0 -40 L7 -7 L40 0 L7 7 L0 40 L-7 7 L-40 0 L-7 -7 Z" fill="#d9b25a" stroke="none" />
          </g>
          {/* abstract hands */}
          <path d="M118 168 q14 -18 34 -10 q22 8 30 30 q-30 16 -50 4 q-18 -10 -14 -24z" />
          <path d="M182 252 q-14 18 -34 10 q-22 -8 -30 -30 q30 -16 50 -4 q18 10 14 24z" />
        </g>
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx={(i * 53) % 300} cy={(i * 97) % 420} r={i % 4 === 0 ? 1.8 : 1} fill="#d9b25a" opacity="0.6" />
        ))}
      </svg>
    </div>
  );
}

export function CardArt({
  pattern,
  unfilteredLevel,
}: {
  pattern: PatternKey;
  unfilteredLevel?: UnfilteredQuestion["level"];
}) {
  switch (pattern) {
    case "wavyChecker":
      return <WavyChecker />;
    case "daisyGrid":
      return <DaisyGrid />;
    case "aura":
      return <AuraFace />;
    case "liquidStars":
      return <LiquidStars />;
    case "sunMoon":
      return <SunMoon />;
    case "burgundy":
      return <Burgundy />;
    case "unfiltered":
      return <Unfiltered level={unfilteredLevel} />;
  }
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
