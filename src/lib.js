import stories from "./data/stories.json";

export const SITE_NAME = "Good News Rowlett";
export const DISCLOSURE = "Good News Rowlett is a free, locally run community project. Stories are never paid for.";

// Add a story: copy one block in src/data/stories.json, give it a new "id" (the web address),
// and set "createdAt" to the date (milliseconds). Newest shows first.
export const goodNews = [...stories].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

export const fmtDate = (ms) => ms
  ? new Date(ms).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" })
  : "";
