# Arathana R K — Portfolio

A premium, responsive personal portfolio for Arathana R K — AI & Data Science student,
Java developer in the making. Built with plain HTML, CSS and JavaScript. No frameworks,
no build step, no dependencies.

## Project structure

```
├── index.html          # the whole page (all sections)
├── style.css           # design system + all styles
├── script.js           # typewriter, animations, menu, form
└── assets/
    ├── images/         # profile.jpg, favicon, project images
    └── resume/         # Resume.pdf
```

## Run locally

Just open `index.html` in a browser — the site is fully static.

For a live-reload-style server (recommended), run any static server from this folder,
for example:

```bash
# Python
python -m http.server 8000
```

then visit `http://localhost:8000`.

## Deploying

### Option 1 — GitHub Pages (free, 5 minutes)

1. Create a GitHub repository named `portfolio` and push this folder to it.
2. Go to the repo → **Settings** → **Pages**.
3. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
4. Wait ~1 minute. Your site is live at:
   **https://arathana29.github.io/portfolio/**

The `.nojekyll` file in this repo tells GitHub Pages to serve the site as-is.

The Open Graph `og:url` in `index.html` is already set to this address.

### Option 2 — Netlify (free, drag-and-drop)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag this project folder onto the page.
3. Done — Netlify gives you a URL instantly. You can connect your GitHub repo
   later for auto-deploys on every push.

### Before you go live

- The resume file (`assets/resume/Resume.pdf`) must be a real PDF — replace the
  placeholder if it isn't already.
- Swap `project1.jpg` / `project2.jpg` in `assets/images/` if you want real
  screenshots in the project cards (the cards currently use elegant gradients).
