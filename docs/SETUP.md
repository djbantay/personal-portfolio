# Setup & operations

Everything needed to run, deploy and maintain DANIEL_OS. For what the project is and how it works, see the [README](../README.md).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Everything works locally with **no API keys**. The guestbook and hit counter use an in-memory store, and `ask`/`mail` reply that they're offline. Add keys to `.env.local` (copy `.env.example`) to turn things on.

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. On vercel.com: **Add New → Project → Import** the repo. There's nothing to configure; just hit Deploy.
3. **Storage:** Project → Storage → add **Upstash Redis** (free tier) and connect it. That powers the guestbook, the hit counter and every rate limit.
4. **Environment variables** (Project → Settings → Environment Variables), then redeploy:
   - `ANTHROPIC_API_KEY`: turns on `ask`
   - `RESEND_API_KEY`: turns on `mail` (see the notes in `.env.example`)
   - `ADMIN_TOKEN`: any long random string. It lets you delete guestbook entries and connect Spotify
   - `GITHUB_TOKEN` (optional): raises GitHub's rate limit for `git log`
5. Optional: add your own domain under Project → Settings → Domains.

## Features

| Where | What | Code |
|---|---|---|
| Terminal `git log` | your latest public GitHub commits (cached 10 min); `git log --career` shows the résumé version | `app/api/commits` |
| Terminal `ssh daniel@berkeley.edu` → `sign <msg>` | guestbook (links blocked, HTML stripped, 3 per 10 min per visitor); also a `guestbook` desktop window | `app/api/guestbook` |
| Taskbar | 90s visitor counter, counted once per browser session; `visitors` command | `app/api/hits` |
| Terminal `ask <question>` | Claude answers from your profile only; 8 per 10 min per visitor plus a daily cap | `app/api/ask` |
| Terminal `mail` | interactive name → email → subject → message (end with `.`), sent through Resend; 3 per hour per visitor | `app/api/mail` |
| Terminal `ssh` | "Last login: … from Oakland, CA" using Vercel's built-in location headers (approximate city, never stored) | `app/api/whereami` |
| Taskbar ♪ widget, `np` | what you're playing on Spotify (or your last track), refreshed every 45s, cached 30s server-side | `app/api/now-playing`, `lib/spotify.ts` |
| `/projects/<slug>` | MDX write-ups, linked from each project window | `content/projects/*.mdx` |
| Link previews | auto-generated retro cards for the home page and each project | `app/**/opengraph-image.tsx`, `lib/og.tsx` |

## Editing content

- **Everything about you** (bio, links, projects, experience, skills) lives in `lib/profile.ts`. The desktop, the `ask` AI, the project pages and the link previews all read from it.
- **Project write-ups:** `content/projects/<slug>.mdx`. Available components are `<Screenshot>`, `<Video>`, `<Stats>` and `<Note>`.
- **Screenshots:** drop images into `public/projects/<slug>/` with the filenames the MDX already references (e.g. `public/projects/wallflower/phone-alert.png`). Until then, a placeholder shows.
- **Repo / demo links:** add `repo` and `demo` to a project in `lib/profile.ts`.
- **Résumé:** replace `public/resume.pdf`.

## Connecting Spotify (one time)

Requires **Spotify Premium** on your account: Spotify's Development Mode apps stop working if the owner's Premium lapses.

1. Go to developer.spotify.com/dashboard → **Create app**. Any name works; check **Web API**.
2. **Redirect URI:** `https://YOUR-DOMAIN/api/spotify/callback`, which must exactly match the domain you'll visit in step 4 (e.g. `https://personal-portfolio-xyz.vercel.app/api/spotify/callback`).
3. Copy the **Client ID** and **Client secret** into Vercel as `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`, set `ADMIN_TOKEN`, then redeploy.
4. Visit `https://YOUR-DOMAIN/api/spotify/login?key=YOUR_ADMIN_TOKEN`, approve, and you're done. The token is saved in Redis and kept fresh automatically.

If the widget ever disappears (Spotify sign-ins expire periodically), just repeat step 4.

## Moderating the guestbook

```bash
curl -X DELETE "https://your-domain.com/api/guestbook?id=ENTRY_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Entry IDs are returned by `GET /api/guestbook`.

## Project layout

```
app/
  page.tsx, os-markup.ts     the DB-1 computer + desktop markup
  globals.css                all desktop styles
  api/{hits,guestbook,commits,ask,mail}/route.ts
  projects/[slug]/           write-up pages + their link previews
  opengraph-image.tsx        home link preview
public/os.js                 desktop behaviour (windows, terminal, easter eggs)
lib/                         profile data, storage, rate limiting, OG card
content/projects/            MDX write-ups
```

Tip: `https://your-domain.com/#desktop` skips the computer intro and goes straight to the desktop.
