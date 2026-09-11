---
name: pre-deploy
description: Pre-deployment checklist for vexury.dev. Use before pushing to main, since a push to main builds and deploys the site via GitHub Actions.
---

# Skill: Pre-Deployment Checklist

Run this before pushing to `main`. Deployment is fully automated: a push to `main` triggers the GitHub Actions workflow (`.github/workflows/build.yml`) which runs `npm run build` on Ubuntu and deploys the `_site/` output to GitHub Pages. There is no manual deploy step.

Work through each section below, run the checks, and surface any failures before pushing.

---

## 1. Branch

```powershell
git branch --show-current
```

Must be `main`. If not, merge or switch before pushing.

---

## 2. Local build

```powershell
npm run build
```

- Must exit with no errors.
- Warnings for missing images (e.g. `[thumb] Could not process`) mean a source image path in a frontmatter `images:` list or a `{% thumb %}` call is wrong — fix the path before pushing.
- The build generates thumbnails into `_site/images/thumbs/` via the `{% thumb %}` shortcode; no separate script needed for the GitHub Actions build.

---

## 3. Source images committed

For every new image or video referenced in posts or project cards:

```powershell
git status src/images/
```

All source files under `src/images/` must be tracked (not untracked). Untracked images will be missing on GitHub Actions because the runner clones the repo.

---

## 4. `_site/` is not staged

```powershell
git diff --cached --name-only
```

No path starting with `_site/` should appear. The Actions runner regenerates `_site/` from scratch; committing it causes conflicts and bloat. If any `_site/` files are staged, unstage them:

```powershell
git reset HEAD _site/
```

---

## 5. Content checks

Scan new or changed Markdown files:

**No em-dashes** — search for `—` (U+2014):
```powershell
git diff HEAD -- 'src/**/*.md' | Select-String "—"
```
Replace any match with a comma, colon, or rewritten sentence.

**Post frontmatter** — every new `src/posts/NNN_Name.md` must have:
- `title` (starts with an emoji)
- `date` (YYYY-MM-DD)
- `summary` (one sentence)

**Project frontmatter** — every new `src/projects/NNN_Name.md` must have:
- `permalink: false`
- `tags: projects`
- At least one entry in `images:`

**Cross-links** — if a new blog post matches an existing project card, confirm the project's frontmatter has a `Blog Post` link pointing to `/posts/NNN_SlugName/`.

---

## 6. CV (if updated)

If `src/cv.html` or CV-related CSS was changed:

```powershell
npm run export-cv
```

This generates `src/files/CV_Vexury_light.pdf` and `src/files/CV_Vexury_dark.pdf`. Commit those PDFs if the output changed.

---

## 7. Visual spot-check

```powershell
npm start
```

Open `localhost:8080` and verify:
- New post or project card appears and renders correctly.
- Images load (no broken img placeholders).
- Navigation and theme toggle still work.
- No obvious layout breakage on both light and dark themes.

Stop the server (`Ctrl+C`) when done.

---
