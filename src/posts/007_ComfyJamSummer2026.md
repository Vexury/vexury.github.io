---
title: "🦐 Comfy Jam Summer 2026: Shrimp Away"
date: 2026-06-24
summary: "A shrimp escaping to the sea in an infinite runner built around a world-bending vertex shader and a jam limitation that the player can never actually win."
ongoing: true
preview_image: /images/ShrimpAway/ShrimpAway_01.png
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}{% if ongoing %} (ongoing){% endif %}</p>
<div class="link-row" style="margin-bottom: 1rem">
<a href="https://vexury.itch.io/shrimpaway" class="link-btn">Game Page <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg></a>
<a href="https://github.com/Vexury/ComfyJamSummer2026" class="link-btn">GitHub <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="vertical-align:-0.1em"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a>
</div>

The [Comfy Jam Summer 2026](https://itch.io/jam/comfy-jam-summer-2026) had two constraints: a **Summer** theme and a limitation called **"The instructions are a lie."** The game I built around those is Shrimp Away: you are a shrimp, freshly escaped from a tank on a truck, rolling down a sunlit beach toward the ocean. Roll as far as you can and make it home.

The lie is that you never will. The ocean is always ahead of you, and the instructions tell you to reach it, but you technically never move. The world moves instead, and a vertex shader makes that feel convincing.

<img src="{% thumb '/images/ShrimpAway/ShrimpAway_Screenshot_01.png', 1100 %}" alt="Shrimp Away gameplay screenshot" loading="lazy">

## The World Bend Shader

An infinite runner where the camera is fixed and obstacles approach the player is simple enough. The visual problem is that a flat plane stretching to the horizon looks exactly like what it is: a flat plane with a hard clip at the draw distance. That is not a beach. That is a corridor.

The fix is to curve the world. The vertex shader offsets every vertex's Y position downward based on its Z distance from the player, bending the geometry along a cylindrical arc. Objects close to the player sit at normal height. Objects further away are progressively lower, tucking below the horizon so the surface appears to curve away. Combined with the beach visuals and the camera angle, it reads as rolling across a round surface toward a distant ocean.

The important thing is that nothing in the game logic changes. Obstacles are still spawned at a fixed Z distance ahead, still move at a fixed speed toward Z = 0, and are despawned when they pass behind the player. The shader is purely visual. All the bending happens in the vertex stage; the actual world coordinates stay flat, so collisions and movement work without any correction.

<video autoplay loop muted playsinline style="max-width:100%">
  <source src="/images/ShrimpAway/ShrimpAway_WorldBend.mp4" type="video/mp4">
</video>

The curvature strength is a single parameter: the bend radius in world units. A large radius gives a subtle curve, a small radius bends aggressively. For a beach runner the setting is mild enough to feel natural but strong enough to hide the spawn distance cleanly.

## The Lie in Practice

Telling the player to reach the ocean and then making that structurally impossible fitted the limitation neatly. The game tracks how many meters you have rolled and submits the score to a global leaderboard, so there is real progression and competition, just no finish line. Players who read the description carefully will already know the catch. Players who do not will find out the longer they play.
