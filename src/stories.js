// Shared by the site and by scripts/covers.mjs so both agree on each story's web address.
// Each story is one JSON file in src/data/stories/ (Pages CMS edits them there).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const slugify = (s) => String(s || "").toLowerCase().replace(/&/g, "and").replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "story";

// Dates are stored as "2026-10-04". Noon keeps the day right in any time zone.
const toTime = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00`).getTime() : 0);

// "Position" (set in Pages CMS) puts stories in a chosen order: 1 is the top story, 2 next, and so on.
// Stories with no position come after those, newest date first.
const pos = (g) => { const n = parseInt(g.position, 10); return Number.isFinite(n) && n > 0 ? n : Infinity; };

// Only stories marked "publish" appear, unless { all: true } (used for private draft previews
// and for making cover images). A blank web address is made from the headline; published
// stories claim their addresses first so a draft can never take a live story's address.
// Newest date first; stories on the same date keep their "order" (higher first), then A–Z.
export function prepare(stories, { all = false } = {}) {
  const used = new Set();
  const sorted = stories
    .filter((g) => g && g.title)
    .sort((a, b) => ((pos(a) === pos(b) ? 0 : pos(a) - pos(b))) || (toTime(b.date) - toTime(a.date)) || ((+b.order || 0) - (+a.order || 0)) || String(a.title).localeCompare(String(b.title)));
  const ids = new Map();
  for (const g of [...sorted.filter((x) => x.publish !== false), ...sorted.filter((x) => x.publish === false)]) {
    const base = slugify(g.id || g.title);
    let id = base, n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id); ids.set(g, id);
  }
  return sorted
    .filter((g) => all || g.publish !== false)
    .map((g) => ({ ...g, id: ids.get(g), draft: g.publish === false, createdAt: toTime(g.date) }));
}

export function readStories(dir, opts) {
  return prepare(readdirSync(dir).filter((f) => f.endsWith(".json"))
    .map((f) => { try { return JSON.parse(readFileSync(join(dir, f), "utf8")); } catch { console.warn(`[stories] skipped ${f}: not valid JSON`); return null; } }), opts);
}
