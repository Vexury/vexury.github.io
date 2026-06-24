# vexury.github.io

Personal website and devlog: A place to share game dev projects, write about graphics and rendering, and document progress along the way.

Built with [11ty](https://www.11ty.dev/) and hosted on [GitHub Pages](https://pages.github.com/). Developed with assistance from [Claude](https://claude.ai) for scaffolding the project architecture and wiring up the build pipeline.

## Stack

- **11ty** — static site generator with Liquid templating
- **CSS** — single stylesheet, Inconsolata monospace font, warm off-white palette, `#FFA833` accent, dark mode via `data-theme="dark"`
- **@11ty/eleventy-img** — thumbnail generation (webp, 400px / 900px) during build
- **GitHub Actions** — deploy to GitHub Pages on push to `main`

## Features

- Project cards with slideshows and lightbox, sorted by filename descending
- Featured projects spanning two columns with larger thumbnails
- Blog posts with preview images
- Dark mode toggle (persisted via `localStorage`, fixed bottom-left)
- Entrance animation on first home page visit per session (`sessionStorage`)

## Development

Install dependencies:
```
npm install
```

Start local dev server (live reload, thumbnails generated on demand):
```
npm start
```

Build for production:
```
npm run build
```

Export CV as PDF (light and dark):
```
npm run export-cv
```

Output goes to `_site/`.

## Content

- `src/projects/*.md` — project cards (frontmatter only, `tags: projects`)
- `src/posts/*.md` — blog posts
- `src/images/` — source images; thumbnails are regenerated automatically during build
- `src/files/` — static files (CV, etc.)
