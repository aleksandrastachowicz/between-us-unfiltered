/**
 * Gentle haptic feedback for supported mobile devices.
 * Silently no-ops where the Vibration API is unavailable (most desktops/iOS Safari).
 */
export function haptic(pattern: number | number[] = 10) {
  if (typeof navigator === "undefined") return;
  const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  if (typeof nav.vibrate !== "function") return;
  try {
    nav.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

export const HAPTIC = {
  flip: 12,
  turn: [10, 40, 16] as number[],
  tap: 8,
};
