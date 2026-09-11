---
name: new-post
description: Create a new blog post for vexury.dev (Eleventy 3, Liquid templates). Use when writing, adding or formatting a post under src/posts.
---

# Skill: New Blog Post

Create a new blog post for vexury.github.io (Eleventy 3, Liquid templates).

## File location & naming

`src/posts/NNN_SlugName.md`

- `NNN` = zero-padded integer, one higher than the current highest (check `src/posts/` to find the current max)
- Slug = PascalCase or hyphenated, matching the post subject
- Examples: `005_NewPost.md`, `006_GGJ-2027.md`
- Sort order in the listing is by `date` descending (frontmatter field), not by filename number

## Frontmatter

```yaml
---
title: "Emoji Title Here"
date: YYYY-MM-DD
summary: "One sentence shown in the posts listing."
preview_image: /images/Foo_001.png   # optional — used for listing thumbnail and og:image
ongoing: true                         # optional — appends "(ongoing)" to the date line
---
```

- `title` always starts with an emoji
- `summary` is one sentence, no trailing period needed
- No `layout`, `permalink`, or `tags` fields — Eleventy picks up posts automatically via `postsSorted` collection
- No `eleventyExcludeFromCollections` (that's only for `src/posts/index.html`)

## Body template

```liquid
# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}{% if ongoing %} (ongoing){% endif %}</p>

Post content here...
```

If the post has external links (game page, GitHub, etc.), insert a link-row **instead of** the `<p class="post-date">` line:

```html
# {{ title }}
<br>
<div class="link-row" style="margin-bottom: 1rem">
<a href="URL" class="link-btn">Game Page SVG_GAMEPAD</a>
<a href="URL" class="link-btn">GitHub SVG_GITHUB</a>
<a href="URL" class="link-btn">Play SVG_PLAY</a>
</div>
```

SVG icons to paste inline (copy from an existing post):
- **Game Page** — joystick controller icon (from `002_GGJ-2026.md` or `004_MiniJameGam.md`)
- **GitHub** — GitHub mark icon (from any post with a GitHub link)
- **Play** — circle with triangle icon (from `002_GGJ-2026.md`)

## Images

Full-width image (use width 1100):
```html
<div style="text-align: center; margin: 1.5rem 0">
  <img src="{% thumb '/images/Foo_001.png', 1100 %}" alt="Description" style="max-width:80%" loading="lazy">
</div>
```

Small / grid thumbnail (use 200–400):
```html
<img src="{% thumb '/images/Foo_001.png', 400 %}" alt="" style="max-width:30%" loading="lazy">
```

Lightbox-capable image (add class `lb`, include lightbox JS at bottom):
```html
<img class="lb" src="{% thumb '/images/Foo.png', 1100 %}" alt="..." style="max-width:100%" loading="lazy">
```

Image subfolder (e.g. for a game with many assets): `src/images/GameName/GameName_001.png` — path becomes `/images/GameName/GameName_001.png`.

## Videos

```html
<video autoplay loop muted playsinline style="max-width:80%">
  <source src="/images/Foo.mp4" type="video/mp4">
</video>
```

Videos are **not** processed by the thumb shortcode — use the raw `/images/` path directly.

## Table of contents

Generated automatically when the post has 2 or more `## h2` headings. No action needed.

## Linking back from the project card

After creating the post, add a `Blog Post` link to the matching project in `src/projects/NNN_Name.md`:

```yaml
links:
  - label: Blog Post
    url: /posts/NNN_SlugName/
```

## Checklist

1. Find current highest `NNN` in `src/posts/` and increment by 1
2. Create `src/posts/NNN_SlugName.md` with correct frontmatter
3. Write body: start with `# {{ title }}`, then date line or link-row
4. Add images to `src/images/` (or a subfolder) — thumbnails generate at build time
5. If linking from a project card, update that project's frontmatter
6. Run `npm start` to verify locally
