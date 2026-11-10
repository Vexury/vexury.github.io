---
title: "🌊 Stylized Water for Unity URP, v2"
date: 2026-11-10
summary: "My URP water grew from one Shader Graph into a whole system: sea, lake and river, a ripple simulation with wakes, a waterfall with volume, an underwater view, rain and night."
preview_image: /images/URP_Water2/Water2_split.jpg
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}{% if ongoing %} (ongoing){% endif %}</p>

In June I wrote about [a water shader I built in Shader Graph](/posts/006_URPWaterShader/). It had four systems (depth color, shoreline foam, Gerstner waves and refraction). When I started using it in an actual scene I noticed how much was still missing: you could not walk through it, nothing floated on it, there was only one kind of water and it stopped working the moment the camera went below the surface.

So I started over. This post is a tour through the second version. Most parts only get a clip and a few sentences, but I go a bit deeper for the ripple simulation, the foam and the waterfall.

<div style="text-align: center; margin: 1.5rem 0">
  <img src="{% thumb '/images/URP_Water2/Water2_split.jpg', 1100 %}" alt="Shallow lagoon with a fish school and seaweed under the surface" style="max-width:100%" loading="lazy">
</div>

## What changed since v1

The biggest change is that the water is handwritten HLSL now. I still really like Shader Graph for single effects, but this shader samples render textures from a compute simulation, sums waves in loops and shares a lot of code with other shaders (the waterfall, the underwater pass, the wet sand). In a graph that turned into a mess of wires very quickly.

The second change is that the water is a whole system now. There is one surface shader for all water and a handful of components around it: a wave set, a baked water map, a ripple simulation, buoyancy, a waterfall, fish, rain, night and an underwater view. Gameplay code asks one place (`WaterQuery`) for the surface height and the current at a position, so it does not have to care which water body it is standing in.

The look I was going for is the water in The Edge of Water. Most of it is close to physical (absorption with depth, strong refraction, a sky reflection with fresnel) and only the foam is stylized: pure white and clipped hard.

## Sea and shore

The sea still uses a sum of Gerstner waves, like v1. New is that the same wave set is evaluated on the CPU as well, so things can float on it. The crests also get foam where the waves compress the surface. I use the Jacobian of the Gerstner displacement for that (it gets small where the surface bunches up) and a large noise breaks it up, so that not every crest along a wave front turns white at once.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water2/Water2_sea.mp4" type="video/mp4">
</video>

At the beach the water runs up the sand and back again. That swash is analytic, so there is no simulation behind it. The ground has its own shader that knows how long ago the water was at each spot, which means the sand stays dark and wet for a while and then dries. The foam rides on the front of the water that just arrived and thins out with age.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water2/Water2_shore.mp4" type="video/mp4">
</video>

## One water map for sea, lake and river

The test island has a sea, a crater lake and a river that connects the two. They are at different heights and the river slopes. To make that work with one shader I bake a water map: a texture over the whole level that stores the ground height, the water height, how close the shore is and what kind of water it is. A second texture stores the flow.

Almost everything reads from these two maps. The ripple simulation gets its walls from them, the fish know where it is deep enough, floating crates drift with the current and the underwater view knows which water body the camera is in.

In the river the detail normals and the foam travel with the current. White water was the tricky part here. My first version put it wherever the water was fast, which covered the whole rapids in one white sheet. Now it is baked around rocks: a cushion where the current runs into a rock, streaks along its sides and a trail behind it (but nothing in the calm spot right behind the rock).

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water2/Water2_river.mp4" type="video/mp4">
</video>

## Ripples and wakes

I wanted the character to leave a wake when walking through the water, and when something falls in there should be rings that bounce off the shore.

I first thought about stamping ring sprites into a texture, but stamps do not spread and do not reflect. So I went with a real simulation: a compute shader solves the wave equation on a 512 x 512 grid that covers 40 m around the player and moves with them. Every step reads the last two height fields and writes the next one. Everything that touches the water pushes the height down a little where it is, and the rest happens by itself. The water map gives the simulation its walls, so the rings reflect at the beach and at rocks.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water2/Water2_wake.mp4" type="video/mp4">
</video>

In real water long waves are faster than short ones, and that is what gives a ship its V-shaped wake at a fixed angle. The wave equation does not do that, which surprised me at first. All waves run at the same speed and you only get a V when the thing that moves is faster than the waves. The half angle of the V is then `asin(wave speed / speed)`.

With my first settings the waves ran at about 2.1 m/s and the character walks at 2 m/s. That meant there was no V at all while walking, only a blob of small ripples that ran ahead of the character. I slowed the waves down to about 1.5 m/s. Now walking already draws a wide V and sprinting gives a narrow one that is close to the angle of a real wake.

## One noise for all foam

Shore foam, crest foam, the foam behind the player and the white water in the river all go through the same noise. Each of them is only a mask that says how much foam there should be, and the noise decides where it breaks up. The result is clipped hard, so foam is either there or not. Because of that all the foam looks like it belongs together, no matter where it comes from.

I noticed how important that is when I added the one thing that did not follow the rule. I wanted a thin white line on the ripples as a stylized way to show the wave fronts. The first version drew the line wherever the simulation height was inside a small band:

```hlsl
float rippleLine = smoothstep(h0 - aa, h0 + aa, sim.height)
                 - smoothstep(h1 - aa, h1 + aa, sim.height);
```

That is a contour line like on a hiking map, and it also looked like one. Every wave got an outline (one line on the front and one on the back that met in a sharp tip), the line zigzagged where the wave height was close to the threshold and it popped off the moment a wave got too low. It also had no noise in it, so it looked like a vector drawing on top of the water.

<div style="text-align: center; margin: 1.5rem 0">
  <img src="{% thumb '/images/URP_Water2/Water2_line_before.jpg', 1100 %}" alt="Ripple line as a height contour: looped, zigzag outlines around each wave" style="max-width:100%" loading="lazy">

  Before: the line is a height contour.
</div>

The fix was to put the line on the ridge of the wave. Slope divided by curvature is roughly the distance to the ridge, so the line gets a width in meters and it does not matter how high the wave is. It fades in with the wave height and goes into the foam mask like everything else:

```hlsl
float crestDist = length(sim.gradient) / max(-sim.laplacian, 1e-4);
float rippleLine = saturate(1 - crestDist / _RippleLineWidth)
                 * smoothstep(_RippleLineHeight * 0.25, _RippleLineHeight, sim.height);
```

Now there is one strand per wave, the noise breaks it into pieces and it thins out when the wave gets weaker.

<div style="text-align: center; margin: 1.5rem 0">
  <img src="{% thumb '/images/URP_Water2/Water2_line_after.jpg', 1100 %}" alt="Ripple line as broken foam strands on the wave crests" style="max-width:100%" loading="lazy">

  After: foam strands on the crests.
</div>

## The waterfall

My first waterfall was a flat band with a scrolling texture. That was fine from the front, but from the side it was just a line.

So the curtain got volume. It is a flattened tube that follows the arc the water would really take when it leaves the edge, thin at the top (about 0.25 m) and 1 m thick at the bottom. The back of the tube is drawn first and shines through the glassy front. At the top the water is clear and blue, and on the way down it breaks up into white streaks.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water2/Water2_fall.mp4" type="video/mp4">
</video>

Where the water hits the lake there is a mass of foam. I made it an opaque mesh with a hard alpha clip, because that way it lands in the depth and color textures. The lake refracts it and you can even see it from below. On top of that, lumps of foam get thrown out of the impact. These are small meshes too (one instanced icosphere per lump that a noise makes lumpy and eats away over its lifetime). I tried billboards first, but from above they looked like a cloud of sprites.

The part I like most is in the pool. The foam flecks and the rings around the impact should run outwards, and my first version used the straight distance to the waterfall for that. With that, the foam went right through the rock pillars next to it. Now the waterfall bakes a small field from the water map: for every point in the pool the length of the way to the impact around the rocks (Dijkstra on the grid) and the direction of travel. The rings wrap around rocks, the water behind a rock is calmer and foam piles up on the side of a rock that faces the waterfall.

<div style="text-align: center; margin: 1.5rem 0">
  <img src="{% thumb '/images/URP_Water2/Water2_fall_reeds.jpg', 1100 %}" alt="Waterfall pouring into the crater lake, with lily pads and reeds in front" style="max-width:100%" loading="lazy">
</div>

## Below the surface

In v1 the camera could not go under water. Now there is an underwater view for shallow water (down to about 6 m), which is a camera component plus a renderer feature. For every pixel it checks if the point on the near plane is below the surface, so the waterline runs through the image as a wavy line when the camera is half in the water. Below it the scene gets darker with depth, gets caustics and fades into the water color. From below, the surface shows the sky inside Snell's window and mirrors the ground outside of it.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water2/Water2_dive.mp4" type="video/mp4">
</video>

The fish are a small GPU simulation without a neighbor search (so no real boids). Every fish has a slot on a ring that turns around a center, the center wanders through water that is deep enough and the fish scatter when the player or a crate comes close. I draw them as opaque low-poly meshes, so the water treats them like the ground: it refracts them, tints them with depth and puts caustics on them.

<div style="text-align: center; margin: 1.5rem 0">
  <img src="{% thumb '/images/URP_Water2/Water2_under.jpg', 1100 %}" alt="Underwater view with seaweed and a fish school" style="max-width:100%" loading="lazy">
</div>

Things under the water also gave me the nastiest bug of the project. Along the edges of fish and seaweed there were light specks. The water takes the color behind it and a depth for that pixel, and at an edge those two did not match: the color was already a blend of fish and seabed (MSAA), but the depth texture only knew one of them. So a fish pixel got the absorption of the seabed far behind it. I ended up writing a small pass that reads the depth samples of each pixel and keeps a near and a far surface with their coverage, and the water blends the two.

## Rain and night

Rain and night share one weather setup, so a rainy night works too. In the rain the sky closes, the sun dims, drops leave rings on the surface and the sand gets wet.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water2/Water2_rain.mp4" type="video/mp4">
</video>

At night there are fireflies over the water. Their reflection was a small problem of its own. The object reflections in the water are screen space and a firefly is much thinner than one step of the ray, so it never showed up. I solved that by letting each firefly draw its own mirror image on the surface.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water2/Water2_night.mp4" type="video/mp4">
</video>

## What is next

There is still a lot on the list. The open sea would look better with FFT waves, calm water needs planar reflections (screen space only sees what is on screen) and the underwater view does not work well in deep water yet. But I am quite satisfied with where the water is now, and it is ready to be dropped into a game!

<div style="text-align: center; margin: 1.5rem 0">
  <img src="{% thumb '/images/URP_Water2/Water2_lagoon.jpg', 1100 %}" alt="View from the lagoon back to the beach with palms and the waterfall in the distance" style="max-width:100%" loading="lazy">
</div>
