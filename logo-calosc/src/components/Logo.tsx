import type { CSSProperties } from "react";
import { DISPLAY_FONT } from "./CardArt";

/** Brand heart. It stands literally "between" the two words of the logotype. */
export const BRAND_HEART = "#D9304F";
const HEART_PATH =
  "M0 1.05C-0.3 0.75-1.15 0.2-1.12-0.35C-1.08-0.95-0.35-1.15 0-0.55C0.35-1.15 1.08-0.95 1.12-0.35C1.15 0.2 0.3 0.75 0 1.05Z";

export function BrandHeart({ color = BRAND_HEART, style }: { color?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-1.2 -1.2 2.4 2.4" aria-hidden="true" style={style}>
      <path d={HEART_PATH} fill={color} />
    </svg>
  );
}

/**
 * The logotype: "between ♥ us". One colour for the words, the heart in the brand red.
 * Set its size with font-size (className or style), the heart scales with it.
 */
export function Logo({
  className = "",
  style,
  heart = BRAND_HEART,
}: {
  className?: string;
  style?: CSSProperties;
  heart?: string;
}) {
  return (
    <span
      role="img"
      aria-label="between us"
      className={`inline-flex items-baseline whitespace-nowrap ${className}`}
      style={{ fontFamily: DISPLAY_FONT, ...style }}
    >
      <span aria-hidden="true">between</span>
      <BrandHeart
        color={heart}
        style={{ width: "0.56em", height: "0.56em", margin: "0 0.12em", alignSelf: "baseline", transform: "translateY(0.01em)", flexShrink: 0 }}
      />
      <span aria-hidden="true">us</span>
    </span>
  );
}
