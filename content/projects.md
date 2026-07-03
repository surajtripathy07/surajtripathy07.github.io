---
title: Projects
slug: projects
---

Things I've built end to end, mostly by directing AI coding agents rather than typing every line myself. I own the architecture, the data model, and the judgment calls that matter; the agent does the typing. Read more about [why I build this way](/about/).

## Membral

*Own your AI conversations.*

A self-hosted knowledge graph over my ChatGPT/Claude/Grok conversation history. A Chrome extension syncs chats into a Next.js/Supabase backend, where a multi-pass LLM extraction pipeline turns raw conversations into a bi-temporal knowledge graph: nodes for people, tools, organizations, and life areas, edges with confidence scores and full audit provenance, all embedded with pgvector and clustered into a navigable tree. Exposed to any AI tool through a self-hosted MCP server, so the graph becomes queryable context for other agents.

Currently running on 976 real conversations → 2,082 nodes / 2,107 edges.

[Source on GitHub →](https://github.com/surajtripathy07/membral)

**Stack:** Next.js 15, React 19, Supabase (Postgres + pgvector), OpenAI embeddings, MCP.

## Staytion

*The app I run my rental business on.*

A native Android app that runs a real PG (paying-guest) rental side business end to end — ~6 flats, ~42 tenants, semi-passive cash flow. It sits on top of how the business already works and takes the daily operations off my plate: onboarding, rent, electricity, deposits, caretakers, and offboarding, all in one place with visibility over every flat.

The friction it removes is the point. A rent reminder surfaces in the app; one tap opens WhatsApp with the right message already written for the right tenant (it auto-detects Personal vs Business). Electricity is calculated from AC meter readings I punch in, split per tenant, and turned into an individual PDF I can share. It tracks the full tenant lifecycle — inquiry → reserved → active → notice → moved out — plus deposit slips and settlements, caretaker-salary reminders, and a call log that matches incoming call recordings to leads so I know who's calling before I answer.

A separate automated flow generates each tenant's rent agreement and police-verification (PV) documents from a Google Form via a Telegram bot.

The app itself started as just a call log, so I could jump from an incoming call straight to the right WhatsApp thread instead of copy-pasting a number between apps, then grew into lead tracking, flats, and everything else as each new manual annoyance became the next feature. A separate early attempt at a Next.js/Prisma site for direct-inbound leads got dropped partway through — it needed flat/bed data that didn't exist yet outside my own head.

**Stack:** Kotlin, Jetpack Compose (Material 3), Supabase (Postgres + Auth + RLS), Google Sign-In.

## GeniusAIx

*Summarize any YouTube video and ask it questions.*

An AI learning layer for YouTube: toggle it on any captioned video and it turns the transcript into AI summaries, "ask anything" Q&A, smart highlights that jump you straight to the key moments, and auto-generated quizzes to test what actually stuck — all from a clean, collapsible sidebar. I shipped this before YouTube had its own in-video AI Q&A; they added something similar a few months after it went live. I've since sunsetted it.

[geniusaix.com →](https://geniusaix.com/) &middot; [Chrome Web Store listing →](https://chromewebstore.google.com/detail/genius-aix-for-youtube-su/ddmilgmdhnppllhepeobhgjkfgkgnkeb) *(sunsetted — no longer maintained)*

**Stack:** Chrome Extension (MV3), Firebase.

## Mumbai Circuit Planner

Google Maps optimizes for speed: the fastest way from A to B. What I wanted was different, a 40-minute to hour-long leisure drive with my kid and wife that starts and ends at home, avoids traffic, and isn't just the same road there and back. A single-file tool on top of the Google Maps Directions API that nudges a destination point outward to force a circular route, optimized for low traffic instead of the shortest path.

[Try it →](/circuit-route-mumbai/)

## Promptly

*Upgrade everyday prompts into expert-level instructions.*

A Chrome extension that sharpens a rough prompt right where you're typing it. Select your text in ChatGPT, Claude, Gemini, Grok, or Copilot, hit Cmd/Ctrl+E, and it rewrites the prompt into a more precise instruction — with optional controls for intent, role, format, tone, and constraints when you want to steer the rewrite. Your API key is stored locally, and only ever goes to the model you're talking to.

[Get the extension →](https://chromewebstore.google.com/detail/promptly-enhance-your-pro/jepfpialangjoaddkjjiahijbelpggpo)

**Stack:** Chrome Extension (MV3).
