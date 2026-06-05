---
title: "🤖 Getting started with Claude Code"
date: 2026-06-03
summary: "How I configured Claude Code for my workflow: global and project-level CLAUDE.md files, and writing a custom skill."
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>

I started using [Claude Code](https://claude.ai/code) as my main AI coding assistant. It works as a CLI inside the terminal (or an IDE extension), meaning it has full access to the filesystem, can run commands, edit files, and read the whole project. The thing that makes it interesting to configure properly is that it reads plain Markdown instruction files before doing anything, so you can teach it quite precisely how to behave in a given context.

There are two layers of configuration: a global file that applies everywhere, and a project-level file checked into the repo.

## Global CLAUDE.md

The global file lives at `~/.claude/CLAUDE.md` and applies to every project you open. I use it for things that are true about me and my environment regardless of which project I am in:

- OS and shell (Windows 11, PowerShell) so it uses the right syntax in commands
- Timezone and name so scheduled tasks and dated outputs are correct
- Stack overview (Vulkan/OpenGL C++, Unity/C#, occasional web with 11ty) so it has baseline context
- Writing rules that apply everywhere (no em-dashes in prose, for instance)
- Coding preferences: minimal changes, no unnecessary comments, no backwards-compatibility shims

The key insight is that this file is not documentation. It is instructions. Claude reads it at the start of every session, so everything in there directly shapes behavior. Keep it short and opinionated.

## Project CLAUDE.md

The project file lives at the repo root and is checked into version control. This one is for everything specific to this particular codebase.

For this website (an Eleventy 3 static site), I documented:

- **Commands**: `npm start`, `npm run build`, `npm run export-cv` and what they do
- **Project structure**: which folders contain what, and what gets generated vs. what you edit
- **How to add a project card**: frontmatter fields, valid link labels, image naming
- **How to write a blog post**: filename pattern, frontmatter, body template, image shortcode usage
- **Design rules**: the CSS variable system, font, accent color, the dark mode toggle mechanism

The point is that Claude should be able to do the right thing without me having to explain the project each time. If I ask it to add a project card, it reads the CLAUDE.md, looks at an existing project file for reference, and produces the correct frontmatter without guessing.

One thing worth being specific about: the site has a custom Eleventy shortcode (`{% thumb %}`) that generates thumbnails and must be used instead of raw `<img src>` tags. Without that documented, Claude would write the wrong thing every time. With it documented, it gets it right on the first attempt.

## Writing a skill

Beyond the instruction files, Claude Code supports custom skills: Markdown files at `.claude/skills/<name>/SKILL.md` that describe a repeatable task in enough detail that no further explanation is needed.

I wrote one for this exact use case: creating a new blog post. The skill captures things that are easy to get wrong from the CLAUDE.md alone:

- The exact filename pattern and how to find the current highest number
- The difference between posts with a link-row and posts with a plain date line
- The `{% thumb %}` shortcode with correct widths per use case
- The checklist at the end (create file, add images, update project card, test locally)

To use a skill I just type `/new-post` and Claude reads the skill file before doing anything. No repeated explanations across sessions.

The general workflow is: CLAUDE.md for always-on context about the project, skills for specific multi-step tasks that have enough nuance to warrant their own reference document. Together they turn what would be a "re-explain everything" conversation into a one-liner.
