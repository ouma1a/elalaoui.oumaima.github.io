# Portfolio — O. El Alaoui

A fast, responsive personal portfolio built with plain HTML, CSS, and vanilla JavaScript. No build step, no framework — loads instantly and deploys free to GitHub Pages.

## Features
- Responsive layout (mobile → desktop)
- Dark / light theme toggle (saved to localStorage)
- Scroll-reveal animations
- Easy to edit: add a project by copying one `<article class="card">` block in `index.html`

## Run locally
Just open `index.html` in a browser. Or serve it:
```bash
# Python
python -m http.server 5500
# then visit http://localhost:5500
```

## Deploy to GitHub Pages
1. Push this repo to GitHub (e.g. a repo named `portfolio` or `<username>.github.io`).
2. Go to **Settings → Pages**.
3. Set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Your site goes live at `https://<username>.github.io/portfolio/`.

## Customize
- **Name / bio / links:** edit the text in `index.html` (search for `EDIT` comments).
- **Projects:** copy a `.card` block in the Projects section.
- **Colors:** tweak the CSS variables at the top of `styles.css`.
