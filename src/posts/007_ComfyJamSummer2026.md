---
title: "🦐 Comfy Jam Summer 2026: Shrimp Away"
date: 2026-06-24
summary: "An infinite runner about a shrimp rolling towards an ocean it can never reach, with a vertex shader that bends the world."
ongoing: true
preview_image: /images/ShrimpAway/ShrimpAway_Cover.png
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}{% if ongoing %} (ongoing){% endif %}</p>
<div class="link-row" style="margin-bottom: 1rem">
<a href="https://vexury.itch.io/shrimpaway" class="link-btn">Game Page <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg></a>
<a href="https://github.com/Vexury/ComfyJamSummer2026" class="link-btn">GitHub <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="vertical-align:-0.1em"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a>
</div>

The [Comfy Jam Summer 2026](https://itch.io/jam/comfy-jam-summer-2026) had a **Summer** theme and the limitation **"The instructions are a lie."**
My game for it is Shrimp Away: you are a shrimp that just escaped from a tank on a truck and now rolls down a sunny beach towards the ocean. Roll as far as you can and make it home.

Of course you never make it home (that's the lie). The instructions tell you to reach the ocean, but it always stays ahead of you because you technically never move.
The world moves towards you instead, and a vertex shader makes that look convincing.

<img src="{% thumb '/images/ShrimpAway/ShrimpAway_01.png', 1100 %}" alt="Shrimp Away gameplay screenshot" loading="lazy">

## The World Bend Shader

The basic setup of an infinite runner is simple: the camera is fixed and the obstacles come towards the player.
The problem is that a flat plane going all the way to the horizon looks exactly like a flat plane with a hard cut at the draw distance, which is more of a corridor than a beach.

So I curved the world. The vertex shader moves every vertex down in Y depending on its Z distance to the player, which bends the geometry along a cylindrical arc.
Objects close to the player stay at their normal height, and objects further away sink lower and lower until they disappear below the horizon.
Together with the beach visuals and the camera angle, it looks like you are rolling over a round surface towards the ocean far away.

<a href="/projects/shadergraph/?file=WorldBend" class="sg-post-cta">View Shader Graph</a>

The game logic does not change at all. Obstacles still spawn at a fixed Z distance, move towards Z = 0 at a fixed speed and get despawned once they are behind the player.
All the bending happens in the vertex stage and the actual world coordinates stay flat, so collisions and movement work without any correction.

<video autoplay loop muted playsinline style="max-width:100%">
  <source src="/images/ShrimpAway/ShrimpAway_WorldBend.mp4" type="video/mp4">
</video>

The curvature is controlled by a single parameter, the bend radius in world units (large radius = subtle curve, small radius = strong bend).
For the beach I kept it mild, so it still looks natural but hides the spawn distance.

## The Lie in Practice

Telling the player to reach the ocean and then making it impossible fit the limitation nicely.
The game tracks how many meters you rolled and submits your score to a global leaderboard, so there is still progression and competition, just no finish line.
If you read the description carefully, you already know the catch. Otherwise you find out the longer you play.
