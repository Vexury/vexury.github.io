---
layout: base.html
title: Projects
---

<div class="project-grid">
  {% for project in collections.projects %}
  <div class="project-card{% if project.data.featured %} featured{% endif %}{% if project.data.pinned %} pinned{% endif %}">
    {% if project.data.images %}
    {% if project.data.featured %}{% assign tw = 900 %}{% else %}{% assign tw = 400 %}{% endif %}
    <div class="slideshow">
      {% for img in project.data.images %}{% if img contains '.mp4' or img contains '.webm' %}<video src="{{ img }}" muted playsinline preload="none" {% if forloop.first %}class="active"{% endif %}></video>{% else %}<img src="{% thumb img, tw %}" data-full="{{ img }}" alt="{{ project.data.title }}" loading="lazy" {% if forloop.first %}class="active"{% endif %}>{% endif %}{% endfor %}
      <div class="slideshow-dots"><div class="slideshow-dots-inner">{% for img in project.data.images %}<span class="dot {% if forloop.first %}active{% endif %}"></span>{% endfor %}</div></div>
    </div>
    {% elsif project.data.image %}<img src="{{ project.data.image }}" alt="{{ project.data.title }}">{% endif %}
    <h3>{{ project.data.emoji }} {{ project.data.title }}{% if project.data.pinned %} <span class="featured-tag">featured</span>{% endif %}</h3>
    <p>{{ project.data.description }}</p>
    {% if project.data.focus %}<p><strong>Focus:</strong> {{ project.data.focus }}</p>{% endif %}
    <div class="link-row">{% for link in project.data.links %}<a href="{{ link.url }}" class="link-btn">{{ link.label }}{% if link.url contains 'github.com' %} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="vertical-align:-0.1em"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>{% elsif link.label == 'Blog Post' %} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>{% elsif link.label == 'Game Page' %} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>{% elsif link.label == 'Play' %} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>{% endif %}</a>{% endfor %}</div>
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
document.querySelectorAll('.project-card').forEach(card => {
  const slideshow = card.querySelector('.slideshow');
  if (!slideshow) return;
  const slides = slideshow.querySelectorAll('img, video');
  const dots = slideshow.querySelectorAll('.dot');
  if (slides.length < 2) return;
  let index = 0;
  let timeout;
  let hovering = false;
  function showSlide(i) {
    const prev = slides[index];
    prev.classList.remove('active');
    if (prev.tagName === 'VIDEO') { prev.pause(); prev.removeEventListener('ended', advance); }
    dots[index].classList.remove('active');
    index = i;
    const curr = slides[index];
    curr.classList.add('active');
    dots[index].classList.add('active');
    if (curr.tagName === 'VIDEO') {
      curr.currentTime = 0;
      curr.play();
      curr.addEventListener('ended', advance, { once: true });
    } else if (hovering) {
      timeout = setTimeout(advance, 3000);
    }
  }
  function advance() {
    clearTimeout(timeout);
    showSlide((index + 1) % slides.length);
  }
  const dotsInner = slideshow.querySelector('.slideshow-dots-inner');
  if (dotsInner) dotsInner.addEventListener('click', (e) => e.stopPropagation());
  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(timeout);
      const curr = slides[index];
      if (curr.tagName === 'VIDEO') curr.removeEventListener('ended', advance);
      showSlide(i);
    });
  });
  card.addEventListener('mouseenter', () => {
    hovering = true;
    timeout = setTimeout(advance, 3000);
  });
  card.addEventListener('mouseleave', () => {
    hovering = false;
    clearTimeout(timeout);
    const curr = slides[index];
    curr.classList.remove('active');
    if (curr.tagName === 'VIDEO') { curr.pause(); curr.removeEventListener('ended', advance); }
    dots[index].classList.remove('active');
    index = 0;
    slides[0].classList.add('active');
    dots[0].classList.add('active');
  });
  let dragStartX = 0;
  let dragging = false;
  function onDragStart(x) { dragStartX = x; dragging = false; }
  function onDragMove(x) { if (Math.abs(x - dragStartX) > 5) dragging = true; }
  function onDragEnd(x) {
    const dx = x - dragStartX;
    if (Math.abs(dx) < 40) return;
    clearTimeout(timeout);
    const curr = slides[index];
    if (curr.tagName === 'VIDEO') curr.removeEventListener('ended', advance);
    const dir = dx < 0 ? 1 : -1;
    showSlide((index + dir + slides.length) % slides.length);
  }
  slideshow.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
  slideshow.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), { passive: true });
  slideshow.addEventListener('touchend', (e) => onDragEnd(e.changedTouches[0].clientX), { passive: true });
  slideshow.addEventListener('dragstart', (e) => e.preventDefault());
  slideshow.addEventListener('mousedown', (e) => { e.preventDefault(); onDragStart(e.clientX); });
  slideshow.addEventListener('mousemove', (e) => { if (e.buttons === 1) onDragMove(e.clientX); });
  slideshow.addEventListener('mouseup', (e) => onDragEnd(e.clientX));
  slideshow.addEventListener('click', (e) => { if (dragging) e.stopImmediatePropagation(); }, true);
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

document.querySelectorAll('.slideshow').forEach(ss => {
  ss.style.cursor = 'pointer';
  ss.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) return;
    const active = ss.querySelector('img.active, video.active');
    if (!active) return;
    lbSlides = Array.from(ss.querySelectorAll('img, video'));
    const multi = lbSlides.length > 1;
    lbPrevBtn.hidden = !multi;
    lbNextBtn.hidden = !multi;
    lbShow(lbSlides.indexOf(active));
    lightbox.classList.add('active');
  });
});

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
