import covers from "./data/covers.json";
import { prepare } from "./stories.js";

export const SITE_NAME = "Good News Rowlett";
export const DISCLOSURE = "Good News Rowlett is a free, locally run community project. Stories are never paid for.";

// Each story is a file in src/data/stories/, edited in Pages CMS.
const files = import.meta.glob("./data/stories/*.json", { eager: true, import: "default" });

// cover = the 1200 x 630 card image; photo = the larger image shown on the story page.
// Both are made by scripts/covers.mjs before each build.
const withCovers = (g) => {
  const c = covers[g.id] || {};
  return { ...g, cover: c.card || "/good-news-card.png", photo: c.full || c.card || "/good-news-card.png", coverAlt: g.coverAlt || g.title };
};
export const goodNews = prepare(Object.values(files)).map(withCovers);
// Every story, drafts included – only used by the private preview pages.
export const allStories = prepare(Object.values(files), { all: true }).map(withCovers);

// Private preview address. Anyone with this link can see drafts, so don't share it.
export const PREVIEW_PATH = "/preview-r7k2q";

export const fmtDate = (ms) => ms
  ? new Date(ms).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  : "";
