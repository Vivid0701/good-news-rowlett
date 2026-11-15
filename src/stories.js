// Shared by the site and by scripts/covers.mjs so both agree on each story's web address.
// Each story is one JSON file in src/data/stories/ (Pages CMS edits them there).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const slugify = (s) => String(s || "").toLowerCase().replace(/&/g, "and").replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "story";

// Dates are stored as "2026-10-04". Noon keeps the day right in any time zone.
const toTime = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00`).getTime() : 0);

// Only stories marked "publish" appear. A blank web address is made from the headline.
// Newest date first; stories on the same date keep their "order" (higher first), then A–Z.
export function prepare(stories) {
  const used = new Set();
  return stories
    .filter((g) => g && g.title && g.publish !== false)
    .sort((a, b) => (toTime(b.date) - toTime(a.date)) || ((+b.order || 0) - (+a.order || 0)) || String(a.title).localeCompare(String(b.title)))
    .map((g) => {
      const base = slugify(g.id || g.title);
      let id = base, n = 2;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);
      return { ...g, id, createdAt: toTime(g.date) };
    });
}

export function readStories(dir) {
  return prepare(readdirSync(dir).filter((f) => f.endsWith(".json"))
    .map((f) => { try { return JSON.parse(readFileSync(join(dir, f), "utf8")); } catch { console.warn(`[stories] skipped ${f}: not valid JSON`); return null; } }));
}
