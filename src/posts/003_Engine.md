---
title: ⚙️ VexEngine - Custom Rendering Engine
date: 2026-02-13
ongoing: true
summary: "A C++ graphics engine I built from scratch, with path tracing, Cook-Torrance GGX materials, OpenGL and Vulkan backends, BVH acceleration, denoising and an editor UI."
preview_image: /images/Engine/Engine_011.png
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}{% if ongoing %} (ongoing){% endif %}</p>

<div class="link-row" style="margin-bottom: 1rem">
<a href="https://github.com/Vexury/VexEngine" class="link-btn">GitHub <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="vertical-align:-0.1em"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a>
</div>

VexEngine is a C++ graphics engine I built from scratch. It has a progressive path tracer with CPU and GPU backends, Cook-Torrance GGX materials, BVH acceleration, denoising and a dockable editor UI. OpenGL and Vulkan both run through one abstracted rendering interface.

<div style="text-align:center; color:#888; font-size:0.85em;">
      <img class="lb" src="{% thumb '/images/Engine/Engine_011.png', 1100 %}" alt="Full editor layout" style="max-width:100%" loading="lazy">

      Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)
</div>

I worked within large frameworks like [PBRT](https://github.com/mmp/pbrt-v4) for years, and navigating someone else's codebase often got in the way of actually experimenting. So I wanted a clean, minimal engine that I fully understand and control. I have also worked with several rendering frameworks for teaching at KIT, but VexEngine is built around my own experiments and not around a fixed curriculum.

## Feature checklist

Here is an overview of what is done and what I am planning to work on next:

<details>
<summary>Engine & UI</summary>

- [x] Window creation with GLFW
- [x] ImGui with docking for editor layout
- [x] Scene hierarchy panel (n-level tree, drag-and-drop reparenting)
- [x] Inspector panel
- [x] Logging console
- [x] Performance metrics (FPS, samples/sec for all path tracing modes)
- [x] Object selection (hierarchy & viewport click)
- [x] Outline rendering for selected objects
- [x] Interactive camera (zoom, pan, orbit)
- [x] Saving Framebuffer as image to disk
- [x] Viewport gizmos (translate, rotate, scale in the viewport)
- [x] Undo/redo system (command stack, Ctrl+Z/Y)
- [x] Primitive objects (plane, cube, sphere, cylinder)

</details>

<details>
<summary>Scene & Assets</summary>

- [x] OBJ mesh loading & deletion
- [x] glTF loading (.gltf + .bin, full PBR/ARM texture support, node hierarchy)
- [x] Runtime object transforms via inspector
- [x] Environment map loading (HDR)
- [ ] FBX loading
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
    - [x] Vulkan (compute shader, software BVH)
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
    - [x] Auxiliary buffer denoising (albedo + normal feature inputs)
- [ ] Deferred rendering
- [ ] Bidirectional Path Tracing (BDPT)
- [ ] Metropolis Light Transport (MLT)
- [ ] Photon Mapping
- [x] Volumetric rendering (participating media)
- [ ] Spectral rendering

</details>

<details>
<summary>Materials</summary>

- [x] Microfacet BSDF (GGX/Cook-Torrance, diffuse and specular lobes)
- [x] Mirror (perfect specular, delta BRDF)
- [x] Dielectric (glass, Fresnel reflect/refract, delta BRDF)
- [x] PBR parameter mapping from OBJ/MTL
- [x] Textured materials
    - [x] Base Color / Albedo map
    - [x] Normal map
    - [x] Emissive map
    - [x] Roughness map (G channel of ARM, or separate greyscale)
    - [x] Metallic map (B channel of ARM, or separate greyscale)
    - [x] AO map (R channel of ARM, or separate greyscale)
    - [x] ARM-packed texture (single texture: R=AO, G=Roughness, B=Metallic)
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

I go into some of these features in more detail below.

## Editor

The foundation is [GLFW](https://www.glfw.org/) for window creation and input, with [Dear ImGui](https://github.com/ocornut/imgui) (docking branch) on top for the UI. ImGui is immediate mode, so the whole editor is just code: every frame I describe what should be on screen, and there are no widget trees or event callbacks. Every panel can be docked, undocked and resized.

<div style="text-align:center; color:#888; font-size:0.85em;">
      <img class="lb" src="{% thumb '/images/Engine/Engine_002.png', 1100 %}" alt="Full editor layout" style="max-width:100%" loading="lazy">

      Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)
</div>

The editor has five panels. The scene hierarchy is a free n-level tree: every node can be dragged under any other node and the hierarchy updates immediately. OBJ files with multiple named objects are imported as a root node with one child per object name. Clicking a node selects it and highlights it in the viewport.

The inspector shows the local transform and the material properties of the selected node (base color tint, roughness, metallic, emissive strength, IOR), and all of them can be edited live in every render backend. Each texture slot has a small inline thumbnail, and hovering it shows a larger, proportionally scaled preview, so I can check which map is loaded without leaving the inspector.

The console shows all engine output in real time and the viewport is the main rendering view. The stats panel shows FPS, frame time, a VSync toggle, the current render mode, the path tracer sample count and samples/sec, scene geometry counts (nodes, submeshes, triangles, vertices, textures, lights, emissive meshes, volumes), BVH node count and SAH cost and the viewport resolution. On Vulkan it also breaks down GPU memory by category (textures, geometry, framebuffers, ray tracing) against the VRAM budget the driver reports.

Navigating the scene works like in Blender: scroll to zoom, middle mouse to pan and click-drag to orbit around a focus point. Meshes can be loaded at runtime through a file dialog, OBJ with [tinyobjloader](https://github.com/tinyobjloader/tinyobjloader) and glTF with [tinygltf](https://github.com/syoyo/tinygltf). glTF imports keep the full node hierarchy of the file, with one SceneNode per glTF node under a named root. Materials come in with full PBR data: ARM-packed `metallicRoughnessTexture` maps are split across the AO (R), Roughness (G) and Metallic (B) slots automatically, without redundant GPU copies.

<details>
<summary>OBJ import performance</summary>

Loading large scenes was slow at first. There were three separate bottlenecks in the import pipeline, and I fixed each of them on its own. Switching render modes afterwards had its own problems, which come after the table.

The first problem was a double texture decode. `Texture2D::createFromFile` decoded each texture from disk for the GPU upload, and then `rebuildRaytraceGeometry` decoded the same files from disk again to build the CPU-side ray tracing data structures. For Bistro (274 unique textures) that meant 548 `stbi_load` calls. Now each texture is decoded once with the rows unflipped and the raw pixels are cached in a `Scene::importedTexPixels` map. The rows get flipped in place for the GPU upload, and the ray tracing rebuild reads the cached pixels directly and clears the map when it is done.

The second one was the size of the ray tracing SSBO. All texture pixels are packed into one flat GPU buffer for the texture array of the path tracer, and at full resolution Bistro's 274 textures produced a 3536 MB SSBO. Textures in that buffer are now capped at 1024 px per axis (nearest-neighbour downsample) before packing. That brings it down to 884 MB with no visible difference in quality at path-traced sample counts.

After these two fixes the GPU upload phase was the bottleneck: 274 textures were decoded one after another on the main thread before the upload. `stbi_load` is thread-safe for concurrent calls, so all unique texture paths are now decoded in parallel on N worker threads (N = hardware concurrency) before the GPU upload starts. Each thread takes work from a shared atomic index and writes into a pre-allocated slot, and after joining, the main thread moves all results into `importedTexPixels`, so no locking is needed.

Measured on the Bistro exterior (1591 submeshes, 2.8M triangles, 274 textures) after each fix:

| State | GPU upload | Total import |
|---|---|---|
| After fixes 1 & 2 | 12 106 ms | 18.6 s |
| + parallel decode (28 threads) | 668 ms decode + 1 732 ms upload | 8.4 s |

The remaining ~5 s are tinyobjloader parsing (2.3 s) and SSBO/BVH packing (3.2 s), both sequential by nature.

Switching to a path tracing mode after loading triggers a geometry rebuild. The pixel cache is cleared after each rebuild so it does not hold ~3.5 GB of raw texture data forever, which meant that every rebuild read all 274 textures from disk again (9.7 s). A `prefetchTextures()` call at the start of each rebuild now refills the cache in parallel if it is empty. That brings the stall down from 10.5 s to ~2.5 to 5 s, depending on the mode.

The Compute and CPU path tracing modes also built two identical BVHs: one inside `CPURaytracer::setGeometry` and a second `m_rtBVH` for reordering the triangles in the GPU compute SSBO. Both traverse `scene.nodes` in the same order, so the permutation is the same. `CPURaytracer` now exposes `getBVH()` and `m_rtBVH` is assigned from it directly, which saves ~2.2 s per Compute RT rebuild. Switching to CPU Raytrace or Compute Raytrace mode now takes ~5 s, HW RT takes ~2.5 s.

Every render-mode switch used to force a full geometry rebuild, even between two RT modes (e.g. CPU → Compute). The rebuild is only necessary when leaving rasterizer mode, because gizmo edits are deferred there. RT→RT switches now skip it, and the existing `m_cpuBVHDirty` flag still triggers a rebuild when a mode needs the CPU BVH for the first time (e.g. HW RT → CPU RT). Switching between CPU RT and Compute RT is instant now.

</details>

Clicking an object in the viewport highlights it with a screen-space outline. The selected geometry is rendered as a solid silhouette into an offscreen mask, and the tone-map pass dilates that mask with a 5×5 kernel and draws it as an orange ring over the final image.

<div style="text-align:center; color:#888; font-size:0.85em;">
      <img class="lb" src="{% thumb '/images/Engine/Engine_Selection.png', 1100 %}" alt="Full editor layout" style="max-width:100%" loading="lazy">

      Scene: [Chess Set](https://polyhaven.com/a/chess_set) (CC0)
</div>

Selected objects can also be transformed directly in the viewport with W (translate), E (rotate) and R (scale), and G toggles between local and global space. The gizmo is drawn with the ImGui draw list, so it needs no extra GPU passes. The pivot point comes from the AABB of the geometry and not from the matrix origin, so scaling and rotating always stay anchored to the visual center of the object. All operations are recorded as undoable commands (Ctrl+Z / Ctrl+Y), and Ctrl+D duplicates the selected object. Primitive objects (plane, cube, UV sphere and cylinder) can be created directly from the hierarchy panel.

<details>
<summary>Picking, selection & outline details</summary>

Both backends share the same selection setup:

- Left-click coordinates come from the ImGui viewport (top-left origin) and are queued as a pick request.
- `pick()` runs once per click and returns a `{groupIdx, submeshIdx}` pair that drives the selection state.
- The selection feeds a mask render pass every frame: selected geometry is drawn as solid white into a dedicated color-only framebuffer (`m_outlineMaskFB`). The pass also runs when nothing is selected (clear to black), so the image is always in a valid sampler state.
- The outline composite runs inside the existing tone-map fullscreen pass. A 5×5 box dilation over the mask gives `ring = dilated × (1 − original)`, which is drawn in orange over the tone-mapped image.

Picking itself works differently in the two backends:

| | OpenGL | Vulkan |
|---|---|---|
| Method | GPU ID render + pixel readback | CPU Möller-Trumbore ray-triangle intersection |
| Resources | Dedicated `m_pickShader`, `m_pickFB` | None, uses `SceneMesh::meshData` CPU vertices |
| Result | `readPixel(x, y) − 1` → flat draw index → `{group, submesh}` | Nearest-`t` triangle hit → `{group, submesh}` |
| GPU sync | `glReadPixels` stalls the pipeline | Zero GPU involvement |

Rendering the outline mask:

| | OpenGL | Vulkan |
|---|---|---|
| Uniform order | `bind()` first, then `setMat4()`, because `glUniform*` needs a bound program | `setMat4()` first, then `bind()`, because `bind()` flushes the UBO to the GPU |
| Depth test | Disabled explicitly (`glDisable`) and restored after | Disabled via pipeline state at `createPipeline(depthTest=false)` |
| Image layout | Managed implicitly by the driver | Render pass transitions color attachment to `SHADER_READ_ONLY_OPTIMAL` at `vkCmdEndRenderPass`, so no explicit barrier is needed before sampling |

And the outline composite:

| | OpenGL | Vulkan |
|---|---|---|
| Mask binding | `GL_TEXTURE1` + `setInt("u_outlineMask", 1)` | `setExternalTextureVK(slot=1)` → descriptor set 2 (`layout(set=2, binding=0)`) |
| Enable flag | `uniform bool u_enableOutline` | Push constant at byte offset 128 (`layout(offset=128) uint enableOutline`) |
| Flag dispatch | `setBool` → `glUniform1i` | `setBool` → immediate `vkCmdPushConstants` |

</details>

<details>
<summary>Gizmo implementation details</summary>

All three modes work in world space. The gizmo target is the selected scene node, and its world matrix comes from walking the parent chain (`getWorldMatrix` = recursive parent × local). To write the result back, the new world matrix is converted to local space with `inverse(parentWorld) × newWorld`.

For translation, a ray from the camera through the cursor is projected onto the axis line. The accumulated offset is `newWorld[3] += axis × worldDist`, applied directly to the translation column. `glm::translate` would apply the offset in local space instead, which gives wrong results when the object is rotated.

For rotation, a ray-plane intersection gives the hit point of the cursor on the plane perpendicular to the rotation axis. The angle is `atan2(cross · axis, dot)` relative to a reference vector frozen at drag start, so the handle follows the cursor continuously and does not snap to an absolute angle.

For scaling, the pivot is kept in place analytically: after scaling the matrix, the translation column is corrected with `newWorld[3] = pivot − newWorld × localCenter`, where `localCenter` is the AABB center in local space frozen at drag start. That way the pivot stays where it is while the mesh grows. The center knob scales uniformly and is tested first in the hit list, so it always takes priority over the axis handles.

For undo/redo, every drag end pushes a `CmdSetTransform` command onto a 50-deep deque-based command stack. The command stores the before and after local matrices directly, so nothing has to be converted when it is applied. Drag-and-drop in the hierarchy emits a `CmdReparent` command that adjusts `parentIndex`, `childIndices` and the local matrix to keep the world position. Ctrl+Z/Y walk the stack, and Ctrl+D emits a `CmdAddNode` that duplicates the selected node as a sibling.

</details>

## Dual backend: OpenGL & Vulkan

VexEngine supports two graphics APIs, selected at compile time with a CMake flag. All GPU concepts (shaders, framebuffers, meshes, textures) sit behind a common interface, and the application layer never calls GL or VK functions directly. This forced me to think carefully about where the abstraction boundaries belong. It also means every feature has to run twice, which is a good way to catch design mistakes early.

OpenGL is the simpler backend and makes iteration fast: shader hot reload works with F5 and the driver handles a lot of state implicitly. In Vulkan everything has to be declared explicitly: render passes, descriptor sets, pipeline layouts, synchronization barriers. In return it gives me hardware ray tracing through `VK_KHR_ray_tracing_pipeline`, which would not have been possible with OpenGL. [vk-bootstrap](https://github.com/charles-lunarg/vk-bootstrap) handles instance and device setup and [VMA](https://github.com/GPUOpen-LibrariesAndSDKs/VulkanMemoryAllocator) manages GPU memory allocation. Both cut boilerplate without hiding anything important.

<div style="margin:1.5rem auto; width:100%">
  <div class="img-compare" onmousemove="var x=event.offsetX,w=this.offsetWidth,l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(w-x)+'px 0 0)';d.style.left=x+'px'" ontouchmove="var r=this.getBoundingClientRect(),x=Math.max(0,Math.min(event.touches[0].clientX-r.left,r.width)),l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(r.width-x)+'px 0 0)';d.style.left=x+'px';event.preventDefault()">
    <img class="ic-right" src="{% thumb '/images/Engine/Engine_Compare_PT.png', 1100 %}" alt="Vulkan hardware ray tracing" loading="lazy">
    <img class="ic-left" src="{% thumb '/images/Engine/Engine_Compare_Rast.png', 1100 %}" alt="OpenGL rasterizer" loading="lazy">
    <div class="ic-line"></div>
    <span class="ic-label ic-label-left">Rasterizer (OpenGL)</span>
    <span class="ic-label ic-label-right">Path Tracer (Vulkan)</span>
  </div>
  <div style="text-align:center; color:#888; font-size:0.85em; margin-top:0.5rem">
  
  Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)</div>
</div>

## Rasterization & debug views

Both backends have a standard rasterizer for fast interactive preview. It is the default mode for moving around the scene and placing objects before starting a more expensive path trace. The rasterized image goes into an HDR intermediate framebuffer and then through a fullscreen tone-map pass that applies ACES tone mapping and exposure / gamma correction before display.

On top of the shaded view there are several debug visualization modes that can be switched on at any time from the viewport:

<div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.5rem; margin:1.5rem 0">
    <figure style="margin:0">
      <img class="lb" src="{% thumb '/images/Engine/Engine_Debug_Shaded.png', 600 %}" style="width:100%; border-radius:4px" alt="Shaded" loading="lazy">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">Shaded</figcaption>
    </figure>
    <figure style="margin:0">
      <img class="lb" src="{% thumb '/images/Engine/Engine_Debug_Wireframe.png', 600 %}" style="width:100%; border-radius:4px" alt="Wireframe" loading="lazy">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">Wireframe</figcaption>
    </figure>
    <figure style="margin:0">
      <img class="lb" src="{% thumb '/images/Engine/Engine_Debug_Normals.png', 600 %}" style="width:100%; border-radius:4px" alt="Normals" loading="lazy">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">Normals</figcaption>
    </figure>
    <figure style="margin:0">
      <img class="lb" src="{% thumb '/images/Engine/Engine_Debug_Albedo.png', 600 %}" style="width:100%; border-radius:4px" alt="Albedo" loading="lazy">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">Albedo</figcaption>
    </figure>
    <figure style="margin:0">
      <img class="lb" src="{% thumb '/images/Engine/Engine_Debug_UVs.png', 600 %}" style="width:100%; border-radius:4px" alt="UVs" loading="lazy">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">UVs</figcaption>
    </figure>
    <figure style="margin:0">
      <img class="lb" src="{% thumb '/images/Engine/Engine_Debug_MatID.png', 600 %}" style="width:100%; border-radius:4px" alt="Material ID" loading="lazy">
      <figcaption style="text-align:center; color:#888; font-size:0.8em; margin-top:0.3rem">Material ID</figcaption>
    </figure>
    
    <div style="grid-column:1/-1; text-align:center; color:#888; font-size:0.85em;">Scene: [Vintage Video Camera](https://polyhaven.com/a/vintage_video_camera) (CC0)</div>
  </div>

- Wireframe, for checking topology and geometry density
- Normals as RGB, for checking mesh quality and normal maps
- Albedo, emission and material ID, which isolate single shading components
- UVs as colors, good for spotting seams and mapping problems
- Depth in grayscale, for checking the near and far plane settings
- Roughness, metallic and AO, read from the correct channel of ARM-packed textures (G/B/R) or from the scalar fallback

## Shadow mapping

The rasterizer supports shadow mapping for the directional (sun) light on both backends. A depth-only pass renders the scene from the sun into a 4096×4096 shadow map, and the main shading pass samples it to decide whether a surface point is lit or in shadow. A PCF 3×3 kernel makes the shadows soft, and the shadow frustum is fitted tightly to the scene geometry so no texel resolution is wasted. The hard part is getting the bias right. I combine three techniques that together remove both acne and peter-panning across a wide range of sun angles. The Sun inspector has a Normal Bias slider and an inline debug view of the shadow map.

<div style="margin:1.5rem auto; width:100%">
  <div class="img-compare" onmousemove="var x=event.offsetX,w=this.offsetWidth,l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(w-x)+'px 0 0)';d.style.left=x+'px'" ontouchmove="var r=this.getBoundingClientRect(),x=Math.max(0,Math.min(event.touches[0].clientX-r.left,r.width)),l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(r.width-x)+'px 0 0)';d.style.left=x+'px';event.preventDefault()">
    <img class="ic-right" src="{% thumb '/images/Engine/Engine_Chess_SM.png', 1100 %}" alt="PCF shadow mapping" loading="lazy">
    <img class="ic-left" src="{% thumb '/images/Engine/Engine_Chess_NoSM.png', 1100 %}" alt="No shadows" loading="lazy">
    <div class="ic-line"></div>
    <span class="ic-label ic-label-left">Shadows off</span>
    <span class="ic-label ic-label-right">PCF shadow mapping</span>
  </div>
  <div style="text-align:center; color:#888; font-size:0.85em; margin-top:0.5rem">
  
  Scene: [Chess Set](https://polyhaven.com/a/chess_set) (CC0)</div>
</div>

<details>
<summary>Frustum fitting & bias</summary>

The orthographic frustum is fitted to the world-space AABB of all scene geometry. All eight corners of the AABB are projected into light view space and the exact min/max extents are read off directly, so no texels are wasted, no matter the scene size or sun angle. The AABB is computed once at scene load and cached. A 2% scale from the AABB center adds a small margin, so PCF samples near the edge of the frustum don't clamp to the border color.

For the bias there are two artifacts to balance: too little causes self-shadowing acne and too much causes peter-panning (the shadow detaches from its caster). I use three techniques together, which is the same approach Unity and Godot use:

- Normal offset bias moves the shadow lookup point along the surface normal by `sin(θ) × normalBias` before projection, instead of biasing the depth value. `sin(θ) = sqrt(1 − NdotL²)` is zero when the surface faces the light directly and largest at grazing angles. The offset is given in shadow-map texels and pre-multiplied by the world-space texel size on the CPU, so it scales with frustum and scene size automatically.
- Receiver plane depth bias (RPDB) is for the PCF kernel. The 3×3 kernel samples at ±1 texel offsets, and on a sloped receiver surface the correct reference depth is different for each tap. Using the same center depth for all nine samples causes acne on moderately lit faces. RPDB computes `dZ/dU` and `dZ/dV` from screen-space derivatives (`dFdx`/`dFdy`) and adjusts the reference depth of each tap to the receiver slope analytically.
- A small hardware constant depth bias (`glPolygonOffset` / `vkCmdSetDepthBias`) during shadow map rendering covers the rest, where `NdotL ≈ 1` and the normal offset is close to zero. The slope-scale component is zero on purpose: at grazing angles it diverges and brings back the peter-panning that the normal offset is supposed to avoid.

</details>

## Path tracing

The main rendering mode is a progressive path tracer, shown in the viewport on a fullscreen quad. It keeps accumulating samples in the background, so the longer the scene stays still, the cleaner the image gets. Any change to the camera, the geometry or the settings resets the accumulation and starts over.

<div style="margin:1.5rem 0">
  <div style="display:flex">
    <div style="flex:1; aspect-ratio:249/685; background-image:url('{% thumb '/images/Engine/Engine_Split_1_SPP.png', 1100 %}'); background-size:400% auto; background-position:0% 0%; border-right:1px solid var(--border)"></div>
    <div style="flex:1; aspect-ratio:249/685; background-image:url('{% thumb '/images/Engine/Engine_Split_16_SPP.png', 1100 %}'); background-size:400% auto; background-position:33.33% 0%; border-right:1px solid var(--border)"></div>
    <div style="flex:1; aspect-ratio:249/685; background-image:url('{% thumb '/images/Engine/Engine_Split_64_SPP.png', 1100 %}'); background-size:400% auto; background-position:66.67% 0%; border-right:1px solid var(--border)"></div>
    <div style="flex:1; aspect-ratio:249/685; background-image:url('{% thumb '/images/Engine/Engine_Split_512_SPP.png', 1100 %}'); background-size:400% auto; background-position:100% 0%"></div>
  </div>
  <div style="display:flex">
    <div style="flex:1; text-align:center; color:#888; padding:0.3rem 0; border-right:1px solid var(--border)">1 SPP</div>
    <div style="flex:1; text-align:center; color:#888; padding:0.3rem 0; border-right:1px solid var(--border)">16 SPP</div>
    <div style="flex:1; text-align:center; color:#888; padding:0.3rem 0; border-right:1px solid var(--border)">64 SPP</div>
    <div style="flex:1; text-align:center; color:#888; padding:0.3rem 0">512 SPP</div>
  </div>
  <div style="text-align:center; color:#888; font-size:0.85em; padding:0.3rem 0">Scene: Nvidia <a href="https://developer.nvidia.com/orca/amazon-lumberyard-bistro" target="_blank" rel="noopener">Amazon Lumberyard Bistro</a> (CC-BY 4.0)</div>
</div>

Ray-scene intersection uses a BVH built with binned SAH. The path tracer supports four kinds of light (emissive geometry, emissive textures, point/directional lights and an environment map), and Next Event Estimation (NEE) and Multiple Importance Sampling (MIS) keep the variance low. Russian Roulette decides the path depth, the specular lobe uses VNDF sampling [(Heitz 2018)](https://jcgt.org/published/0007/04/01/paper.pdf) and depth of field comes from a thin-lens camera. Anti-aliasing comes for free with jittered primary rays, and firefly clamping cuts extreme outliers during early convergence.

<details>
<summary>BVH acceleration</summary>

The BVH is built with a binned Surface Area Heuristic (SAH). The builder evaluates split candidates over binned intervals and produces a tree that minimises the expected traversal cost. Traversal is ordered: the closer child is visited first, which helps early termination and reduces the number of intersection tests significantly.

</details>

<details>
<summary>Ray-triangle intersection precision</summary>

The three software path tracers use Möller-Trumbore (MT) for ray-triangle intersection. MT computes the determinant `a = dot(edge1, cross(dir, edge2))`, which equals `−dot(dir, geoNormal) × 2 × area`. Two choices in that formulation decide how robust it is at grazing angles.

The first is the epsilon for near-parallel rays. When `a` approaches zero, the ray is nearly coplanar with the triangle. A naive absolute threshold rejects valid near-grazing hits on small triangles, because `|a| = sin(θ) × 2 × area`, so the smallest accepted angle grows as triangles get smaller. I use `1e-9`, which is well below the range where the floating-point division becomes unstable but still lets genuinely shallow hits through. The t-threshold (the self-intersection guard) is a separate `1e-7`, since it works in world-space distance and not in determinant scale.

The second is a tolerance on the barycentric bounds. Even when `a` passes the epsilon check, `f = 1/a` can be large at shallow angles and amplify the rounding error in the dot products for `u` and `v`. A ray that lands exactly on a triangle edge can then compute slightly outside `[0, 1]`. So instead of a strict simplex test I allow `1e-5` of outward slack on all three edges. The coordinates are not clamped before use: normals, UVs and tangents are interpolated with the raw values, because a `1e-5` extrapolation past an edge is imperceptible and adjacent triangles share the same vertex data at their boundary anyway.

Both tolerances have a limit: they are absolute and not relative to the triangle size. On large triangles the `1e-9` epsilon still rejects extreme grazing angles, and on very small triangles the `1e-5` UV slack is a proportionally larger fraction of the triangle and could admit a hit in a gap at a non-manifold edge or T-junction.

</details>

<details>
<summary>Light sources & sampling</summary>

Triangles with a solid emissive color (`Ke`) are area lights. They are collected into a CDF weighted by surface area, so NEE can sample points on their surface directly at every bounce. A path ray that hits one of these emitters terminates there, since the surface is a pure light source. MIS balances NEE and BSDF sampling to reduce variance.

Materials with `map_Ke` work differently. Their emission varies per texel, so they are left out of the light CDF and can't be NEE-sampled. They only contribute when a ray happens to hit them, and unlike solid emitters they keep scattering through their base material (they are glowing surfaces and not light sources).

Point and directional lights have their own NEE paths. Point lights use inverse-square falloff. The sun has a configurable angular radius, and shadow rays are jittered inside that cone to get soft shadows.

For environment lighting an HDR environment map provides image-based lighting. A 2D CDF (conditional + marginal) is precomputed so NEE samples the bright regions of the sky more often, and MIS balances environment and BSDF sampling.

All four NEE strategies run independently at every bounce. The emissive material contribution can be switched off to isolate the explicit light sources.

</details>

<details>
<summary>Russian Roulette path termination</summary>

After the first two bounces, every bounce computes a survival probability equal to the luminance of the current path throughput, capped at 0.95. The path terminates with probability `1 − p`, and if it survives, the throughput is divided by `p` so the estimator stays unbiased. Paths through dark surfaces lose energy quickly and end early, bright paths keep going. That makes a higher maximum depth cheap in practice, since most paths end long before the cap.

</details>

<details>
<summary>VNDF specular sampling</summary>

The specular lobe uses VNDF sampling ([Heitz 2018](https://jcgt.org/published/0007/04/01/)) instead of plain NDF sampling. NDF sampling draws half-vectors without looking at the view direction, so at grazing angles it often produces reflected directions below the surface, which wastes the sample and loses energy. VNDF only draws half-vectors that are visible from the current view direction, which removes most of these invalid samples.

</details>

<details>
<summary>Depth of field</summary>

Depth of field uses a thin-lens camera model. Instead of firing all rays from a single point (pinhole), each primary ray starts at a random position on a disk with configurable radius (the aperture) and is aimed at a focal plane at a configurable distance. Objects on the focal plane are perfectly sharp, and nearer or farther objects get a circle of confusion that grows with distance. Concentric disk mapping keeps the sample distribution uniform across the lens. An aperture of zero falls back to exact pinhole behaviour without overhead. The CPU and GPU path tracers share the same model.

</details>

The algorithm is the same in all four backends. They only differ in where it runs:

- CPU: the original implementation, running on the host. It is slow, but I can step through every ray in a debugger, which helped a lot while I was building the lighting and sampling logic.
- GPU (OpenGL compute): the same algorithm ported to a GLSL compute shader. It runs in parallel on the GPU and is much faster, and it supports live shader reload (F5) for fast iteration.
- GPU (Vulkan compute): algorithmically identical to the OpenGL compute path, ported to Vulkan. It uploads a CPU-built BVH as an SSBO and dispatches a single `pathtracer.comp` compute shader in 8×8 workgroups. This one works on any Vulkan device, with or without hardware RT support.
- GPU (Vulkan HW RT): uses hardware ray tracing (`VK_KHR_ray_tracing_pipeline`), so the RT cores do the BVH traversal and ray-triangle intersection. The algorithm is split over five shader stages (rgen, rmiss, shadow rmiss, rchit, rahit), with an iterative loop in the ray generation shader to stay within a recursion depth of one.

<div style="text-align:center; color:#888; font-size:0.85em;">
      <img class="lb" src="{% thumb '/images/Engine/Engine_010.png', 1100 %}" alt="Full editor layout" style="max-width:100%" loading="lazy">

      Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)
</div>

## Volumetric participating media

The path tracer supports physically based participating media (fog, haze, light shafts and colored smoke) as regular scene objects. A volume is an axis-aligned box that can be placed anywhere in the scene, or set to infinite mode for global atmospheric effects. Each volume has three parameters: density (σt, the extinction coefficient), scatter color (per-channel scattering albedo, so volumes can be tinted) and anisotropy (the Henyey-Greenstein *g* parameter, which controls whether light scatters forward, backward or isotropically).

Everything is analytical, so the volumes need no extra geometry, BVH nodes or TLAS instances. At every path tracing bounce each volume is intersected with the ray using a slab test. If the ray enters a volume, a free-flight distance is drawn with exponential importance sampling. If that distance is shorter than the distance to the surface hit, a scatter event happens: the throughput is weighted by the scattering albedo, a new direction is drawn from the Henyey-Greenstein distribution and NEE samples all active lights with the phase function as the directional weight. If nothing scatters inside the slab, Beer-Lambert transmittance attenuates the throughput by `exp(−σt × path length)` and the ray continues to the surface.

Anisotropy (*g*) shapes the scattering lobe: *g* = 0 gives isotropic fog, *g* → +1 pushes the scattering forward and gives glowing halos around lights seen through haze, and *g* < 0 scatters light back toward the source.

<div style="text-align:center; color:#888; font-size:0.85em;">
      <img class="lb" src="{% thumb '/images/Engine/Engine_Bistro_Fog.png', 1100 %}" alt="Volumetric fog in the Bistro scene" style="max-width:100%" loading="lazy">

      Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)
</div>

## Denoising

Even a well-optimised path tracer needs many samples before the image looks clean. At 1 SPP the noise is severe, and a result that looks converged can take hundreds of passes. So instead of waiting, I integrated [Intel Open Image Denoise (OIDN)](https://www.openimagedenoise.org/) as a one-click post-process that runs on the CPU and gives a clean result in a fraction of a second.

The integration runs entirely on the CPU side and does not depend on the backend. When samples have been accumulated, a "Denoise" button shows up in the Settings panel. Pressing it reads back the current accumulation buffer as linear HDR float RGB (before any tone mapping), runs OIDN's RT filter on it and then applies the same exposure, ACES tone mapping and gamma correction as the live display. The result replaces the viewport image and accumulation is frozen. Moving the camera or changing any scene parameter clears the denoised result and restarts accumulation from zero.

For the two Vulkan GPU path tracers (HW RT and compute) the readback copies the RGBA32F accumulation image from device memory into a CPU-side staging buffer with an immediate-submit command, divides out the per-pixel sample counter stored in the alpha channel and passes the linear HDR data directly to OIDN. The CPU path tracer already has its accumulation buffer on the host, so there is nothing to copy.

A second mode, Denoise+, gives OIDN two extra feature buffers next to the noisy color input: first-hit albedo and first-hit world-space normal. OIDN's RT filter uses them to separate lighting noise from surface texture and to respect geometric edges, which improves the result a lot at very low sample counts where color-only denoising struggles. Each backend captures the data at the primary ray hit. The GPU path tracers write it to dedicated `rgba32f` storage images at depth 0 in the shader, and the CPU path tracer stores it in per-pixel auxiliary buffers that are filled on the first bounce. Both buffers are the same for every sample (first-hit data is deterministic), so writing them every frame costs nothing. The comparison below is at 1 SPP, so a single sample per pixel.

<div style="margin:1.5rem auto; width:100%">
  <div class="img-compare" onmousemove="var x=event.offsetX,w=this.offsetWidth,l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(w-x)+'px 0 0)';d.style.left=x+'px'" ontouchmove="var r=this.getBoundingClientRect(),x=Math.max(0,Math.min(event.touches[0].clientX-r.left,r.width)),l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(r.width-x)+'px 0 0)';d.style.left=x+'px';event.preventDefault()">
    <img class="ic-right" src="{% thumb '/images/Engine/Engine_BistroInterior_1_SPP_denoised_extra.png', 1100 %}" alt="OIDN Denoise+ (albedo + normal)" loading="lazy">
    <img class="ic-left" src="{% thumb '/images/Engine/Engine_BistroInterior_1_SPP_raw.png', 1100 %}" alt="1 SPP raw" loading="lazy">
    <div class="ic-line"></div>
    <span class="ic-label ic-label-left">1 SPP (raw)</span>
    <span class="ic-label ic-label-right">Denoise+ (albedo + normal)</span>
  </div>
  <div style="text-align:center; color:#888; font-size:0.85em; margin-top:0.5rem">

  Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)</div>
</div>

## Post-processing

The post-processing stack sits between the HDR render and the final display output. Every render path (rasterizer and path tracer, OpenGL and Vulkan) shares the same pipeline: bloom composited in linear HDR space, then ACES tone mapping and exposure / gamma correction in a single fullscreen pass.

Bloom runs in three stages on a half-resolution offscreen framebuffer:

1. Threshold: a fragment shader reads the HDR source, converts each pixel to luminance and applies a soft ramp. Pixels below the threshold contribute nothing, and pixels above it contribute in proportion to how far they exceed it. Only bright surfaces like emissive materials, specular highlights and direct light hits get through.

2. Separable Gaussian blur: two ping-pong framebuffers alternate horizontal and vertical 9-tap Gaussian passes (σ ≈ 1.5). Running the blur several times spreads the glow further without a wider kernel.

3. Composite: the blurred bloom map is added onto the HDR image with a configurable intensity, before tone mapping. Because this happens in HDR space, the glow of an overexposed surface stays bright through the tone mapper and does not get clipped to a flat white halo.

The GPU path tracers needed one extra step. Their accumulation buffer stores a running sum over N samples and not a normalised average, so the threshold shader divides by the sample count before it extracts bright pixels. Without that, the bloom contribution would grow linearly with N and blow the image out to white after enough samples.

<div style="margin:1.5rem auto; width:100%">
  <div class="img-compare" onmousemove="var x=event.offsetX,w=this.offsetWidth,l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(w-x)+'px 0 0)';d.style.left=x+'px'" ontouchmove="var r=this.getBoundingClientRect(),x=Math.max(0,Math.min(event.touches[0].clientX-r.left,r.width)),l=this.querySelector('.ic-left'),d=this.querySelector('.ic-line');l.style.clipPath='inset(0 '+(r.width-x)+'px 0 0)';d.style.left=x+'px';event.preventDefault()">
    <img class="ic-right" src="{% thumb '/images/Engine/Engine_Compare_Bloom.png', 1100 %}" alt="Bloom on" loading="lazy">
    <img class="ic-left" src="{% thumb '/images/Engine/Engine_Compare_NoBloom.png', 1100 %}" alt="Bloom off" loading="lazy">
    <div class="ic-line"></div>
    <span class="ic-label ic-label-left">Bloom off</span>
    <span class="ic-label ic-label-right">Bloom on</span>
  </div>
  <div style="text-align:center; color:#888; font-size:0.85em; margin-top:0.5rem">

  Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)</div>
</div>

## Materials and textures

The materials use a PBR pipeline built on the Cook-Torrance [microfacet model](https://pbr-book.org/3ed-2018/Reflection_Models/Microfacet_Models) with a GGX normal distribution. There are three material types: Microfacet for the general case, Mirror for perfect specular surfaces and Dielectric for glass and other transmissive materials. They are loaded from OBJ/MTL files automatically and can be overridden per object in the inspector.

Textures can drive base color, normal, emission, roughness, metallic and ambient occlusion. OBJ/MTL files use separate greyscale maps per channel, while glTF files typically pack roughness, metallic and AO into a single ARM texture (R=AO, G=Roughness, B=Metallic). The engine handles both formats the same way: ARM maps are deduped at the `shared_ptr` level, so all three slots reference the same GPU texture object. Without a texture, the scalar material value is used as fallback.

Every material property can be edited live in the inspector without reloading the scene. A base color tint multiplies on top of the vertex or texture color for quick color variations. An emissive strength multiplier scales the emission independently of the map, so a glowing surface can go from off to extremely bright at any time. Alpha clip can be toggled per submesh, and for Dielectric materials an IOR preset popup has one-click values for common materials (water, glass, crystal, diamond).

<details>
<summary>Material types (from OBJ/MTL illum)</summary>

The engine maps OBJ/MTL fields to three internal material types, which can also be set by hand in the inspector.

| MTL condition | Type | materialType | BRDF |
|---|---|---|---|
| illum 0, 1, 2 (default) | Microfacet | 0 | Cook-Torrance GGX (diffuse + specular) |
| illum 3, 5 | Mirror | 1 | MirrorBSDF (delta, no NEE) |
| illum 4, 6, 7 | Dielectric | 2 | Fresnel reflect/refract (delta) |
| `d < 1` without alpha-clip texture | Dielectric | 2 | Fresnel reflect/refract (delta) |

The dispatch also treats Microfacet materials with `metallic > 0.99` and `roughness < 0.01` as a perfect mirror and sends them to MirrorBSDF, which avoids numerical issues at near-zero GGX alpha.

</details>

<details>
<summary>PBR parameter mapping</summary>

| MTL property | PBR parameter | Notes |
|---|---|---|
| Pr | roughness | PBR scalar (0-1), used directly when present |
| Ns (shininess) | roughness | Fallback: `clamp(1 - sqrt(max(Ns,0) / 1000), 0, 1)`, inverts Blender's export formula `Ns = (1−r)²×1000` |
| map_Pr | roughness texture | Preferred, expected in 0-1 PBR range |
| map_Ns | roughness texture | Fallback if map_Pr absent |
| Pm | metallic | PBR scalar (0-1), used directly when present |
| illum 3/5 | metallic | 1.0 (overrides Pm for mirror materials) |
| map_Pm | metallic texture | R channel sampled directly (0=dielectric, 1=metal) |
| Ni (IOR) | ior | Used directly for Dielectric (default 1.5) |
| Kd | baseColor | Vertex color (Ks for mirror, ignored for dielectrics since refraction is always clear) |
| d / Tr | materialType | `d < 1` without alpha-clip texture → Dielectric (type 2) |

</details>

<details>
<summary>Roughness range examples</summary>

| Ns | Roughness | Appearance |
|---|---|---|
| 0 | 1.00 | Fully rough |
| 10 | 0.90 | Very rough |
| 100 | 0.68 | Moderately rough |
| 200 | 0.55 | Semi-rough (typical Blender interior material) |
| 500 | 0.29 | Fairly glossy |
| 1000 | 0.00 | Mirror-smooth |

</details>

<details>
<summary>Where Cook-Torrance is not used</summary>

- Mirror (type 1) always dispatches to the delta MirrorBSDF (set by illum 3/5 in the MTL or by hand in the inspector). Roughness and metallic are ignored, and the surface albedo tints the reflection.
- Microfacet materials with `metallic > 0.99` and `roughness < 0.01` also go to MirrorBSDF (the perfect mirror shortcut from the material types).
- Dielectric (type 2) uses delta Fresnel reflect/refract (Snell's law). Refraction transmits with full throughput and the surface has no absorption, so the glass is perfectly clear. Tinted glass would need Beer-Lambert attenuation over distance, which is left to the volumetric system. Rough dielectrics would need microfacet transmission, which is a separate feature.

</details>
<br>
<div style="text-align:center; color:#888; font-size:0.85em;">
      <img class="lb" src="{% thumb '/images/Engine/Engine_BistroInterior_Denoised.png', 1100 %}" alt="Bistro interior path traced render" style="max-width:100%" loading="lazy">

      Scene: Nvidia [Amazon Lumberyard Bistro](https://developer.nvidia.com/orca/amazon-lumberyard-bistro) (CC-BY 4.0)
</div>

## Resources

Some of the resources that influenced this project the most:

- [PBRT](https://www.pbr-book.org/): the reference book on physically based rendering. It covers BVH, microfacet theory, MIS, participating media and more in full mathematical depth
- [Ray Tracing in One Weekend](https://raytracing.github.io/): the classic starting point for writing a path tracer
- [Scratchapixel](https://www.scratchapixel.com/): derivations from scratch for ray tracing, Monte Carlo integration and the math of volume rendering
- [How to Build a BVH (Jacco Bikker)](https://jacco.ompf2.com/2022/04/13/how-to-build-a-bvh-part-1-basics/): a hands-on series in several parts about binned SAH construction and ordered traversal
- [Understanding the Masking-Shadowing Function in Microfacet-Based BRDFs (Heitz 2014)](https://jcgt.org/published/0003/02/03/): the math behind the GGX distribution and the Cook-Torrance BSDF
- [Sampling the GGX Distribution of Visible Normals (Heitz 2018)](https://jcgt.org/published/0007/04/01/paper.pdf): the VNDF sampling paper I use for the specular lobe
- [vkguide.dev](https://vkguide.dev/): a practical, modern Vulkan tutorial
- [Nvidia Vulkan Ray Tracing Tutorial](https://nvpro-samples.github.io/vk_raytracing_tutorial_KHR/): a step-by-step guide to `VK_KHR_ray_tracing_pipeline`, rgen/rmiss/rchit shaders and the TLAS/BLAS setup
- [LearnOpenGL](https://learnopengl.com/): comprehensive OpenGL tutorials
- [Ray Tracing Gems I & II](https://www.realtimerendering.com/raytracinggems/): free books with in-depth chapters on sampling, denoising, participating media and hardware ray tracing

VexEngine is an ongoing project, and the checklist at the top shows what I am planning to work on next. It goes from low-level GPU API work and acceleration structures to physically based shading and editor tooling, and I built every part of it myself.

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
