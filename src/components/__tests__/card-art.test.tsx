import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CardArt, patternFor, type PatternKey } from "../CardArt";

const PATTERNS: PatternKey[] = [
  "love", "friendship", "selfdev", "passions", "introspection",
  "plus_love", "plus_spice", "plus_deep", "plus_kinky",
  "uf_love_spice", "uf_after_dark", "uf_no_limits",
];

const EXPECTED_FIELD: Record<PatternKey, "chk" | "daisy" | "aura" | "fluid" | "wash"> = {
  love: "chk",
  friendship: "daisy",
  selfdev: "aura",
  passions: "fluid",
  introspection: "aura",
  plus_love: "chk",
  plus_spice: "fluid",
  plus_deep: "aura",
  plus_kinky: "chk",
  uf_love_spice: "aura",
  uf_after_dark: "chk",
  uf_no_limits: "wash",
};

const render = (pattern: PatternKey) =>
  renderToStaticMarkup(
    <CardArt pattern={pattern} edition="Edition" category="Category" hint="Hint" />,
  );

describe("card backs", () => {
  it.each(PATTERNS)("%s renders its declared background family", (pattern) => {
    const html = render(pattern);
    expect(html).toContain(`url(#${EXPECTED_FIELD[pattern]}-${pattern})`);
  });

  it.each(PATTERNS)("%s scopes every gradient/pattern id to its own deck", (pattern) => {
    const html = render(pattern);
    const ids = [...html.matchAll(/id="([a-z]+)-([a-z_]+)"/g)];
    expect(ids.length).toBeGreaterThan(0);
    for (const [, , owner] of ids) expect(owner).toBe(pattern);
  });

  it.each(PATTERNS)("%s uses no brown/copper earthy metallics", (pattern) => {
    const html = render(pattern).toLowerCase();
    const banned = ["#8b4513", "#a0522d", "#b87333", "#cd7f32", "#7b3f00", "brown", "sienna", "peru", "chocolate"];
    for (const c of banned) expect(html).not.toContain(c);
  });

  it.each(PATTERNS)("%s keeps a legibility scrim and grain texture", (pattern) => {
    const html = render(pattern);
    expect(html).toContain(`url(#scrim-${pattern})`);
    expect(html).toContain(`url(#grain-${pattern})`);
  });

  it("renders unfiltered gold accents only on unfiltered decks", () => {
    for (const p of PATTERNS) {
      const hasGold = render(p).includes(`gold-${p}`);
      expect(hasGold).toBe(p.startsWith("uf_"));
    }
  });

  it("maps categories and unfiltered levels to distinct patterns", () => {
    expect(patternFor("love")).toBe("love");
    expect(patternFor("unfiltered")).toBe("uf_love_spice");
    expect(patternFor("unfiltered", "after_dark")).toBe("uf_after_dark");
    expect(patternFor("unfiltered", "no_limits")).toBe("uf_no_limits");
  });

  it.each(PATTERNS)("%s snapshot is stable", (pattern) => {
    expect(render(pattern)).toMatchSnapshot();
  });
});
