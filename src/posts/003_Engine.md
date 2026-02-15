---
title: ⚙️ Custom Graphics Engine
date: 2026-02-14
summary: I am building my own graphics engine! Path Tracing, Bounding Volume Hierarchies and more...
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>

Links: [Source Code](https://github.com/Vexury/VexEngine)

Over the last few years working with graphics and games, I started building my own engine piece by piece.
When I started learning graphics and rendering, I used to work with existing frameworks like [PBRT](https://github.com/mmp/pbrt-v4).
Working with such big codebases introduces an immense overhead for learning how it functions and where I can start injecting my own code to manipulate the final rendered image.
And then you notice that the framework does not provide a feature that you did not realize you needed and then you just go to the next bigger, more bloaty, more complicated one just to test out a few effects or techniques.
This motivated me to write a modern, clean and simple yet functional engine from scratch that provides me with a flexible playground for my own ideas and experiments.
I had already done something similar for teaching graphics at KIT where we provided students with exercise frameworks where they can implement their solutions to exercise sheets.
However, there were multiple such frameworks in place and I never had one engine that I could call mine where everything is built and designed by myself.

<!-- Engine_001: Screenshot of the full engine UI (editor layout with viewport, hierarchy, inspector, console) -->

## Window & UI

The first step for any graphics application is getting a window on screen. I use [GLFW](https://www.glfw.org/) for window creation and input handling — it is lightweight, cross-platform and works with both OpenGL and Vulkan out of the box.

For the UI layer, I use [Dear ImGui](https://github.com/ocornut/imgui) with the [docking branch](https://github.com/ocornut/imgui/wiki/Docking). ImGui is an immediate-mode GUI library, meaning you describe your UI every frame rather than maintaining a persistent widget tree. This makes it incredibly easy to iterate on layouts and debug tools. The docking branch lets me create a fully dockable, rearrangeable editor layout similar to what you would find in Unity or Unreal.

<!-- Engine_002: Screenshot or short video showing the dockable UI panels being rearranged -->

## Editor Layout

With ImGui docking in place, I built an engine-like editor layout with several panels:

- **Scene Hierarchy** — A tree view of all objects in the scene. You can select objects here, and the selection is synced with the viewport.
- **Inspector** — Displays the properties of the currently selected object (transform, material, etc.) and lets you edit them directly.
- **Console** — A logging console that captures engine output, warnings and errors in real time.
- **Viewport** — The main rendering view where the scene is drawn.
- **Performance Metrics** — Frame time, FPS, and other stats to keep an eye on how things are running.

Selecting an object in the hierarchy or clicking it in the viewport highlights it with an **outline rendering** pass, making it easy to see what is currently selected in a complex scene.

<!-- Engine_003: Screenshot showing object selection with outline highlight in the viewport -->

## Dual Backend: OpenGL & Vulkan

One of the more interesting architectural decisions was supporting two graphics backends: **OpenGL** and **Vulkan**. The engine abstracts rendering behind a common interface, and the CMake configuration builds the project with one backend or the other using a compile flag. This way I can switch between them without touching the application code.

For getting started with OpenGL, [LearnOpenGL](https://learnopengl.com/) is an incredible resource — it walks you through everything from opening a window to PBR shading. For Vulkan, I highly recommend [vkguide.dev](https://vkguide.dev/) which takes a very hands-on approach to learning the Vulkan API.

On the Vulkan side, I use [vk-bootstrap](https://github.com/charles-lunarg/vk-bootstrap) to simplify the verbose instance/device setup and [Vulkan Memory Allocator (VMA)](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator) for buffer and image memory management. These two libraries cut down an enormous amount of boilerplate and let you focus on the actual rendering logic instead of fighting the API.

<!-- Engine_004: Side-by-side comparison of the same scene in OpenGL and Vulkan, or a screenshot of the CMake config -->

## Rasterization

Both backends support classic **rasterization** rendering. Meshes are uploaded to the GPU, transformed by vertex shaders and shaded by fragment shaders. This gives me a fast, interactive preview of the scene that I use for navigating and placing objects before kicking off a more expensive path trace.

<!-- Engine_005: Screenshot of a rasterized scene in the viewport -->

## Interactive Camera

Navigating the scene is done through an interactive camera that supports **zoom**, **pan** and **orbit rotation**. This feels similar to how you would move around in Blender or other 3D tools — scroll to zoom, middle-mouse to pan, and click-drag to orbit around a focus point. Having a responsive camera is essential for quickly inspecting objects and finding the right angle for a render.

## Scene Management

The engine can **load and delete OBJ meshes** at runtime. You can import objects into the scene, move them around using the inspector transforms, and remove them when they are no longer needed. The scene hierarchy updates automatically to reflect all changes, so you always have a clear overview of what is in the scene.

<!-- Engine_006: Short video or screenshots showing loading an OBJ, moving it, and deleting it -->

## CPU Path Tracing

The most involved rendering feature is a **CPU path tracer** that runs on the host and displays its result in the viewport using a fullscreen quad. The path tracer is **progressive** — as long as nothing changes in the scene (camera, objects, materials), it keeps accumulating samples and the image converges to a cleaner result over time. The moment something changes, the accumulation resets and a new trace begins from scratch.

<!-- Engine_007: Video or sequence of screenshots showing progressive convergence (noisy → clean) -->

The path tracer implements several techniques to reduce noise and converge faster:

- **Next Event Estimation (NEE)** — At each bounce, the tracer sends a shadow ray directly toward a light source instead of relying purely on random bounces to eventually hit one. This dramatically reduces variance for direct lighting.
- **Multiple Importance Sampling (MIS)** — Combines BSDF sampling and light sampling using balance heuristics, so that both glossy highlights and soft diffuse lighting converge efficiently without either strategy dominating.
- **Environment Lighting** — The scene is lit by an environment map (HDR), providing realistic ambient illumination from all directions. This works together with MIS to produce natural-looking outdoor and studio lighting.

<!-- Engine_008: Comparison of a noisy vs converged render, or a render showing environment lighting -->

## Feature Checklist

Here is an overview of what is done and what I am planning to work on next:

**Engine & UI**
- [x] Window creation with GLFW
- [x] ImGui with docking for editor layout
- [x] Scene hierarchy panel
- [x] Inspector panel
- [x] Logging console
- [x] Performance metrics
- [x] Object selection (hierarchy & viewport click)
- [x] Outline rendering for selected objects
- [ ] Viewport gizmos (translate, rotate, scale directly in the viewport)
- [ ] Undo/redo system

**Scene & Assets**
- [x] OBJ mesh loading & deletion
- [x] Runtime object transforms via inspector
- [x] Environment map loading (HDR)
- [ ] FBX loading
- [ ] glTF loading
- [ ] Scene serialization (save/load scenes to file)

**Rendering — Rasterization**
- [x] OpenGL backend
- [x] Vulkan backend
- [x] CMake compile flag to switch backends
- [x] Interactive camera (zoom, pan, orbit)
- [ ] Shadow mapping
- [ ] GPU-driven path tracing
- [ ] Deferred rendering
- Post-processing
  - [x] Exposure / gamma correction
  - [x] ACES tone mapping
  - [ ] Bloom
  - [ ] SSAO

**Materials**
- [x] Diffuse (Lambertian)
- [ ] Specular (perfect mirror)
- [ ] Dielectric (glass, refraction)
- [ ] Microfacet BSDF (GGX/Cook-Torrance)
- [ ] Textured materials (albedo, normal, roughness maps)
- [ ] Emissive materials

**Global Illumination & Ray Tracing**
- [x] CPU progressive path tracer
- [x] Fullscreen quad display
- [x] Automatic reset on scene changes
- [x] Next Event Estimation (NEE)
- [x] Multiple Importance Sampling (MIS)
- [x] Environment lighting
- [ ] Bounding Volume Hierarchy (BVH) acceleration
- [ ] Bidirectional Path Tracing (BDPT)
- [ ] Metropolis Light Transport (MLT)
- [ ] Photon Mapping
- [ ] Volumetric rendering (participating media)
- [ ] Spectral rendering
- [ ] Denoising (OIDN / OptiX)

## Resources

If you are interested in building something similar, here are some of the resources that helped me the most:

- [LearnOpenGL](https://learnopengl.com/) — Comprehensive OpenGL tutorials from the ground up
- [vkguide.dev](https://vkguide.dev/) — Practical, modern Vulkan tutorial
- [Ray Tracing in One Weekend](https://raytracing.github.io/) — The classic starting point for writing a path tracer
- [PBRT](https://www.pbr-book.org/) — The reference book on physically based rendering
- [Dear ImGui](https://github.com/ocornut/imgui) — Immediate-mode GUI for tools and debug UI
- [vk-bootstrap](https://github.com/charles-lunarg/vk-bootstrap) — Simplifies Vulkan initialization
- [Vulkan Memory Allocator](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator) — GPU memory management for Vulkan

This engine is still a work in progress — there is always more to add and improve. But having a codebase that is entirely my own, where I understand every line, makes it a joy to experiment with new rendering techniques.
