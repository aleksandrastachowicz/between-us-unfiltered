import { useEffect, useState } from "react";

/**
 * Large screens get the same composition as a ~800×660 window, scaled up as a whole.
 * Everything (card, buttons, tabs, header) keeps the proportions approved on tablet and laptop.
 */
const BASE_H = 660;
const BASE_W = 820;
export function useStageScale(baseW = BASE_W, baseH = BASE_H) {
  const [stage, setStage] = useState<{ z: number; h: number } | null>(null);
  useEffect(() => {
    const update = () => {
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
      // Only real desktops: a mouse, no touch screen. Phones and tablets keep their own layout.
      const desktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches && navigator.maxTouchPoints === 0;
      if (!desktop || w < 1024) return setStage(null);
      const z = Math.max(1, Math.min(h / baseH, w / baseW, 1.7));
      setStage(z > 1.02 ? { z, h: h / z } : null);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [baseW, baseH]);
  return stage;
}
