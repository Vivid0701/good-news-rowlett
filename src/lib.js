import stories from "./data/stories.json";

export const SITE_NAME = "Good News Rowlett";
export const DISCLOSURE = "Good News Rowlett is a free, locally run community project. Stories are never paid for.";

export const slugify = (s) => String(s || "").toLowerCase().replace(/&/g, "and").replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "story";

// Dates are stored as "2026-10-04". Noon keeps the day right in any time zone.
const toTime = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00`).getTime() : 0);

// Stories are edited in Pages CMS (or directly in src/data/stories.json).
// Only stories marked "publish" appear. A blank web address is made from the title.
const used = new Set();
export const goodNews = stories
  .filter((g) => g && g.title && g.publish !== false)
  .map((g, i) => {
    let id = slugify(g.id || g.title), n = 2;
    while (used.has(id)) id = `${slugify(g.id || g.title)}-${n++}`;
    used.add(id);
    return { ...g, id, createdAt: toTime(g.date), _i: i };
  })
  .sort((a, b) => (b.createdAt - a.createdAt) || (a._i - b._i));

export const fmtDate = (ms) => ms
  ? new Date(ms).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  : "";
