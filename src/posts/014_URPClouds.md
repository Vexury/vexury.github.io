---
title: "☁️ Raymarched Cumulus Clouds for Unity URP"
date: 2026-11-26
summary: "Puffy cumulus heaps for my water scene: distance fields of merged spheres, raymarched at half resolution, lit with multiple scattering and reflected in the water."
preview_image: /images/Clouds/clouds_lookout_day.jpg
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>

The sky in my [water scene](/posts/013_URPWaterV2/) used to be one flat cloud layer. That works for high, thin clouds and for the closed deck when it rains, but it never looked like the big puffy cumulus clouds you see on a summer day. So I added a second kind of cloud on top of it: cumulus heaps that are actual volumes, raymarched in a renderer feature.

The flat layer is still there. It keeps the high, far clouds and the rain deck at 700 m. The heaps stay below that deck and carry the sky in front of it.

<video class="lazy-video" loop muted playsinline preload="none" poster="{% thumb '/images/Clouds/clouds_lookout_day.jpg', 1100 %}" style="width:100%; aspect-ratio:16/9; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/Clouds/clouds_lookout_day.mp4" type="video/mp4">
</video>

## A field of heaps

The heaps are placed on a honeycomb grid that drifts with the wind. A hash per cell decides whether the cell holds a cluster, how many heaps it has (one to three, merged into one body) and what they look like. Because it is all derived from the hash, the field is deterministic and I can build it around any camera every frame.

A single heap is a handful of spheres. There is a base row of four to seven spheres on a slightly oval ring (randomly rotated) with one more in the middle, then two or three smaller domes on top and sometimes a small cap. The radii follow the height of the heap and not its width, so the heaps come out broad and flat. The towers in my first prototype were too tall, so now a heap is at most half as tall as it is wide.

Each cluster also sits on its own flat base at a slightly different altitude. With one shared base height all the bottoms lined up into one flat ceiling.

Nothing pops in or out. Clusters swell in at the edge of the field (4 km around the camera in this scene) and when the coverage goes up, and they shrink away the same way. There is also a cap on how many clusters are kept (the nearest ones win), and the ones near that cap shrink away too.

One thing I tried and dropped was letting clusters overlap. They are traced as separate boxes, so where two of them intersect one has to be painted over the other. That gave a hard seam that flipped in a single frame whenever the camera crossed the line where their order swapped. Now clusters always stay inside their own cell.

<video class="lazy-video" loop muted playsinline preload="none" poster="{% thumb '/images/Clouds/clouds_overhead.jpg', 1100 %}" style="width:100%; aspect-ratio:16/9; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/Clouds/clouds_overhead.mp4" type="video/mp4">
</video>

## Shape and light

The shape of a cluster is a signed distance field: a smooth minimum over its spheres, cut off by the flat base. On top of that two layers of Worley noise (billows and finer detail) push the surface in and out. The noise is a baked, tileable 64³ texture of inverted Worley fbm. Near the base the billows get weaker, so the bottom stays flat like a real cumulus.

The march uses sphere tracing while the ray is outside a heap and fixed 6.5 m steps inside. Beyond 600 m the steps grow with distance, up to four times as long. For the lighting every step does a short light march of five steps towards the sun (starting at 12 m and doubling each time).

The scattering is the usual set of tricks for clouds:
- three octaves of multiple scattering
- a dual-lobe Henyey-Greenstein phase function, so the edges light up when you look towards the sun
- a powder term
- ambient light from a tinted underside up to the sky color, taken from the ambient probe

Far heaps melt into the scene color behind them over 5 km, so the field does not end in a hard line at the horizon.

<video class="lazy-video" loop muted playsinline preload="none" poster="{% thumb '/images/Clouds/clouds_beach_dawn.jpg', 1100 %}" style="width:100%; aspect-ratio:16/9; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/Clouds/clouds_beach_dawn.mp4" type="video/mp4">
</video>

## Rendering at half resolution

The heaps are drawn by a renderer feature before the transparents. Every cluster is one instanced box, drawn back to front into half-resolution targets: premultiplied color with the transmittance in alpha, plus the nearest hit stored as 1/distance (max-blended, so the closest one wins). Each half-res pixel traces up to the farthest scene depth of its 2x2 block.

The composite back to full resolution has to be careful around thin geometry like palm fronds. Every full-res pixel only uses the half-res samples whose nearest hit lies in front of its own scene depth, so the fronds keep their silhouette against the clouds. There is no temporal history, every frame is traced from scratch.

## Reflections and shadows

For the water reflection a second pass traces the heaps over the upper hemisphere into a small 512 x 128 map, from the water level under the camera. The water shader samples that map after the flat clouds and blurs it through the mips with the same roughness as the sky reflection.

<video class="lazy-video" loop muted playsinline preload="none" poster="{% thumb '/images/Clouds/clouds_sea_dusk.jpg', 1100 %}" style="width:100%; aspect-ratio:16/9; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/Clouds/clouds_sea_dusk.mp4" type="video/mp4">
</video>

For shadows the heaps write their vertical transmittance into the cloud shadow texture of the flat layer. The shadows fall straight down below the heaps.

## Day cycle and weather

The look comes from the sky material, so the moods and the day cycle carry it automatically. During the day the heaps run at full coverage and the flat layer is switched off, because it simply could not keep up with the heaps next to it. Dawn and dusk have about half the coverage (dawn also gets a warm tint), and the night has a blue tint and less ambient light.

<video class="lazy-video" loop muted playsinline preload="none" poster="{% thumb '/images/Clouds/clouds_timelapse.jpg', 1100 %}" style="width:100%; aspect-ratio:16/9; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/Clouds/clouds_timelapse.mp4" type="video/mp4">
</video>

<video class="lazy-video" loop muted playsinline preload="none" poster="{% thumb '/images/Clouds/clouds_night.jpg', 1100 %}" style="width:100%; aspect-ratio:16/9; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/Clouds/clouds_night.mp4" type="video/mp4">
</video>

When it rains the coverage of the heaps goes down to zero, so they dissolve under the closed rain deck.

## Cost and what is still missing

On my RTX 4070 Ti at 2560 x 1440 the heaps (including the composite and the reflection map) took under 1 ms in the normal views with a lighter setting, and about 1.9 ms when looking straight up under a heap. The dense sky in these clips packs a lot more clusters, and that is somewhere around 2.5 ms. I still have to measure that properly.

Some things are still open:
- Clusters do not shadow each other.
- Right below a heap the flat base reads as a soft grey mass.
- At night the heaps might glow a bit too bright under the moon.
- When the field is packed very tightly, the honeycomb shows from above as diagonal rows.

If you build something similar, be careful with changing GPU buffer layouts while the editor runs. I changed the layout of the cluster buffer while the editor was running, and for a moment the new shader read the old, shorter buffer. It looped over garbage sphere counts and took the GPU down with it (device removed, editor crash). The loop is capped now.
