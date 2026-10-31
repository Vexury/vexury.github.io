---
title: "🔮 The Very Serious Juniper Dev Game Jam: Six of Nyx + Big Tony's Epic Wheel"
date: 2026-06-27
summary: "Eight days in two teams at the same time: a 3D puzzle game with a glass sphere and a yoyo horde shooter."
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

The [Very Serious Juniper Dev Game Jam](https://itch.io/jam/theveryseriousjuniperdevgamejam) ran from June 19 to June 27, 2026, so a bit more than eight days. The theme was **Spin to Win**.

I had already planned to join with [Cxbane](https://cxbane.zone), my regular jam partner from Necrocure and Shrimp Away.
A few days before the start, a second team reached out because their programmer had dropped out and they needed someone on short notice. I said yes, so I spent the eight days on two projects at once, with two codebases and two teams.

## Six of Nyx

Six of Nyx is a 3D puzzle game where you control a large glass sphere with a marble trapped inside.
Each level is a floating platform puzzle with three stars and a finish goal.
The marble rolls freely inside the sphere, so you navigate by rotating the sphere.
In the second mode (marble-view) you control the marble directly, which you need when the sphere is in place and the marble has to reach something more precisely.

<div style="text-align:center; margin:1.5rem 0">
  <img src="{% thumb '/images/SixOfNyx/SixOfNyx_Screenshot_01.png', 1100 %}" alt="Six of Nyx gameplay" loading="lazy" style="max-width:80%">
</div>

### Controls

Getting the two control modes to feel right took longer than expected. Rotating a large sphere and steering a marble inside it are very different inputs, and we kept tuning the switch between them for the whole jam so it would not feel jarring.
In the end it felt good, but the level design did not always use both views. Some levels can be finished entirely from one view, and that would be the first thing to change with more time.

### The Mist Shader

The most interesting technical part is the volumetric mist inside the glass sphere.
It is a raymarching shader in Shader Graph with a custom HLSL file for the raymarching loop. Rays go through the sphere volume and sample 3D noise along the way, accumulating density to get soft cloud shapes that sit inside the curved glass.

I also hooked it up to a script for level transitions: when the scene changes, the script pushes the shader's color and density towards a dense red and fades it back to normal once the new level is loaded.
It is a small detail, but the transition looks much nicer than a hard cut.

<div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:1.5rem 0">
  <img src="{% thumb '/images/SixOfNyx/SixOfNyx_Screenshot_02.png', 550 %}" alt="Six of Nyx mist shader" loading="lazy" style="width:100%">
  <img src="{% thumb '/images/SixOfNyx/SixOfNyx_Screenshot_03.png', 550 %}" alt="Six of Nyx level" loading="lazy" style="width:100%">
</div>

<div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:1.5rem 0">
  <img src="{% thumb '/images/SixOfNyx/SixOfNyx_Screenshot_04.png', 550 %}" alt="Six of Nyx marble view" loading="lazy" style="width:100%">
  <img src="{% thumb '/images/SixOfNyx/SixOfNyx_Screenshot_05.png', 550 %}" alt="Six of Nyx sphere rotation" loading="lazy" style="width:100%">
</div>

## Big Tony's Epic Wheel

Big Tony is the humble owner of a mechanical museum who left his life of crime behind to follow his dream of silly gizmos, doohickeys and whatchamacallits.
But his past catches up with him and four old rivals show up, one wave at a time. Your weapon is a yoyo, and after each of the 10 waves you spin a wheel and get a buff or a second yoyo.

<div style="text-align:center; margin:1.5rem 0">
  <video autoplay loop muted playsinline style="max-width:80%">
    <source src="/images/BigTonysEpicWheel/BigTonysEpicWheel_Intro.mp4" type="video/mp4">
  </video>
</div>

I joined this team on short notice as their only programmer. The artists were doing their first jam, so some things took longer than planned and the last stretch was a crunch.
A few features did not make it in, and one more day would have helped the game a lot.

### Technical Work

There are three things I want to mention:

- A dithered death fade for the enemies. Dying enemies dissolve with a screen-space dither pattern on the alpha instead of disappearing instantly. Simple to implement and it adds a lot of game feel.
- A vignette linked to the player's HP. It scales a post-process vignette from zero at full health to heavy near death. No number is shown, the edges of the screen just get darker, and that works well as a danger signal without interrupting the action.
- Sprite flipbooks on 3D quads, which was the main structural challenge. All the character art was 2D sprite sheets, but the game runs in 3D. So every character is a camera-facing quad, and a shader steps through the frames of the sprite sheet based on an animation index and playback speed. That way the artists could keep their 2D workflow completely.

<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem; margin:1.5rem 0">
  <img src="{% thumb '/images/BigTonysEpicWheel/BigTonysEpicWheel_Shreenshot_01.png', 400 %}" alt="Big Tony's Epic Wheel gameplay" loading="lazy" style="width:100%">
  <img src="{% thumb '/images/BigTonysEpicWheel/BigTonysEpicWheel_Shreenshot_02.png', 400 %}" alt="Big Tony's Epic Wheel wave" loading="lazy" style="width:100%">
  <img src="{% thumb '/images/BigTonysEpicWheel/BigTonysEpicWheel_Shreenshot_03.png', 400 %}" alt="Big Tony's Epic Wheel wheel spin" loading="lazy" style="width:100%">
</div>

## Retrospective

Eight days in two teams is really exhausting. Each project got less attention than it would have with a full week, and keeping two designs, two codebases and two team chats in my head at the same time was a lot.
Finishing a jam is always satisfying though, and finishing two in the same week (and a bit) felt kind of strange, in a good way.

I would not do it again, at least not as the main programmer on both. I usually end up as main programmer and producer in whatever team I join, and splitting that across two projects means both of them suffer.
Next time it's one team with full focus.
