# Water Footprint Lab — Lab Website

Source for **https://WaterFootPrint-lab.github.io/** — the website for the
Water Footprint Lab (PI: Dr. Mesfin Mekonnen), Department of Civil,
Construction & Environmental Engineering, The University of Alabama.

It's a plain HTML/CSS/JS site — **no build step, no Node, no framework.**
Page content (team, projects, news, publications, positions) lives in
`/data/*.json`. Edit those files, commit, push — the live site updates.

---

## 1. One-time GitHub setup

This repo must be named **exactly** `WaterFootPrint-lab.github.io` and
live under a GitHub account/organization literally named `WaterFootPrint-lab`
(that's how GitHub Pages maps a repo to a root-level `https://<name>.github.io/` URL).

1. Create the GitHub org or user account `WaterFootPrint-lab` (if it doesn't exist yet).
2. Create a new repository there named `WaterFootPrint-lab.github.io`.
3. Push this folder's contents to the `main` branch (instructions below).
4. In the repo, go to **Settings → Pages** and confirm the source is
   **Deploy from a branch → `main` → `/ (root)`**. (User/org `*.github.io`
   repos are usually published automatically — no extra config needed.)
5. Visit `https://WaterFootPrint-lab.github.io/` after a minute or two.

### Pushing this project for the first time

```bash
cd WaterFootPrint-lab.github.io
git init -b main                      # skip if already a git repo
git add .
git commit -m "Initial site"
git remote add origin https://github.com/WaterFootPrint-lab/WaterFootPrint-lab.github.io.git
git push -u origin main
```

(If this folder already has a `.git` directory because it came pre-initialized,
just set the remote and push: `git remote add origin ...` then `git push -u origin main`.)

---

## 2. Day-to-day updates (the part you'll actually do)

Everything content-related is in `/data/`. You do **not** need to touch HTML
for routine updates.

| To do this...                          | Edit this file                | Notes |
|-----------------------------------------|--------------------------------|-------|
| Add a new Ph.D. student                 | `data/team.json`              | Add an object to the `students` array. Drop a photo in `assets/img/` and point `photo` at it. |
| Update the PI's bio / links             | `data/team.json`              | Edit the `pi` object. |
| Add a new project                       | `data/projects.json`          | Add an object to the array. `icon` can be `drop`, `map`, `crop`, `network`, or `scale`. |
| Post a news item / announcement         | `data/news.json`              | Add `{ "date": "YYYY-MM-DD", "title": "...", "body": "...", "tag": "...", "link": "" }`. Newest shows first automatically. |
| Add a published paper                   | `data/publications.json`      | Add `{ "year": 2026, "title": "...", "authors": "...", "venue": "...", "link": "https://doi.org/..." }`. Sorted by year automatically; the Publications page also gets a year filter automatically. |
| Open / close a position                 | `data/positions.json`         | Set `"status": "open"` or `"status": "closed"`. The homepage's "open positions" line updates automatically. |

After editing, save, then:

```bash
git add .
git commit -m "Add news: <short description>"
git push
```

The live site reflects the change within a minute or two (GitHub Pages cache
can occasionally take a few minutes longer).

### Adding real photos

Replace the placeholder SVGs in `assets/img/` (`pi-photo.svg`, `avatar-1.svg`
… `avatar-5.svg`) with real images — JPG or PNG work fine. Just update the
`photo` path in `data/team.json` to match the new filename, e.g.
`"photo": "assets/img/habtamu.jpg"`. Square images (roughly 600×600px or
larger) look best — they're cropped into circles/squares automatically.

---

## 3. Previewing changes locally before you push

From the project folder, run a tiny local server (needed because the page
loads `data/*.json` via `fetch`, which most browsers block on a bare
`file://` page):

```bash
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

(Any static server works — `npx serve`, VS Code's "Live Server" extension, etc.)

---

## 4. Project structure

```
WaterFootPrint-lab.github.io/
├── index.html              Home — hero, research questions, PI summary, previews
├── projects.html           Full projects grid
├── team.html                PI profile + full student grid
├── news.html                Full news/announcements feed
├── publications.html       Full publication list with year filter
├── positions.html          Open positions + "contact us" fallback
├── css/style.css           All styling — design tokens at the top of the file
├── js/main.js              Nav, scroll reveal, and all data-driven rendering
├── data/
│   ├── team.json           PI + Ph.D. students
│   ├── projects.json       Research projects
│   ├── news.json           Announcements
│   ├── publications.json   Papers
│   └── positions.json      Open/closed openings
└── assets/img/             Logo, hero artwork, photo/avatar placeholders
```

## 5. Notes on what's a placeholder right now

- **Student research-focus lines** in `data/team.json` are filled with
  bracketed placeholder text — replace each with the student's actual focus area.
- **PI's Google Scholar link** in `data/team.json` is a placeholder URL — swap in the real one.
- **Project links** (`#`) and some **publication links** (`#`) in the JSON
  files should be replaced with real DOIs/URLs as you go.
- **Photos** are initials-based SVG placeholders — see "Adding real photos" above.

Everything else (PI bio, the three guiding research questions, the seeded
publication list, nav structure, and styling) is real content, ready to ship.
