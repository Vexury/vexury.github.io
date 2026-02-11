---
layout: base.html
title: Projects
---

<div class="project-grid">
  {% for project in collections.projects %}
  <div class="project-card">
    {% if project.data.images %}
    <div class="slideshow">
      {% for img in project.data.images %}{% if img contains '.mp4' or img contains '.webm' %}<video src="{{ img }}" muted playsinline {% if forloop.first %}class="active"{% endif %}></video>{% else %}<img src="{{ img }}" alt="{{ project.data.title }}" {% if forloop.first %}class="active"{% endif %}>{% endif %}{% endfor %}
      <div class="slideshow-dots">{% for img in project.data.images %}<span class="dot {% if forloop.first %}active{% endif %}"></span>{% endfor %}</div>
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
  <img id="lightbox-img">
  <video id="lightbox-video" controls autoplay loop></video>
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
      timeout = setTimeout(advance, 1000);
    }
  }
  function advance() {
    clearTimeout(timeout);
    showSlide((index + 1) % slides.length);
  }
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
    advance();
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
});

const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbVideo = document.getElementById('lightbox-video');

document.querySelectorAll('.slideshow').forEach(ss => {
  ss.style.cursor = 'pointer';
  ss.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) return;
    const active = ss.querySelector('img.active, video.active');
    if (!active) return;
    if (active.tagName === 'VIDEO') {
      lbImg.style.display = 'none';
      lbVideo.style.display = 'block';
      lbVideo.src = active.src;
    } else {
      lbVideo.style.display = 'none';
      lbImg.style.display = 'block';
      lbImg.src = active.src;
    }
    lightbox.classList.add('active');
  });
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
    lbVideo.pause();
    lbVideo.removeAttribute('src');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    lightbox.classList.remove('active');
    lbVideo.pause();
    lbVideo.removeAttribute('src');
  }
});
</script>