// Home page: projects as lit monoliths in a fogged void. Scroll glides the
// camera from station to station; the HTML stays the source of every fact.

import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Vector3, Vector2, Group,
  PlaneGeometry, BoxGeometry, EdgesGeometry, BufferGeometry, Float32BufferAttribute,
  ShaderMaterial, LineBasicMaterial, MeshBasicMaterial, Mesh, LineSegments, Points,
  TextureLoader, VideoTexture, SRGBColorSpace, AdditiveBlending, CatmullRomCurve3,
  MathUtils, LinearFilter, FogExp2, LineLoop,
} from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const html = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const VOID = new Color(0x070b12);
const AMBER = new Color(0xffa833);
const GLASS = new Color(0xa7b2c2);
const FOG_DENSITY = 0.032;

function supportsGL() {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch (e) { return false; }
}

// Panels light up while their room is on screen, with or without WebGL.
document.querySelectorAll('.room-panel').forEach(panel => {
  ScrollTrigger.create({ trigger: panel, start: 'top 80%', end: 'bottom 20%', toggleClass: 'is-active' });
});

if (supportsGL()) start();

function start() {
  const canvas = document.createElement('canvas');
  canvas.className = 'void-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(VOID, 1);
  renderer.outputColorSpace = SRGBColorSpace;
  const narrow = () => innerWidth < 760;
  const setSize = () => {
    renderer.setPixelRatio(Math.min(devicePixelRatio, narrow() ? 1.5 : 1.75));
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.fov = camera.aspect < 1 ? 62 : 42;
    camera.updateProjectionMatrix();
  };

  const scene = new Scene();
  scene.fog = new FogExp2(VOID, FOG_DENSITY);
  const camera = new PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 120);
  setSize();

  const loader = new TextureLoader();
  const loadTex = url => new Promise(res => loader.load(url, t => {
    t.colorSpace = SRGBColorSpace;
    t.minFilter = LinearFilter;
    t.generateMipmaps = false;
    res(t);
  }, undefined, () => res(null)));

  // ── Shared shader bits: exponential fog, matching the clear colour ──
  const fogGLSL = `
    uniform vec3 uFog; uniform float uFogDensity;
    vec3 applyFog(vec3 c, float d) { float f = 1.0 - exp(-uFogDensity * uFogDensity * d * d); return mix(c, uFog, clamp(f, 0.0, 1.0)); }
  `;

  // ── Image face: two textures crossfading, dimmed when inactive, with a
  // mirrored copy under the floor that fades out ──
  function faceMaterial(reflect) {
    return new ShaderMaterial({
      transparent: true,
      depthWrite: !reflect,
      uniforms: {
        map0: { value: null }, map1: { value: null }, uMix: { value: 0 },
        uLit: { value: 0.35 }, uAlpha: { value: 0 },
        uFog: { value: VOID }, uFogDensity: { value: FOG_DENSITY },
      },
      vertexShader: `
        varying vec2 vUv; varying float vDist;
        void main() {
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform sampler2D map0; uniform sampler2D map1; uniform float uMix; uniform float uLit; uniform float uAlpha;
        varying vec2 vUv; varying float vDist;
        ${fogGLSL}
        void main() {
          vec2 uv = ${reflect ? 'vec2(vUv.x, 1.0 - vUv.y)' : 'vUv'};
          vec3 c = mix(texture2D(map0, uv).rgb, texture2D(map1, uv).rgb, uMix);
          c *= mix(0.12, 1.0, uLit);
          float a = uAlpha;
          ${reflect ? 'a *= smoothstep(0.0, 1.0, vUv.y) * 0.22; c *= 0.7;' : ''}
          gl_FragColor = linearToOutputTexel(vec4(applyFog(c, vDist), a));
        }`,
    });
  }

  // ── Soft glow card behind a monolith, additive ──
  function glowMaterial() {
    return new ShaderMaterial({
      transparent: true, depthWrite: false, blending: AdditiveBlending,
      uniforms: { uColor: { value: AMBER.clone() }, uStrength: { value: 0 }, uSize: { value: new Vector2(1, 1) }, uInner: { value: new Vector2(1, 1) } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform vec3 uColor; uniform float uStrength; uniform vec2 uSize; uniform vec2 uInner; varying vec2 vUv;
        void main(){
          vec2 p = abs(vUv - 0.5) * uSize;
          float dist = length(max(p - uInner * 0.5, 0.0));
          float outside = step(0.0001, dist);
          float g = exp(-dist * 14.0) * outside;
          gl_FragColor = linearToOutputTexel(vec4(uColor * g * uStrength, 1.0));
        }`,
    });
  }

  // ── Monolith: glass slab with an image face, edge lines and glow ──
  function makeMonolith({ w, h, d = 0.14, pos, rotY = 0, accent = true }) {
    const g = new Group();
    g.position.copy(pos);
    g.rotation.y = rotY;

    const glass = new Mesh(new BoxGeometry(w + 0.12, h + 0.12, d), new MeshBasicMaterial({
      color: 0x16202e, transparent: true, opacity: 0.35, depthWrite: false,
    }));
    g.add(glass);

    const face = new Mesh(new PlaneGeometry(w, h), faceMaterial(false));
    face.position.z = d / 2 + 0.005;
    g.add(face);

    const refl = new Mesh(new PlaneGeometry(w, h), faceMaterial(true));
    refl.position.set(0, -pos.y * 2, d / 2 + 0.005);
    g.add(refl);

    // One clean frame on the front face; the box edges would double it.
    const fw = (w + 0.12) / 2, fh = (h + 0.12) / 2;
    const frameGeo = new BufferGeometry();
    frameGeo.setAttribute('position', new Float32BufferAttribute([-fw, -fh, 0, fw, -fh, 0, fw, fh, 0, -fw, fh, 0], 3));
    const edgeMat = new LineBasicMaterial({ color: GLASS.clone(), transparent: true, opacity: 0.4 });
    const edges = new LineLoop(frameGeo, edgeMat);
    edges.position.z = d / 2 + 0.008;
    g.add(edges);

    const gw = w + 1.4, gh = h + 1.4;
    const glow = new Mesh(new PlaneGeometry(gw, gh), glowMaterial());
    glow.material.uniforms.uSize.value.set(gw, gh);
    glow.material.uniforms.uInner.value.set(w + 0.12, h + 0.12);
    glow.position.z = d / 2 + 0.002;
    g.add(glow);

    scene.add(g);
    return { group: g, face, refl, edgeMat, glow, accent, base: pos.clone(), lit: 0, textures: [], cycle: 0 };
  }

  function setTextures(m, t0, t1 = t0) {
    for (const mesh of [m.face, m.refl]) {
      mesh.material.uniforms.map0.value = t0;
      mesh.material.uniforms.map1.value = t1;
    }
  }

  function revealMonolith(m) {
    for (const mesh of [m.face, m.refl]) gsap.to(mesh.material.uniforms.uAlpha, { value: 1, duration: reduce ? 0 : 1.2, ease: 'power2.out' });
  }

  // ── Floor: faint grid fading into fog, with an amber pool under the focus ──
  const floor = new Mesh(new PlaneGeometry(200, 200), new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uFocus: { value: new Vector2() }, uFog: { value: VOID }, uFogDensity: { value: FOG_DENSITY }, uPool: { value: 0 } },
    vertexShader: `
      varying vec3 vWorld; varying float vDist;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vWorld = w.xyz; vec4 mv = viewMatrix * w; vDist = -mv.z; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `
      uniform vec2 uFocus; uniform float uPool; varying vec3 vWorld; varying float vDist;
      ${fogGLSL}
      void main(){
        vec2 g = abs(fract(vWorld.xz * 0.5) - 0.5) / fwidth(vWorld.xz * 0.5);
        float line = 1.0 - min(min(g.x, g.y), 1.0);
        vec3 c = uFog + vec3(0.65, 0.70, 0.78) * line * 0.012;
        float pool = exp(-dot(vWorld.xz - uFocus, vWorld.xz - uFocus) * 0.12) * uPool;
        c += vec3(1.0, 0.4, 0.03) * pool * 0.025;
        vec3 col = applyFog(c, vDist);
        gl_FragColor = linearToOutputTexel(vec4(col, 1.0));
      }`,
  }));
  floor.rotation.x = -Math.PI / 2;
  // Drawn first: as a huge transparent plane its sort distance ties with the
  // monoliths, and drawn after them it painted over their glow and reflections.
  floor.renderOrder = -1;
  scene.add(floor);

  // ── Empty glass towers: the memory field around the work ──
  const rand = mulberry32(7);
  const towerGroup = new Group();
  const towerEdge = new LineBasicMaterial({ color: GLASS, transparent: true, opacity: 0.22 });
  const towerFill = new MeshBasicMaterial({ color: 0x1a2433, transparent: true, opacity: 0.24, depthWrite: false });
  const dust = [];
  const towerCount = narrow() ? 14 : 26;
  for (let i = 0; i < towerCount; i++) {
    const w = 0.5 + rand() * 0.9, h = 2 + rand() * 6.5, dd = 0.5 + rand() * 0.9;
    const side = rand() < 0.5 ? -1 : 1;
    const x = side * (5.5 + rand() * 12), z = 6 - rand() * 46;
    const box = new BoxGeometry(w, h, dd);
    const fill = new Mesh(box, towerFill);
    const edge = new LineSegments(new EdgesGeometry(box), towerEdge);
    fill.position.set(x, h / 2, z); edge.position.copy(fill.position);
    towerGroup.add(fill, edge);
    const n = Math.round(h * 26);
    for (let k = 0; k < n; k++) dust.push(x + (rand() - 0.5) * w, rand() * h, z + (rand() - 0.5) * dd);
  }
  scene.add(towerGroup);

  // ── Motes: drifting dust in projector light, plus dust caught in towers ──
  const moteCount = narrow() ? 1400 : 3200;
  const motePos = [];
  for (let i = 0; i < moteCount; i++) motePos.push((rand() - 0.5) * 50, rand() * 12, 10 - rand() * 52);
  const moteGeo = new BufferGeometry();
  moteGeo.setAttribute('position', new Float32BufferAttribute(motePos.concat(dust), 3));
  const seeds = new Float32Array(moteCount + dust.length / 3);
  for (let i = 0; i < seeds.length; i++) seeds[i] = i < moteCount ? rand() : rand() * 0.14;
  moteGeo.setAttribute('seed', new Float32BufferAttribute(seeds, 1));
  const moteMat = new ShaderMaterial({
    transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uScale: { value: renderer.getPixelRatio() * innerHeight * 0.5 }, uFog: { value: VOID }, uFogDensity: { value: FOG_DENSITY } },
    vertexShader: `
      attribute float seed; uniform float uTime; uniform float uScale; varying float vA; varying float vDist;
      void main(){
        vec3 p = position;
        float rise = mod(p.y + uTime * (0.05 + seed * 0.1), 12.0);
        p.y = seed > 0.15 ? rise : p.y;
        p.x += sin(uTime * 0.2 + seed * 40.0) * 0.15;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vDist = -mv.z;
        vA = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + seed) + seed * 90.0));
        gl_PointSize = (0.03 + seed * 0.035) * uScale / vDist;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vA; varying float vDist;
      uniform vec3 uFog; uniform float uFogDensity;
      void main(){
        float r = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, r) * vA;
        float f = exp(-uFogDensity * uFogDensity * vDist * vDist * 0.6);
        gl_FragColor = linearToOutputTexel(vec4(vec3(0.62, 0.68, 0.78) * a * f, 1.0));
      }`,
  });
  scene.add(new Points(moteGeo, moteMat));

  // ── The work: monoliths fed from the HTML rooms ──
  const rooms = Array.from(document.querySelectorAll('[data-station]'));
  const monos = [];

  const engineEl = document.getElementById('room-vexengine');
  const engine = makeMonolith({ w: 3.6, h: 2.03, pos: new Vector3(2.4, 1.75, 0), rotY: -0.18 });
  engine.station = [0, 1];
  monos.push(engine);
  Promise.all(engineEl.dataset.tex.split('|').map(loadTex)).then(ts => {
    engine.textures = ts.filter(Boolean);
    if (!engine.textures.length) return;
    setTextures(engine, engine.textures[0]);
    revealMonolith(engine);
  });

  const waterEl = document.getElementById('room-water');
  const water = makeMonolith({ w: 3.4, h: 1.91, pos: new Vector3(9.5, 1.8, -9), rotY: -0.45 });
  water.station = [2];
  monos.push(water);
  const video = document.createElement('video');
  Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'auto', crossOrigin: 'anonymous' });
  video.src = waterEl.dataset.video;
  loadTex(waterEl.dataset.tex).then(t => { if (t) { setTextures(water, t); revealMonolith(water); } });
  const videoTex = new VideoTexture(video);
  videoTex.colorSpace = SRGBColorSpace;
  let videoLive = false;
  video.addEventListener('playing', () => { if (!videoLive) { videoLive = true; setTextures(water, videoTex); } });

  const puzzleEl = document.getElementById('room-puzzle');
  const phones = [];
  puzzleEl.dataset.phones.split('|').forEach((url, i) => {
    const m = makeMonolith({ w: 0.95, h: 1.69, d: 0.08, pos: new Vector3(-8.2 + i * 1.15, 1.25 + (i === 1 ? 0.18 : 0), -24 + Math.abs(i - 1) * 0.25), rotY: 0.3 });
    m.station = [3];
    phones.push(m); monos.push(m);
    loadTex(url).then(t => { if (t) { setTextures(m, t); revealMonolith(m); } });
  });

  // Jam games recede deeper in the field; they light up for "More work".
  const moreSpots = [[-2.6, 1.4, -31, 0.25], [1.0, 1.9, -34, 0], [4.6, 1.5, -32, -0.25], [-6.0, 1.7, -36, 0.35], [7.6, 1.8, -37, -0.35], [0.0, 1.3, -39, 0]];
  document.querySelectorAll('.more-list [data-tex]').forEach((li, i) => {
    const s = moreSpots[i % moreSpots.length];
    const m = makeMonolith({ w: 2.0, h: 1.13, pos: new Vector3(s[0], s[1], s[2]), rotY: s[3], accent: false });
    m.station = [4];
    monos.push(m);
    loadTex(li.dataset.tex).then(t => { if (t) { setTextures(m, t); revealMonolith(m); } });
  });

  // ── Camera stations: landscape framings, and portrait framings that put
  // the focus in the top half of a phone screen ──
  const wide = [
    { p: [0.4, 2.0, 8.2], t: [1.3, 1.45, -1.5] },
    { p: [-0.6, 1.8, 4.8], t: [1.0, 1.65, 0] },
    { p: [4.4, 1.8, -3.0], t: [8.7, 1.75, -9] },
    { p: [-3.8, 1.75, -18.4], t: [-7.4, 1.4, -24.2] },
    { p: [0.6, 3.4, -24.5], t: [0.8, 1.4, -35] },
    { p: [0.0, 11, -14], t: [0.0, 0.0, -22] },
  ];
  const tall = [
    { p: [2.4, 2.4, 7.4], t: [2.4, 1.2, 0] },
    { p: [2.3, 2.2, 6.2], t: [2.4, 1.25, 0] },
    { p: [6.9, 2.3, -3.6], t: [9.5, 1.3, -9] },
    { p: [-5.6, 2.0, -19.4], t: [-7.0, 0.95, -24] },
    { p: [0.8, 3.6, -25], t: [0.8, 1.0, -35] },
    { p: [0.0, 12, -14], t: [0.0, 0.0, -22] },
  ];
  // Portrait screens are narrow, so the hand-placed framings cut the work off
  // at the sides. For the work rooms the camera is fitted instead: it keeps
  // each station's viewing angle, backs off until the lit object fills about
  // 80% of the width and at most 30% of the height, and aims below it so the
  // object sits in the upper third, clear of the panel that scrolls in under it.
  const phoneCenter = phones.reduce((a, m) => a.add(m.base), new Vector3()).divideScalar(phones.length || 1);
  const frames = [
    { c: engine.base, hw: 3.6 / 2, hh: 2.03 / 2 },
    { c: engine.base, hw: 3.6 / 2, hh: 2.03 / 2 },
    { c: water.base, hw: 3.4 / 2, hh: 1.91 / 2 },
    { c: phoneCenter, hw: (2.3 + 0.95) / 2, hh: 1.69 / 2 + 0.18 },
  ];
  const fitTall = () => tall.map((st, i) => {
    const fr = frames[i];
    if (!fr) return st;
    const tanV = Math.tan(MathUtils.degToRad(camera.fov / 2));
    const tanH = tanV * camera.aspect;
    const c = fr.c.clone().setY(fr.c.y + 0.08);
    const d = Math.max(((fr.hw + 0.1) * 1.12) / (0.8 * tanH), ((fr.hh + 0.1) * 1.12) / (0.3 * tanV));
    const dir = new Vector3(...st.p).sub(new Vector3(...st.t)).normalize();
    const p = c.clone().addScaledVector(dir, d);
    const t = c.clone().setY(c.y - d * 0.42 * tanV);
    return { p: p.toArray(), t: t.toArray() };
  });

  let pathPos, pathTgt;
  const buildPaths = () => {
    const set = camera.aspect < 1 ? fitTall() : wide;
    pathPos = new CatmullRomCurve3(set.map(s => new Vector3(...s.p)), false, 'centripetal');
    pathTgt = new CatmullRomCurve3(set.map(s => new Vector3(...s.t)), false, 'centripetal');
  };
  buildPaths();
  const last = wide.length - 1;

  // Scroll position to a fractional station. Station i is reached when its
  // section top meets the viewport top; the camera holds there for the first
  // part of the section, then glides on so it arrives with the next panel.
  let anchors = [];
  const measure = () => {
    anchors = rooms.map((el, i) => i === 0 ? 0 : el.getBoundingClientRect().top + scrollY);
  };
  measure();
  const stationAt = y => {
    if (y <= anchors[0]) return 0;
    for (let i = 0; i < anchors.length - 1; i++) {
      if (y < anchors[i + 1]) {
        const span = anchors[i + 1] - anchors[i];
        const hold = Math.min(span * 0.45, innerHeight * 0.55);
        const t = MathUtils.clamp((y - anchors[i] - hold) / (span - hold), 0, 1);
        return i + (reduce ? Math.round(t) : smooth(t));
      }
    }
    return last;
  };

  const pointer = new Vector2();
  if (!reduce) addEventListener('pointermove', e => pointer.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5), { passive: true });

  // Stream links show which room the camera is in.
  const streamLinks = Array.from(document.querySelectorAll('.stream-list a'));

  let s = stationAt(scrollY);
  let visible = true;
  let cycleClock = 0;
  const tmpP = new Vector3(), tmpT = new Vector3(), look = new Vector3();
  look.copy(pathTgt.getPoint(s / last));

  html.classList.add('void-gl');

  gsap.ticker.add((time, delta) => {
    if (!visible) return;
    const dt = Math.min(delta, 50) / 1000;
    const target = stationAt(scrollY);
    s = reduce ? target : MathUtils.damp(s, target, 3.2, dt);
    const u = MathUtils.clamp(s / last, 0, 1);
    pathPos.getPoint(u, tmpP);
    pathTgt.getPoint(u, tmpT);
    tmpP.x += pointer.x * 0.35;
    tmpP.y -= pointer.y * 0.2;
    camera.position.copy(tmpP);
    look.lerp(tmpT, reduce ? 1 : 1 - Math.exp(-8 * dt));
    camera.lookAt(look);

    let focus = null, best = 0;
    for (const m of monos) {
      const w = Math.max(...m.station.map(st => 1 - Math.min(1, Math.abs(s - st))));
      m.lit = MathUtils.damp(m.lit, w, 5, dt);
      const k = m.lit;
      m.group.scale.setScalar(1 + 0.12 * k);
      m.group.position.y = m.base.y + (reduce ? 0 : Math.sin(time * 0.6 + m.base.z) * 0.04) + k * 0.08;
      m.edgeMat.color.copy(GLASS).lerp(m.accent ? AMBER : GLASS, k);
      m.edgeMat.opacity = 0.35 + 0.6 * k;
      m.glow.material.uniforms.uStrength.value = (m.accent ? 0.28 : 0) * k;
      for (const mesh of [m.face, m.refl]) mesh.material.uniforms.uLit.value = 0.25 + 0.75 * k;
      if (k > best) { best = k; focus = m; }
    }
    if (focus) floor.material.uniforms.uFocus.value.set(focus.group.position.x, focus.group.position.z);
    floor.material.uniforms.uPool.value = best;

    // The engine monolith cycles through its renders while it has focus.
    if (engine.textures.length > 1 && engine.lit > 0.6) {
      cycleClock += dt;
      if (cycleClock > 4) {
        cycleClock = 0;
        const next = (engine.cycle + 1) % engine.textures.length;
        setTextures(engine, engine.textures[engine.cycle], engine.textures[next]);
        const mix = [engine.face.material.uniforms.uMix, engine.refl.material.uniforms.uMix];
        mix.forEach(u => { u.value = 0; });
        gsap.to(mix, { value: 1, duration: reduce ? 0 : 1.1, ease: 'power2.inOut', onComplete: () => {
          engine.cycle = next;
          setTextures(engine, engine.textures[next]);
          mix.forEach(u => { u.value = 0; });
        } });
      }
    }

    const wantVideo = water.lit > 0.25;
    if (wantVideo && video.paused) video.play().catch(() => {});
    else if (!wantVideo && !video.paused) video.pause();

    const room = Math.round(s);
    streamLinks.forEach((a, i) => a.classList.toggle('is-current', room === i + 1));

    if (!reduce) moteMat.uniforms.uTime.value = time;
    renderer.render(scene, camera);
  });

  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  addEventListener('resize', () => {
    setSize();
    buildPaths();
    moteMat.uniforms.uScale.value = renderer.getPixelRatio() * innerHeight * 0.5;
    measure();
  });
  ScrollTrigger.addEventListener('refresh', measure);
  addEventListener('load', measure);
}

function smooth(t) { return t * t * (3 - 2 * t); }

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
