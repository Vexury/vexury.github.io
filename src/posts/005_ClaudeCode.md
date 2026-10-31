---
title: "🤖 Mastering Claude Code"
date: 2026-06-03
summary: "How I configured Claude Code for my workflow: CLAUDE.md files, skills, hooks, MCP, and multi-agent documentation."
preview_image: /images/ClaudeCode_logo.png
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>

I started using [Claude Code](https://claude.ai/code) as my main AI coding assistant. It runs as a CLI in the terminal (or as an IDE extension), so it has full access to the filesystem and can run commands, edit files and read the whole project.
What makes it worth configuring properly is that it reads plain Markdown instruction files before doing anything, so you can tell it quite precisely how to behave in a given context.

There are two layers of configuration: a global file that applies everywhere and a project file that is checked into the repo.

## Global CLAUDE.md

The global file is at `~/.claude/CLAUDE.md` and applies to every project you open. I use it for things about me and my environment that are true no matter which project I am in:

- OS and shell (Windows 11, PowerShell) so it uses the right syntax in commands
- Timezone and name so scheduled tasks and dated outputs are correct
- Stack overview (Vulkan/OpenGL C++, Unity/C#, occasional web with 11ty) so it has baseline context
- Writing rules that apply everywhere (no em-dashes in prose, for instance)
- Coding preferences: minimal changes, no unnecessary comments, no backwards-compatibility shims

Claude reads this file at the start of every session and follows it, so I write it as instructions and not as documentation. Keep it short and opinionated.

## Project CLAUDE.md

The project file is at the repo root and checked into version control. It contains everything specific to this codebase.
For this website (an Eleventy 3 static site) I documented:

- Commands: `npm start`, `npm run build`, `npm run export-cv` and what they do
- Project structure: which folders contain what, and what gets generated vs. what you edit
- How to add a project card: frontmatter fields, valid link labels, image naming
- How to write a blog post: filename pattern, frontmatter, body template, image shortcode usage
- Design rules: the CSS variable system, font, accent color, the dark mode toggle mechanism

This way Claude can do the right thing without me explaining the project every time. If I ask it to add a project card, it reads the CLAUDE.md, looks at an existing project file and writes the correct frontmatter without guessing.

One example: the site has a custom Eleventy shortcode (`{% raw %}{% thumb %}{% endraw %}`) that generates thumbnails and has to be used instead of raw `<img src>` tags. Without that in the file, Claude would write the wrong thing every time. With it, it gets it right on the first try.

## Writing a skill

Besides the instruction files, Claude Code supports custom skills: Markdown files at `.claude/skills/<name>/SKILL.md` that describe a repeatable task in enough detail that it needs no further explanation.

I maintain a library of reusable Unity scripts that I want in every new project. Copying folders by hand and figuring out what goes where is tedious and easy to get wrong, so I wrote a skill called `deploy-library`. It knows where the library is, how the target project is structured, which scripts to copy and how to handle conflicts.

This task is not tied to one project, so I made the skill global and put it in `~/.claude/skills/` instead of a repo. Now I can open any new Unity project, type `/deploy-library` and it runs without any setup in that project.

When I type the slash command, Claude reads the skill file before doing anything, so I don't have to explain the task again in every session.

My rule of thumb: CLAUDE.md for context about the project that should always be there, skills for specific multi-step tasks with enough details to need their own document. Skills for one project live in that repo, skills for everything live in the global `~/.claude/skills/` folder.
Together they replace the usual "explain everything again" conversation with a single command.

## Hooks

Claude Code supports hooks, which are shell commands that run automatically on events like tool calls. I added one that runs every time Claude uses a tool and appends a line to a log file:

```
2026-06-08T02:18:23+02:00 | Edit  | file: C:\Projects\MyGame\Scripts\PlayerController.cs
```

Each session gets its own log file. If Claude edits twenty files in a refactor, I can scan the log instead of reconstructing what happened from memory. In practice it's only moderately useful, but it's nice to have the log already there when something unexpected happens.

Hooks are configured in `settings.json` and not in CLAUDE.md, which makes sense: CLAUDE.md is instructions for Claude, `settings.json` is configuration for the harness that runs it.

## MCP

MCP (Model Context Protocol) is the standard for connecting external tools and data sources to a model. Claude Code is an MCP client, so you can give it access to things outside the local filesystem.

I connected the GitHub MCP server so Claude can read issues from my repositories during a session. Instead of switching to the browser to check whether a repo has open issues, I just ask. It's a small thing that saves one context switch. Most of the time there are no issues anyway, but at least I don't have to go and look.

The bigger benefit of MCP is that the same session that reads your code can also read your issue tracker, a calendar or any other system that has a server, so everything stays in one place.

## Agent teams

The most complex thing I set up is a multi-agent workflow for documenting VexEngine, my custom C++ renderer. Documenting a codebase like that is tedious, and its subsystems are mostly independent: the public API, the rendering pipeline and the shader system each need focused reading of completely different parts of the code.

So a master agent spawns three sub-agents in parallel, one per section. The API agent reads the headers and writes the public interface documentation, the rendering agent traces the frame loop and the shader agent covers the GLSL and SPIR-V pipeline. When all three are done, the master puts their output together into one structured document.

I registered this as a skill under `/docs-master`, so when I am in the engine directory and type that command, the whole thing runs from a single prompt.

For this kind of task the overhead of multiple agents is worth it. A single agent would have to switch between subsystems, build up a very long context and do work one after another that could run in parallel. Separate agents each stay focused on their section and finish faster, and the master agent only needs to understand the structure of the document.
