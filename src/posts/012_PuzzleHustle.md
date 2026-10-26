---
title: "🧩 Puzzle Hustle Is Out: Daily Logic Puzzles Without a Server"
date: 2026-10-26
summary: "Puzzle Hustle is out on Google Play and the App Store, with every puzzle generated on the phone, the same dailies for everyone without a server and difficulty tuned from real play times"
preview_image: /images/PuzzleHustle/PuzzleHustle_Feature.png
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>
<div class="link-row" style="margin-bottom: 1rem">
<a href="https://play.google.com/store/apps/details?id=dev.vexury.puzzlehustle" class="link-btn">Google Play</a>
<a href="https://apps.apple.com/app/id6814679756" class="link-btn">App Store</a>
<a href="/projects/puzzle-hustle/" class="link-btn">Play in the Browser <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg></a>
</div>

Puzzle Hustle has been on Google Play and the App Store since October 23. It is built around my wife's favourite puzzles and now has ten puzzle types, a new set every day, a harder Weekly, a big Monthly and an endless mode called Hustle. It is a solo project under Vexury, written in TypeScript with React and Capacitor, and the web version runs at [puzzles.vexury.dev](https://puzzles.vexury.dev/).

Below are the technical parts that took the most work: generating the puzzles on the phone, dailies that need no server, and tuning the difficulty with measured play times.

<video autoplay loop muted playsinline preload="metadata" poster="/images/PuzzleHustle/PuzzleHustle_Trailer_Poster.jpg" style="width:100%; max-width:420px; margin:1.5rem auto; border-radius:8px; display:block;">
  <source src="/images/PuzzleHustle/PuzzleHustle_Trailer.mp4" type="video/mp4">
</video>

## Ten puzzle types

| Puzzle | Rule |
|---|---|
| Sudoku | Classic 9×9 |
| Sumdoku | Killer Sudoku, every cage has a sum |
| Nonogram | Fill cells from row and column clues, Hard and Genius with 2 or 3 colours |
| Mosaic | Each number counts the filled cells in its 3×3 block (Fill-a-Pix) |
| Cats | One cat per row, column and region, no two touching |
| Hearts | Two hearts per row, column and region, no two touching |
| Zip | One path through every cell, visiting the numbers in order |
| Tracks | One track from A to B, the edge numbers count track cells per row and column |
| Slabs | Place dominoes so every coloured region follows its rule (after NYT Pips) |
| Shapes | Slide fragments until the pattern matches (after the Prophecy Tablet in Honkai: Star Rail) |

<div class="ph-shots">
  <img class="lb" src="{% thumb '/images/PuzzleHustle/PuzzleHustle_Shot_01-daily.png', 600 %}" alt="Daily screen with the streak card and one card per puzzle type" loading="lazy">
  <img class="lb" src="{% thumb '/images/PuzzleHustle/PuzzleHustle_Shot_02-nonogram.png', 600 %}" alt="Nonogram daily in progress" loading="lazy">
  <img class="lb" src="{% thumb '/images/PuzzleHustle/PuzzleHustle_Shot_04-cats.png', 600 %}" alt="Cats puzzle" loading="lazy">
  <img class="lb" src="{% thumb '/images/PuzzleHustle/PuzzleHustle_Shot_07-hustle.png', 600 %}" alt="Hustle ladder" loading="lazy">
</div>

## One seed, exactly one solution

Nothing in the app is downloaded. Every board, including the daily, is generated on the device from a seed, and a solver checks it before you see it. The rule is the same for all ten types: exactly one solution, and you can get there without guessing.

For the scheduled puzzles the seed comes from a string hash of type, period, date and an attempt counter. The first seed whose board passes `accepts` wins:

```ts
for (let attempt = 0; attempt < PERIOD_ATTEMPTS; attempt++) {
  seed = hashString(`${type}|${period}|${key}|${attempt}`) % 0xffffffff;
  if (a.accepts(seed, difficulty, options) && (maxScore === undefined || a.score(seed, difficulty) <= maxScore)) break;
}
```

`hashString` is a 53-bit hash in the style of cyrb53, and the generators draw from a mulberry32 RNG. The catch is that `accepts` has to give the same answer on an old Android phone and on a new iPhone. So the solvers count search nodes and stop at a fixed budget (3,000,000 nodes for Shapes, 500,000 for Cats and Hearts), which is the same on every device. The budget only decides whether a generator gives up, never what it returns.

Each type gets to a unique board in its own way:

- Zip: a backbite random path with a minimum number of turns, numbers placed along it, then walls placed against the first alternative solution the solver finds. If that is not enough, a coordinate descent moves the numbers and adds more until the path is unique.
- Nonogram: the picture grows as blobs from random seeds. Unique here means solvable by row and column logic alone (a line solver with propagation), so every board that needs a guess is thrown away.
- Sudoku and Sumdoku: an exact bitmask solver for uniqueness and a logic solver with named techniques for difficulty. Easy has 38 givens and needs only singles, Genius has 25 and can need an X-Wing.
- Cats and Hearts: a valid placement first, regions grown from it, then hill climbing on the region borders until the exact solver counts one solution.

The last one is easy to show, so here is a small version of it running in your browser. It uses the same hash and RNG as the app and the same idea (place the cats, grow the regions, move border cells until one solution is left), just on a 7×7 board with a much simpler solver. Pick a date and every device builds the same board.

<div class="ph-demo" id="ph-seed">
  <div class="ph-demo-bar">
    <label>Date <input type="date" id="ph-seed-date"></label>
    <button type="button" class="link-btn" id="ph-seed-run">Generate</button>
  </div>
  <div class="ph-seed-body">
    <div class="ph-board" id="ph-seed-board" aria-label="Generated Cats board"></div>
    <div class="ph-log" id="ph-seed-log" aria-live="polite"></div>
  </div>
</div>

Every generator also carries a version number. Share links encode type, difficulty and seed, so changing a generator without bumping its version would quietly turn old links into different puzzles. Saved games store the version as well and are dropped when it changes.

## Dailies without a server

Daily, Weekly and Monthly are seeded from the date, so every phone computes the same puzzles on its own. The server only receives times from players who signed in.

Until October 25 the date was Berlin's, which meant New York got the new daily at 18:00 and Tokyo at 08:00. Now a period turns at the device's own midnight. From the server's point of view a day then lasts a lot longer than 24 hours: the API accepts a day from its start in UTC+14 to its end in UTC−12, so one daily is open for 50 hours, and solves are still accepted for 48 hours after that.

<div class="ph-demo" id="ph-tz">
  <div class="ph-demo-bar">
    <span class="ph-tz-clock" id="ph-tz-clock">UTC</span>
    <span class="ph-tz-count" id="ph-tz-count"></span>
  </div>
  <div class="ph-tz-strip" id="ph-tz-strip"></div>
  <div class="ph-tz-legend"><span class="ph-sw ph-sw-before"></span>still on Oct 25 <span class="ph-sw ph-sw-open"></span>playing the Oct 26 daily <span class="ph-sw ph-sw-after"></span>already on Oct 27</div>
</div>

Someone who sets their phone to Kiritimati can play up to 13 hours before Berlin. That is a known trade-off. Times are measured on the client and the generator is public, so a global top list would never be credible anyway, and there is none. Signed-in players compare times in private groups with friends and family, and the server only checks plausibility (at least one second, at most ten moves per second, the first submission per puzzle counts).

The seed search costs time at startup. On a Galaxy S23 it took about 0.6 s of the 1.4 s until the first frame, Zip alone 320 ms. The app now caches the seeds of the current period and hands them to the core before the first render, which brings the start down to 0.8 s. Only the first launch of a day still searches. A cache entry is only used while the generator version still matches, otherwise a phone with an old cache would play a different daily than everyone else.

## Offline first

Everything except ads and the purchase works without a connection. If no ad can be loaded, you get the hint anyway. Solved period puzzles go into a local queue and are sent once the network is back, so nothing in solving ever waits for it.

Not every board can be generated on the phone in reasonable time though. Zip Genius took up to three minutes on a throttled phone build. So the level packs (30 levels per type and difficulty) ship as prebuilt boards inside the app, and the random modes of the slowest types draw from prebuilt pools. Everything else is generated in a Web Worker behind a short "Building puzzle…".

Sign-in is optional and only needed for groups and for syncing progress between Android, iOS and the web. Sync merges both sides: period puzzles keep their first run (that is the leaderboard run), other puzzles keep the better run, achievements are the union of both. The merge is commutative, so it does not matter which device syncs first.

## Statistics without a device ID

I wanted to know which puzzles people actually play and where they give up, without a consent dialog. Under § 25 TDDDG that rules out a device identifier, and with it Firebase. So each event only carries the day, the platform, the build hash and the install age as a bucket (0, 1, 2, 3, 7, 8, 14, 30, 31, 60, 90 or 180 days). There is no ID, no time of day and no IP address in it. Next-day return is still measurable from the age bucket.

The events go to their own D1 database, so they never queue up in front of leaderboard and sync writes. A cron job rolls the last seven days into summary tables, raw rows are deleted after 90 days, and you can switch it off under Profile > Account.

## Calibrating with play times

Every generator computes a difficulty score, but a score is only comparable within one type, and even there it can be misleading. The Nonogram medians for Medium and Hard were 53 and 54, so the two difficulties were basically the same puzzle. Since September 30 the difficulty is calibrated from measured play times instead, with one target time band per difficulty.

The attempt events from above make that possible. A report script recomputes the score of every played board from the core and puts it next to the measured solve time. For Hearts the two lined up almost perfectly:

| Hearts score | Median solve time |
|---|---|
| 59.7 | 2:14 |
| 66.5 | 3:49 |
| 68.8 | 4:13 |
| 69.3 | 5:23 |

So the daily Hearts is now capped at a score of 63. The same data showed the opposite problem for Tracks: its daily median was 34 s while Nonogram was at 2:27, so Tracks got a notch harder and now aims for 1:30 to 3:00. Nonogram ended up at score medians of 53, 70 and 85.

## Things that broke

A few bugs that I would not have guessed beforehand:

1. Pulling down the notification shade on Android does not stop the Activity. 13 seconds with the shade open were 13 seconds on the puzzle clock. Only `onWindowFocusChanged` catches it.
2. Android WebView 151 started snapshotting View Transitions in device pixels. On the S23 (3× density) the circle of the theme switch landed at a third of its coordinates. My code had not changed, the WebView update alone broke it.
3. The rewarded video's own back handler swallows the back button. 37 back presses across four videos ended none of them.

Puzzle Hustle is free with ads and has no subscription. A one-time purchase for 3.99 € removes the ads and makes hints free. If a puzzle ever needs a guess, that is a bug, so please send me the share link (it contains the seed) at vexury.dev@gmail.com.

<div class="lightbox" id="lightbox"><img id="lightbox-img"></div>

<style>
.ph-shots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin: 1.5rem 0; }
.ph-shots img { width: 100%; border-radius: 8px; border: 1px solid var(--border); }
@media (max-width: 600px) { .ph-shots { grid-template-columns: repeat(2, 1fr); } }
.ph-demo { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; margin: 1.5rem 0; box-shadow: var(--shadow); }
.ph-demo-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 1rem; font-size: var(--fs-sm); color: var(--text-muted); }
.ph-demo-bar input { font: inherit; color: var(--text); background: var(--bg); border: 1px solid var(--border-mid); border-radius: 4px; padding: 0.2rem 0.4rem; margin-left: 0.4rem; }
.ph-demo-bar button { cursor: pointer; font: inherit; }
.ph-seed-body { display: grid; grid-template-columns: minmax(0, 280px) minmax(0, 1fr); gap: 1.25rem; align-items: start; }
@media (max-width: 600px) { .ph-seed-body { grid-template-columns: 1fr; } .ph-board { max-width: 280px; margin: 0 auto; } }
.ph-board { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; aspect-ratio: 1; background: var(--border-mid); border: 2px solid var(--border-mid); border-radius: 6px; overflow: hidden; }
.ph-cell { position: relative; background: var(--bg); transition: background-color 0.35s ease; display: flex; align-items: center; justify-content: center; }
.ph-cell.ph-moved { animation: ph-pulse 0.5s ease; }
@keyframes ph-pulse { 0% { transform: scale(0.6); } 60% { transform: scale(1.12); } 100% { transform: scale(1); } }
.ph-cat { width: 70%; height: 70%; opacity: 0; transform: scale(0.3); transition: opacity 0.3s ease, transform 0.3s cubic-bezier(.3,1.6,.5,1); }
.ph-cat.ph-on { opacity: 1; transform: scale(1); }
.ph-log { font-family: 'Inconsolata', monospace; font-size: var(--fs-sm); line-height: 1.55; color: var(--text-muted); min-height: 12rem; overflow-wrap: anywhere; }
.ph-log div { margin-bottom: 0.3rem; }
.ph-log .ph-hi { color: var(--text); }
.ph-log .ph-ok { color: #3fa66b; font-weight: 600; }
.ph-log .ph-bad { color: #d0645a; }
.ph-log .ph-count { color: var(--accent-text); font-weight: 600; }
.ph-tz-clock { font-family: 'Inconsolata', monospace; color: var(--text); font-size: var(--fs-md); }
.ph-tz-count { font-family: 'Inconsolata', monospace; }
.ph-tz-strip { display: grid; grid-template-columns: repeat(27, minmax(0, 1fr)); gap: 2px; }
.ph-tz { height: 3.2rem; border-radius: 3px; background: var(--border); transition: background-color 0.25s ease, box-shadow 0.25s ease; }
.ph-tz.ph-open { background: var(--accent); }
.ph-tz.ph-after { background: transparent; box-shadow: inset 0 0 0 1px var(--border-mid); }
.ph-tz-labels { display: grid; grid-template-columns: repeat(27, minmax(0, 1fr)); gap: 2px; margin-top: 0.35rem; font-family: 'Inconsolata', monospace; font-size: var(--fs-2xs); color: var(--text-muted); }
.ph-tz-labels span { text-align: center; white-space: nowrap; overflow: visible; }
.ph-tz-cities { position: relative; height: 1.2rem; margin-top: 0.2rem; font-size: var(--fs-2xs); color: var(--text-muted); }
.ph-tz-cities span { position: absolute; transform: translateX(-50%); white-space: nowrap; }
.ph-tz-legend { margin-top: 0.9rem; font-size: var(--fs-xs); color: var(--text-muted); display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem 0.5rem; }
.ph-sw { display: inline-block; width: 0.8rem; height: 0.8rem; border-radius: 2px; vertical-align: -0.1em; margin-left: 0.4rem; }
.ph-sw-before { background: var(--border); }
.ph-sw-open { background: var(--accent); }
.ph-sw-after { box-shadow: inset 0 0 0 1px var(--border-mid); }
@media (max-width: 600px) { .ph-tz-labels span:nth-child(even) { visibility: hidden; } .ph-tz-cities .ph-mid { display: none; } }
</style>

<script>
{% raw %}
(function () {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  document.querySelectorAll('img.lb').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => { lbImg.src = img.src; lb.classList.add('active'); });
  });
  lb.addEventListener('click', () => lb.classList.remove('active'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('active'); });
})();

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = 7, BUDGET = 200000, CLIMB = 120, ATTEMPTS = 24;
  const COLORS = ['#e8a13a', '#5b8fd6', '#55b38a', '#c96bb3', '#d5644f', '#8f7ad8', '#3fb3c0'];
  const CAT = '<svg class="ph-cat" viewBox="0 0 24 24" aria-hidden="true"><path fill="#2d2d2d" d="M4 3l4.5 4.2a9.6 9.6 0 0 1 7 0L20 3v9.5C20 17.2 16.4 21 12 21s-8-3.8-8-8.5z"/><circle cx="9" cy="13" r="1.3" fill="#fff"/><circle cx="15" cy="13" r="1.3" fill="#fff"/></svg>';

  function hashString(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0) * 4294967296 + (h1 >>> 0);
  }
  function makeRng(seed) {
    let s = (seed >>> 0) || 0x9e3779b9;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function neighbours(i) {
    const x = i % N, y = (i / N) | 0, out = [];
    if (x > 0) out.push(i - 1);
    if (x < N - 1) out.push(i + 1);
    if (y > 0) out.push(i - N);
    if (y < N - 1) out.push(i + N);
    return out;
  }
  function solve(region) {
    let count = 0, nodes = 0;
    const colUsed = [], regUsed = [], pos = [];
    (function place(row) {
      if (count >= 99 || nodes > BUDGET) return;
      if (row === N) { count++; return; }
      for (let c = 0; c < N; c++) {
        nodes++;
        const g = region[row * N + c];
        if (colUsed[c] || regUsed[g] || (row > 0 && Math.abs(pos[row - 1] - c) <= 1)) continue;
        colUsed[c] = regUsed[g] = true; pos.push(c);
        place(row + 1);
        pos.pop(); colUsed[c] = regUsed[g] = false;
      }
    })(0);
    return nodes > BUDGET ? -1 : count;
  }
  function connected(region, g) {
    const cells = [];
    for (let i = 0; i < N * N; i++) if (region[i] === g) cells.push(i);
    if (!cells.length) return false;
    const seen = new Set([cells[0]]), stack = [cells[0]];
    while (stack.length) for (const j of neighbours(stack.pop())) if (region[j] === g && !seen.has(j)) { seen.add(j); stack.push(j); }
    return seen.size === cells.length;
  }
  function generate(seed) {
    const rnd = makeRng(seed), int = n => Math.floor(rnd() * n);
    let cats;
    for (;;) {
      cats = []; const used = [];
      for (let row = 0; row < N; row++) {
        const opts = [];
        for (let c = 0; c < N; c++) if (!used[c] && (row === 0 || Math.abs(c - cats[row - 1]) > 1)) opts.push(c);
        if (!opts.length) break;
        const c = opts[int(opts.length)]; cats.push(c); used[c] = true;
      }
      if (cats.length === N) break;
    }
    const star = cats.map((c, row) => row * N + c);
    const region = new Array(N * N).fill(-1), frontier = star.slice();
    star.forEach((i, g) => { region[i] = g; });
    let left = N * N - N;
    while (left > 0) {
      const k = int(frontier.length), i = frontier[k];
      const free = neighbours(i).filter(j => region[j] < 0);
      if (!free.length) { frontier.splice(k, 1); continue; }
      const j = free[int(free.length)];
      region[j] = region[i]; frontier.push(j); left--;
    }
    let count = solve(region);
    const frames = [{ region: region.slice(), count }];
    for (let step = 0; step < CLIMB && count !== 1; step++) {
      const i = int(N * N);
      if (star.includes(i)) continue;
      const from = region[i];
      const to = neighbours(i).map(j => region[j]).filter(g => g !== from);
      if (!to.length) continue;
      region[i] = to[int(to.length)];
      const n = connected(region, from) ? solve(region) : -1;
      if (n >= 1 && (count < 1 || n <= count)) {
        if (n < count) frames.push({ region: region.slice(), count: n, moved: i });
        count = n;
      } else region[i] = from;
    }
    return { ok: count === 1, frames, star };
  }

  const board = document.getElementById('ph-seed-board');
  const log = document.getElementById('ph-seed-log');
  const dateInput = document.getElementById('ph-seed-date');
  const runBtn = document.getElementById('ph-seed-run');
  if (!board) return;
  const cells = [];
  for (let i = 0; i < N * N; i++) {
    const d = document.createElement('div');
    d.className = 'ph-cell';
    d.innerHTML = CAT;
    board.appendChild(d);
    cells.push(d);
  }
  const now = new Date();
  dateInput.value = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

  let token = 0;
  const wait = ms => new Promise(r => setTimeout(r, reduced ? 0 : ms));
  function paint(frame) {
    frame.region.forEach((g, i) => {
      const x = i % N, y = (i / N) | 0, edge = 'rgba(0,0,0,0.55)', s = [];
      if (x < N - 1 && frame.region[i + 1] !== g) s.push('inset -2px 0 0 ' + edge);
      if (x > 0 && frame.region[i - 1] !== g) s.push('inset 2px 0 0 ' + edge);
      if (y < N - 1 && frame.region[i + N] !== g) s.push('inset 0 -2px 0 ' + edge);
      if (y > 0 && frame.region[i - N] !== g) s.push('inset 0 2px 0 ' + edge);
      cells[i].style.backgroundColor = COLORS[g];
      cells[i].style.boxShadow = s.join(', ') || 'none';
    });
    if (frame.moved !== undefined) {
      const c = cells[frame.moved];
      c.classList.remove('ph-moved'); void c.offsetWidth; c.classList.add('ph-moved');
    }
  }
  function line(html, cls) {
    const d = document.createElement('div');
    if (cls) d.className = cls;
    d.innerHTML = html;
    log.appendChild(d);
    return d;
  }
  async function run() {
    const my = ++token;
    const key = dateInput.value || '2026-10-26';
    log.innerHTML = '';
    cells.forEach(c => c.querySelector('.ph-cat').classList.remove('ph-on'));
    for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
      const seed = hashString('cats|daily|' + key + '|' + attempt) % 0xffffffff;
      line('hashString("cats|daily|' + key + '|' + attempt + '")<br>&rarr; seed <span class="ph-hi">' + seed + '</span>');
      const res = generate(seed);
      const counter = line('');
      for (const frame of res.frames) {
        if (my !== token) return;
        paint(frame);
        counter.innerHTML = 'solutions: <span class="ph-count">' + frame.count + '</span>';
        await wait(frame === res.frames[0] ? 700 : 380);
      }
      if (res.ok) {
        line('exactly one solution, accepted', 'ph-ok');
        for (const i of res.star) {
          if (my !== token) return;
          cells[i].querySelector('.ph-cat').classList.add('ph-on');
          await wait(140);
        }
        return;
      }
      line('climb gave up, next attempt', 'ph-bad');
      await wait(700);
    }
  }
  runBtn.addEventListener('click', run);
  dateInput.addEventListener('change', run);
  new IntersectionObserver((entries, obs) => {
    if (entries.some(e => e.isIntersecting)) { obs.disconnect(); run(); }
  }, { threshold: 0.4 }).observe(board);
})();

(function () {
  const strip = document.getElementById('ph-tz-strip');
  if (!strip) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = document.getElementById('ph-tz-clock');
  const count = document.getElementById('ph-tz-count');
  const offsets = [];
  for (let o = 14; o >= -12; o--) offsets.push(o);
  const cities = { 14: 'Kiritimati', 9: 'Tokyo', 0: 'Reykjavík', '-12': 'Baker Island' };
  const zones = offsets.map(o => {
    const d = document.createElement('div');
    d.className = 'ph-tz';
    d.title = 'UTC' + (o >= 0 ? '+' : '−') + Math.abs(o);
    strip.appendChild(d);
    return d;
  });
  const labels = document.createElement('div');
  labels.className = 'ph-tz-labels';
  labels.innerHTML = offsets.map(o => '<span>' + (o > 0 ? '+' : o < 0 ? '−' : '') + Math.abs(o) + '</span>').join('');
  strip.after(labels);
  const cityRow = document.createElement('div');
  cityRow.className = 'ph-tz-cities';
  cityRow.innerHTML = offsets.map((o, k) => {
    if (!cities[o]) return '';
    const pos = k === 0 ? 'left:0;transform:none' : k === offsets.length - 1 ? 'right:0;transform:none' : 'left:' + ((k + 0.5) / offsets.length * 100) + '%';
    return '<span class="' + (k === 0 || k === offsets.length - 1 ? '' : 'ph-mid') + '" style="' + pos + '">' + cities[o] + '</span>';
  }).join('');
  labels.after(cityRow);

  const DAY = Date.UTC(2026, 9, 26);
  const START = DAY - 16 * 3600e3, END = DAY + 38 * 3600e3;
  const pad = n => String(n).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function render(t) {
    let open = 0;
    offsets.forEach((o, k) => {
      const local = Math.floor((t + o * 3600e3) / 86400e3) * 86400e3;
      const z = zones[k];
      z.classList.toggle('ph-open', local === DAY);
      z.classList.toggle('ph-after', local > DAY);
      if (local === DAY) open++;
    });
    const d = new Date(t);
    clock.textContent = 'UTC ' + months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
    count.textContent = 'Oct 26 daily open in ' + open + ' / 27 zones';
  }
  if (reduced) { render(DAY + 2 * 3600e3); return; }
  let t0 = null, running = false;
  const DURATION = 14000, HOLD = 1500;
  function frame(ts) {
    if (t0 === null) t0 = ts;
    const p = ((ts - t0) % (DURATION + HOLD)) / DURATION;
    render(START + Math.min(p, 1) * (END - START));
    if (running) requestAnimationFrame(frame);
  }
  render(START);
  new IntersectionObserver(entries => {
    const vis = entries.some(e => e.isIntersecting);
    if (vis && !running) { running = true; t0 = null; requestAnimationFrame(frame); }
    if (!vis) running = false;
  }, { threshold: 0.2 }).observe(strip);
})();
{% endraw %}
</script>
