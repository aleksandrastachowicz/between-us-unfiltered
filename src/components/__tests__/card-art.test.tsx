import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BACK_COLORS, CardArt, FRONT_STYLES, FrontSymbol, patternFor, type PatternKey } from "../CardArt";

const PATTERNS: PatternKey[] = [
  "love", "friendship", "selfdev", "passions", "introspection",
  "plus_love", "plus_spice", "plus_deep", "plus_kinky",
  "uf_love_spice", "uf_after_dark", "uf_no_limits",
];

/** The three app themes a card can sit on. */
const THEMES = { roz: "#F2BCCB", szalwia: "#BFCEB5", lawenda: "#CFC4EC" };
const PLAQUE = "#FFF6F0";

function luminance(hex: string) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const render = (pattern: PatternKey) =>
  renderToStaticMarkup(<CardArt pattern={pattern} edition="Edition" category="Category" hint="Hint" />);

describe("card backs", () => {
  it.each(PATTERNS)("%s renders its artwork with deck name, category and hint", (pattern) => {
    const html = render(pattern);
    expect(html).toContain(`data-card-pattern="${pattern}"`);
    expect(html).toContain("Edition");
    expect(html).toContain("Category");
    expect(html).toContain("Hint");
  });

  it.each(PATTERNS)("%s keeps svg ids unique per card instance", (pattern) => {
    const html = renderToStaticMarkup(
      <>
        <CardArt pattern={pattern} edition="A" category="A" hint="" />
        <CardArt pattern={pattern} edition="B" category="B" hint="" />
      </>,
    );
    const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(PATTERNS)("%s plaque texts pass WCAG AA (4.5:1)", (pattern) => {
    const c = BACK_COLORS[pattern];
    expect(contrast(c.accent, PLAQUE)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(c.hint, PLAQUE)).toBeGreaterThanOrEqual(4.5);
  });

  it("maps categories and unfiltered levels to patterns", () => {
    expect(patternFor("love")).toBe("love");
    expect(patternFor("unfiltered")).toBe("uf_love_spice");
    expect(patternFor("unfiltered", "after_dark")).toBe("uf_after_dark");
    expect(patternFor("unfiltered", "no_limits")).toBe("uf_no_limits");
  });
});

describe("card fronts", () => {
  it.each(PATTERNS)("%s question and translation pass WCAG AA", (pattern) => {
    const f = FRONT_STYLES[pattern];
    expect(contrast(f.ink, f.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(f.sub, f.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(f.foot, f.bg)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(PATTERNS)("%s front stands out from every theme background", (pattern) => {
    const f = FRONT_STYLES[pattern];
    for (const bg of Object.values(THEMES)) expect(contrast(f.bg, bg)).toBeGreaterThanOrEqual(1.4);
  });

  it.each(PATTERNS)("%s has a symbol that renders", (pattern) => {
    const f = FRONT_STYLES[pattern];
    const html = renderToStaticMarkup(<FrontSymbol symbol={f.symbol} color={f.symbolColor} />);
    expect(html).toContain("<svg");
    expect(html).toContain(f.symbolColor);
  });
});
