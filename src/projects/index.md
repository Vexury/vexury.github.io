---
layout: base.html
title: Projects
---

<div class="project-filters">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="rendering">Rendering</button>
  <button class="filter-btn" data-filter="game-jams">Game Jams</button>
  <button class="filter-btn" data-filter="games">Games</button>
</div>

<div class="project-grid">
  {% for project in collections.projects %}
  <div class="project-card{% if project.data.featured %} featured{% endif %}{% if project.data.pinned %} pinned{% endif %}" data-category="{{ project.data.category }}">
    {% if project.data.images %}
    {% if project.data.featured %}{% assign tw = 900 %}{% else %}{% assign tw = 400 %}{% endif %}
    <div class="slideshow">
      <div class="frames" tabindex="0" role="group" aria-label="{{ project.data.title }} media, {{ project.data.images.size }} items. Use arrow keys to browse.">
        {% for img in project.data.images %}{% if img contains '.mp4' or img contains '.webm' %}<video src="{{ img }}" muted playsinline preload="none"></video>{% else %}<img src="{% thumb img, tw %}" data-full="{{ img }}" alt="{{ project.data.title }}" loading="lazy">{% endif %}{% endfor %}
      </div>{% if project.data.images.size > 1 %}<button class="frame-nav prev" type="button" tabindex="-1" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button><button class="frame-nav next" type="button" tabindex="-1" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button><div class="scrubber" aria-hidden="true">{% for img in project.data.images %}<button class="scrub-seg" type="button" tabindex="-1"></button>{% endfor %}</div>{% endif %}
    </div>
    {% elsif project.data.image %}<img src="{{ project.data.image }}" alt="{{ project.data.title }}">{% endif %}
    <h3>{{ project.data.emoji }} {{ project.data.title }}{% if project.data.pinned %} <span class="featured-tag">featured</span>{% endif %}</h3>
    {% if project.data.ranking %}<div class="rank-strip"><span class="rank-num">#{{ project.data.ranking.place }}</span> <span class="rank-total">/ {{ project.data.ranking.total }}</span>{% for h in project.data.ranking.highlights %}<span class="rank-sep">·</span><span class="rank-pill"><span class="rank-num">#{{ h.place }}</span> {{ h.label }}</span>{% endfor %}</div>{% endif %}
    <p>{{ project.data.description }}</p>
    {% if project.data.duration %}<p><strong>Duration:</strong> {{ project.data.duration }}</p>{% endif %}
    {% if project.data.focus %}<p><strong>Focus:</strong> {{ project.data.focus }}</p>{% endif %}
    <div class="link-row">{% for link in project.data.links %}<a href="{{ link.url }}" class="link-btn">{{ link.label }}{% if link.url contains 'github.com' %} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="vertical-align:-0.1em"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>{% elsif link.label == 'Blog Post' %} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>{% elsif link.label == 'Game Page' %} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>{% elsif link.label == 'Play' %} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>{% elsif link.label == 'ShaderGraph' %} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style="vertical-align:-0.1em"><circle cx="2" cy="6" r="1.5" fill="currentColor"/><circle cx="10" cy="3" r="1.5" fill="currentColor"/><circle cx="10" cy="9" r="1.5" fill="currentColor"/><line x1="3.5" y1="5.5" x2="8.5" y2="3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3.5" y1="6.5" x2="8.5" y2="8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>{% endif %}</a>{% endfor %}</div>
  </div>
  {% endfor %}
</div>

<div class="lightbox" id="lightbox">
  <button class="lb-prev">&#8592;</button>
  <img id="lightbox-img">
  <video id="lightbox-video" controls autoplay loop></video>
  <button class="lb-next">&#8594;</button>
</div>

<script>
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    projectCards.forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
    });
  });
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

document.querySelectorAll('.slideshow').forEach(ss => {
  const scroller = ss.querySelector('.frames');
  if (!scroller) return;
  const frames = Array.from(scroller.querySelectorAll('img, video'));
  if (!frames.length) return;

  const segs = Array.from(ss.querySelectorAll('.scrub-seg'));
  const prevBtn = ss.querySelector('.frame-nav.prev');
  const nextBtn = ss.querySelector('.frame-nav.next');
  const total = frames.length;

  let index = 0;
  let timer;
  let settle;
  let hovering = false;
  let touched = false;

  // Nearest frame to the current scroll offset. Measuring beats arithmetic
  // here: gaps, percentage widths and resizes all take care of themselves.
  function measure() {
    let best = 0;
    let bestDist = Infinity;
    frames.forEach((f, i) => {
      const d = Math.abs(f.offsetLeft - scroller.scrollLeft);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  function goTo(i, smooth = true) {
    const target = frames[Math.max(0, Math.min(total - 1, i))];
    scroller.scrollTo({ left: target.offsetLeft, behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
    clearTimeout(settle);
    settle = setTimeout(sync, smooth ? 600 : 60);
  }

  function stopTimer() {
    clearTimeout(timer);
    segs.forEach(s => s.classList.remove('filling'));
  }

  function schedule() {
    stopTimer();
    if (!hovering || reduceMotion) return;
    if (frames[index].tagName === 'VIDEO') return;
    if (segs[index]) segs[index].classList.add('filling');
    timer = setTimeout(() => {
      if (index + 1 >= total) goTo(0, false); else goTo(index + 1);
    }, 3000);
  }

  function syncVideo() {
    frames.forEach((f, i) => {
      if (f.tagName !== 'VIDEO') return;
      if (i === index && (hovering || !canHover)) {
        f.play().catch(() => {});
      } else {
        f.pause();
        if (i !== index) f.currentTime = 0;
      }
    });
  }

  function render() {
    segs.forEach((s, i) => s.classList.toggle('active', i === index));
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === total - 1;
    syncVideo();
  }

  function sync() {
    const i = measure();
    if (i === index) return;
    index = i;
    render();
    schedule();
  }

  // Which frame is showing is answered by an IntersectionObserver rather than
  // by scroll events, which browsers are free to coalesce or drop entirely.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const i = frames.indexOf(e.target);
        if (i === -1 || i === index) return;
        index = i;
        render();
        schedule();
      });
    }, { root: scroller, threshold: 0.6 });
    frames.forEach(f => io.observe(f));
  }

  let raf;
  scroller.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(sync);
  }, { passive: true });

  frames.forEach(f => {
    if (f.tagName !== 'VIDEO') return;
    f.addEventListener('ended', () => {
      if (!hovering) return;
      if (index + 1 >= total) goTo(0, false); else goTo(index + 1);
    });
  });

  segs.forEach((seg, i) => seg.addEventListener('click', (e) => {
    e.stopPropagation();
    touched = true;
    stopTimer();
    goTo(i);
  }));

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); touched = true; stopTimer(); goTo(index - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); touched = true; stopTimer(); goTo(index + 1); });

  scroller.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    touched = true;
    stopTimer();
    goTo(index + (e.key === 'ArrowRight' ? 1 : -1));
  });

  ss.addEventListener('mouseenter', () => { hovering = true; syncVideo(); schedule(); });
  ss.addEventListener('mouseleave', () => {
    hovering = false;
    stopTimer();
    syncVideo();
    if (!touched) goTo(0, false);
  });

  // A click opens the lightbox; a drag or a scroll must not.
  let downX = 0;
  let downScroll = 0;
  let moved = false;
  scroller.addEventListener('pointerdown', (e) => {
    downX = e.clientX;
    downScroll = scroller.scrollLeft;
    moved = false;
    touched = true;
    stopTimer();
  });
  scroller.addEventListener('pointermove', (e) => {
    if (e.buttons === 1 && Math.abs(e.clientX - downX) > 5) moved = true;
  });
  scroller.addEventListener('dragstart', (e) => e.preventDefault());
  scroller.addEventListener('click', () => {
    if (moved || Math.abs(scroller.scrollLeft - downScroll) > 5) return;
    openLightbox(frames, index);
  });

  render();
});

document.querySelector('.project-grid').classList.add('loaded');

const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbVideo = document.getElementById('lightbox-video');
const lbPrevBtn = lightbox.querySelector('.lb-prev');
const lbNextBtn = lightbox.querySelector('.lb-next');

let lbSlides = [];
let lbIndex = 0;

function lbShow(index) {
  lbIndex = (index + lbSlides.length) % lbSlides.length;
  lbVideo.pause();
  const slide = lbSlides[lbIndex];
  if (slide.tagName === 'VIDEO') {
    lbImg.style.display = 'none';
    lbVideo.style.display = 'block';
    lbVideo.src = slide.src;
  } else {
    lbVideo.style.display = 'none';
    lbImg.style.display = 'block';
    lbImg.src = slide.dataset.full || slide.src;
  }
}

function lbClose() {
  lightbox.classList.remove('active');
  lbVideo.pause();
  lbVideo.removeAttribute('src');
}

function openLightbox(slides, start) {
  lbSlides = slides;
  const multi = lbSlides.length > 1;
  lbPrevBtn.hidden = !multi;
  lbNextBtn.hidden = !multi;
  lbShow(start);
  lightbox.classList.add('active');
}

lbPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); lbShow(lbIndex - 1); });
lbNextBtn.addEventListener('click', (e) => { e.stopPropagation(); lbShow(lbIndex + 1); });

lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lbClose(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') lbClose();
  if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
  if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
});
</script>
