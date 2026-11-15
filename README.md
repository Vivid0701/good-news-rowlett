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
Stories are edited at **app.pagescms.org** (Pages CMS). Open the good-news-rowlett repository, then **Stories**.
- **Publish on the site** – off while writing; turn it on to put the story live.
- **Web address** – leave blank and it's made from the headline.
- Saving publishes the change within a couple of minutes.

Stories are stored in `src/data/stories.json`, and uploaded photos go to `public/images/`.

## Editor login
In Pages CMS, open the repository → **Collaborators** → invite the editor by email. Editors don't need a GitHub account and can only change stories and photos – not the site's design, settings or other collaborators.

## Setting it up on Netlify (one time)
1. Netlify → **Add new project → Import an existing project → GitHub → good-news-rowlett**.
2. Leave the settings as filled in (Base directory blank), then **Deploy**.
3. **Domain management → Add a domain → goodnewsrowlett.com**. If the domain is already attached to the Shop Rowlett First project, remove it there first.
4. At GoDaddy, point the domain to Netlify. Set the `@` A record to `75.2.60.5`, set the `www` CNAME to the new `.netlify.app` address, and turn off forwarding.
5. **Forms → enable form detection**, then redeploy. Under **Forms → Notifications**, add an email notification so tips and sign-ups reach you.
