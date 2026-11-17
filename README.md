# DANIEL_OS — Daniel Bantay's portfolio

A retro, terminal-driven portfolio: an isometric pixel-art computer you boot up, a desktop with draggable windows, a real terminal, and a bear.

Built with **Next.js (App Router) + TypeScript**, deployed on **Vercel**.

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
   - `GUESTBOOK_ADMIN_TOKEN`: lets you delete guestbook entries
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
| `/projects/<slug>` | MDX write-ups, linked from each project window | `content/projects/*.mdx` |
| Link previews | auto-generated retro cards for the home page and each project | `app/**/opengraph-image.tsx`, `lib/og.tsx` |

## Editing content

- **Everything about you** (bio, links, projects, experience, skills) lives in `lib/profile.ts`. The desktop, the `ask` AI, the project pages and the link previews all read from it.
- **Project write-ups:** `content/projects/<slug>.mdx`. Available components are `<Screenshot>`, `<Video>`, `<Stats>` and `<Note>`.
- **Screenshots:** drop images into `public/projects/<slug>/` with the filenames the MDX already references (e.g. `public/projects/wallflower/phone-alert.png`). Until then, a placeholder shows.
- **Repo / demo links:** add `repo` and `demo` to a project in `lib/profile.ts`.
- **Résumé:** replace `public/resume.pdf`.

## Moderating the guestbook

```bash
curl -X DELETE "https://your-domain.com/api/guestbook?id=ENTRY_ID" \
  -H "Authorization: Bearer $GUESTBOOK_ADMIN_TOKEN"
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
public/os.js                 desktop behaviour (windows, terminal, bear, easter eggs)
lib/                         profile data, storage, rate limiting, OG card
content/projects/            MDX write-ups
```

Tip: `https://your-domain.com/#desktop` skips the computer intro and goes straight to the desktop.
