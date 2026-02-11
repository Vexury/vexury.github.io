---
layout: base.html
title: Projects
---

<div class="project-grid">
  {% for project in collections.projects %}
  <div class="project-card">
    {% if project.data.images %}
    <div class="slideshow">
      {% for img in project.data.images %}<img src="{{ img }}" alt="{{ project.data.title }}" {% if forloop.first %}class="active"{% endif %}>{% endfor %}
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
  const imgs = slideshow.querySelectorAll('img');
  const dots = slideshow.querySelectorAll('.dot');
  if (imgs.length < 2) return;
  let index = 0;
  let interval;
  function advance() {
    imgs[index].classList.remove('active');
    dots[index].classList.remove('active');
    index = (index + 1) % imgs.length;
    imgs[index].classList.add('active');
    dots[index].classList.add('active');
  }
  card.addEventListener('mouseenter', () => {
    advance();
    interval = setInterval(advance, 1000);
  });
  card.addEventListener('mouseleave', () => {
    clearInterval(interval);
    imgs[index].classList.remove('active');
    dots[index].classList.remove('active');
    index = 0;
    imgs[0].classList.add('active');
    dots[0].classList.add('active');
  });
});
</script>