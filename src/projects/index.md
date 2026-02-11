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
</script>