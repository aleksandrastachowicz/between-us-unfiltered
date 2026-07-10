// Generates a 9:16 (1080×1920) Instagram-Stories-ready PNG for a question,
// painted on an on-brand aura gradient with a small "Between Us" wordmark.

export interface ShareCardInput {
  primary: string;
  secondary: string;
  category: string;
  edition: string;
  accent: string; // hex
}

function readVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6) || "000000", 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: [number, number, number], b: [number, number, number], t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
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

export async function generateShareCard(input: ShareCardInput): Promise<void> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const accent = hexToRgb(input.accent);
  const dark: [number, number, number] = [16, 12, 20];

  // Base deep background
  ctx.fillStyle = mix(accent, dark, 0.82);
  ctx.fillRect(0, 0, W, H);

  // Aura radial glow
  const glow = ctx.createRadialGradient(W / 2, H * 0.36, 80, W / 2, H * 0.36, H * 0.7);
  glow.addColorStop(0, mix(accent, dark, 0.15));
  glow.addColorStop(0.55, mix(accent, dark, 0.55));
  glow.addColorStop(1, mix(accent, dark, 0.9));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Soft secondary blob bottom
  const glow2 = ctx.createRadialGradient(W * 0.2, H * 0.85, 40, W * 0.2, H * 0.85, W * 0.8);
  glow2.addColorStop(0, mix(accent, dark, 0.35));
  glow2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  const margin = 110;
  const contentWidth = W - margin * 2;
  ctx.textAlign = "center";

  // Category pill
  const pillText = input.category.toUpperCase();
  ctx.font = "700 32px Inter, system-ui, sans-serif";
  const pillW = ctx.measureText(pillText).width + 72;
  const pillH = 74;
  const pillX = (W - pillW) / 2;
  const pillY = 300;
  ctx.fillStyle = input.accent;
  const r = pillH / 2;
  ctx.beginPath();
  ctx.moveTo(pillX + r, pillY);
  ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + pillH, r);
  ctx.arcTo(pillX + pillW, pillY + pillH, pillX, pillY + pillH, r);
  ctx.arcTo(pillX, pillY + pillH, pillX, pillY, r);
  ctx.arcTo(pillX, pillY, pillX + pillW, pillY, r);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.fillText(pillText, W / 2, pillY + pillH / 2 + 2);

  // Edition label above pill
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "700 28px Inter, system-ui, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(input.edition.toUpperCase(), W / 2, pillY - 34);

  // Primary question — centered block
  ctx.fillStyle = "#ffffff";
  let fontSize = 76;
  let primaryLines: string[] = [];
  for (; fontSize >= 46; fontSize -= 4) {
    ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`;
    primaryLines = wrap(ctx, input.primary, contentWidth);
    if (primaryLines.length <= 7) break;
  }
  const lineH = fontSize * 1.24;
  const blockH = primaryLines.length * lineH;
  let y = H / 2 - blockH / 2 + lineH / 2;
  ctx.font = `800 ${fontSize}px Inter, system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  for (const l of primaryLines) {
    ctx.fillText(l, W / 2, y);
    y += lineH;
  }

  // Secondary translation
  if (input.secondary) {
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    const sFont = Math.max(30, Math.round(fontSize * 0.5));
    ctx.font = `500 ${sFont}px Inter, system-ui, sans-serif`;
    const sLines = wrap(ctx, input.secondary, contentWidth);
    y += lineH * 0.4;
    const sLineH = sFont * 1.3;
    for (const l of sLines.slice(0, 4)) {
      ctx.fillText(l, W / 2, y);
      y += sLineH;
    }
  }

  // Wordmark bottom
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 44px Inter, system-ui, sans-serif";
  ctx.fillText("Between Us", W / 2, H - 150);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "600 26px Inter, system-ui, sans-serif";
  ctx.fillText("betweenus.app", W / 2, H - 108);

  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "between-us.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function accentHexFor(cat: string): string {
  return readVar(`--color-cat-${cat}`, "#ff2f9e");
}
