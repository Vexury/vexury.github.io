---
title: "🤖 Getting started with Claude Code"
date: 2026-06-03
summary: "How I configured Claude Code for my workflow: CLAUDE.md files, skills, hooks, MCP, and multi-agent documentation."
preview_image: /images/ClaudeCode_logo.png
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

I maintain a library of reusable Unity scripts that I want available in every new project. Manually copying folders and resolving what goes where is the kind of thing that is easy to get wrong and tedious to repeat. So I wrote a skill called `deploy-library` that knows where the library lives, how the target project is structured, which scripts to copy, and how to handle conflicts.

Because this task is not specific to any one project, I made the skill global, placing it in `~/.claude/skills/` rather than inside a repo. That means I can open any new Unity project, type `/deploy-library`, and it runs without any setup in that project first.

To use a skill I just type the slash command and Claude reads the skill file before doing anything. No repeated explanations across sessions.

The general rule is: CLAUDE.md for always-on context about the project, skills for specific multi-step tasks that have enough nuance to warrant their own reference document. Skills that apply to one project live in that repo; skills that apply everywhere live in the global `~/.claude/skills/` folder. Together they turn what would be a "re-explain everything" conversation into a one-liner.

## Hooks

Claude Code supports hooks: shell commands that run automatically in response to events like tool calls. I added one that fires every time Claude uses a tool and appends a line to a log file:

```
2026-06-08T02:18:23+02:00 | Edit  | file: C:\Projects\MyGame\Scripts\PlayerController.cs
```

Each session gets its own log file. If Claude edits twenty files across a refactor, I can scan the log rather than reconstruct the sequence from memory. I find it moderately useful in practice, but it feels good to have. When something unexpected happens, the log is already there.

Hooks are configured in `settings.json`, not in CLAUDE.md, which is the right separation: CLAUDE.md is instructions for Claude, `settings.json` is configuration for the harness that runs it.

## MCP

MCP (Model Context Protocol) is the standard for connecting external tools and data sources to a model. Claude Code acts as an MCP client, meaning you can give it access to things beyond the local filesystem.

I connected the GitHub MCP server so Claude can read issues from my repositories inside a session. The use case is simple: instead of switching to the browser to check whether a repo has open issues, I can ask and get the answer in context. It is not a dramatic change, just the removal of a small context switch. Most of the time there are no issues, which is fine. The point is not having to go look.

The broader value of MCP is that the same session reading your code can also read your issue tracker, a calendar, or any other system that has a server. The context stays in one place.

## Agent teams

The most involved thing I set up is a multi-agent workflow for documenting VexEngine, my custom C++ renderer. Documenting a codebase like that is tedious because different subsystems are largely independent: the public API, the rendering pipeline, and the shader system each require focused reading of completely different parts of the code.

The solution is a master agent that spawns three sub-agents in parallel, each responsible for one section. The API agent reads headers and produces the public interface documentation. The rendering agent traces the frame loop. The shader agent covers the GLSL and SPIRV pipeline. When all three finish, the master assembles their output into a single structured document.

I registered this as a skill under `/docs-master`, so when I am working inside the engine directory and type that command, the whole thing runs from a single prompt. One invocation, three agents working in parallel, one combined result.

This is where the multi-agent model actually earns its overhead. A single agent doing the same task would have to context-switch between subsystems, accumulate a very long context window, and serialize work that is naturally parallel. Separate agents each stay focused on their section and finish faster. The master agent only needs to understand structure, not content.
