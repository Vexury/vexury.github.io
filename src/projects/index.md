---
layout: base.html
title: Projects
---

<div class="project-grid">
  {% for project in collections.projects %}
  <div class="project-card{% if project.data.featured %} featured{% endif %}">
    {% if project.data.images %}
    <div class="slideshow">
      {% for img in project.data.images %}{% if img contains '.mp4' or img contains '.webm' %}<video src="{{ img }}" muted playsinline preload="none" {% if forloop.first %}class="active"{% endif %}></video>{% else %}{% if project.data.featured %}{% assign thumbsDir = '/images/thumbs/large/' %}{% else %}{% assign thumbsDir = '/images/thumbs/' %}{% endif %}{% assign base = img | split: '.' | first %}<img src="{{ base | replace: '/images/', thumbsDir }}.jpg" data-full="{{ img }}" alt="{{ project.data.title }}" loading="lazy" {% if forloop.first %}class="active"{% endif %}>{% endif %}{% endfor %}
      <div class="slideshow-dots"><div class="slideshow-dots-inner">{% for img in project.data.images %}<span class="dot {% if forloop.first %}active{% endif %}"></span>{% endfor %}</div></div>
    </div>
    {% elsif project.data.image %}<img src="{{ project.data.image }}" alt="{{ project.data.title }}">{% endif %}
    <h3>{{ project.data.emoji }} {{ project.data.title }}</h3>
    <p>{{ project.data.description }}</p>
    {% if project.data.focus %}<p><strong>Focus:</strong> {{ project.data.focus }}</p>{% endif %}
    <p>{% for link in project.data.links %}{% if forloop.first == false %} · {% endif %}<a href="{{ link.url }}">{{ link.label }}</a>{% endfor %}</p>
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