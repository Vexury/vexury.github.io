---
version: 1
slug: "src-index-html"
primary_target: "src/index.html"
related_targets: []
---

Scope: vexury.dev home page (`src/index.html`), full redesign with its own visual world; since 2026-11-19 the same world runs site-wide (raw WebGL2 fog floor on the other pages, DESIGN.md records it). Visitor mode: Experience.
Audience: hiring managers for rendering roles first, then graphics/gamedev developers and Vexury clients.
Job: the work itself leads the first viewport, cinematic, rendered live in WebGL; reach VexEngine, Stylized Water and Puzzle Hustle in one scroll.
Proof: VexEngine offline renders (labelled as offline path traced), URP Water v2 clip, Puzzle Hustle screenshots, jam key art.
Constraints: amber stays (user). WebGL is the heart (user). Content lives in HTML and stays readable without WebGL or JS. Self-hosted libs and fonts.
Unresolved: none. Copy signed off by Moritz on 2026-11-19.

## Direction contract

THESIS: The home page is a console system menu in a black void: Moritz's projects drift as lit glass monoliths in fog, and scrolling glides the camera from one to the next, the chosen one swelling forward in amber. Refuses the hero-plus-card-grid portfolio.

OWN-WORLD: Void #070B12 ground, fog #0F1520, tower glass #A7B2C2 edges, core light #E6EBF2 text, white particle motes, amber #FFA833 only for the selected object, focus and primary action. Thin wide-tracked uppercase sans (Jost) for display and labels, Inconsolata only for measured data. Glass panels: 1px hairline borders, faint inner fill, no heavy blur.

STORY: Visitor lands in the field and sees real project art hanging in depth, reads who Moritz is, then glides through three rooms (VexEngine, Stylized Water, Puzzle Hustle), sees the rest of the work receding, ends on a system log of background and contact.

FIRST VIEWPORT: Full-bleed WebGL void. VexEngine monolith centre-right, glowing amber edges, its face showing an offline render; jam and app monoliths recede left and right into fog among empty glass towers. Left: MORITZ GRAUER in large thin tracked caps, role line, two-sentence bio, primary amber button "view my work", secondary links. Bottom bar: work stream list (project, year, discipline) that jumps the camera.

FORM: console-dashboard challenger (digital-design-canon-console-dashboard-atmosphere), competitive card chosen by the user over the assigned Safelight; seed:f8eaa1df5ff330be.

Signature interaction: scroll-scrubbed camera glide (three.js + GSAP ScrollTrigger) along a spline through project stations; the active monolith scales up, edges turn amber, others dim into fog. Motion grammar: constant slow mote drift, eased camera, pointer parallax; nothing else animates. Reduced motion: camera cuts between stations, motes still.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
