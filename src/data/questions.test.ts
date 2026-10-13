import { afterEach, describe, expect, it, vi } from "vitest";
import { QUESTIONS, type UnfilteredLevel } from "./questions";
import { generateUnfiltered } from "./unfiltered";

afterEach(() => vi.restoreAllMocks());

describe("Bilingual question integrity", () => {
  it("keeps a complete Polish and English pair for every unique card", () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
    for (const q of QUESTIONS) {
      expect(q.pl.trim()).toBe(q.pl);
      expect(q.en.trim()).toBe(q.en);
      expect(q.pl.length).toBeGreaterThan(5);
      expect(q.en.length).toBeGreaterThan(5);
      expect(q.en).not.toMatch(/\{topic\}|undefined|\binner joke\b/);
    }
  });

  it.each([
    ["Jaką obietnicę chcesz złożyć sobie w tym roku?", "What promise do you want to make to yourself this year?"],
    ["Jaki jest jeden sposób okazywania miłości, którego inni by się nie spodziewali?", "What's one unexpected way you show love?"],
    ["Jakiej formy bliskości brakuje Ci najbardziej?", "What kind of closeness do you miss the most?"],
    ["Z jakimi aspektami swojej osobowości wciąż się zmagasz?", "Which parts of your personality do you still struggle with?"],
    ["Jaki koszmar senny powtarza się u Ciebie najczęściej?", "Which nightmare do you have most often?"],
    ["Jakimi 1-2 sposobami na pewno nie chciałbyś/ałabyś umrzeć?", "What are one or two ways you'd definitely not want to die?"],
    ["Gdybyś mógł przeżyć swoją pierwszą miłość jeszcze raz, zrobiłbyś to?", "If you could experience your first love again, would you?"],
  ])("preserves the reviewed meaning of %s", (pl, en) => {
    expect(QUESTIONS.find((q) => q.pl === pl)?.en).toBe(en);
  });
});

describe("Unfiltered English fallback", () => {
  const levels: [number, UnfilteredLevel][] = [[0, "love_spice"], [50, "after_dark"], [100, "no_limits"]];

  it.each(levels)("keeps all seed translations complete at progress %i", (progress, level) => {
    for (let seed = 0; seed < 5; seed++) {
      vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce((seed + 0.5) / 5);
      const q = generateUnfiltered(progress);
      expect(q.level).toBe(level);
      expect(q.pl.length).toBeGreaterThan(10);
      expect(q.en.length).toBeGreaterThan(10);
      vi.restoreAllMocks();
    }
  });

  it.each(levels)("renders every topic/frame combination at progress %i", (progress, level) => {
    const questions = new Set<string>();
    for (let topic = 0; topic < 6; topic++) {
      for (let frame = 0; frame < 6; frame++) {
        vi.spyOn(Math, "random")
          .mockReturnValueOnce(0).mockReturnValueOnce(0.9)
          .mockReturnValueOnce((topic + 0.5) / 6).mockReturnValueOnce((frame + 0.5) / 6);
        const q = generateUnfiltered(progress);
        expect(q.level).toBe(level);
        expect(q.en).not.toMatch(/\{topic\}|undefined|^What does the (boundaries|fears|subtle gestures)|^When did you last truly feel/);
        expect(q.en).toMatch(/[?.]$/);
        questions.add(q.en);
        vi.restoreAllMocks();
      }
    }
    expect(questions.size).toBe(36);
  });
});