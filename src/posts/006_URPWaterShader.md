---
title: "🌊 Customizable Unity URP Water Shader"
date: 2026-06-09
summary: "Building a stylized yet beautiful URP water shader in Unity Shader Graph, with Gerstner waves, depth-based color blending, shoreline foam, and screen-space refraction."
preview_image: /images/URP_Water/Water_01.png
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}{% if ongoing %} (ongoing){% endif %}</p>
<div class="link-row" style="margin-bottom: 1rem">
<a href="/projects/shadergraph/?file=StylizedGerstnerWater" class="link-btn">Shader Graph <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style="vertical-align:-0.1em"><circle cx="2" cy="6" r="1.5" fill="currentColor"/><circle cx="10" cy="3" r="1.5" fill="currentColor"/><circle cx="10" cy="9" r="1.5" fill="currentColor"/><line x1="3.5" y1="5.5" x2="8.5" y2="3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3.5" y1="6.5" x2="8.5" y2="8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></a>
</div>

I wanted a water shader I could drop into any future Unity project and have it look good immediately. Stylized, but with enough physical grounding to feel convincing: real wave geometry, accurate lighting from the displaced surface, and subtle underwater color. Everything built in Shader Graph for URP so it stays editor-friendly and easy to tweak per-scene.

The shader ended up with four main systems, each configurable independently: depth-based color, shoreline foam, Gerstner wave displacement, and screen-space refraction.

## Depth-Based Color

Water looks different depending on how deep it is. Shallow areas over sand are bright and warm; open water at depth turns dark and saturated. Getting this right requires knowing how far below the water surface the terrain sits at any given pixel.

I wrapped this logic in a reusable `DepthFadeRobust` subgraph. It samples the scene depth in Eye mode (true linear depth), subtracts the world-space Y of the water surface, divides by a configurable distance, and saturates the result. The reason for the custom subgraph is that Unity's built-in `Depth Fade` node only works correctly for perspective cameras — it produces wrong results with orthographic cameras. By using the `Scene Depth` node in Eye mode, which returns correct linear depth for both projection types, the water works in orthographic views as well, which matters for top-down games or editor tooling.

The 0–1 value from the subgraph feeds a lerp between `ShallowColor` and `DeepColor`, with `WaterDepth` controlling how many world units the transition spans. Getting a convincing result is mostly color-picking: shallow should be noticeably lighter and slightly desaturated relative to deep. The depth value is also reused by the foam and refraction systems, so it is the single most shared signal in the shader.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water/Water_Color.mp4" type="video/mp4">
</video>

## Shoreline Foam

Foam collects where waves break against geometry: at the shoreline, around rocks, and wherever shallow water churns. The same depth value from `DepthFadeRobust` drives it, thresholded at a configurable distance.

Two separate noise layers produce the foam texture: a Gradient Noise layer and a Simple Noise layer, each scrolled over time via the `UVScroll` subgraph at different scales. Multiplying them together breaks the tiling pattern without needing an actual texture asset. The `FoamNoiseScale` parameter controls how large the individual foam patches appear.

Three parameters shape the final foam mask. `FoamCutoff` sets how deep from the shoreline foam extends. `FoamFade` controls how sharply the foam edge falls off — a Remap node maps the raw depth value to a 0–1 mask with a soft falloff at the outer edge. `FoamAmount` multiplies the final result to boost or soften the overall foam intensity. A `FoamColor` tint and a `FoamSpeed` scroll rate round out the controls.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water/Water_Foam.mp4" type="video/mp4">
</video>

## Gerstner Waves

Most water shaders displace vertices along the Y axis with a sine wave. It works but the result looks like a floating sheet. Gerstner waves are the physically correct alternative: each wave also shifts vertices horizontally, toward the crest, which produces the characteristic peaked crests and broad troughs of real water.

The shader has a `RadialWaves` toggle that switches between two modes via a Branch node. In directional mode, all waves travel along a single `WaveDirection` vector. In radial mode, the direction is derived from the vertex's XZ position relative to the origin, so waves spread outward in concentric rings — useful for a pond or water surface disturbed at a point.

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
| `w` | Angular frequency — `2π / wavelength` |
| `phi` | Phase speed |
| `Q` | Steepness — controls horizontal bunching toward crests |

</details>

### Normals and Tangents

Vertex displacement alone is not enough. The surface normal must match the displaced geometry or lighting will not agree with the wave shape. With Gerstner waves, both the normal and the tangent can be derived analytically from the same parameters used for displacement — no finite differencing, no extra texture lookups.

The HLSL computes N and T directly, without going through a binormal cross product. Each wave contributes an additive increment to both vectors, and they are summed across all active waves.

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

Note that N.x and N.z do not include the steepness `Q` — only N.y does. The tangent T follows the wave surface in the direction of travel. Both are normalized after accumulation.

The steepness is also auto-clamped in the HLSL before use: `q = min(Steepness, 1 / (w * A))`. This prevents the surface from ever folding over on itself, so the material property is safe to animate freely without worrying about artifacts.

</details>

Getting this right was the most involved part of the whole shader. The analytical normal gives correct lighting across the full steepness range, including at sharp crests where a noise-based normal map would give completely wrong surface orientation.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water/Water_GerstnerWaves.mp4" type="video/mp4">
</video>

## Screen-Space Refraction

Looking into water from above, the geometry underneath appears distorted. That distortion is refraction: light bends as it crosses the water surface. A physically accurate model would require a separate render target; screen-space refraction fakes it cheaply with UV offset.

The refraction normal is built from animated gradient noise: a `Gradient Noise` texture is scrolled using `UVScroll` at `RefractionSpeed`, then converted to a normal via `Normal From Height`. That ripple normal is blended with the analytical Gerstner normal using `Normal Blend`, and the blended normal's XZ components are scaled by `RefractionStrength` and added to the screen-space UV before sampling `Scene Color`. The result distorts the underwater geometry in proportion to the surface tilt — steep ripples produce strong distortion, flat areas are clear.

The `RefractionScale` parameter controls the tiling of the noise (smaller values give larger, calmer ripples; larger values give tight chop), and `RefractionStrength` controls how far the UV actually shifts.

One edge case to handle: the refracted UV can land above the water surface and sample the sky. The depth check from `DepthFadeRobust` is used as a mask — refraction only applies where there is actual geometry behind the water, which keeps the edges of water bodies clean.

<video autoplay loop muted playsinline preload="metadata" style="width:100%; margin:1.5rem 0; border-radius:4px; display:block;">
  <source src="/images/URP_Water/Water_Refraction.mp4" type="video/mp4">
</video>

## Parameters

All controls are exposed as material properties, grouped below by system. The example values are from the configuration shown in the results section.

**Depth and surface**

| Parameter | Description | Example |
|---|---|---|
| `ShallowColor` | Color at shallow depth | cyan-white |
| `DeepColor` | Color at full water depth | deep blue |
| `WaterDepth` | World units over which the color transition occurs | 1.3 |
| `Smoothness` | PBR smoothness of the water surface | 1.0 |
| `NormalStrength` | Blend between Gerstner analytical normal and the detail ripple normal | 10 |

**Waves**

| Parameter | Description | Example |
|---|---|---|
| `WaveAmplitude` | Wave height in world units | 0.02 |
| `WaveFrequency` | Spatial frequency (higher = shorter wavelengths) | 0.19 |
| `WaveSpeed` | Phase speed along the wave direction | 3 |
| `WaveSteepness` | Horizontal crest sharpening, auto-clamped to prevent fold-over | 0 |
| `WaveDirection` | XZ travel direction (ignored in radial mode) | (1, 0) |
| `RadialWaves` | Toggle between directional and radial wave mode | on |

**Foam**

| Parameter | Description | Example |
|---|---|---|
| `FoamColor` | Foam tint | white (HDR) |
| `FoamCutoff` | Depth threshold at which foam begins | 4 |
| `FoamFade` | Transition sharpness at the outer foam edge | 0.64 |
| `FoamAmount` | Overall foam intensity multiplier | 0.52 |
| `FoamScale` | UV tiling of the combined foam mask | 50 |
| `FoamNoiseScale` | Scale of individual foam patch noise | 20 |
| `FoamSpeed` | Foam texture scroll speed | 0.2 |

**Refraction**

| Parameter | Description | Example |
|---|---|---|
| `RefractionStrength` | How far the screen UV shifts under the water surface | 0.1 |
| `RefractionScale` | Tiling of the refraction ripple noise | 1.8 |
| `RefractionSpeed` | Refraction ripple animation speed | 0.06 |

## Results

The four systems compose cleanly. Deep open water gets the dark saturated color, a shimmer from the blended ripple normals, and large rolling Gerstner waves. Shallow areas near the shore shift to a brighter tint, gain foam at the waterline, and the refraction reveals the terrain underneath through the ripple distortion.

Because everything is parameterized, adapting it per-scene is a matter of dialing values: a calm lake gets low steepness and mild refraction, a stormy sea gets steep waves and heavy foam, a tropical beach gets a warm shallow color and bright white foam at the shoreline.
