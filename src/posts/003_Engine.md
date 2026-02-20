---
title: ⚙️ Custom Graphics Engine
date: 2026-02-14
summary: A C++ graphics engine built from scratch — path tracing, Cook-Torrance GGX, dual OpenGL/Vulkan backend, BVH acceleration and a full editor UI.
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>

Links: [Source Code](https://github.com/Vexury/VexEngine) · [Rendered Images](/projects/)

VexEngine is a C++ graphics engine I built from scratch — featuring a progressive path tracer with CPU and GPU backends, Cook-Torrance GGX materials, BVH acceleration, and a dockable editor UI. It supports both OpenGL and Vulkan through an abstracted rendering interface.

After years of working within large frameworks like [PBRT](https://github.com/mmp/pbrt-v4), where the overhead of navigating someone else's codebase often got in the way of actually experimenting, I wanted a clean, minimal engine that I fully understand and control. Having built exercise frameworks for teaching graphics at KIT, I knew what a good learning-oriented codebase should look like — VexEngine is that, but designed entirely around my own rendering ideas and experiments.

<!-- Engine_001: Screenshot of the full engine UI (editor layout with viewport, hierarchy, inspector, console) -->

<div style="text-align: center">
    <img src="/images/Engine_002.png" alt="Alt text" style="max-width:100%">
    
    Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)
</div>

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
- [ ] Viewport gizmos (translate, rotate, scale directly in the viewport)
- [ ] Undo/redo system

</details>

<details>
<summary>Scene & Assets</summary>

- [x] OBJ mesh loading & deletion
- [ ] Runtime object transforms via inspector
- [x] Environment map loading (HDR)
- [ ] FBX loading
- [ ] glTF loading
- [ ] Scene serialization (save/load scenes to file)

</details>

<details>
<summary>Rendering and Global Illumination</summary>

- [x] CMake compile flag to switch backends
- [x] Bounding Volume Hierarchy (BVH)
    - [x] Binned SAH Builder
    - [x] Ordered Traversal
- [x] Fullscreen quad
    - [x] OpenGL
    - [x] Vulkan
- [ ] Shadow mapping
    - [ ] OpenGL
    - [ ] Vulkan
- [x] CPU Progressive Path Tracing
- [ ] GPU Progressive Path Tracing
    - [x] OpenGL (compute shader)
    - [x] Live shader reload (F5 / button, OpenGL)
    - [ ] Vulkan
- [x] Path Tracing Features
    - [x] Next Event Estimation (NEE)
    - [x] Multiple Importance Sampling (MIS)
    - [x] Point light
    - [x] Directional (sun) light with soft shadows
    - [x] Emissive area lights
    - [x] Environment map lighting (importance-sampled)
    - [x] VNDF specular sampling (Heitz 2018)
    - [x] Firefly clamping
    - [x] Anti-aliasing (jittered sampling)
    - [x] Depth of field (thin-lens camera model)
    - [x] Flat shading toggle
- [x] Debug visualization modes
    - [x] Normals
    - [x] UVs
    - [x] Depth
    - [x] Wireframe
    - [x] Albedo
    - [x] Emission
    - [x] Material ID
- [ ] Denoising
- [ ] Deferred rendering
    - [ ] OpenGL
    - [ ] Vulkan
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
- [x] Textured materials
    - [x] Base Color / Albedo map
    - [x] Normal map
    - [x] Emissive map
    - [x] Roughness map
    - [x] Metallic map
- [x] Alpha clip (cutout transparency from RGBA diffuse texture)
- [x] Constant transparency (MTL `d`/`Tr` → Dielectric)
- [x] Auto-smooth normals (angle-based)
- [x] PBR parameter mapping from OBJ/MTL
- [x] Emissive materials

</details>

<details>
<summary>Post-processing</summary>

- [x] Exposure / gamma correction
- [x] ACES tone mapping
- [ ] Bloom
- [ ] SSAO

</details>

Some of the features are further discussed below.

## Window & UI

The first step for any graphics application is getting a window on screen. I use [GLFW](https://www.glfw.org/) for window creation and input handling — it is lightweight, cross-platform and works with both OpenGL and Vulkan out of the box.

For the UI layer, I use [Dear ImGui](https://github.com/ocornut/imgui) with the [docking branch](https://github.com/ocornut/imgui/wiki/Docking). ImGui is an immediate-mode GUI library, meaning you describe your UI every frame rather than maintaining a persistent widget tree. This makes it incredibly easy to iterate on layouts and debug tools. The docking branch lets me create a fully dockable, rearrangeable editor layout similar to what you would find in Unity or Unreal.

<!-- Engine_002: Screenshot or short video showing the dockable UI panels being rearranged -->

## Editor & Scene

With ImGui docking in place, I built an engine-like editor layout with several panels:

- **Scene Hierarchy** — A tree view of all objects in the scene. You can select objects here, and the selection is synced with the viewport.
- **Inspector** — Displays the properties of the currently selected object (transform, material, etc.) and lets you edit them directly.
- **Console** — A logging console that captures engine output, warnings and errors in real time.
- **Viewport** — The main rendering view where the scene is drawn.
- **Performance Metrics** — Frame time, FPS, and other stats to keep an eye on how things are running.

Selecting an object in the hierarchy or clicking it in the viewport highlights it with an **outline rendering** pass, making it easy to see what is currently selected in a complex scene.

<!-- Engine_003: Screenshot showing object selection with outline highlight in the viewport -->

Navigating the scene is done through an interactive camera that supports **zoom**, **pan** and **orbit rotation**. This feels similar to how you would move around in Blender or other 3D tools — scroll to zoom, middle-mouse to pan, and click-drag to orbit around a focus point.

The engine can load and delete OBJ meshes at runtime using [tinyobjloader](https://github.com/tinyobjloader/tinyobjloader). Objects can be imported into the scene via file dialog and removed when no longer needed. The scene hierarchy updates automatically to reflect all changes.

<!-- Engine_006: Short video or screenshots showing loading an OBJ, moving it, and deleting it -->

## Dual Backend: OpenGL & Vulkan

One of the more challenging architectural decisions was supporting two graphics backends: **OpenGL** and **Vulkan**. The engine abstracts rendering behind a common interface, and a CMake compile flag selects the backend — application code stays the same either way.

On the Vulkan side, I use [vk-bootstrap](https://github.com/charles-lunarg/vk-bootstrap) for instance/device setup and [VMA](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator) for GPU memory management, which cuts down the verbose boilerplate and lets me focus on the actual rendering logic.

<!-- Engine_004: Side-by-side comparison of the same scene in OpenGL and Vulkan, or a screenshot of the CMake config -->

## Rasterization & Debug Renders

Both backends support classic **rasterization** rendering. Meshes are uploaded to the GPU, transformed by vertex shaders and shaded by fragment shaders. This gives me a fast, interactive preview of the scene that I use for navigating and placing objects before kicking off a more expensive path trace.

<!-- Engine_005: Screenshot of a rasterized scene in the viewport -->

On top of the standard shaded view, the rasterizer supports several **debug visualization modes** that can be toggled in the viewport:

- **Normals** — Visualizes surface normals as RGB colors, useful for checking mesh quality and normal map correctness.
- **UVs** — Displays texture coordinates as colors, making it easy to spot UV seams and mapping issues.
- **Depth** — Renders the scene depth buffer as a grayscale image, helpful for verifying camera near/far planes and spatial layout.
- **Wireframe** — Overlays the triangle mesh wireframe, useful for inspecting geometry density and topology.

These debug modes render in real time and are invaluable for quickly diagnosing visual artifacts or verifying that scene data is loaded correctly.

<!-- Engine_010: Grid of debug render modes showing the same scene in normals, UVs, depth and wireframe -->

## Path Tracing

The engine includes a **progressive path tracer** that displays its result in the viewport using a fullscreen quad. As long as nothing changes in the scene (camera, objects, materials), it keeps accumulating samples and the image converges to a cleaner result over time. The moment something changes, the accumulation resets and a new trace begins from scratch.

<!-- Engine_007: Video or sequence of screenshots showing progressive convergence (noisy → clean) -->

Ray-scene intersection is accelerated by a **Bounding Volume Hierarchy (BVH)** built with **binned Surface Area Heuristic (SAH)**. The SAH builder evaluates split candidates across binned intervals to produce a tree that minimizes expected traversal cost. At query time, the traversal is **ordered** — the closer child node is visited first, which improves early termination and cuts the number of intersection tests significantly.

The path tracer supports four types of light sources, each with its own sampling strategy:

- **Emissive geometry** — Triangles with a solid emissive color (`Ke` in MTL) are treated as area lights. They are collected into a light CDF weighted by surface area, allowing **Next Event Estimation (NEE)** to directly sample points on their surface each bounce. When a path ray hits one of these emitters, it terminates — the surface is treated purely as a light source. **Multiple Importance Sampling (MIS)** balances the NEE and BSDF strategies to reduce variance.
- **Emissive textures** — Materials with an emissive texture map (`map_Ke`) are handled differently. Because emission varies per-texel, they are not included in the light CDF and cannot be importance-sampled by NEE. Instead, they contribute light only when a ray happens to hit them. Unlike solid emitters, these surfaces continue scattering light via their base material rather than terminating — they are glowing surfaces, not light sources.
- **Point and directional lights** — Sampled by dedicated NEE paths. The point light uses inverse-square falloff. The directional (sun) light has a configurable angular radius, producing soft shadows — shadow rays are jittered within a cone rather than aimed at a single direction.
- **Environment lighting** — An HDR environment map provides image-based lighting. A 2D CDF (conditional + marginal) is precomputed for importance sampling, so NEE preferentially samples bright regions of the sky. MIS again balances environment sampling against BSDF sampling.

All four NEE strategies fire independently each bounce, and the emissive material contribution can be toggled off to isolate the effect of explicit light sources.

The specular lobe uses **VNDF sampling** (Heitz 2018 — [Sampling the GGX Distribution of Visible Normals](https://jcgt.org/published/0007/04/01/)) instead of plain NDF sampling. NDF sampling draws half-vectors blind to the view direction, which frequently produces reflected directions below the surface at grazing angles — wasting the sample and losing energy. VNDF sampling restricts half-vectors to those actually visible from the current view direction, eliminating most of these invalid samples.

The path tracer also supports **depth of field** via a thin-lens camera model. Instead of firing all rays from a single point (pinhole), each primary ray originates from a random position on a disk of configurable radius (the aperture), aimed at a common focal plane at a configurable focus distance. Objects at the focal plane are perfectly sharp regardless of where on the lens disk the ray starts; objects nearer or farther produce a circle of confusion that grows with distance from the focal plane. Concentric disk mapping keeps the sample distribution uniform across the lens. Setting aperture to zero falls back to the exact pinhole behaviour with no overhead. Both the CPU and GPU path tracers share the same model.

<!-- Engine_008: Comparison of a noisy vs converged render, or a render showing environment lighting -->

The path tracing algorithm itself is the same across all backends — the difference is where it runs:

- **CPU** — The original implementation, running on the host. Great for debugging and correctness testing since you can step through every ray.
- **GPU (OpenGL)** — Ported to the GPU using **compute shaders**. The same progressive accumulation and sampling logic runs massively parallel, giving a significant speedup for interactive previews.
- **GPU (Vulkan)** — Planned. The Vulkan backend will use **hardware ray tracing** (VK_KHR_ray_tracing_pipeline) to leverage dedicated RT cores for acceleration structure traversal and ray-triangle intersection.

## Materials and Textures

The engine supports a full **PBR material pipeline** built on the **Cook-Torrance [microfacet model](https://pbr-book.org/3ed-2018/Reflection_Models/Microfacet_Models)** with a **GGX normal distribution**. Materials are loaded from OBJ/MTL files and automatically mapped to physically based parameters.

**Textured materials** allow spatially varying surface properties. The engine supports **base color (albedo)** (`map_Kd`), **emissive** (`map_Ke`), **normal** (`map_bump`/`norm`), **roughness** (`map_Ns`) and **metallic** (`map_Pm`) maps loaded from MTL files. When no texture is provided, the corresponding scalar value is used as fallback. Roughness and metallic textures are sampled from the R channel.

<!-- Engine_009: Screenshot showing textured vs untextured materials side by side -->

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
