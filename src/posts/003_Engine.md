---
title: ⚙️ VexEngine - Custom Rendering Engine
date: 2026-02-14
summary: A C++ graphics engine built from scratch — path tracing, Cook-Torrance GGX, dual OpenGL/Vulkan backend, BVH acceleration and a full editor UI.
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>

Links: [Source Code](https://github.com/Vexury/VexEngine) · [Rendered Images](/projects/)

VexEngine is a C++ graphics engine I built from scratch — featuring a progressive path tracer with CPU and GPU backends, Cook-Torrance GGX materials, BVH acceleration, and a dockable editor UI. It supports both OpenGL and Vulkan through an abstracted rendering interface.

<div style="text-align:center; color:#888; font-size:0.85em;">
      <img class="lb" src="/images/Engine_011.png" alt="Full editor layout" style="max-width:100%">

      Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)
</div>

After years of working within large frameworks like [PBRT](https://github.com/mmp/pbrt-v4), where the overhead of navigating someone else's codebase often got in the way of actually experimenting, I wanted a clean, minimal engine that I fully understand and control. I have already worked with multiple rendering frameworks for teaching at KIT but VexEngine is built around my own experiments rather than a fixed curriculum.

## Feature Checklist

Here is an overview of what is done and what I am planning to work on next:

<details>
<summary>Engine & UI</summary>

- [x] Window creation with GLFW
- [x] ImGui with docking for editor layout
- [x] Scene hierarchy panel
- [x] Inspector panel
- [x] Logging console
- [x] Performance metrics
- [x] Object selection (hierarchy & viewport click)
- [x] Outline rendering for selected objects
- [x] Interactive camera (zoom, pan, orbit)
- [x] Saving Framebuffer as image to disk
- [x] Viewport gizmos (translate, rotate, scale in the viewport)
- [ ] Undo/redo system

</details>

<details>
<summary>Scene & Assets</summary>

- [x] OBJ mesh loading & deletion
- [x] Runtime object transforms via inspector
- [x] Environment map loading (HDR)
- [ ] FBX loading
- [ ] glTF loading
- [ ] Scene serialization (save/load scenes to file)

</details>

<details>
<summary>Rendering and Global Illumination</summary>

- [x] CMake compile flag to switch backends
- [x] Live shader reload (F5 / button, OpenGL)
- [x] Bounding Volume Hierarchy (BVH)
    - [x] Binned SAH Builder
    - [x] Ordered Traversal
- [x] Fullscreen quad
    - [x] OpenGL
    - [x] Vulkan
- [x] Shadow mapping (rasterizer, both backends)
    - [x] AABB-fitted orthographic frustum
    - [x] Receiver plane depth bias (RPDB)
    - [x] PCF 3×3 soft shadows
    - [x] Shadow map debug view in Sun inspector
- [x] CPU Progressive Path Tracing
- [x] GPU Progressive Path Tracing
    - [x] OpenGL (compute shader)
    - [x] Vulkan (VK_KHR_ray_tracing_pipeline, hardware RT cores)
- [x] Path Tracing Features
    - [x] Next Event Estimation (NEE)
    - [x] Multiple Importance Sampling (MIS)
    - [x] Point light
    - [x] Directional (sun) light with soft shadows
    - [x] Emissive area lights
    - [x] Environment map lighting (importance-sampled)
    - [x] VNDF specular sampling (Heitz 2018)
    - [x] Russian Roulette path termination
    - [x] Firefly clamping
    - [x] Anti-aliasing (jittered sampling)
    - [x] Depth of field (thin-lens camera model)
- [x] Debug visualization modes
- [x] Denoising
    - [x] OIDN (Intel Open Image Denoise, CPU)
- [ ] Deferred rendering
- [ ] Bidirectional Path Tracing (BDPT)
- [ ] Metropolis Light Transport (MLT)
- [ ] Photon Mapping
- [ ] Volumetric rendering (participating media)
- [ ] Spectral rendering

</details>

<details>
<summary>Materials</summary>

- [x] Microfacet BSDF (GGX/Cook-Torrance) — handles both diffuse and specular lobes
- [x] Mirror (perfect specular, delta BRDF)
- [x] Dielectric (glass, Fresnel reflect/refract, delta BRDF)
- [x] PBR parameter mapping from OBJ/MTL
- [x] Textured materials
    - [x] Base Color / Albedo map
    - [x] Normal map
    - [x] Emissive map
    - [x] Roughness map
    - [x] Metallic map
- [x] Alpha clip (cutout transparency from RGBA diffuse texture)
- [x] Auto-smooth normals (angle-based)

</details>

<details>
<summary>Post-processing</summary>

- [x] Exposure / gamma correction
- [x] ACES tone mapping
- [x] Bloom
- [ ] Chromatic Aberration
- [ ] Vignette
- [ ] Color Grading

</details>

Some of the features are further discussed below.

## Window & UI

The foundation is [GLFW](https://www.glfw.org/) for window creation and input handling — lightweight, cross-platform, and compatible with both OpenGL and Vulkan out of the box. On top of that sits [Dear ImGui](https://github.com/ocornut/imgui) with the [docking branch](https://github.com/ocornut/imgui/wiki/Docking), which gives me a fully rearrangeable editor where every panel can be docked, undocked and resized freely. Since ImGui is immediate-mode, the UI is just code — no widget trees, no event callbacks, just describe what you want each frame and move on.

<div style="text-align:center; color:#888; font-size:0.85em;">
      <img class="lb" src="/images/Engine_002.png" alt="Full editor layout" style="max-width:100%">

      Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)
</div>

## Editor & Scene

The editor is built around five dockable panels. The **Scene Hierarchy** shows all loaded objects in a tree; clicking one selects it and syncs the viewport highlight. The **Inspector** exposes the selected object's material and rendering properties — roughness, metallic, emissive intensity, shadow bias — and lets you edit them live. The **Console** captures all engine output in real time, the **Viewport** is the main rendering view, and **Performance Metrics** track frame time, FPS and draw call counts.

Navigating the scene feels like Blender: scroll to zoom, middle-mouse to pan, click-drag to orbit around a focus point. Meshes can be loaded and deleted at runtime via file dialog using [tinyobjloader](https://github.com/tinyobjloader/tinyobjloader), the hierarchy updates automatically to reflect changes.

Clicking an object in the viewport highlights it with a **screen-space outline**: the selected geometry is rendered as a solid silhouette into an offscreen mask, which the tone-map pass then dilates with a 5×5 kernel and composites as an orange ring over the final image.

<div style="text-align:center; color:#888; font-size:0.85em;">
      <img class="lb" src="/images/Engine_Selection.png" alt="Full editor layout" style="max-width:100%">

      Scene: [Chess Set](https://polyhaven.com/a/chess_set) (CC0)
</div>

<details>
<summary>Picking, Selection & Outline — Implementation Details</summary>

**Shared infrastructure**

- Left-click coordinates are captured from the ImGui viewport (top-left origin) and queued as a pick request.
- `pick()` is called once per click and returns a `{groupIdx, submeshIdx}` pair that drives the selection state.
- The selection feeds into a mask render pass every frame: selected geometry is drawn as solid white into a dedicated color-only framebuffer (`m_outlineMaskFB`), even when nothing is selected (clear to black) so the image is always in a valid sampler state.
- The outline composite runs inside the existing tone-map fullscreen pass. A 5×5 box dilation over the mask produces `ring = dilated × (1 − original)`, overlaid in orange on top of the tone-mapped image.

**Picking**

| | OpenGL | Vulkan |
|---|---|---|
| Method | GPU ID render + pixel readback | CPU Möller–Trumbore ray-triangle intersection |
| Resources | Dedicated `m_pickShader`, `m_pickFB` | None — uses `SceneMesh::meshData` CPU vertices |
| Result | `readPixel(x, y) − 1` → flat draw index → `{group, submesh}` | Nearest-`t` triangle hit → `{group, submesh}` |
| GPU sync | `glReadPixels` stalls the pipeline | Zero GPU involvement |

**Outline mask rendering**

| | OpenGL | Vulkan |
|---|---|---|
| Uniform order | `bind()` first, then `setMat4()` — `glUniform*` requires a bound program | `setMat4()` first, then `bind()` — `bind()` flushes the UBO to the GPU |
| Depth test | Disabled explicitly (`glDisable`) and restored after | Disabled via pipeline state at `createPipeline(depthTest=false)` |
| Image layout | Managed implicitly by the driver | Render pass transitions color attachment to `SHADER_READ_ONLY_OPTIMAL` at `vkCmdEndRenderPass` — no explicit barrier needed before sampling |

**Outline composite**

| | OpenGL | Vulkan |
|---|---|---|
| Mask binding | `GL_TEXTURE1` + `setInt("u_outlineMask", 1)` | `setExternalTextureVK(slot=1)` → descriptor set 2 (`layout(set=2, binding=0)`) |
| Enable flag | `uniform bool u_enableOutline` | Push constant at byte offset 64 (`layout(offset=64) uint enableOutline`) |
| Flag dispatch | `setBool` → `glUniform1i` | `setBool` → immediate `vkCmdPushConstants` |

</details>

## Dual Backend: OpenGL & Vulkan

One of the more unusual design decisions is supporting two graphics APIs, selected at compile time via a CMake flag. All GPU concepts — shaders, framebuffers, meshes, textures — sit behind a common interface; the application layer never calls any GL or VK functions directly. This forced me to think carefully about where abstraction boundaries belong, and made every feature run twice — a surprisingly effective way to catch design mistakes early.

OpenGL is the simpler backend and makes iteration fast: shader hot-reload works at the press of F5, and the driver handles a lot of state implicitly. Vulkan is far more explicit — render passes, descriptor sets, pipeline layouts, synchronization barriers — everything has to be declared. That verbosity is the price of admission for hardware ray tracing via `VK_KHR_ray_tracing_pipeline`, which wouldn't have been possible on the OpenGL side. [vk-bootstrap](https://github.com/charles-lunarg/vk-bootstrap) handles instance and device setup, and [VMA](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator) manages GPU memory allocation — both reduce boilerplate without hiding anything important.

<div style="margin:1.5rem auto; width:100%">
  <div class="img-compare" onmousemove="var x=event.offsetX,w=this.offsetWidth,l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(w-x)+'px 0 0)';d.style.left=x+'px'" ontouchmove="var r=this.getBoundingClientRect(),x=Math.max(0,Math.min(event.touches[0].clientX-r.left,r.width)),l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(r.width-x)+'px 0 0)';d.style.left=x+'px';event.preventDefault()">
    <img class="ic-right" src="/images/Engine_Compare_PT.png" alt="Vulkan hardware ray tracing">
    <img class="ic-left" src="/images/Engine_Compare_Rast.png" alt="OpenGL rasterizer">
    <div class="ic-line"></div>
    <span class="ic-label ic-label-left">Rasterizer (OpenGL)</span>
    <span class="ic-label ic-label-right">Path Tracer (Vulkan)</span>
  </div>
  <div style="text-align:center; color:#888; font-size:0.85em; margin-top:0.5rem">
  
  Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)</div>
</div>

## Rasterization & Debug Views

Both backends support standard rasterization for fast interactive preview — the default mode for navigating the scene and placing objects before running a more expensive path trace. The rasterized image is rendered into an HDR intermediate framebuffer and then passed through a fullscreen tone-map pass that applies **ACES tone mapping** and **exposure / gamma correction** before display.

On top of the standard shaded view, several **debug visualization modes** can be toggled at any time from the viewport:

<div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.5rem; margin:1.5rem 0">
    <figure style="margin:0">
      <img class="lb" src="/images/Engine_Debug_Shaded.png" style="width:100%; border-radius:4px" alt="Shaded">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">Shaded</figcaption>
    </figure>
    <figure style="margin:0">
      <img class="lb" src="/images/Engine_Debug_Wireframe.png" style="width:100%; border-radius:4px" alt="Wireframe">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">Wireframe</figcaption>
    </figure>
    <figure style="margin:0">
      <img class="lb" src="/images/Engine_Debug_Normals.png" style="width:100%; border-radius:4px" alt="Normals">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">Normals</figcaption>
    </figure>
    <figure style="margin:0">
      <img class="lb" src="/images/Engine_Debug_Albedo.png" style="width:100%; border-radius:4px" alt="Albedo">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">Albedo</figcaption>
    </figure>
    <figure style="margin:0">
      <img class="lb" src="/images/Engine_Debug_UVs.png" style="width:100%; border-radius:4px" alt="UVs">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">UVs</figcaption>
    </figure>
    <figure style="margin:0">
      <img class="lb" src="/images/Engine_Debug_MatID.png" style="width:100%; border-radius:4px" alt="Material ID">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">Material ID</figcaption>
    </figure>
    
    <div style="grid-column:1/-1; text-align:center; color:#888; font-size:0.85em;">Scene: [Vintage Video Camera](https://polyhaven.com/a/vintage_video_camera) (CC0)</div>
  </div>

- **Wireframe** — Triangle mesh overlay for inspecting topology and geometry density.
- **Normals** — Surface normals as RGB, useful for checking mesh quality and normal map correctness.
- **Albedo / Emission / Material ID** — Passes that isolate specific shading components for quick inspection.
- **UVs** — Texture coordinates as colors, good for spotting seams and mapping problems.
- **Depth** — Grayscale depth buffer, helpful for verifying near/far plane settings.

## Shadow Mapping

The rasterizer supports directional (sun) shadow mapping on both backends. A depth-only pass renders the scene from the sun's point of view into a 4096×4096 shadow map, which the main shading pass samples to determine whether each surface point is lit or in shadow. Soft shadows are produced by a PCF 3×3 kernel, and the shadow frustum is fitted tightly to the scene geometry so no texel resolution is wasted. Getting the bias right is the main challenge — the engine uses a combination of three complementary techniques that together eliminate both acne and peter-panning across a wide range of sun angles. A Normal Bias slider and an inline shadow map debug view are exposed directly in the Sun inspector.

<div style="margin:1.5rem auto; width:100%">
  <div class="img-compare" onmousemove="var x=event.offsetX,w=this.offsetWidth,l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(w-x)+'px 0 0)';d.style.left=x+'px'" ontouchmove="var r=this.getBoundingClientRect(),x=Math.max(0,Math.min(event.touches[0].clientX-r.left,r.width)),l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(r.width-x)+'px 0 0)';d.style.left=x+'px';event.preventDefault()">
    <img class="ic-right" src="/images/Engine_Chess_SM.png" alt="PCF shadow mapping">
    <img class="ic-left" src="/images/Engine_Chess_NoSM.png" alt="No shadows">
    <div class="ic-line"></div>
    <span class="ic-label ic-label-left">Shadows off</span>
    <span class="ic-label ic-label-right">PCF shadow mapping</span>
  </div>
  <div style="text-align:center; color:#888; font-size:0.85em; margin-top:0.5rem">
  
  Scene: [Chess Set](https://polyhaven.com/a/chess_set) (CC0)</div>
</div>

<details>
<summary>Frustum Fitting & Bias</summary>

**Frustum fitting** — The orthographic frustum is fitted to the world-space AABB of all scene geometry. All eight AABB corners are projected into light view space and the exact min/max extents are read off directly — no wasted texels regardless of scene size or sun angle. The AABB is computed once at scene load and cached. A 2% scale from the AABB center adds a small margin to prevent PCF samples near the frustum edge from clamping to the border color.

Getting the bias right requires balancing two artifacts: too little causes self-shadowing acne, too much causes peter-panning (the shadow detaches from its caster). The engine uses three complementary techniques, matching the approach used by Unity and Godot:

- **Normal offset bias** — Instead of biasing the depth value, the shadow lookup point is shifted along the surface normal by `sin(θ) × normalBias` before projection. `sin(θ) = sqrt(1 − NdotL²)` is zero when the surface directly faces the light and maximum at grazing angles. The offset is expressed in shadow-map texel units and pre-multiplied by the world-space texel size on the CPU, so it scales automatically with frustum and scene size.
- **Receiver plane depth bias (RPDB)** — The PCF 3×3 kernel samples at ±1 texel offsets. On a sloped receiver surface the correct reference depth differs at each tap. Using the same center depth for all nine samples causes acne on moderately-lit faces. RPDB computes `dZ/dU` and `dZ/dV` via screen-space derivatives (`dFdx`/`dFdy`) and adjusts each tap's reference depth to match the receiver slope analytically.
- **Hardware constant depth bias** — A small constant bias (`glPolygonOffset` / `vkCmdSetDepthBias`) applied during shadow map rendering handles the residual case where `NdotL ≈ 1` and the normal offset is near zero. The slope-scale component is intentionally zero — at grazing angles it diverges and recreates the peter-panning that normal offset is designed to avoid.

</details>

## Post-Processing

The post-processing stack sits between the HDR render and the final display output. Every render path — rasterizer and path tracer, OpenGL and Vulkan — shares the same pipeline: **bloom** composited in linear HDR space, then **ACES tone mapping** and **exposure / gamma correction** in a single fullscreen pass.

**Bloom** runs as a three-stage pipeline on a half-resolution offscreen framebuffer:

1. **Threshold** — A fragment shader reads the HDR source, converts each pixel to luminance, and applies a soft ramp: pixels below the threshold contribute nothing, pixels above it contribute proportionally to how far they exceed it. Only bright surfaces — emissive materials, specular highlights, direct light hits — pass through.

2. **Separable Gaussian blur** — A pair of ping-pong framebuffers alternate horizontal and vertical 9-tap Gaussian passes (σ ≈ 1.5). Running the blur multiple times spreads the glow further without a wider kernel.

3. **Composite** — The blurred bloom map is additively mixed onto the HDR image at a configurable intensity, before tone mapping is applied. Compositing in HDR space means the glow from an overexposed surface stays bright through the tone mapper rather than getting clipped to a flat white halo.

One complication arises with the GPU path tracers: the accumulation buffer stores a running sum across N samples, not a normalised average. The threshold shader divides by the sample count before extracting bright pixels — without this, the bloom contribution would grow linearly with N and blow the image out to white after enough samples.

<div style="margin:1.5rem auto; width:100%">
  <div class="img-compare" onmousemove="var x=event.offsetX,w=this.offsetWidth,l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(w-x)+'px 0 0)';d.style.left=x+'px'" ontouchmove="var r=this.getBoundingClientRect(),x=Math.max(0,Math.min(event.touches[0].clientX-r.left,r.width)),l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(r.width-x)+'px 0 0)';d.style.left=x+'px';event.preventDefault()">
    <img class="ic-right" src="/images/Engine_Compare_Bloom.png" alt="Bloom on">
    <img class="ic-left" src="/images/Engine_Compare_NoBloom.png" alt="Bloom off">
    <div class="ic-line"></div>
    <span class="ic-label ic-label-left">Bloom off</span>
    <span class="ic-label ic-label-right">Bloom on</span>
  </div>
  <div style="text-align:center; color:#888; font-size:0.85em; margin-top:0.5rem">

  Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)</div>
</div>

## Path Tracing

The engine's main rendering mode is a **progressive path tracer** displayed in the viewport via a fullscreen quad. It accumulates samples silently in the background — the longer the scene sits still, the cleaner the image gets. Any change to the camera, geometry, or settings immediately resets the accumulation and starts fresh.

<div style="display:grid; grid-template-columns: repeat(4, 1fr); margin:1.5rem auto; width:100%; overflow:hidden">
  <div style="overflow:hidden; border-right:1px solid var(--border)"><img src="/images/Engine_Split_1_SPP.png" style="width:400%; height:100%; display:block" alt="1 SPP"></div>
  <div style="overflow:hidden; border-right:1px solid var(--border)"><img src="/images/Engine_Split_16_SPP.png" style="width:400%; height:100%; display:block; transform:translateX(-25%)" alt="16 SPP"></div>
  <div style="overflow:hidden; border-right:1px solid var(--border)"><img src="/images/Engine_Split_64_SPP.png" style="width:400%; height:100%; display:block; transform:translateX(-50%)" alt="64 SPP"></div>
  <div style="overflow:hidden"><img src="/images/Engine_Split_512_SPP.png" style="width:400%; height:100%; display:block; transform:translateX(-75%)" alt="512 SPP"></div>
  <div style="text-align:center; color:#888; padding:0.3rem 0; border-right:1px solid var(--border)">1 SPP</div>
  <div style="text-align:center; color:#888; padding:0.3rem 0; border-right:1px solid var(--border)">16 SPP</div>
  <div style="text-align:center; color:#888; padding:0.3rem 0; border-right:1px solid var(--border)">64 SPP</div>
  <div style="text-align:center; color:#888; padding:0.3rem 0">512 SPP</div>
  <div style="grid-column:1/-1; text-align:center; color:#888; font-size:0.85em; padding:0.3rem 0">
  
  Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)</div>
</div>

Ray-scene intersection is accelerated by a **BVH** built with binned SAH. The path tracer supports four light types — emissive geometry, emissive textures, point/directional lights, and an environment map — all sampled with **Next Event Estimation (NEE)** and **Multiple Importance Sampling (MIS)** to keep variance low. Path depth is managed by **Russian Roulette**, the specular lobe uses **VNDF sampling** [(Heitz 2018)](https://jcgt.org/published/0007/04/01/paper.pdf), and **depth of field** is modelled with a thin-lens camera. Anti-aliasing comes for free via jittered primary rays, and firefly clamping suppresses extreme outliers during early convergence.

<details>
<summary>BVH Acceleration</summary>

The BVH is built with **binned Surface Area Heuristic (SAH)**. The builder evaluates split candidates across binned intervals to produce a tree that minimises expected traversal cost. At query time, traversal is **ordered** — the closer child is visited first, improving early termination and reducing the number of intersection tests significantly.

</details>

<details>
<summary>Light Sources & Sampling</summary>

- **Emissive geometry** — Triangles with a solid emissive color (`Ke`) are treated as area lights. They are collected into a CDF weighted by surface area, allowing NEE to directly sample points on their surface each bounce. When a path ray hits one of these emitters it terminates — the surface is a pure light source. MIS balances NEE and BSDF sampling to reduce variance.
- **Emissive textures** — Materials with `map_Ke` are handled differently. Because emission varies per-texel they are excluded from the light CDF and cannot be NEE-sampled. They contribute only when a ray happens to hit them, and unlike solid emitters they continue scattering via their base material — they are glowing surfaces, not light sources.
- **Point and directional lights** — Sampled by dedicated NEE paths. Point lights use inverse-square falloff. The directional (sun) light has a configurable angular radius — shadow rays are jittered within a cone to produce soft shadows.
- **Environment lighting** — An HDR environment map provides image-based lighting. A 2D CDF (conditional + marginal) is precomputed so NEE preferentially samples bright sky regions. MIS balances environment and BSDF sampling.

All four NEE strategies fire independently each bounce. The emissive material contribution can be toggled off to isolate explicit light sources.

</details>

<details>
<summary>Russian Roulette Path Termination</summary>

After the first two bounces, each subsequent bounce computes a survival probability equal to the luminance of the current path throughput, capped at 0.95. The path terminates with probability `1 − p`; if it survives, the throughput is divided by `p` to keep the estimator unbiased. Paths through dark surfaces lose energy quickly and self-terminate early; bright paths continue. Raising the maximum depth has little practical cost — most paths terminate long before the cap.

</details>

<details>
<summary>VNDF Specular Sampling</summary>

The specular lobe uses **VNDF sampling** ([Heitz 2018](https://jcgt.org/published/0007/04/01/)) instead of plain NDF sampling. NDF sampling draws half-vectors without regard to the view direction, frequently producing reflected directions below the surface at grazing angles — wasting the sample and losing energy. VNDF restricts half-vectors to those visible from the current view direction, eliminating most invalid samples.

</details>

<details>
<summary>Depth of Field</summary>

Depth of field uses a **thin-lens camera model**. Instead of firing all rays from a single point (pinhole), each primary ray originates from a random position on a disk of configurable radius (the aperture), aimed at a focal plane at a configurable distance. Objects at the focal plane are perfectly sharp; objects nearer or farther accumulate a circle of confusion that grows with distance. Concentric disk mapping keeps the sample distribution uniform across the lens. Setting aperture to zero falls back to exact pinhole behaviour with no overhead. Both CPU and GPU path tracers share the same model.

</details>

The algorithm is the same across all three backends — the difference is where it runs:

- **CPU** — The original implementation, running on the host. Slow, but every ray can be stepped through in a debugger, which was invaluable when building out the lighting and sampling logic.
- **GPU (OpenGL)** — The same algorithm ported to a **compute shader**. Runs massively parallel with a significant speedup, and supports **live shader reload** (F5) for fast iteration.
- **GPU (Vulkan)** — Uses **hardware ray tracing** (`VK_KHR_ray_tracing_pipeline`) with dedicated RT cores for BVH traversal and ray-triangle intersection. The algorithm spans five shader stages (rgen, rmiss, shadow rmiss, rchit, rahit) with an iterative loop in the ray generation shader to stay within a recursion depth of one.

<div style="text-align:center; color:#888; font-size:0.85em;">
      <img class="lb" src="/images/Engine_010.png" alt="Full editor layout" style="max-width:100%">

      Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)
</div>

## Denoising

Even a well-optimised path tracer needs many samples before the image looks clean — at 1 SPP the noise is severe, and reaching a perceptually converged result can take hundreds of passes. Rather than waiting, the engine integrates [Intel Open Image Denoise (OIDN)](https://www.openimagedenoise.org/) as a one-click post-process that runs on the CPU and produces a clean result in a fraction of a second.

The integration works entirely on the CPU side and is backend-agnostic. A "Denoise" button appears in the Settings panel whenever samples have been accumulated; pressing it reads back the current accumulation buffer as **linear HDR float RGB** — before any tone mapping — feeds it into OIDN's RT filter, then applies the same exposure, ACES tone mapping and gamma correction as the live display. The result replaces the viewport image and accumulation is frozen. Moving the camera or changing any scene parameter immediately clears the denoised result and restarts accumulation from zero.

For the Vulkan GPU path tracer the readback copies the RGBA32F accumulation image from device memory to a CPU-side staging buffer via an immediate-submit command, divides out the per-pixel sample counter stored in the alpha channel, and passes the resulting linear HDR data directly to OIDN. For the CPU path tracer the accumulation buffer is already on the host, so no copy is needed.

<div style="margin:1.5rem auto; width:100%">
  <div class="img-compare" onmousemove="var x=event.offsetX,w=this.offsetWidth,l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(w-x)+'px 0 0)';d.style.left=x+'px'" ontouchmove="var r=this.getBoundingClientRect(),x=Math.max(0,Math.min(event.touches[0].clientX-r.left,r.width)),l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(r.width-x)+'px 0 0)';d.style.left=x+'px';event.preventDefault()">
    <img class="ic-right" src="/images/Engine_Bistro_16_SPP_denoised.png" alt="OIDN denoised">
    <img class="ic-left" src="/images/Engine_Bistro_16_SPP.png" alt="16 SPP raw">
    <div class="ic-line"></div>
    <span class="ic-label ic-label-left">16 SPP (raw)</span>
    <span class="ic-label ic-label-right">OIDN denoised</span>
  </div>
  <div style="text-align:center; color:#888; font-size:0.85em; margin-top:0.5rem">

  Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)</div>
</div>

## Materials and Textures

The engine supports a full **PBR material pipeline** built on the **Cook-Torrance [microfacet model](https://pbr-book.org/3ed-2018/Reflection_Models/Microfacet_Models)** with a **GGX normal distribution**. Three material types are supported — **Microfacet** for the general case, **Mirror** for perfect specular surfaces, and **Dielectric** for glass and other transmissive materials. All are loaded automatically from OBJ/MTL files and can be overridden per-object in the Inspector.

Textures can drive any surface property spatially: **base color**, **normal**, **emissive**, **roughness** and **metallic** maps are all supported, loaded from the standard MTL fields. When no texture is present, the scalar material value is used as fallback.

<details>
<summary>Material Types (from OBJ/MTL illum)</summary>

The engine maps OBJ/MTL fields to three internal material types. They can also be set manually in the Inspector.

| MTL condition | Type | materialType | BRDF |
|---|---|---|---|
| illum 0, 1, 2 (default) | Microfacet | 0 | Cook-Torrance GGX (diffuse + specular) |
| illum 3, 5 | Mirror | 1 | MirrorBSDF (delta, no NEE) |
| illum 4, 6, 7 | Dielectric | 2 | Fresnel reflect/refract (delta) |
| `d < 1` without alpha-clip texture | Dielectric | 2 | Fresnel reflect/refract (delta) |

The dispatch also treats Microfacet materials with `metallic > 0.99` and `roughness < 0.01` as a perfect mirror shortcut via MirrorBSDF, avoiding numerical issues at near-zero GGX alpha.

</details>

<details>
<summary>PBR Parameter Mapping</summary>

| MTL property | PBR parameter | Notes |
|---|---|---|
| Ns (shininess) | roughness | `clamp(sqrt(2 / (max(Ns,0) + 2)), 0, 1)` — maps Blinn-Phong lobe width to GGX |
| map_Ns | roughness texture | R channel, expected in 0–1 PBR range (not as Ns exponent) |
| illum 3/5 | metallic | 1.0 (all other types default to 0.0) |
| map_Pm | metallic texture | R channel sampled directly (0=dielectric, 1=metal) |
| Ni (IOR) | ior | Used directly for Dielectric (default 1.5) |
| Kd | baseColor | Vertex color (Ks for mirror, Tf for dielectric tint if set) |
| d / Tr | materialType | `d < 1` without alpha-clip texture → Dielectric (type 2) |

</details>

<details>
<summary>Roughness Range Examples</summary>

| Ns | Roughness | Appearance |
|---|---|---|
| 0 | 1.0 | Fully rough (pure diffuse look) |
| 10 | 0.41 | Moderate roughness |
| 100 | 0.14 | Fairly glossy |
| 1000 | 0.045 | Near-mirror |

</details>

<details>
<summary>Where Cook-Torrance is NOT Used</summary>

- **Mirror (type 1)** — Always dispatches to the delta MirrorBSDF (set by illum 3/5 in MTL or manually in the Inspector). Roughness and metallic are ignored. The surface albedo tints the reflection.
- **Perfect mirror shortcut** — Microfacet materials with `metallic > 0.99` and `roughness < 0.01` also dispatch to MirrorBSDF to avoid numerical issues at near-zero GGX alpha.
- **Dielectric (type 2)** — Uses delta Fresnel reflect/refract (Snell's law). Rough dielectrics would need microfacet transmission — a separate feature.

</details>

## Resources

Some of the resources that influenced this project the most:

- [PBRT](https://www.pbr-book.org/) — The reference book on physically based rendering
- [Ray Tracing in One Weekend](https://raytracing.github.io/) — The classic starting point for writing a path tracer
- [LearnOpenGL](https://learnopengl.com/) — Comprehensive OpenGL tutorials
- [vkguide.dev](https://vkguide.dev/) — Practical, modern Vulkan tutorial

This engine is an ongoing project — the roadmap above shows where it is headed. It covers the full stack from low-level GPU API work and acceleration structures to physically based shading and editor tooling, with every component built and understood by me.

<div class="lightbox" id="lightbox"><img id="lightbox-img"></div>

<script>
(function() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  document.querySelectorAll('img.lb').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => { lbImg.src = img.src; lb.classList.add('active'); });
  });
  lb.addEventListener('click', () => lb.classList.remove('active'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('active'); });
})();
</script>
