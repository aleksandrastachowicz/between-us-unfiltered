import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { CARD_TEXTURES } from "../card-textures";
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
    const source = readFileSync(`src/assets/card-textures/${pattern}.svg`, "utf8");
    expect(source).toContain(`url(#${EXPECTED_FIELD[pattern]}-${pattern})`);
    expect(html).toContain(`href="${CARD_TEXTURES[pattern]}"`);
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
    const source = readFileSync(`src/assets/card-textures/${pattern}.svg`, "utf8");
    expect(source).toContain(`url(#grain-${pattern})`);
    expect(html).not.toContain("feTurbulence");
    expect(html).not.toContain("feDisplacementMap");
    expect(html).not.toContain("<filter");
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

  it.each([
    { pattern: "love", family: "checker", edition: "Basic", field: "chk", symbol: 'd="M0 26 C-5 19', element: '<rect width="24" height="24"' },
    { pattern: "plus_love", family: "checker", edition: "Love & Spice", field: "chk", symbol: 'd="M-34 0 C-24 -16', element: '<rect width="24" height="24"' },
    { pattern: "friendship", family: "daisy", edition: "Basic", field: "daisy", symbol: '<circle r="17"', element: '<ellipse rx="5.5" ry="12"' },
    { pattern: "selfdev", family: "aura", edition: "Basic", field: "aura", symbol: '<circle cy="-1" r="5.5"', element: '<circle cx="150" cy="150" r="54"' },
    { pattern: "passions", family: "fluid", edition: "Basic", field: "fluid", symbol: 'd="M0 -46 L9 -9 L46 0', element: 'd="M-30 10 Q 70 -24 150 10 T 330 10"' },
  ] as const)("$edition / $family has the correct pattern and central symbol", ({ pattern, family, edition, field, symbol, element }) => {
    const html = renderToStaticMarkup(<CardArt pattern={pattern} edition={edition} category={pattern} hint="" />);
    const source = readFileSync(`src/assets/card-textures/${pattern}.svg`, "utf8");
    expect(html).toContain(`data-background-family="${family}"`);
    expect(html).toContain(`data-central-symbol="${pattern}"`);
    expect(html).toContain(symbol);
    expect(html).toContain(edition.replaceAll("&", "&amp;"));
    expect(source).toContain(`url(#${field}-${pattern})`);
    expect(source).toContain(element);
    expect(source).not.toContain('data-central-symbol');
  });

  it("reuses one immutable texture URL for every instance of a pattern", () => {
    const html = renderToStaticMarkup(<>{["Basic", "Translated", "Multiplayer"].map(edition => <CardArt key={edition} pattern="love" edition={edition} category="Love" hint="" />)}</>);
    expect(html.split(`href="${CARD_TEXTURES.love}"`)).toHaveLength(4);
    expect(new Set(Object.values(CARD_TEXTURES)).size).toBe(PATTERNS.length);
  });
});
