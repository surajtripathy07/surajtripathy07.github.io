---
title: Projects
slug: projects
---

Things I've built end to end, mostly by directing AI coding agents rather than typing every line myself. I own the architecture, the data model, and the judgment calls that matter; the agent does the typing. Read more about [why I build this way](/about/).

## Membral

{{< when "Sep 2026 – now" >}}

*Your coding agent answers from what past sessions found.*

Every coding harness keeps its own transcripts in its own format, on one machine, until it prunes them. Membral sits underneath all of them. One command per harness, then every session from Claude Code, opencode, GitHub Copilot and Codex CLI lands in one Postgres store, normalised into one shape: turns in order, models, token usage, tools called, files touched, the sub-agent tree and a server-side cost figure. A session that needs the past pulls it back over MCP: decisions and settled designs, issues and PRs worked on, outcomes, dead ends, what a parallel session did today. It hands the agent the link; the agent checks live state itself.

Measured on five frozen tasks, five runs each with and without Membral: the median answer got at least one more fact right on four of five, with no harmful answer in 25 runs. For an Opus session that delegates to sub-agents, Membral answered from recorded sessions in 0.30 to 0.37x the wall time.

In use on every session I run since September 2026. Built solo by directing agents, with the data model and the judgment calls mine. MIT.

[Source on GitHub →](https://github.com/surajtripathy07/membral) &middot; [membral.me →](https://membral.me)

**Stack:** TypeScript, Postgres (Supabase), MCP server, Claude Code plugin, CLI.

## Mumbai Circuit Planner

{{< when "Apr 2026" >}}

Google Maps optimizes for speed: the fastest way from A to B. What I wanted was different, a 40-minute to hour-long leisure drive with my kid and wife that starts and ends at home, avoids traffic, and isn't just the same road there and back. A single-file tool on top of the Google Maps Directions API that nudges a destination point outward to force a circular route, optimized for low traffic instead of the shortest path.

[Try it →](/circuit-route-mumbai/)

## Promptly

{{< when "Jul 2025" >}}

*Upgrade everyday prompts into expert-level instructions.*

A Chrome extension that sharpens a rough prompt right where you're typing it. Select your text in ChatGPT, Claude, Gemini, Grok, or Copilot, hit Cmd/Ctrl+E, and it rewrites the prompt into a more precise instruction, with optional controls for intent, role, format, tone, and constraints when you want to steer the rewrite. Your API key is stored locally, and only ever goes to the model you're talking to.

[Get the extension →](https://chromewebstore.google.com/detail/promptly-enhance-your-pro/jepfpialangjoaddkjjiahijbelpggpo)

**Stack:** Chrome Extension (MV3).

## Staytion

{{< when "May 2025 – now" "Android app Feb 2026 · OpenClaw agent Jul 2026 · Sally Oct 2026" >}}

*A coliving business that runs on an agent.*

[Staytion](https://staytioncoliving.com) is a paying-guest coliving business in Mumbai: 33 flats and 318 beds that my family and I sell through one pipeline, five of the flats mine. Two agents on a dedicated WhatsApp number do the work. Sally, our sales agent, answers every inquiry, qualifies the lead, books the visit and follows up. OpenClaw holds the gate: every message goes out through it, Sally's included. It also chases rent, drives agreement signing and sends the owners a daily digest. The business takes about an hour of my day.

It went live in shadow mode first, drafting replies a human approved, with a kill switch that pauses all outbound messages and a hard rule that anything touching money waits for a person. Private repo.

**Stack:** Node, an agent runtime on WhatsApp, Supabase (Postgres).

### How it started

A native Android app that runs a real PG (paying-guest) rental side business end to end, with six flats and forty-two tenants at the time, semi-passive cash flow. It sits on top of how the business already works and takes the daily operations off my plate: onboarding, rent, electricity, deposits, caretakers, and offboarding, all in one place with visibility over every flat.

The friction it removes is the point. A rent reminder surfaces in the app; one tap opens WhatsApp with the right message already written for the right tenant (it auto-detects Personal vs Business). Electricity is calculated from AC meter readings I punch in, split per tenant, and turned into an individual PDF I can share. It tracks the full tenant lifecycle (inquiry → reserved → active → notice → moved out), plus deposit slips and settlements, caretaker-salary reminders, and a call log that matches incoming call recordings to leads so I know who's calling before I answer.

A separate automated flow generates each tenant's rent agreement and police-verification (PV) documents from a Google Form via a Telegram bot.

The app itself started as just a call log, so I could jump from an incoming call straight to the right WhatsApp thread instead of copy-pasting a number between apps, then grew into lead tracking, flats, and everything else as each new manual annoyance became the next feature. A separate early attempt at a Next.js/Prisma site for direct-inbound leads got dropped partway through: it needed flat/bed data that didn't exist yet outside my own head.

**Stack:** Kotlin, Jetpack Compose (Material 3), Supabase (Postgres + Auth + RLS), Google Sign-In.

## GeniusAIx

{{< when "May 2025" >}}

*Summarize any YouTube video and ask it questions.*

An AI learning layer for YouTube: toggle it on any captioned video and it turns the transcript into AI summaries, "ask anything" Q&A, smart highlights that jump you straight to the key moments, and auto-generated quizzes to test what actually stuck, all from a clean, collapsible sidebar. I shipped this before YouTube had its own in-video AI Q&A; they added something similar a few months after it went live. I've since sunsetted it.

[geniusaix.com →](https://geniusaix.com/) &middot; [Chrome Web Store listing →](https://chromewebstore.google.com/detail/genius-aix-for-youtube-su/ddmilgmdhnppllhepeobhgjkfgkgnkeb) *(sunsetted, no longer maintained)*

**Stack:** Chrome Extension (MV3), Firebase.
