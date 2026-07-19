# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Suraj Tripathi's personal site — a Hugo static site (theme: `hugo-coder`) deployed to
`https://surajtripathi.info/` via GitHub Pages. It's a hiring-facing showcase: real
projects, honest build-story posts, and an "AI-native builder" positioning (see
`content/about.md`).

## Commands

- `hugo server` — local dev server with live reload (default `http://localhost:1313`).
- `hugo --minify` — production build, outputs to `public/` (matches the CI build command).
- No test suite, linter, or package.json — this is a content + template repo.
- Build artifacts (`public/`, `resources/_gen/`, `.hugo_build.lock`) are gitignored; don't
  hand-edit or commit anything under `public/`.

## Deployment

`.github/workflows/hugo.yml` builds with Hugo `0.163.3` (extended) + Dart Sass on every push
to `main` and deploys straight to GitHub Pages — there is no staging environment. Pushing to
`main` is effectively publishing to the live site.

## Architecture

- **Theme is vendored, not a submodule.** `themes/hugo-coder/` is a full copy of the
  hugo-coder theme committed directly into this repo (there's no `.gitmodules`). To customize
  behavior, prefer overriding in the top-level `layouts/` and `assets/css/custom.css` rather
  than editing files inside `themes/hugo-coder/` — Hugo resolves top-level `layouts/` and
  `assets/` over the theme's own, so overrides live outside the vendored tree.
- **Layout overrides** (`layouts/`):
  - `partials/page.html` — generic page template.
  - `partials/home/extensions.html` — injects the "landing hub" content (featured
    projects/posts) below the theme's default avatar/name/social block on the homepage.
  - `shortcodes/gallery.html` — `{{< gallery >}}...{{< /gallery >}}` shortcode for image
    galleries inside posts (see usage in `content/posts/five-months-on-whatsapp-before-code.md`).
- **Styling**: all customization lives in `assets/css/custom.css`, layered on top of the
  theme's own CSS. Root font-size is `62.5%` (`1rem = 10px`). Dark mode is handled via CSS
  custom properties, keyed off `body.colorscheme-dark` (explicit dark) and
  `body.colorscheme-auto` + `prefers-color-scheme: dark` (system-driven) — when adding new
  themed colors, define both.
- **Content** (`content/`):
  - `about.md`, `projects.md` — standalone pages (simple `title`/`slug` front matter).
  - `posts/*.md` — blog posts, front matter is just `title` + `date`.
  - Homepage featured cards in `layouts/partials/home/extensions.html` link to specific
    projects/posts by slug — when adding or renaming a post/project, check whether it's
    referenced there.

## Content workflow and voice

- `/writeup` (`.claude/commands/writeup.md`) is the standing slash command for producing new
  content: it turns a real story into one blog post in `content/posts/` plus a matching
  LinkedIn draft in `linkedin-drafts/`. It pulls positioning/voice context from this project's
  Claude Code memory files and uses `content/posts/region_was_fine_dns_wasnt.md` as the voice
  exemplar.
- **Non-negotiable rule for any content in this repo: confident but true, no fabrication.**
  Every concrete fact (name, number, timeline, incident detail) must be real — sourced from
  Suraj directly, not invented to sound better. If you don't have a needed detail, ask.
- `linkedin-drafts/` is gitignored except its `README.md` — drafts are working copy, not meant
  to be published to the repo.
- `.handoff/` is a gitignored scratch area for session handoff notes between work sessions —
  not part of the site.
