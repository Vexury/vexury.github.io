---
title: "🌊 Customizable Unity URP Water Shader"
date: 2026-06-09
summary: "How I built a stylized water shader for URP in Shader Graph, with Gerstner waves, depth-based color, shoreline foam and screen-space refraction."
preview_image: /images/URP_Water/Water_01.png
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}{% if ongoing %} (ongoing){% endif %}</p>
<div class="link-row" style="margin-bottom: 1rem">
<a href="/projects/shadergraph/?file=StylizedGerstnerWater" class="link-btn">Shader Graph <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style="vertical-align:-0.1em"><circle cx="2" cy="6" r="1.5" fill="currentColor"/><circle cx="10" cy="3" r="1.5" fill="currentColor"/><circle cx="10" cy="9" r="1.5" fill="currentColor"/><line x1="3.5" y1="5.5" x2="8.5" y2="3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3.5" y1="6.5" x2="8.5" y2="8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></a>
</div>

<p><em>There is a second version of this water now: <a href="/posts/013_URPWaterV2/">Stylized Water for Unity URP, v2</a>.</em></p>

I wanted a water shader that I can drop into any future Unity project and that looks good right away.
It should be stylized, but with some physical basis: real wave geometry, lighting that matches the displaced surface and a bit of color under the water.
I built everything in Shader Graph for URP, so it stays editor-friendly and easy to tweak per scene.

The shader ended up with four main parts that can be configured independently: depth-based color, shoreline foam, Gerstner wave displacement and screen-space refraction.

## Depth-based color

Water looks different depending on how deep it is. Shallow areas over sand are bright and warm, open water at depth gets dark and saturated.
For that I need to know how far below the water surface the terrain is at each pixel.

I put this logic into a reusable `DepthFadeRobust` subgraph. It samples the scene depth in Eye mode (true linear depth), subtracts the world-space Y of the water surface, divides by a configurable distance and saturates the result.
I made my own subgraph because Unity's built-in `Depth Fade` node only works correctly for perspective cameras and gives wrong results with orthographic cameras.
The `Scene Depth` node in Eye mode returns correct linear depth for both projection types, so the water also works in orthographic views (which matters for top-down games or editor tooling).

The 0–1 value from the subgraph feeds a lerp between `ShallowColor` and `DeepColor`, and `WaterDepth` sets how many world units the transition spans.
After that it is mostly color-picking: shallow should be noticeably lighter and slightly desaturated compared to deep.
The foam and the refraction reuse the same depth value, so it is the most shared signal in the shader.

<video class="lazy-video" loop muted playsinline preload="none" style="width:100%; aspect-ratio:1280/658; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water/Water_Color.mp4" type="video/mp4">
</video>

## Shoreline foam

Foam collects where waves break against geometry: at the shoreline, around rocks and wherever shallow water churns.
It is driven by the same depth value from `DepthFadeRobust`, thresholded at a configurable distance.

The foam texture comes from two noise layers, a Gradient Noise and a Simple Noise. Each one is scrolled over time with the `UVScroll` subgraph at a different scale.
Multiplying them breaks up the tiling without needing an actual texture asset. `FoamNoiseScale` controls how large the single foam patches are.

Three parameters shape the final foam mask:
- `FoamCutoff` sets how far from the shoreline the foam extends.
- `FoamFade` sets how sharp the foam edge falls off. A Remap node maps the raw depth value to a 0–1 mask with a soft falloff at the outer edge.
- `FoamAmount` multiplies the final result to make the foam stronger or softer overall.

On top of that there is a `FoamColor` tint and a `FoamSpeed` scroll rate.

<video class="lazy-video" loop muted playsinline preload="none" style="width:100%; aspect-ratio:1280/654; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water/Water_Foam.mp4" type="video/mp4">
</video>

## Gerstner waves

Most water shaders displace the vertices along the Y axis with a sine wave. That works, but it looks like a floating sheet.
Gerstner waves are the physically correct alternative. Each wave also moves the vertices horizontally toward the crest, which gives the peaked crests and broad troughs of real water.

The shader has a `RadialWaves` toggle that switches between two modes with a Branch node.
In directional mode all waves travel along one `WaveDirection` vector.
In radial mode the direction comes from the vertex's XZ position relative to the origin, so the waves spread outward in concentric rings (useful for a pond or a surface that gets disturbed at one point).

<details>
<summary>Wave Displacement Formula</summary>

For a single wave, using phase term `f = dot(D, pos.xz) * w + t * phi`:

```
x += (Q * A) * D.x * cos(f)
y +=       A       * sin(f)
z += (Q * A) * D.z * cos(f)
```

| Parameter | Description |
|---|---|
| `D` | Wave direction (normalized XZ) |
| `A` | Amplitude |
| `w` | Angular frequency: `2π / wavelength` |
| `phi` | Phase speed |
| `Q` | Steepness, controls horizontal bunching toward crests |

</details>

### Normals and tangents

Displacing the vertices is not enough. The surface normal has to match the displaced geometry, otherwise the lighting does not fit the wave shape.
With Gerstner waves both the normal and the tangent can be derived analytically from the same parameters as the displacement, so there is no finite differencing and no extra texture lookup.

The HLSL computes N and T directly, without a binormal cross product. Each wave adds an increment to both vectors, summed over all active waves.

<details>
<summary>Normal and Tangent Derivation</summary>

Using the same phase term `f = dot(D, pos.xz) * w + t * phi`:

```
N.x = -D.x * w * A * cos(f)
N.y =  1 - Q * w * A * sin(f)
N.z = -D.z * w * A * cos(f)

T.x =  1 - D.x*D.x * Q * w * A * sin(f)
T.y =      D.x     * w * A * cos(f)
T.z =    - D.x*D.z * Q * w * A * sin(f)
```

N.x and N.z do not include the steepness `Q`, only N.y does. The tangent T follows the wave surface in the direction of travel. Both are normalized after accumulation.

The HLSL also clamps the steepness before using it: `q = min(Steepness, 1 / (w * A))`. That way the surface never folds over itself, and the material property can be animated freely without artifacts.

</details>

This was the most work in the whole shader.
The analytical normal gives correct lighting over the full steepness range, including sharp crests where a noise-based normal map would give a completely wrong surface orientation.

<video class="lazy-video" loop muted playsinline preload="none" style="width:100%; aspect-ratio:1280/660; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water/Water_GerstnerWaves.mp4" type="video/mp4">
</video>

## Screen-space refraction

When you look into water from above, the geometry underneath looks distorted. That is refraction: light bends when it crosses the water surface.
A physically accurate model would need a separate render target. Screen-space refraction fakes it cheaply with a UV offset.

The refraction normal comes from animated gradient noise. A `Gradient Noise` texture is scrolled with `UVScroll` at `RefractionSpeed` and turned into a normal with `Normal From Height`.
I blend that ripple normal with the analytical Gerstner normal using `Normal Blend`. The XZ components of the blended normal are scaled by `RefractionStrength` and added to the screen-space UV before sampling `Scene Color`.
So the underwater geometry gets distorted in proportion to the surface tilt: steep ripples distort a lot, flat areas stay clear.

`RefractionScale` controls the tiling of the noise (smaller values give larger, calmer ripples, larger values give tight chop) and `RefractionStrength` controls how far the UV actually shifts.

There is one edge case: the refracted UV can land above the water surface and sample the sky.
I use the depth check from `DepthFadeRobust` as a mask, so refraction only applies where there is actual geometry behind the water. That keeps the edges of the water clean.

<video class="lazy-video" loop muted playsinline preload="none" style="width:100%; aspect-ratio:1280/652; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water/Water_Refraction.mp4" type="video/mp4">
</video>

## Parameters

All controls are exposed as material properties, grouped by system. The example values are from the configuration shown in the results section.

Depth and surface:

| Parameter | Description | Example |
|---|---|---|
| `ShallowColor` | Color at shallow depth | cyan-white |
| `DeepColor` | Color at full water depth | deep blue |
| `WaterDepth` | World units over which the color transition occurs | 1.3 |
| `Smoothness` | PBR smoothness of the water surface | 1.0 |
| `NormalStrength` | Blend between Gerstner analytical normal and the detail ripple normal | 10 |

Waves:

| Parameter | Description | Example |
|---|---|---|
| `WaveAmplitude` | Wave height in world units | 0.02 |
| `WaveFrequency` | Spatial frequency (higher = shorter wavelengths) | 0.19 |
| `WaveSpeed` | Phase speed along the wave direction | 3 |
| `WaveSteepness` | Horizontal crest sharpening, auto-clamped to prevent fold-over | 0 |
| `WaveDirection` | XZ travel direction (ignored in radial mode) | (1, 0) |
| `RadialWaves` | Toggle between directional and radial wave mode | on |

Foam:

| Parameter | Description | Example |
|---|---|---|
| `FoamColor` | Foam tint | white (HDR) |
| `FoamCutoff` | Depth threshold at which foam begins | 4 |
| `FoamFade` | Transition sharpness at the outer foam edge | 0.64 |
| `FoamAmount` | Overall foam intensity multiplier | 0.52 |
| `FoamScale` | UV tiling of the combined foam mask | 50 |
| `FoamNoiseScale` | Scale of individual foam patch noise | 20 |
| `FoamSpeed` | Foam texture scroll speed | 0.2 |

Refraction:

| Parameter | Description | Example |
|---|---|---|
| `RefractionStrength` | How far the screen UV shifts under the water surface | 0.1 |
| `RefractionScale` | Tiling of the refraction ripple noise | 1.8 |
| `RefractionSpeed` | Refraction ripple animation speed | 0.06 |

## Results

All four parts work together.
Deep open water gets the dark saturated color, a shimmer from the blended ripple normals and large rolling Gerstner waves.
Shallow areas near the shore get a brighter tint and foam at the waterline, and the refraction shows the terrain underneath through the ripple distortion.

Since everything is a parameter, adapting it to a scene means changing values: a calm lake gets low steepness and mild refraction, a stormy sea gets steep waves and a lot of foam, a tropical beach gets a warm shallow color and bright white foam at the shoreline.
