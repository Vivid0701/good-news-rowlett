// Shared by the site and by scripts/covers.mjs so both agree on each story's web address.
import { readFileSync } from "node:fs";

export const slugify = (s) => String(s || "").toLowerCase().replace(/&/g, "and").replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "story";

// Dates are stored as "2026-10-04". Noon keeps the day right in any time zone.
const toTime = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00`).getTime() : 0);

// Only stories marked "publish" appear. A blank web address is made from the headline.
export function prepare(stories) {
  const used = new Set();
  return stories
    .filter((g) => g && g.title && g.publish !== false)
    .map((g, i) => {
      const base = slugify(g.id || g.title);
      let id = base, n = 2;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);
      return { ...g, id, createdAt: toTime(g.date), _i: i };
    })
    .sort((a, b) => (b.createdAt - a.createdAt) || (a._i - b._i));
}

export const readStories = (path) => prepare(JSON.parse(readFileSync(path, "utf8")));
