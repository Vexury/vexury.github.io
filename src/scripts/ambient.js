// Ambient field for every page except home: the fog floor and drifting dust of
// the home scene, drawn with raw WebGL2 so it costs a few KB instead of three.js.
// Scrolling glides the camera forward over the grid. Without WebGL2 the CSS
// gradient on body stays as the background.

const FOG_DENSITY = 0.032;
const VOID = srgbToLinear([0x07, 0x0b, 0x12]);
const HAZE = srgbToLinear([0x16, 0x20, 0x2e]);
const MOTE = [0.62, 0.68, 0.78];

function srgbToLinear(rgb) {
  return rgb.map(v => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
}

const ENCODE = `
  vec3 encode(vec3 c) {
    c = max(c, 0.0);
    return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
  }`;

const FLOOR_VS = `#version 300 es
  out vec2 vNdc;
  void main() {
    vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
    vNdc = p;
    gl_Position = vec4(p, 0.0, 1.0);
  }`;

const FLOOR_FS = `#version 300 es
  precision highp float;
  in vec2 vNdc;
  out vec4 outColor;
  uniform vec3 uEye;
  uniform mat3 uBasis;
  uniform vec2 uTan;
  uniform vec3 uVoid;
  uniform vec3 uHaze;
  uniform float uFogDensity;
  ${ENCODE}
  void main() {
    vec3 dir = normalize(uBasis * vec3(vNdc * uTan, -1.0));
    vec3 c = uVoid;
    // A soft haze around the horizon, like the projector light on home.
    float horizon = exp(-abs(dir.y) * 9.0);
    c = mix(c, uHaze, horizon * 0.55);
    if (dir.y < -0.0005) {
      float t = -uEye.y / dir.y;
      vec3 hit = uEye + dir * t;
      vec2 cell = hit.xz * 0.5;
      vec2 fw = fwidth(cell);
      vec2 g = abs(fract(cell) - 0.5) / fw;
      float line = 1.0 - min(min(g.x, g.y), 1.0);
      // Lines thinner than a pixel fade out instead of shimmering into moire.
      line *= 1.0 - smoothstep(0.12, 0.5, max(fw.x, fw.y));
      vec3 floorC = uVoid + vec3(0.65, 0.70, 0.78) * line * 0.009;
      float f = exp(-uFogDensity * uFogDensity * t * t);
      c = mix(c, floorC, f);
    }
    outColor = vec4(encode(c), 1.0);
  }`;

const MOTE_VS = `#version 300 es
  in vec3 aPos;
  in float aSeed;
  uniform mat4 uView;
  uniform mat4 uProj;
  uniform float uTime;
  uniform float uScale;
  uniform float uEyeZ;
  uniform float uMaxSize;
  out float vA;
  out float vDist;
  void main() {
    vec3 p = aPos;
    p.y = mod(p.y + uTime * (0.05 + aSeed * 0.1), 12.0);
    p.x += sin(uTime * 0.2 + aSeed * 40.0) * 0.15;
    // The field repeats along z so the camera never runs out of dust.
    p.z = uEyeZ + 6.0 - mod(uEyeZ + 6.0 - p.z, 52.0);
    vec4 mv = uView * vec4(p, 1.0);
    vDist = -mv.z;
    vA = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aSeed) + aSeed * 90.0));
    gl_PointSize = min((0.03 + aSeed * 0.035) * uScale / max(vDist, 0.1), uMaxSize);
    gl_Position = uProj * mv;
  }`;

const MOTE_FS = `#version 300 es
  precision highp float;
  in float vA;
  in float vDist;
  out vec4 outColor;
  uniform vec3 uMote;
  uniform float uFogDensity;
  ${ENCODE}
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, r) * vA;
    float f = exp(-uFogDensity * uFogDensity * vDist * vDist * 0.6);
    outColor = vec4(encode(uMote * a * f), 1.0);
  }`;

function compile(gl, vs, fs) {
  const prog = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  const u = {};
  const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const name = gl.getActiveUniform(prog, i).name;
    u[name] = gl.getUniformLocation(prog, name);
  }
  return { prog, u };
}

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };

function start() {
  if (document.documentElement.hasAttribute('data-paper')) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'void-canvas ambient-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;

  let floorP, moteP;
  try {
    floorP = compile(gl, FLOOR_VS, FLOOR_FS);
    moteP = compile(gl, MOTE_VS, MOTE_FS);
  } catch (e) {
    return;
  }
  document.body.prepend(canvas);

  const narrow = () => Math.min(innerWidth, innerHeight) < 700;
  const rand = mulberry32(11);
  const count = narrow() ? 900 : 2200;
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * 50;
    pos[i * 3 + 1] = rand() * 12;
    pos[i * 3 + 2] = 10 - rand() * 52;
    seed[i] = 0.15 + rand() * 0.85;
  }
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  for (const [name, data, size] of [['aPos', pos, 3], ['aSeed', seed, 1]]) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(moteP.prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }
  gl.bindVertexArray(null);
  const emptyVao = gl.createVertexArray();

  let w = 0, h = 0, dpr = 1;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, narrow() ? 1.25 : 1.5);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  addEventListener('resize', () => { resize(); if (reduce) frame(0); });

  const pointer = [0, 0];
  addEventListener('pointermove', e => {
    pointer[0] = e.clientX / innerWidth - 0.5;
    pointer[1] = e.clientY / innerHeight - 0.5;
  }, { passive: true });

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let camZ = 8 - scrollY * 0.004, px = 0, py = 0, last = performance.now();

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const k = reduce ? 1 : 1 - Math.exp(-3.2 * dt);
    camZ += (8 - scrollY * 0.004 - camZ) * k;
    px += (pointer[0] * 0.35 - px) * k;
    py += (pointer[1] * 0.2 - py) * k;

    const eye = [px, 2.0 - py, camZ];
    const target = [0, 0.95, camZ - 10];
    const f = norm(sub(target, eye));
    const r = norm(cross(f, [0, 1, 0]));
    const u = cross(r, f);
    const fov = (innerHeight > innerWidth ? 62 : 46) * Math.PI / 180;
    const ty = Math.tan(fov / 2), tx = ty * (w / h);

    gl.disable(gl.BLEND);
    gl.useProgram(floorP.prog);
    gl.bindVertexArray(emptyVao);
    gl.uniform3fv(floorP.u.uEye, eye);
    gl.uniformMatrix3fv(floorP.u.uBasis, false, [...r, ...u, -f[0], -f[1], -f[2]]);
    gl.uniform2f(floorP.u.uTan, tx, ty);
    gl.uniform3fv(floorP.u.uVoid, VOID);
    gl.uniform3fv(floorP.u.uHaze, HAZE);
    gl.uniform1f(floorP.u.uFogDensity, FOG_DENSITY);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const view = [
      r[0], u[0], -f[0], 0,
      r[1], u[1], -f[1], 0,
      r[2], u[2], -f[2], 0,
      -(r[0] * eye[0] + r[1] * eye[1] + r[2] * eye[2]),
      -(u[0] * eye[0] + u[1] * eye[1] + u[2] * eye[2]),
      f[0] * eye[0] + f[1] * eye[1] + f[2] * eye[2], 1,
    ];
    const near = 0.1, far = 80, nf = 1 / (near - far);
    const proj = [1 / tx, 0, 0, 0, 0, 1 / ty, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(moteP.prog);
    gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(moteP.u.uView, false, view);
    gl.uniformMatrix4fv(moteP.u.uProj, false, proj);
    gl.uniform1f(moteP.u.uTime, reduce ? 0 : now / 1000);
    gl.uniform1f(moteP.u.uScale, dpr * h * 0.5);
    gl.uniform1f(moteP.u.uEyeZ, camZ);
    gl.uniform1f(moteP.u.uMaxSize, 3.5 * dpr);
    gl.uniform3fv(moteP.u.uMote, MOTE);
    gl.uniform1f(moteP.u.uFogDensity, FOG_DENSITY);
    gl.drawArrays(gl.POINTS, 0, count);
  }

  let raf = 0;
  const loop = now => { frame(now); raf = requestAnimationFrame(loop); };
  const run = () => {
    cancelAnimationFrame(raf);
    if (reduce) { frame(performance.now()); return; }
    if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); }
  };
  document.addEventListener('visibilitychange', run);
  if (reduce) addEventListener('scroll', () => frame(performance.now()), { passive: true });

  frame(performance.now());
  requestAnimationFrame(() => canvas.classList.add('is-ready'));
  run();
}

start();
