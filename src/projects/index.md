---
layout: base.html
title: Projects
---

<div class="project-grid">
  {% for project in collections.projects %}
  <div class="project-card">
    <h3>{{ project.data.emoji }} {{ project.data.title }}</h3>
    <p>{{ project.data.description }}</p>
    <p>{% for link in project.data.links %}{% if forloop.first == false %} · {% endif %}<a href="{{ link.url }}">{{ link.label }}</a>{% endfor %}</p>
  </div>
  {% endfor %}
</div>