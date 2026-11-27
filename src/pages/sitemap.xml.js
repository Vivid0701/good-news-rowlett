import { goodNews } from "../lib.js";

// Every published story, with its date so search engines know what's new.
export function GET({ site }) {
  const day = (ms) => new Date(ms).toISOString().slice(0, 10);
  const newest = goodNews.reduce((m, g) => Math.max(m, g.createdAt || 0), 0);
  const pages = [
    { path: "/", lastmod: newest },
    { path: "/about" },
    { path: "/share" },
    ...goodNews.map((g) => ({ path: `/${g.id}`, lastmod: g.createdAt })),
  ];
  const urls = pages.map((p) => `  <url><loc>${new URL(p.path, site).href}</loc>${p.lastmod ? `<lastmod>${day(p.lastmod)}</lastmod>` : ""}</url>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } });
}
