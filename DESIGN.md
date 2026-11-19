---
name: vexury.dev
description: Portfolio of a graphics programmer, shown as a console system menu in a black void.
colors:
  amber: "#FFA833"
  amber-glow: "rgba(255, 168, 51, 0.35)"
  amber-soft: "rgba(255, 168, 51, 0.10)"
  void: "#070b12"
  fog: "#0f1520"
  haze: "#16202e"
  glass: "#a7b2c2"
  core: "#e6ebf2"
  dim: "#8e9aab"
  hairline: "rgba(167, 178, 194, 0.22)"
  hairline-strong: "rgba(167, 178, 194, 0.42)"
  pane: "rgba(15, 21, 32, 0.62)"
  pane-solid: "rgba(10, 15, 23, 0.96)"
  scrollbar: "#2a3546"
typography:
  display:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7.2vw, 6rem)"
    fontWeight: 200
    lineHeight: 0.98
    letterSpacing: "0.12em"
  headline:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 3rem)"
    fontWeight: 200
    lineHeight: 1.05
    letterSpacing: "0.14em"
  page-title:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3rem)"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: "0.02em"
  title:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.18em"
  subtitle:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.02em"
  body:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-light:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 300
    lineHeight: 1.65
  label:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
  group-label:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 500
    letterSpacing: "0.24em"
  data:
    fontFamily: "Inconsolata, monospace"
    fontSize: "0.84rem"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  xs: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "1.75rem"
  gutter: "clamp(1.25rem, 4vw, 3.5rem)"
components:
  button-primary:
    backgroundColor: "rgba(15, 21, 32, 0.5)"
    textColor: "{colors.amber}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.4rem"
    height: "2.75rem"
  button-secondary:
    backgroundColor: "rgba(15, 21, 32, 0.5)"
    textColor: "{colors.core}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 1.4rem"
    height: "2.75rem"
  button-secondary-hover:
    backgroundColor: "rgba(15, 21, 32, 0.8)"
    textColor: "{colors.core}"
  link-button:
    backgroundColor: "rgba(15, 21, 32, 0.5)"
    textColor: "{colors.core}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 0.95rem"
    height: "2.25rem"
  filter-chip:
    backgroundColor: "rgba(15, 21, 32, 0.5)"
    textColor: "{colors.dim}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 0.95rem"
    height: "2.25rem"
  filter-chip-selected:
    textColor: "{colors.amber}"
  glass-panel:
    backgroundColor: "{colors.pane}"
    textColor: "{colors.core}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
  header-band:
    backgroundColor: "rgba(7, 11, 18, 0.92)"
    textColor: "{colors.dim}"
    padding: "1.1rem clamp(1.25rem, 4vw, 3.5rem)"
  nav-link-active:
    textColor: "{colors.amber}"
  back-to-top:
    backgroundColor: "{colors.pane-solid}"
    textColor: "{colors.core}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.85rem"
---

# Design System: vexury.dev

## Overview

**Creative North Star: "The Console in the Void"**

Every page is a system menu floating in a black void. A fog floor grid and drifting white motes run behind the content in WebGL (the full three.js monolith scene on home, a light WebGL2 fog floor with dust everywhere else), and the content sits on top as lit glass: near-transparent fill, a single 1px hairline edge, no heavy blur. The type is thin, wide-tracked and uppercase where it names things, and plain light sans where it explains them. The work (renders, clips, screenshots) is the only saturated colour on screen.

Amber is light, not decoration. It is the glow on whatever the visitor has chosen: the monolith in front, the active filter, the current page in the nav, the primary action, the focus ring. Everything else stays in the cold blue-grey range between void and core light, so the one amber thing always reads as "this one". The site is dark only; there is no theme toggle. A warm paper theme exists solely for the CV PDF export.

The world refuses the hero-plus-card-grid portfolio on home, where the camera glides between project stations instead. The other pages keep conventional layouts (grid of project cards, post list, reading column) but dress them in the same glass, hairline and amber rules.

**Key Characteristics:**
- Black void ground (#070b12) with a live WebGL fog floor and motes behind every page; a CSS radial haze is the fallback.
- Glass panels: translucent fog fill, 1px blue-grey hairline, 8px corners.
- Jost for everything a person reads; Inconsolata only for years, measurements and code.
- Thin tracked uppercase for names and controls, light sentence-case for prose.
- Amber reserved for the selected object, focus and the primary action.
- Motion is slow and continuous in the background, quick and quiet (0.2s) on controls.

## Colors

A cold, nearly monochrome blue-grey ramp from void to core light, with one warm amber reserved for selection.

### Primary
- **Selection Amber** (amber): the light of the chosen object. Primary action text and edge, focus outline, active nav link, active filter chip, current work-stream item, active room panel edge, active table-of-contents marker, hall-of-fame poster frame, text selection background. Usually paired with its glow (amber-glow) as a soft box-shadow halo rather than as a fill.
- **Amber Tint** (amber-soft): a 10% wash for the CV award pill and the paper theme. Not a pattern to extend.

### Neutral
- **Void** (void): page ground, the colour the 3D scene and fog fade into, and the text colour on amber fills.
- **Fog** (fog): the base of every glass fill; panels are fog at 50 to 62% opacity.
- **Haze** (haze): the lit centre of the background radial gradient and the WebGL fog colour. Never a flat surface.
- **Core Light** (core): primary text and headings, hover state of secondary controls.
- **Tower Glass** (glass): body prose inside panels and the hero bio, secondary metadata; slightly cooler and softer than core.
- **Dim Readout** (dim): nav links at rest, group labels, dates, mono data, unselected chips.
- **Hairline** (hairline) and **Strong Hairline** (hairline-strong): the 1px edges. Hairline for dividers and quiet controls, strong hairline for panel and button edges.
- **Pane** (pane) and **Solid Pane** (pane-solid): glass fill for panels; the solid variant for overlays that must hide what is under them (nav sub-panel, back-to-top).

Scoped exceptions: the ShaderGraph viewer draws Unity's own neutral grey node-editor palette with per-type port colours, because it reproduces an editor. The paper theme (`html[data-paper]`, warm off-white #faf9f8, ink #2d2d2d) exists only for the CV PDF export and never appears on the live site.

### Named Rules
**The One Light Rule.** Amber marks exactly three things: the selected object (including the one under the pointer when pointing is choosing, as in the work stream and project cards), the focus ring, and the primary action. It is never a heading colour, a badge fill, or a hover tint on chrome like icons or the wordmark.

**The Cold Ground Rule.** Every neutral is a blue-grey from the void ramp. No warm greys, no pure black, no pure white text; core light (#e6ebf2) is the brightest text on the site.

## Typography

**Display / Body Font:** Jost (self-hosted variable, 100 to 900), fallback system-ui, sans-serif
**Data Font:** Inconsolata (self-hosted, 400 to 700), fallback monospace

**Character:** A geometric sans used thin and wide for names, like menu items on a console, and light for prose so the void stays dominant. The monospace is a measuring instrument: it appears only where a value is counted or typed.

### Hierarchy
- **Display** (200, clamp(3rem, 7.2vw, 6rem), 0.98, uppercase, tracked 0.12em): the name on the home first screen only.
- **Headline** (200, clamp(2rem, 3.6vw, 3rem), 1.05, uppercase, tracked 0.14em): home room titles and the system-log heading.
- **Page Title** (200, clamp(2rem, 4.6vw, 3.2rem), 1.05, uppercase, tracked 0.12em): visible h1 of standalone pages (Impressum, Puzzle Hustle, legal pages) and the CV name.
- **Post Title** (300, clamp(2rem, 4.2vw, 3rem), 1.12, tracked 0.02em, balanced wrap): h1 of posts, sentence case. Exception to the Thin Name Rule on purpose: post titles are full sentences with an emoji and run to two or three lines.
- **Title** (500, 1.05rem, uppercase, tracked 0.18em): h2 section headings in posts and pages.
- **Subtitle** (500, 1.12rem, tracked 0.02em): h3, card and post titles, sentence case.
- **Body** (400, 16px, 1.6): reading text; posts hold a 780px column. Panel prose and the hero bio drop to 300 weight at 1.65 line height in tower glass.
- **Label** (500, 0.7 to 0.78rem, uppercase, tracked 0.18 to 0.22em): every button, chip, nav link and back-to-top.
- **Group Label** (500, 0.66 to 0.72rem, uppercase, tracked 0.24 to 0.28em, dim): names a list or a panel's contents (work stream, contents, log groups).
- **Data** (Inconsolata 400, 0.84rem, tabular figures, dim): years, durations, version numbers, code.

### Named Rules
**The Measured Mono Rule.** Inconsolata is for values and code only. If the text would still make sense read aloud as a sentence, it is Jost.

**The Thin Name Rule.** Uppercase tracking is for things that name or operate (names, room titles, controls, group labels). Prose is never uppercase.

## Layout

Content pages sit in a centred 1100px wrapper with a fluid side gutter (clamp(1.25rem, 4vw, 3.5rem)) and clear the fixed header with 7rem of top padding. Home drops the wrapper: the first screen is a full-height grid with the copy in the left third and the work stream as a bottom bar, then each room is a 170svh section whose panel pins at 20svh while the camera holds on its station, alternating left and right so the monolith owns the other side. The system log closes home as a three-column grid of log panels.

Project cards run in a three-column grid with 1.25rem gaps; a featured card spans two columns. Posts use one 780px column for text and media; from 1140px the table of contents moves into a sticky right aside with a hairline left edge.

Breakpoints: 640px (phones: single column, home header scrolls away, rooms stack with the panel under the monolith), 768px, 900px (log grid and project grid collapse), 1140px (post aside), plus `hover: none` where the nav sub-links become an inline row.

Spacing rhythm is rem-based: 0.5rem between chips and link buttons, 0.75rem between primary actions, 1.25rem between cards and inside small panels, 1.5 to 1.9rem inside large panels.

## Elevation & Depth

Depth comes from the scene, not from the panels. The WebGL fog floor, motes and (on home) monoliths provide real perspective behind the page; the HTML layer stays flat glass with hairline edges. Shadows exist in two roles: a soft black ambient drop under cards that lifts on hover, and an amber halo that is the selection light.

### Shadow Vocabulary
- **Ambient** (`0 1px 2px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.3)`): project cards, post list entries, poster cards at rest.
- **Ambient Raised** (`0 2px 4px rgba(0,0,0,0.5), 0 14px 34px rgba(0,0,0,0.45)`): the same on hover, and the nav sub-panel.
- **Selection Halo** (`0 0 0 1px rgba(255,168,51,0.15), 0 0 24px rgba(255,168,51,0.18)`): primary action at rest; intensifies to `0 0 0 1px rgba(255,168,51,0.35), 0 0 34px rgba(255,168,51,0.35)` on hover. Selected chips and stream items use a single 18 to 22px amber glow at about 0.16.
- **Room Hold** (`0 0 0 1px rgba(255,168,51,0.12), 0 30px 60px rgba(0,0,0,0.35)`): the room panel whose station the camera is holding.

### Named Rules
**The Glass Not Frost Rule.** Panels are translucent fog with a hairline edge. No backdrop blur, no gradient fills, no inner glow; the scene behind must stay visible.

**The Halo Is Selection Rule.** An amber glow means "chosen". A neutral control never glows.

## Shapes

Small, consistent radii on a strict ladder: 3px for thumbnails and the focus ring, 4px for media inside panels and inline code, 6px for every control and small floating panel (buttons, chips, nav sub-panel, pager links, back-to-top), 8px for glass panels and cards. Every container has exactly one 1px edge. Drawn geometry stays line-based: the nav sub-link elbow, the rotating chevron on disclosures, the ToC dash that lengthens and turns amber when active, and the slash prefix on the wordmark and nav links.

## Components

### Buttons
Quiet glass slabs with tracked uppercase labels; the primary one is lit.
- **Shape:** 6px corners, 1px edge, 2.75rem tall on home and post calls to action, 2.25rem for link buttons in cards and panels.
- **Primary:** amber edge and amber label over 50% fog glass, wrapped in the selection halo. One per view (enter the work, view shader graph).
- **Secondary:** strong-hairline edge, core label. Hover turns the edge core light and deepens the fill to 80%.
- **Link button:** the secondary style at chip size, optionally with a 12 to 14px inline SVG icon after the label (GitHub, play, blog post).
- **Focus:** the global 2px amber outline at 2px offset.

### Chips (Filters)
- **Style:** link-button geometry with a plain hairline edge and dim label.
- **State:** hover raises the edge to strong hairline and the label to core; the selected filter takes the amber edge, amber label and a soft amber glow.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** pane (fog at 62%).
- **Border:** 1px strong hairline; turns amber when the card is pointed at or selected.
- **Shadow Strategy:** Ambient at rest, Ambient Raised on hover (see Elevation).
- **Internal Padding:** 1.25rem for cards and list entries, 1.5 to 1.9rem for home room and log panels.
- **Variants:** project card (slideshow with a scrubber bar, title, description, link row), post list entry (text left, 200px image right), poster card (2:3 full-bleed artwork, labels on top), log panel (hairline-divided list rows with mono metadata), table of contents (inline panel, or a hairline-edged aside on wide screens).

### Navigation
- **Style:** a fixed header band (void at 92%, hairline bottom edge) with the slash-prefixed wordmark left and slash-prefixed tracked links right, then a hairline-separated row of 16px SVG icons.
- **States:** links rest in dim, hover to core, the current section is amber. Sub-links open as a solid pane panel under their parent on hover or focus.
- **Mobile / touch:** sub-links become an inline row; on home at phone width the header scrolls away with the first screen.

### Work Stream (signature)
The home bottom bar: three glass tiles, each a 64px thumbnail, a tracked project name and a dim meta line with a mono year. Hovering a tile or reaching its station turns its edge amber; clicking glides the camera to that station.

### Ambient Field (signature)
A fixed full-viewport canvas behind every page. Home runs the three.js scene (glass monoliths with project art, fog floor, motes, scroll-scrubbed camera, pointer parallax). Other pages run a raw WebGL2 fog-floor grid with dust that fades in over 1.2s, glides forward on scroll, pauses when the tab is hidden and draws one static frame under reduced motion.

## Do's and Don'ts

### Do:
- **Do** put every surface on glass: pane fill, one 1px hairline edge, 8px corners for panels, 6px for controls.
- **Do** keep amber for the selected object, the focus ring and the primary action, and show it as edge plus halo rather than fill.
- **Do** set names, titles and controls in thin or medium Jost uppercase with wide tracking (0.12 to 0.28em), and prose in light sentence case.
- **Do** use Inconsolata with tabular figures for years, durations and code, and nothing else.
- **Do** keep the background alive with the ambient field, and keep the page readable with the CSS radial haze when WebGL is missing.
- **Do** honour reduced motion: camera cuts between stations, motes and dust hold still, control transitions drop.
- **Do** keep control transitions at 0.2s on colour, border and shadow; use `cubic-bezier(0.16, 1, 0.3, 1)` for things that appear (sub-panel, canvas fade).

### Don't:
- **Don't** add a light theme or a theme toggle to the live site; the paper theme is for the CV PDF export only.
- **Don't** use amber on headings, badges, decorative chips or chrome hover states (wordmark, footer icons).
- **Don't** introduce warm greys, pure black or pure white; stay on the void to core ramp.
- **Don't** frost panels with backdrop blur or fill them with gradients.
- **Don't** set prose in Inconsolata or in uppercase.
- **Don't** place a small tracked label above a headline as a kicker; group labels name a list or panel, not a title.
- **Don't** use emoji or glyph characters as UI icons; controls and links use inline SVG.

### Recorded exceptions
- **Emoji in titles.** Post and project titles carry an emoji by brand commitment (PRODUCT.md). It is part of the title text, not an icon system, and stays.
- **Show tracker amber.** Hall-of-fame poster frames, rating badges and production pills stay amber as defined in the tracker conventions (CLAUDE.md). The tracker is a personal list, and amber there means "chosen", which is the One Light Rule read loosely.
