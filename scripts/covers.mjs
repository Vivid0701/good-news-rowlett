// Runs before every build. Makes each story's pictures, so editors can upload any photo:
// - An uploaded photo (any size, straight from a phone) becomes a 1200 x 630 card image
//   for the story list and Facebook, plus a lighter full-size version for the story page.
// - A story with no photo gets a Good News Rowlett headline card made for it.
// Results go to public/covers/ and src/data/covers.json (both rebuilt every time).

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";
import { readStories } from "../src/stories.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "public/covers");
const MAP = join(root, "src/data/covers.json");
const FONTS = [join(root, "scripts/fonts/InterDisplay-ExtraBold.otf"), join(root, "scripts/fonts/InterDisplay-SemiBold.otf")];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Break a headline into lines that fit the card.
function wrap(text, maxChars, maxLines) {
  const words = String(text).split(/\s+/), lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars && line) { lines.push(line); line = w; } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + "…"; }
  return lines;
}

function headlineCard(label, title) {
  const long = title.length > 60;
  const size = long ? 64 : 80, lh = long ? 74 : 90;
  const lines = wrap(title, long ? 30 : 24, 4);
  const top = 222;
  const text = lines.map((l, i) => `<text x="80" y="${top + i * lh}" font-family="Inter Display" font-weight="800" font-size="${size}" fill="#FFFFFF" letter-spacing="-1">${esc(l)}</text>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#0B0B0B"/><rect width="1200" height="16" fill="#ED1C24"/>
    <text x="80" y="140" font-family="Inter Display" font-weight="600" font-size="30" fill="#ED1C24">${esc(label.toUpperCase())}</text>
    ${text}
    <text x="80" y="574" font-family="Inter Display" font-weight="600" font-size="28" fill="#9A9A9A">Good News Rowlett</text>
  </svg>`;
  return new Resvg(svg, { font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: "Inter Display" } }).render().asPng();
}

const stories = readStories(join(root, "src/data/stories"), { all: true });
const map = {};
for (const g of stories) {
  const cover = (g.cover || "").trim();
  const src = cover && join(root, "public", cover.replace(/^\//, ""));
  try {
    if (cover && existsSync(src)) {
      const meta = await sharp(src).metadata();
      // Branded cards that are already 1200 x 630 PNGs are used as they are.
      if (meta.width === 1200 && meta.height === 630 && meta.format === "png") { map[g.id] = { card: cover, full: cover }; continue; }
      const turned = await sharp(src).rotate().toBuffer({ resolveWithObject: true });
      const ratio = turned.info.width / turned.info.height;
      if (ratio >= 1.5) {
        // Wide photo: fill the card, keeping the most interesting part in frame.
        await sharp(turned.data).resize(1200, 630, { fit: "cover", position: sharp.strategy.attention }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, `${g.id}.jpg`));
        await sharp(turned.data).resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, `${g.id}-full.jpg`));
        map[g.id] = { card: `/covers/${g.id}.jpg`, full: `/covers/${g.id}-full.jpg`, photo: true };
      } else {
        // Square, tall or logo-style image: show all of it, centered on a soft blurred copy of itself.
        const bg = await sharp(turned.data).resize(1200, 630, { fit: "cover" }).blur(40).modulate({ brightness: 0.55 }).toBuffer();
        const fg = await sharp(turned.data).resize({ width: 1100, height: 570, fit: "inside" }).toBuffer();
        await sharp(bg).composite([{ input: fg, gravity: "center" }]).jpeg({ quality: 85, mozjpeg: true }).toFile(join(OUT, `${g.id}.jpg`));
        map[g.id] = { card: `/covers/${g.id}.jpg`, full: `/covers/${g.id}.jpg`, photo: true };
      }
    } else {
      if (cover) console.warn(`[covers] "${g.title}": photo ${cover} not found – using a headline card`);
      writeFileSync(join(OUT, `${g.id}.png`), headlineCard(g.cardLabel || "Good News", g.title));
      map[g.id] = { card: `/covers/${g.id}.png`, full: `/covers/${g.id}.png` };
    }
  } catch (e) {
    console.warn(`[covers] "${g.title}": ${e.message} – using a headline card`);
    writeFileSync(join(OUT, `${g.id}.png`), headlineCard(g.cardLabel || "Good News", g.title));
    map[g.id] = { card: `/covers/${g.id}.png`, full: `/covers/${g.id}.png` };
  }
}
writeFileSync(MAP, JSON.stringify(map, null, 2) + "\n");
console.log(`[covers] ${Object.keys(map).length} stories: ${Object.values(map).filter((m) => m.photo).length} photos, ${Object.values(map).filter((m) => m.card.endsWith(".png") && m.card.startsWith("/covers/")).length} headline cards`);
