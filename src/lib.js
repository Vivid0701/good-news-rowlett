import stories from "./data/stories.json";
import covers from "./data/covers.json";
import { prepare } from "./stories.js";

export const SITE_NAME = "Good News Rowlett";
export const DISCLOSURE = "Good News Rowlett is a free, locally run community project. Stories are never paid for.";

// Stories are edited in Pages CMS (or directly in src/data/stories.json).
// cover = the 1200 x 630 card image; photo = the larger image shown on the story page.
// Both are made by scripts/covers.mjs before each build.
export const goodNews = prepare(stories).map((g) => {
  const c = covers[g.id] || {};
  return { ...g, cover: c.card || "/good-news-card.png", photo: c.full || c.card || "/good-news-card.png", coverAlt: g.coverAlt || g.title };
});

export const fmtDate = (ms) => ms
  ? new Date(ms).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  : "";
