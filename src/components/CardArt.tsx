import { memo, useId } from "react";
import { motion } from "motion/react";
import type { CategoryId } from "@/data/questions";
import type { UnfilteredQuestion } from "@/data/unfiltered";

export type PatternKey =
  | CategoryId
  | "uf_love_spice"
  | "uf_after_dark"
  | "uf_no_limits";

/* ============================================================
   CARD BACKS — one layout for every deck:
   label pill on top, full-bleed motif, cream plaque at the bottom
   with the category name and "tap to reveal".
   Each category has its own motif (hearts, flowers, swirls…).
   ============================================================ */

export const DISPLAY_FONT = "'Archivo Black', 'Inter', sans-serif";

const HEART = "M22 38 C8 29 3 21 4 13 C5 5 15 2 22 11 C28 2 39 4 40 13 C41 22 34 30 22 38z";
const HEART_ROUND = "M22 36 C10 28 5 21 5 14 a8.5 8.5 0 0 1 17 -2 a8.5 8.5 0 0 1 17 2 c0 7 -5 14 -17 22z";
const STAR = "M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10z";
const LIP_TOP = "M-17 0 C-11 -9 -4 -9 0 -4 C4 -9 11 -9 17 0 C9 1 -9 1 -17 0z";
const LIP_BOTTOM = "M-17 2 C-10 12 10 12 17 2 C9 4 -9 4 -17 2z";

/** Background colour (shown while the art loads) and the accent used on the pill and plaque. */
export const BACK_COLORS: Record<PatternKey, { base: string; accent: string; hint: string }> = {
  love: { base: "#FBF1E4", accent: "#B0141A", hint: "#955E6A" },
  friendship: { base: "#E9788F", accent: "#B23A57", hint: "#90626F" },
  selfdev: { base: "#B7CB8F", accent: "#4F6B37", hint: "#67755B" },
  passions: { base: "#9EC5F5", accent: "#2457B0", hint: "#5B6F90" },
  introspection: { base: "#AE95EE", accent: "#5B3BAE", hint: "#75689A" },
  plus_love: { base: "#F5A9B8", accent: "#AD0A23", hint: "#A45A66" },
  plus_spice: { base: "#EC84A8", accent: "#AD0A23", hint: "#A45A66" },
  plus_deep: { base: "#FFE3EA", accent: "#AD0A23", hint: "#A45A66" },
  plus_kinky: { base: "#EC84A8", accent: "#AD0A23", hint: "#A45A66" },
  uf_love_spice: { base: "#A3101E", accent: "#A3101E", hint: "#A45A66" },
  uf_after_dark: { base: "#6E2A3E", accent: "#6E2A3E", hint: "#8B626E" },
  uf_no_limits: { base: "#0F0C0D", accent: "#1E1418", hint: "#7D6E59" },
};

const PLAQUE = "#FFF6F0";

/* ---------------- the motifs ---------------- */

function Rings() {
  const cols = ["#AE95EE", "#E9E0FF", "#B7A2EE", "#F4EFFF"];
  const rings: { r: number; c: string }[] = [];
  for (let r = 320, i = 0; r > 6; r -= 16, i++) rings.push({ r, c: cols[i % 4] });
  return (
    <>
      {rings.map((ring) => (
        <circle key={ring.r} cx="110" cy="132" r={ring.r} fill={ring.c} />
      ))}
    </>
  );
}

function StarField({ id, base, dot }: { id: string; base: string; dot: string }) {
  return (
    <>
      <defs>
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill={base} />
          <path transform="translate(10 10) scale(0.5)" d={STAR} fill={dot} />
          <circle cx="30" cy="30" r="1.6" fill={dot} />
        </pattern>
      </defs>
      <rect width="220" height="308" fill={`url(#${id})`} />
    </>
  );
}

function Motif({ pattern, uid }: { pattern: PatternKey; uid: string }) {
  const id = (name: string) => `${name}-${uid}`;
  switch (pattern) {
    case "love":
      return (
        <>
          <defs>
            <pattern id={id("p")} width="96" height="96" patternUnits="userSpaceOnUse">
              <rect width="96" height="96" fill="#FBF1E4" />
              <path transform="translate(4 2) rotate(-22 22 22) scale(0.9)" d={HEART} fill="#D7191F" />
              <path transform="translate(52 6) rotate(28 22 22) scale(0.62)" d={HEART} fill="#D7191F" />
              <path transform="translate(40 46) rotate(-8 22 22) scale(1.05)" d={HEART} fill="#D7191F" />
              <path transform="translate(2 60) rotate(40 22 22) scale(0.55)" d={HEART} fill="#D7191F" />
            </pattern>
          </defs>
          <rect width="220" height="308" fill={`url(#${id("p")})`} />
        </>
      );
    case "friendship": {
      const flower = (
        <>
          <circle cx="0" cy="-9" r="7" />
          <circle cx="8.6" cy="-2.8" r="7" />
          <circle cx="5.3" cy="7.3" r="7" />
          <circle cx="-5.3" cy="7.3" r="7" />
          <circle cx="-8.6" cy="-2.8" r="7" />
          <circle r="4.5" fill="#E9788F" />
        </>
      );
      return (
        <>
          <defs>
            <pattern id={id("p")} width="88" height="88" patternUnits="userSpaceOnUse">
              <rect width="88" height="88" fill="#E9788F" />
              <g transform="translate(22 22)" fill="#FFF3E8">{flower}</g>
              <g transform="translate(66 64) scale(0.7) rotate(20)" fill="#FFF3E8">{flower}</g>
              <circle cx="68" cy="18" r="3" fill="#FFF3E8" />
              <circle cx="18" cy="70" r="3" fill="#FFF3E8" />
            </pattern>
          </defs>
          <rect width="220" height="308" fill={`url(#${id("p")})`} />
        </>
      );
    }
    case "selfdev":
      return (
        <>
          <defs>
            <pattern id={id("p")} width="40" height="136" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
              <rect width="40" height="34" fill="#F6E8D6" />
              <rect y="34" width="40" height="34" fill="#F6A3BE" />
              <rect y="68" width="40" height="34" fill="#B7CB8F" />
              <rect y="102" width="40" height="34" fill="#86A170" />
            </pattern>
            <filter id={id("f")} x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves={1} seed={12} />
              <feDisplacementMap in="SourceGraphic" scale={120} />
            </filter>
          </defs>
          <rect x="-80" y="-80" width="380" height="470" fill={`url(#${id("p")})`} filter={`url(#${id("f")})`} />
        </>
      );
    case "passions":
      return (
        <>
          <defs>
            <pattern id={id("p")} width="22" height="22" patternUnits="userSpaceOnUse">
              <rect width="22" height="22" fill="#9EC5F5" />
              <rect width="9" height="22" fill="#F4F8FF" />
            </pattern>
            <filter id={id("f")} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={1} seed={3} />
              <feDisplacementMap in="SourceGraphic" scale={34} />
            </filter>
          </defs>
          <rect x="-40" y="-40" width="300" height="390" fill={`url(#${id("p")})`} filter={`url(#${id("f")})`} />
        </>
      );
    case "introspection":
      return <Rings />;
    case "plus_love":
      return (
        <>
          <defs>
            <pattern id={id("p")} width="64" height="64" patternUnits="userSpaceOnUse">
              <rect width="64" height="64" fill="#F5A9B8" />
              <rect width="32" height="32" fill="#AD0A23" />
              <rect x="32" y="32" width="32" height="32" fill="#AD0A23" />
            </pattern>
            <filter id={id("f")} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.007" numOctaves={1} seed={9} />
              <feDisplacementMap in="SourceGraphic" scale={44} />
            </filter>
          </defs>
          <rect x="-40" y="-40" width="300" height="390" fill={`url(#${id("p")})`} filter={`url(#${id("f")})`} />
        </>
      );
    case "plus_spice":
      return (
        <>
          <rect width="220" height="308" fill="#EC84A8" />
          <text x="110" y="122" textAnchor="middle" fontFamily={DISPLAY_FONT} fontSize="74" fill="#C1121F">HOT</text>
          <text x="110" y="187" textAnchor="middle" fontFamily={DISPLAY_FONT} fontSize="74" fill="#C1121F">HOT</text>
        </>
      );
    case "plus_deep":
      return (
        <>
          <rect width="220" height="308" fill="#FFE3EA" />
          <path transform="translate(-30 -6) scale(2.6)" d={HEART_ROUND} fill="#B00D22" />
          <path transform="translate(150 50) scale(1.2) rotate(18 22 22)" d={HEART_ROUND} fill="#B00D22" />
          <path transform="translate(120 140) scale(2.2) rotate(-15 22 22)" d={HEART_ROUND} fill="#B00D22" />
          <path transform="translate(14 150) scale(1.1) rotate(-20 22 22)" d={HEART_ROUND} fill="#B00D22" />
        </>
      );
    case "plus_kinky":
      return (
        <>
          <defs>
            <pattern id={id("p")} width="70" height="62" patternUnits="userSpaceOnUse">
              <rect width="70" height="62" fill="#EC84A8" />
              <g transform="translate(18 16) rotate(-14)" fill="#C1121F"><path d={LIP_TOP} /><path d={LIP_BOTTOM} /></g>
              <g transform="translate(52 46) rotate(12)" fill="#C1121F"><path d={LIP_TOP} /><path d={LIP_BOTTOM} /></g>
            </pattern>
          </defs>
          <rect width="220" height="308" fill={`url(#${id("p")})`} />
        </>
      );
    case "uf_love_spice":
      return (
        <>
          <StarField id={id("s")} base="#A3101E" dot="#C8303C" />
          <g transform="translate(110 140) scale(0.82) translate(-110 -160)">
            <circle cx="110" cy="160" r="54" fill="none" stroke="#FFF1E0" strokeWidth="2" strokeDasharray="0.1 7" strokeLinecap="round" />
            <circle cx="110" cy="160" r="36" fill="#A3101E" stroke="#FFF1E0" strokeWidth="1.6" />
            <path d="M116 136 a24 24 0 1 0 0 48 a19 19 0 1 1 0 -48z" fill="#FFF1E0" />
            <path transform="translate(124 152) scale(0.7)" d={STAR} fill="#FFF1E0" />
            <path transform="translate(168 108) scale(0.9)" d={STAR} fill="#FFF1E0" />
            <path transform="translate(52 214) scale(0.8)" d={STAR} fill="#FFF1E0" />
          </g>
        </>
      );
    case "uf_after_dark":
      return (
        <>
          <StarField id={id("s")} base="#6E2A3E" dot="#8A4256" />
          <g transform="translate(110 140) scale(0.76) translate(-110 -160)" fill="none" stroke="#F4C7B4" strokeWidth="1.8" strokeLinecap="round">
            <path d="M110 112 V232" />
            <path d="M88 96 Q110 80 132 96 Q110 112 88 96z" />
            <circle cx="110" cy="96" r="6" />
            <path d="M110 74 V64 M98 77 L93 68 M122 77 L127 68 M88 82 L80 76 M132 82 L140 76" />
            <ellipse cx="110" cy="162" rx="9" ry="13" />
            <path d="M70 162 H98 M122 162 H150" />
            <circle cx="58" cy="162" r="13" />
            <circle cx="162" cy="162" r="13" />
            <path d="M58 141 V136 M58 183 V188 M37 162 H32 M162 141 V136 M162 183 V188 M183 162 H188" />
            <path d="M96 222 a16 16 0 0 0 28 0" />
            <path d="M92 216 a20 20 0 0 0 36 0" />
            <path d="M76 118 Q60 160 76 206 M144 118 Q160 160 144 206" strokeDasharray="0.1 6" strokeWidth="2.4" />
          </g>
        </>
      );
    case "uf_no_limits":
      return (
        <>
          <StarField id={id("s")} base="#0F0C0D" dot="#3A2F22" />
          <g transform="translate(110 140) scale(0.76) translate(-110 -160)">
            <g fill="none" stroke="#D9B26F" strokeWidth="1.8" strokeLinecap="round">
              <path d="M90 70 q4 8 0 16 q-4 8 0 16 M102 64 q4 8 0 16 q-4 8 0 16 M118 64 q4 8 0 16 q-4 8 0 16 M130 70 q4 8 0 16 q-4 8 0 16" />
              <path d="M96 112 Q110 102 124 112 Q110 122 96 112z" />
              <circle cx="110" cy="112" r="3.5" />
              <path d="M110 122 V238" />
              <ellipse cx="110" cy="162" rx="62" ry="12" strokeDasharray="3 4" />
              <ellipse cx="110" cy="162" rx="30" ry="5" />
              <path d="M92 196 a20 20 0 1 0 36 0" />
              <path d="M97 194 a14 14 0 1 0 26 0" />
              <circle cx="110" cy="248" r="4" />
            </g>
            <circle cx="48" cy="162" r="4.5" fill="#D9B26F" />
            <circle cx="168" cy="160" r="3.5" fill="#D9B26F" />
            <circle cx="128" cy="166" r="2.5" fill="#D9B26F" />
          </g>
        </>
      );
  }
}

/** Full-bleed artwork of a card back (no text). */
export const DeckArt = memo(function DeckArt({ pattern }: { pattern: PatternKey }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg
      viewBox="0 0 220 308"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      data-card-pattern={pattern}
    >
      <Motif pattern={pattern} uid={uid} />
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
  const c = BACK_COLORS[pattern];
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: c.base }}>
      <DeckArt pattern={pattern} />
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-[7%] pb-[6%] pt-[7%] text-center">
        <span
          className="rounded-full px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.3em]"
          style={{ background: PLAQUE, color: c.accent }}
        >
          {edition}
        </span>
        <div
          className="flex w-full flex-col items-center gap-2 rounded-[20px] px-3 pb-3.5 pt-4"
          style={{ background: PLAQUE }}
        >
          <span
            className="text-balance text-[22px] uppercase leading-[1.05]"
            style={{ fontFamily: DISPLAY_FONT, color: c.accent }}
          >
            {category}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: c.hint }}>
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
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.div
        className="relative overflow-hidden rounded-xl"
        style={{
          width: 52,
          aspectRatio: "5 / 7",
          background: BACK_COLORS[pattern].base,
          border: "2px solid #FFFFFF",
          boxShadow: "0 6px 14px -8px rgba(0,0,0,0.4)",
        }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.06 }}
      >
        <DeckArt pattern={pattern} />
      </motion.div>
      {label ? (
        <span className="max-w-[72px] text-center text-[9px] font-semibold leading-tight" style={{ color: "var(--muted-text)" }}>
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

/* ============================================================
   CARD FRONTS — calm, one colour per deck, one small symbol,
   the question in the centre and a quiet footer.
   ============================================================ */

type FrontStyle = { bg: string; ink: string; sub: string; foot: string; symbol: "heart" | "flower" | "leaf" | "star" | "circle" | "flame" | "lips" | "moon"; symbolColor: string };

export const FRONT_STYLES: Record<PatternKey, FrontStyle> = {
  love: { bg: "#FFF8F0", ink: "#B0141A", sub: "#85666A", foot: "#9A6168", symbol: "heart", symbolColor: "#D7191F" },
  friendship: { bg: "#FFF4F6", ink: "#9E2F4C", sub: "#85616C", foot: "#90626F", symbol: "flower", symbolColor: "#E9788F" },
  selfdev: { bg: "#F6FAF1", ink: "#3E5A2E", sub: "#62725A", foot: "#67755B", symbol: "leaf", symbolColor: "#86A170" },
  passions: { bg: "#F2F7FE", ink: "#1D4A9A", sub: "#5B6D8F", foot: "#596D90", symbol: "star", symbolColor: "#2457B0" },
  introspection: { bg: "#F8F5FE", ink: "#4F2FA0", sub: "#6E6490", foot: "#75689A", symbol: "circle", symbolColor: "#9B82E6" },
  plus_love: { bg: "#FFF3F6", ink: "#8E0B20", sub: "#8A4A58", foot: "#9B5D6A", symbol: "heart", symbolColor: "#AD0A23" },
  plus_spice: { bg: "#FFF3F6", ink: "#9E0E1C", sub: "#8A4A58", foot: "#9B5D6A", symbol: "flame", symbolColor: "#C1121F" },
  plus_deep: { bg: "#FFF3F6", ink: "#8E0B20", sub: "#8A4A58", foot: "#9B5D6A", symbol: "heart", symbolColor: "#B00D22" },
  plus_kinky: { bg: "#FFF3F6", ink: "#8E0B20", sub: "#8A4A58", foot: "#9B5D6A", symbol: "lips", symbolColor: "#C1121F" },
  uf_love_spice: { bg: "#FFF9F2", ink: "#8E0B1C", sub: "#816661", foot: "#856A64", symbol: "moon", symbolColor: "#A3101E" },
  uf_after_dark: { bg: "#FFF9F2", ink: "#5E2235", sub: "#816661", foot: "#856A64", symbol: "moon", symbolColor: "#6E2A3E" },
  uf_no_limits: { bg: "#FFF9F2", ink: "#4A1726", sub: "#816661", foot: "#856A64", symbol: "moon", symbolColor: "#B0852F" },
};

export function FrontSymbol({ symbol, color, size = 22 }: { symbol: FrontStyle["symbol"]; color: string; size?: number }) {
  switch (symbol) {
    case "heart":
      return <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true"><path d={HEART} fill={color} /></svg>;
    case "flower":
      return (
        <svg width={size} height={size} viewBox="-17 -17 34 34" aria-hidden="true" fill={color}>
          <circle cx="0" cy="-9" r="7" /><circle cx="8.6" cy="-2.8" r="7" /><circle cx="5.3" cy="7.3" r="7" /><circle cx="-5.3" cy="7.3" r="7" /><circle cx="-8.6" cy="-2.8" r="7" />
        </svg>
      );
    case "leaf":
      return (
        <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true" fill={color}>
          <path d="M21 40 V22 C21 12 13 5 4 5 C4 15 11 22 21 22 M23 34 V18 C23 9 30 3 40 3 C40 12 33 18 23 18" stroke={color} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
    case "star":
      return <svg width={size} height={size} viewBox="-11 -11 22 22" aria-hidden="true"><path d={STAR} fill={color} /></svg>;
    case "circle":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2.4" /><circle cx="12" cy="12" r="4.5" fill={color} />
        </svg>
      );
    case "flame":
      return <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true"><path d="M22 41c-8 0-13-5-13-12 0-8 7-11 8-20 5 4 6 8 6 11 2-1 3-4 3-7 5 4 9 9 9 16 0 7-5 12-13 12z" fill={color} /></svg>;
    case "lips":
      return (
        <svg width={size} height={size} viewBox="-19 -12 38 24" aria-hidden="true" fill={color}>
          <path d={LIP_TOP} /><path d={LIP_BOTTOM} />
        </svg>
      );
    case "moon":
      return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3.2 A9.5 9.5 0 1 0 20.5 18 A7.5 7.5 0 1 1 15 3.2 Z" fill={color} /></svg>;
  }
}
