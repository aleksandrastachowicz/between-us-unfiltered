// Canvas-based 9:16 story image exporter for shareable question cards.
// Renders on demand — no runtime dependencies beyond the DOM Canvas API.
import type { DrawnCard } from "@/lib/store";

function readCssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderStoryImage(card: DrawnCard, lang: "pl" | "en"): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context");

  const bg = readCssVar("--bg", "#150a13");
  const accent = readCssVar("--accent", "#ff6bb8");
  const aura1 = readCssVar("--aura-1", accent);
  const aura2 = readCssVar("--aura-2", accent);
  const aura4 = readCssVar("--aura-4", accent);

  // base
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // aura mesh via radial gradients
  const blob = (x: number, y: number, r: number, color: string, alpha = 0.75) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  };
  blob(W * 0.15, H * 0.2, 900, aura1);
  blob(W * 0.9, H * 0.35, 800, aura2, 0.55);
  blob(W * 0.5, H * 0.85, 1000, aura4, 0.6);
  ctx.globalAlpha = 1;

  // soft vignette
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  // card panel
  const padX = 100;
  const cardX = padX;
  const cardY = 320;
  const cardW = W - padX * 2;
  const cardH = 1200;
  const radius = 60;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.fill();
  ctx.stroke();

  // accent pill
  ctx.fillStyle = accent;
  const pillY = cardY + 80;
  roundRect(ctx, cardX + 60, pillY, 240, 60, 30);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 22px Inter, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText("BETWEEN US", cardX + 60 + 120, pillY + 32);

  // primary question
  const primary = lang === "pl" ? card.pl : card.en;
  const secondary = lang === "pl" ? card.en : card.pl;

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "800 62px Inter, system-ui, sans-serif";
  const textMaxW = cardW - 140;
  const primaryLines = wrapText(ctx, primary, textMaxW);
  let ty = cardY + 260;
  for (const l of primaryLines) {
    ctx.fillText(l, W / 2, ty);
    ty += 78;
  }

  ty += 40;
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "500 34px Inter, system-ui, sans-serif";
  const secondaryLines = wrapText(ctx, secondary, textMaxW);
  for (const l of secondaryLines) {
    ctx.fillText(l, W / 2, ty);
    ty += 46;
  }

  // footer logo
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "900 44px Inter, Helvetica, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Between Us", W / 2, H - 180);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "600 22px Inter, system-ui, sans-serif";
  ctx.fillText(lang === "pl" ? "gra rozmów o bliskości" : "an intimate conversation game", W / 2, H - 130);

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

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