# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

1. **Hiring managers and recruiters** evaluating Moritz Grauer for rendering / graphics engineering roles. They skim on desktop between other candidates and need to judge technical depth quickly.
2. **Fellow graphics and game developers** who arrive through a post, a Shader Graph link, GitHub or a jam page and read in depth.
3. **Potential clients and partners for Vexury** (shader, lighting and VFX contracting) checking whether the work fits their project.

Players coming from itch.io, game jams or Puzzle Hustle also visit, but they are not the primary audience of the portfolio pages.

## Product Purpose

vexury.dev is the personal portfolio of Moritz Grauer (studio name Vexury): graphics programmer and game developer. Success means a visitor leaves with a clear, credible impression of his rendering and game development skill. Contact (email, CV, GitHub) matters, but it follows from that impression rather than being pushed.

## Positioning

The site shows work rendered by his own engine (VexEngine, Vulkan/C++ path tracer) and real shipped jam games, shaders and posts with technical depth. The evidence is original renders and write-ups, not claims.

## Operating Context

- Static site: Eleventy 3, Liquid templates, GitHub Pages, deployed on push to `main`. No backend, no client-side state beyond theme choice.
- Sections: home (hero, VexEngine render strip, life timeline), projects (filterable cards with media filmstrips, categories game-jams / games / rendering), posts (technical blog), CV page with PDF export, Shader Graph viewer, show tracker (personal horror/mystery list), Puzzle Hustle pages, legal pages.
- The Puzzle Hustle landing pages (`/get/`, `/puzzlehustle/`) deliberately use the app's own look and are outside the site theme.

## Capabilities and Constraints

- Refinement only: the existing identity is binding (monospace Inconsolata, warm off-white palette, accent `#FFA833`, dark mode via `[data-theme="dark"]`). Improve hierarchy, layout, detail, motion and mobile within it.
- All styles in one file, `src/css/style.css`, colors only through CSS variables.
- Page transitions: `.page-entering` fade on main and footer only; the header stays static on purpose. Native view transitions deferred for browser support.
- Images go through the build-time `thumb` shortcode (webp); image basenames must be unique.
- Open: whether an animation library (GSAP) is added. Decide only where CSS cannot do the job.

## Brand Commitments

- Name: Moritz Grauer, studio Vexury (vexury.dev, vexury.itch.io, github.com/Vexury).
- Voice: direct, factual, no hype. No em dashes in body text. Project descriptions say what it is, the context, and what he built.
- Posts are in English, titles with an emoji.

## Evidence on Hand

- VexEngine renders in `src/images/Engine/`.
- Project cards with images and videos in `src/projects/*.md` and `src/images/`.
- Technical posts in `src/posts/`, Shader Graph files in `src/files/shaders/`.
- CV in `src/cv.html` with PDF export.
- No testimonials, client logos or press exist. Do not invent any.

## Product Principles

1. The work is the proof: renders, games and write-ups lead, interface recedes.
2. A hiring manager should grasp the skill profile within the first screen and reach the strongest evidence in one step.
3. Depth is available but optional: skimmers and deep readers both get served.
4. Keep the existing identity; craft shows in precision, not in new decoration.
