# Good News Rowlett

The stand-alone Good News Rowlett site for goodnewsrowlett.com. It runs as its own Netlify site and doesn't depend on Shop Rowlett First.

## Pages
- `/` – all stories, newest first
- `/<story-id>` – each story, with Facebook share and copy-link buttons
- `/share` – readers send in good news (Netlify form "good-news-tip", photo upload allowed)
- `/subscribe` – email sign-up (Netlify form "good-news-email")
- `/about` – what Good News Rowlett is, and what it publishes

Old Shop Rowlett First links (`/good-news/...`) redirect here automatically.

## Adding a story
Stories are in `src/data/stories.json`. Copy one block, then change:
- `id` – the web address, lowercase with dashes (for example `teacher-of-the-year`)
- `title`, `excerpt` (one sentence), `body` (blank line between paragraphs; lines starting with "- " become a list)
- `cover` – an image in `public/` (1200 x 630), and `coverAlt`
- `createdAt` – the date in milliseconds
- `sources` – optional, a list of `{ "name": "...", "url": "..." }`

Saving the change on GitHub publishes it within a couple of minutes.

## Setting it up on Netlify (one time)
1. Netlify → **Add new project → Import an existing project → GitHub → good-news-rowlett**.
2. Leave the settings as filled in (Base directory blank), then **Deploy**.
3. **Domain management → Add a domain → goodnewsrowlett.com**. If the domain is already attached to the Shop Rowlett First project, remove it there first.
4. At GoDaddy, point the domain to Netlify. Set the `@` A record to `75.2.60.5`, set the `www` CNAME to the new `.netlify.app` address, and turn off forwarding.
5. **Forms → enable form detection**, then redeploy. Under **Forms → Notifications**, add an email notification so tips and sign-ups reach you.
