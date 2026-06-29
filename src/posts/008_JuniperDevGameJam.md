---
title: "🔮 The Very Serious Juniper Dev Game Jam: Six of Nyx + Big Tony's Epic Wheel"
date: 2026-06-27
summary: "Eight days, two teams, two games: a 3D glass sphere puzzle and a yoyo horde shooter. Twice the output, twice the stress."
preview_image: /images/JuniperJam_Split.png
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>
<div class="link-row" style="margin-bottom: 1rem">
<a href="https://vexury.itch.io/six-of-nyx" class="link-btn">Six of Nyx <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg></a>
<a href="https://github.com/Vexury/Six-Of-Nyx" class="link-btn">GitHub <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="vertical-align:-0.1em"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a>
<a href="https://vexury.itch.io/epic-wheel" class="link-btn">Big Tony's Epic Wheel <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg></a>
<a href="https://github.com/Vexury/Big-Tonys-Epic-Wheel" class="link-btn">GitHub <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="vertical-align:-0.1em"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a>
</div>

<div style="margin:1.5rem 0">
  <img src="{% thumb '/images/JuniperJam_Split.png', 1100 %}" alt="Six of Nyx and Big Tony's Epic Wheel" loading="lazy" style="width:100%">
</div>

The [Very Serious Juniper Dev Game Jam](https://itch.io/jam/theveryseriousjuniperdevgamejam) ran from **June 19 to June 27, 2026**, just over eight days. The theme: **Spin to Win**.

I had already planned to join with [Cxbane](https://cxbane.zone), my regular jam partner from Necrocure and Shrimp Away. A few days before the start, a second team reached out: their programmer had dropped out and they needed someone on short notice. I said yes. So I spent eight days split across two separate projects, two codebases, and two sets of team dynamics.

## Six of Nyx

Six of Nyx is a 3D puzzle game. The setup: you control a large glass sphere with a marble trapped inside it. Each level is a floating platform puzzle in 3D space with three stars and a finish goal. The marble rolls freely inside the sphere, so rotating the sphere is how you navigate. A second mode, marble-view, lets you switch to controlling the marble directly, which is needed when the sphere position is set and the marble needs more precise guidance to reach something.

<div style="text-align:center; margin:1.5rem 0">
  <img src="{% thumb '/images/SixOfNyx/SixOfNyx_Screenshot_01.png', 1100 %}" alt="Six of Nyx gameplay" loading="lazy" style="max-width:80%">
</div>

### Controls

Getting the two control modes to feel right took longer than expected. Rotating a large sphere and directly steering a marble inside it are very different input models, and blending between them without a jarring transition was something we kept tuning throughout the jam. We eventually landed on something that felt good, but the level design did not always make full use of the dual-view mechanic. Some levels could be completed entirely from one view, which flattens the concept. That is the clearest thing we would revisit with more time.

### The Mist Shader

The most technically interesting piece is the volumetric mist inside the glass sphere. It is a raymarching shader built in Shader Graph backed by a custom HLSL file for the raymarching loop. Rays are cast through the sphere volume and sample 3D noise as they travel, accumulating density to produce soft cloud shapes that sit naturally inside the curved glass surface.

I also wired it to a script for level transitions: when the scene changes, the script drives the shader's color and density toward a dense red, then fades it back to normal once the new level is loaded. It is a small touch, but it makes the transition feel deliberate rather than like a hard cut.

<div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:1.5rem 0">
  <img src="{% thumb '/images/SixOfNyx/SixOfNyx_Screenshot_02.png', 550 %}" alt="Six of Nyx mist shader" loading="lazy" style="width:100%">
  <img src="{% thumb '/images/SixOfNyx/SixOfNyx_Screenshot_03.png', 550 %}" alt="Six of Nyx level" loading="lazy" style="width:100%">
</div>

<div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:1.5rem 0">
  <img src="{% thumb '/images/SixOfNyx/SixOfNyx_Screenshot_04.png', 550 %}" alt="Six of Nyx marble view" loading="lazy" style="width:100%">
  <img src="{% thumb '/images/SixOfNyx/SixOfNyx_Screenshot_05.png', 550 %}" alt="Six of Nyx sphere rotation" loading="lazy" style="width:100%">
</div>

## Big Tony's Epic Wheel

Big Tony is the humble owner of a mechanical museum who set aside a life of crime to pursue his dream of silly gizmos, doohickeys and whatchamacallits. His past catches up with him: four old rivals show up, one wave at a time. Your weapon is a yoyo. After each of the 10 waves, you spin a wheel and get a buff or a second yoyo.

<div style="text-align:center; margin:1.5rem 0">
  <video autoplay loop muted playsinline style="max-width:80%">
    <source src="/images/BigTonysEpicWheel/BigTonysEpicWheel_Intro.mp4" type="video/mp4">
  </video>
</div>

I joined this team on short notice as their sole programmer. The artists were first-time jammers, which meant some things took longer to land than planned, and the final stretch of the jam was a crunch. There are features that did not make it in, and one more day would have made a real difference to the final state of the game.

### Technical Work

Three things are worth mentioning:

The **dithered death fade** is a dissolve shader for enemies. Instead of a hard destroy, dying enemies fade out using a screen-space dither pattern on the alpha. Simple to implement and it adds a lot of game feel.

The **HP-linked vignette** reads the player's current health and scales a post-process vignette from zero at full health to heavy near death. No number displayed, just growing screen pressure. It works well as a danger signal without interrupting the action.

The **sprite flipbooks on 3D quads** were the main structural challenge. All the character art was 2D sprite sheets, and the game runs in 3D. I built a system where each character renders as a camera-facing quad mesh, with a shader advancing through frames of the sprite sheet based on an animation index and playback speed. The artists could keep their 2D workflow entirely while the game rendered in 3D space.

<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem; margin:1.5rem 0">
  <img src="{% thumb '/images/BigTonysEpicWheel/BigTonysEpicWheel_Shreenshot_01.png', 400 %}" alt="Big Tony's Epic Wheel gameplay" loading="lazy" style="width:100%">
  <img src="{% thumb '/images/BigTonysEpicWheel/BigTonysEpicWheel_Shreenshot_02.png', 400 %}" alt="Big Tony's Epic Wheel wave" loading="lazy" style="width:100%">
  <img src="{% thumb '/images/BigTonysEpicWheel/BigTonysEpicWheel_Shreenshot_03.png', 400 %}" alt="Big Tony's Epic Wheel wheel spin" loading="lazy" style="width:100%">
</div>

## Retrospective

Eight days across two teams is genuinely exhausting. Each project got less attention than it would have with a full dedicated week, and keeping two design contexts, two codebases and two sets of team communication in parallel is a real cognitive load.

The output felt rewarding. Finishing a jam is always satisfying, and finishing two in the same window is a strange kind of double payoff.

That said, I would not do it again, at least not as primary programmer on both. I tend to end up as the main programmer and producer on whatever team I join, and splitting that role across two projects just means both take a hit. One team, full commitment, is the better call.
