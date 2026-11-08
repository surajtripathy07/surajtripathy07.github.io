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
- `node tools/art/build.mjs`: regenerate the painted art partials/data (run after editing `tools/art/`).
- No test suite, linter, or package.json — this is a content + template repo.
- Build artifacts (`public/`, `resources/_gen/`, `.hugo_build.lock`) are gitignored; don't
  hand-edit or commit anything under `public/`.

## Deployment

`.github/workflows/hugo.yml` builds with Hugo `0.163.3` (extended) + Dart Sass on every push
to `main` and deploys straight to GitHub Pages — there is no staging environment. Pushing to
`main` is effectively publishing to the live site.

## Architecture

- **No theme.** `theme` is gone from `config.toml`; `themes/hugo-coder/` is still in the repo
  but inert. Every template is top-level `layouts/` (`_default/baseof.html`, `index.html`,
  `404.html`, `drops/`, `posts/`, `partials/head.html`, `partials/css.html`).
- **Look: painterly, fixed palette (no dark-mode toggle).** Home (`layouts/index.html`) is a
  painted rendition of Las Meninas with the door. About (`_default/about.html`, front matter
  `layout: about`) is a Mumbai street scene with Auto/Day/Night lighting on Mumbai time
  (`assets/js/about.js`), text below on the shared sheet. Every other page uses the shared
  "sheet" (`content/clankers.md`, `_default/clankers.html`, `partials/sheet/`): a torn chalk
  sheet on a dark green brush-stroked ground. **Owner rule: only the home page carries a
  famous-painting rendition; other pages get the painterly theme only.**
- **CSS** in `assets/css/`: `tokens.css` (`--ink --green --deep --ochre --chalk --ver
  --ver-text --soft`), `site.css` (sheet + prose), `home.css`, `about.css`. Minified via Hugo
  Pipes. Use the tokens; there is no second palette to define.
- **Art pipeline.** Node generators in `tools/art/` (no npm deps; see its README) write
  committed outputs: `layouts/partials/art/`, `data/art.json`, `data/dabs.json`,
  `static/img/grain.png`. CI has no Node, so after editing anything in `tools/art/` rerun
  `node tools/art/build.mjs` and commit the outputs.
- **Minify:** HTML and SVG minify are disabled in `config.toml` because Hugo's minifier
  corrupts the inline SVG paintings.
- **Markdown render hooks** (`layouts/_default/_markup/`): images become resized webp
  (`render-image.html`); h2 gets a brush underline (`render-heading.html`).
- **Shortcodes** (`layouts/shortcodes/`): `gallery`, `ledger`, `dial`, `close`, `when` (project
  date line under a heading), `mermaid` (pinned mermaid@11 from jsdelivr, loaded only on pages
  that use it).
- **Content** (`content/`): `_index.md` (home), `about.md`, `projects.md`, `clankers.md`;
  `posts/*.md` (front matter `title` + `date`); `drops/` paginates at 10 per page
  (`pagination.pagerSize`), and home lists the 5 newest drops automatically.
- **Menu** (`[[menu.main]]` in `config.toml`): Home, Projects, Drops, Posts, About, Clankers.

## Content workflow and voice

- `/writeup` (`.claude/commands/writeup.md`) is the standing slash command for producing new
  content: it turns a real story into one blog post in `content/posts/` plus a matching
  LinkedIn draft in `linkedin-drafts/`. It pulls positioning/voice context from this project's
  Claude Code memory files and uses `content/posts/region_was_fine_dns_wasnt.md` as the voice
  exemplar.
- **Non-negotiable rule for any content in this repo: confident but true, no fabrication.**
  Every concrete fact (name, number, timeline, incident detail) must be real — sourced from
  Suraj directly, not invented to sound better. If you don't have a needed detail, ask.
- Project dates on Projects and Home come from confirmed records only (see the `when`
  shortcode); ask before adding any date.
- `linkedin-drafts/` is gitignored except its `README.md` — drafts are working copy, not meant
  to be published to the repo.
- `.handoff/` is a gitignored scratch area for session handoff notes between work sessions —
  not part of the site.
