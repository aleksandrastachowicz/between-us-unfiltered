// Canvas-based 9:16 story image of a question card, in the Between Us look:
// the same card front as in the game, on the brand rose background, with the logo.
import type { DrawnCard } from "@/lib/store";
import { CATEGORY_META, EDITION_META, editionForCategory } from "@/data/questions";
import { UNFILTERED_LEVELS } from "@/data/unfiltered";
import { FRONT_STYLES, frontSymbolUrl, patternFor } from "@/components/CardArt";

const ROSE = "#F2BCCB";
const INK = "#650F23";
const HEART = "#D9304F";
const DISPLAY = "'Archivo Black', 'Inter', sans-serif";
const TEXT = "Inter, system-ui, sans-serif";
const HEART_PATH =
  "M0 1.05C-0.3 0.75-1.15 0.2-1.12-0.35C-1.08-0.95-0.35-1.15 0-0.55C0.35-1.15 1.08-0.95 1.12-0.35C1.15 0.2 0.3 0.75 0 1.05Z";

/** Wraps on spaces; a word wider than the line (e.g. "chciałbyś/chciałabyś") may also break after "/". */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  const push = (piece: string, glue: string) => {
    const test = line ? line + glue + piece : piece;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = piece;
    } else {
      line = test;
    }
  };
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (ctx.measureText(word).width > maxWidth && word.includes("/")) {
      const bits = word.split("/");
      bits.forEach((bit, i) => push(i < bits.length - 1 ? `${bit}/` : bit, i === 0 ? " " : ""));
    } else {
      push(word, " ");
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** "between ♥ us", centred on x, with the heart drawn as the brand shape. */
function drawLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, heart: string) {
  ctx.font = `400 ${size}px ${DISPLAY}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  const a = ctx.measureText("between").width;
  const b = ctx.measureText("us").width;
  const hw = size * 0.56;
  const gap = size * 0.12;
  const total = a + gap + hw + gap + b;
  let cx = x - total / 2;
  ctx.fillStyle = color;
  ctx.fillText("between", cx, y);
  cx += a + gap;
  ctx.save();
  ctx.translate(cx + hw / 2, y - hw * 0.5);
  ctx.scale(hw / 2.4, hw / 2.4);
  ctx.fillStyle = heart;
  ctx.fill(new Path2D(HEART_PATH));
  ctx.restore();
  ctx.fillStyle = color;
  ctx.fillText("us", cx + hw + gap, y);
}

function labelsFor(card: DrawnCard, lang: "pl" | "en") {
  const category =
    card.category === "unfiltered"
      ? UNFILTERED_LEVELS[card.unfilteredLevel ?? "love_spice"].label[lang]
      : CATEGORY_META[card.category]?.label[lang] ?? "";
  const edition = EDITION_META[editionForCategory(card.category)][lang];
  return `${category} · ${edition}`.toUpperCase();
}

export async function renderStoryImage(card: DrawnCard, lang: "pl" | "en"): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context");

  // The brand fonts must be ready before measuring text, or the canvas falls back to a system font.
  try {
    await Promise.all([
      document.fonts.load(`400 80px "Archivo Black"`),
      document.fonts.load(`500 40px Inter`),
      document.fonts.load(`700 30px Inter`),
    ]);
  } catch {
    /* draw with whatever is available */
  }

  const pattern = patternFor(card.category, card.unfilteredLevel);
  const front = FRONT_STYLES[pattern];
  const primary = lang === "pl" ? card.pl : card.en;
  const secondary = lang === "pl" ? card.en : card.pl;

  // background
  ctx.fillStyle = ROSE;
  ctx.fillRect(0, 0, W, H);

  // the card, 5:7 like in the game
  const cardW = 860;
  const cardH = Math.round((cardW * 7) / 5);
  const cardX = (W - cardW) / 2;
  const cardY = 250;
  ctx.save();
  ctx.shadowColor = "rgba(101,15,35,0.28)";
  ctx.shadowBlur = 80;
  ctx.shadowOffsetY = 36;
  ctx.fillStyle = front.bg;
  roundRect(ctx, cardX, cardY, cardW, cardH, 72);
  ctx.fill();
  ctx.restore();

  // symbol at the top of the card
  try {
    const sym = await loadImage(frontSymbolUrl(pattern, 120));
    ctx.drawImage(sym, W / 2 - 40, cardY + 90, 80, 80);
  } catch {
    /* symbol is decoration only */
  }

  // card footer: logo and category · edition
  const footY = cardY + cardH - 150;
  drawLogo(ctx, W / 2, footY, 40, front.foot, front.foot);
  ctx.fillStyle = front.foot;
  ctx.font = `700 24px ${TEXT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "5px";
  } catch {
    /* older browsers */
  }
  ctx.fillText(labelsFor(card, lang), W / 2, footY + 62);
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
  } catch {
    /* older browsers */
  }

  // question: as large as fits between the symbol and the footer
  const textW = cardW - 180;
  const top = cardY + 230;
  const bottom = footY - 90;
  let size = 76;
  let pLines: string[] = [];
  let sLines: string[] = [];
  let sSize = 0;
  for (; size >= 40; size -= 2) {
    sSize = Math.max(28, Math.round(size * 0.55));
    ctx.font = `400 ${size}px ${DISPLAY}`;
    pLines = wrapText(ctx, primary, textW);
    ctx.font = `500 ${sSize}px ${TEXT}`;
    sLines = wrapText(ctx, secondary, textW);
    const h = pLines.length * size * 1.18 + 44 + sLines.length * sSize * 1.4;
    if (h <= bottom - top) break;
  }
  const blockH = pLines.length * size * 1.18 + 44 + sLines.length * sSize * 1.4;
  let ty = top + (bottom - top - blockH) / 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = front.ink;
  ctx.font = `400 ${size}px ${DISPLAY}`;
  for (const l of pLines) {
    ctx.fillText(l, W / 2, ty);
    ty += size * 1.18;
  }
  ty += 44;
  ctx.fillStyle = front.sub;
  ctx.font = `500 ${sSize}px ${TEXT}`;
  for (const l of sLines) {
    ctx.fillText(l, W / 2, ty);
    ty += sSize * 1.4;
  }

  // below the card: the logo and one line of the brand idea
  drawLogo(ctx, W / 2, cardY + cardH + 210, 76, INK, HEART);
  ctx.fillStyle = INK;
  ctx.font = `500 32px ${TEXT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(
    lang === "pl" ? "Każda dobra rozmowa zaczyna się od pytania." : "Every good conversation starts with a question.",
    W / 2,
    cardY + cardH + 275,
  );

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

/** On phones opens the share sheet (where "Save image" lives); elsewhere downloads the PNG. */
export async function shareOrDownloadStory(card: DrawnCard, lang: "pl" | "en") {
  const blob = await renderStoryImage(card, lang);
  const file = new File([blob], `between-us-${card.id}.png`, { type: "image/png" });
  const nav = navigator as Navigator & {
    canShare?: (data: { files: File[] }) => boolean;
    share?: (data: { files: File[]; title?: string }) => Promise<void>;
  };
  if (nav.canShare?.({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], title: "Between Us" });
      return;
    } catch {
      /* fall through to download */
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
