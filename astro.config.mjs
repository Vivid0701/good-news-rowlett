import { defineConfig } from "astro/config";

// The public address that links, sharing previews and the sitemap point to.
export default defineConfig({
  site: process.env.SITE_URL || "https://goodnewsrowlett.com",
  output: "static",
  trailingSlash: "never",
  build: { format: "file" },
});
