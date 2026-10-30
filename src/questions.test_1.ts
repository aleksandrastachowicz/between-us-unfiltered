import { afterEach, describe, expect, it, vi } from "vitest";
import { QUESTIONS, type UnfilteredLevel } from "./questions";
import { generateUnfiltered, UNFILTERED_POOL, levelForProgress } from "./unfiltered";

afterEach(() => vi.restoreAllMocks());

const clean = (s: string) => {
  expect(s.trim()).toBe(s);
  expect(s.length).toBeGreaterThan(5);
  expect(s).not.toMatch(/\{topic\}|undefined/);
};

describe("Bilingual question integrity", () => {
  it("keeps a complete, unique Polish and English pair for every card", () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    expect(new Set(QUESTIONS.map((q) => q.pl)).size).toBe(QUESTIONS.length);
    for (const q of QUESTIONS) {
      clean(q.pl);
      clean(q.en);
    }
  });

  it("keeps sexual topics out of the Basic deck", () => {
    const basic = QUESTIONS.filter((q) => q.deck === "basic");
    for (const q of basic) expect(q.pl).not.toMatch(/seks|gr(a|ze) wstępn|sekstowani|sypialni/i);
  });

  it.each([
    ["Jaką obietnicę chcesz złożyć sobie w tym roku?", "What promise do you want to make to yourself this year?"],
    ["Jaki jest jeden sposób okazywania miłości, którego inni by się nie spodziewali?", "What's one unexpected way you show love?"],
    ["Jakiej formy bliskości brakuje Ci najbardziej?", "What kind of closeness do you miss the most?"],
    ["Co oznacza dla Ciebie kochanie samego/samej siebie?", "What does self-love mean to you?"],
    ["Czy chcesz jeszcze raz przeżyć swoją pierwszą miłość?", "If you could experience your first love again, would you?"],
  ])("preserves the reviewed meaning of %s", (pl, en) => {
    expect(QUESTIONS.find((q) => q.pl === pl)?.en).toBe(en);
  });
});

describe("Unfiltered levels", () => {
  const levels: [number, UnfilteredLevel][] = [[0, "love_spice"], [50, "after_dark"], [100, "no_limits"]];

  it.each(levels)("maps progress %i to %s", (progress, level) => {
    expect(levelForProgress(progress)).toBe(level);
  });

  it.each(levels)("returns complete pairs at progress %i", (progress, level) => {
    for (let i = 0; i < 20; i++) {
      const q = generateUnfiltered(progress);
      expect(q.level).toBe(level);
      clean(q.pl);
      clean(q.en);
    }
  });

  it("has at least 55 unique questions per level", () => {
    for (const pool of Object.values(UNFILTERED_POOL)) {
      expect(pool.length).toBeGreaterThanOrEqual(55);
      expect(new Set(pool.map((q) => q.pl)).size).toBe(pool.length);
    }
  });
});
