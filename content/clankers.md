---
title: "Clankers"
slug: "clankers"
layout: "clankers"
description: "The AI agents and bots that work with Suraj Tripathi, and who decides what."
lead: "My clankers are the AI agents and bots I've set up to work with me. This is the whole setup: what runs, when, and who gets the final say."
dial:
  - { color: ver, time: "08:30", label: "drop brief" }
  - { color: ochre, time: "09:00", label: "star daily" }
  - { color: green, time: "20:30", label: "drop nightly" }
ledgers:
  bots:
    - name: Drop
      when: Daily at 20:30
      who: I approve
      kind: ask
      desc: >-
        Mines my day in Membral for one thing I made or fixed, drafts a post with an image and sends it to me on Telegram. Nothing goes live until I reply "go". Then it commits and pushes to [this site](/drops/). It also sends me a morning brief at 08:30, a taste check on Sundays, and watches its own health twice a day.
    - name: Star
      when: Every 30 minutes
      who: I approve
      kind: ask
      desc: Looks for people talking about Membral and drafts replies for me.
    - name: Coder
      when: Twice an hour
      who: I approve
      kind: ask
      desc: Picks a queued task on Membral and opens a draft pull request. It never touches main. I merge.
    - name: Reviewer
      when: Twice an hour
      who: I approve
      kind: ask
      desc: Reviews the coder's pull requests against a written gate.
  staytion:
    - name: OpenClaw agent
      when: Around the clock
      who: runs on its own
      kind: self
      desc: >-
        Runs on a small VPS as an [OpenClaw](https://docs.openclaw.ai) agent on a dedicated WhatsApp number. It sends the reminders, gives us an interface to the Staytion backend, and handles the admin, from agreement signing to rent reminders.
    - name: Sally
      when: Every 10 minutes
      who: runs on its own
      kind: self
      desc: >-
        Sally is our sales agent. She does the selling, working to fill empty beds. She can't mark a bed sold; only a separate reconcile step can. Her messages go out only after approval, checked every minute.
tokens:
  count: "11 billion+"
  label: "tokens through AI models since 17 September 2026"
  note: "As of 9 November 2026, counted from my local logs for Claude Code, opencode and Copilot CLI. Over 90% of it is models re-reading context from cache, which is where the maxing happens."
---

## In four words

I asked ChatGPT: "How best to describe me in 4 words". Its reply, word for word:

> If I had to compress how you come across into **four words**:
>
> **Curious. Ambitious. Analytical. Restless.**
>
> - **Curious** — you explore everything from AI and software to history, psychology, investing, travel, and even nursery rhymes.
> - **Ambitious** — you’re consistently thinking about the next level: career, wealth, projects, family, lifestyle.
> - **Analytical** — you naturally break things into systems, numbers, trade-offs, and scenarios.
> - **Restless** — probably the most distinctive one. You rarely seem satisfied with “good enough”; there’s usually a “but what if we did this better?” lurking underneath.
>
> If I were allowed a **fifth**, I'd pick **builder**.

## The workbench

I work in Claude Code. My config is public: [claude-config](https://github.com/surajtripathy07/claude-config).

One model does the thinking. It decides, designs, reviews and talks to me. Cheaper models do the legwork:

- Scouts (Haiku) look things up, one question each.
- Verifiers (Haiku) run the checks and report back. They never fix anything.
- Builders (Sonnet) write code from a written brief, inside a fixed scope.
- A browser agent (Sonnet) checks pages in my real Chrome.

Builders never commit. I do, after the change has been walked through with me.

### Skills I wrote

- **own-it:** walks me through every change until I could defend it myself.
- **orchestrate:** the delegation rules above.
- **pending-decisions:** lays out every decision waiting on me, with enough context to decide on the spot.
- **review-mr:** reviews a pull request the way its author would: runs the tests, reproduces the steps, and posts nothing until I say go.
- Also: git-commit, write-goal.

### Skills by others I use

stop-slop, web-design-guidelines, frontend-design, impeccable.

### Hooks

A read cap that keeps the thinking model's context small, session hooks that feed Membral, and a status line.

## Tokens burned

{{< tokens >}}

## Membral, the memory

[Membral](https://membral.me) ([source](https://github.com/surajtripathy07/membral)) saves my coding sessions from Claude Code, Codex, opencode, Copilot and Antigravity into one local store. It pulls out the decisions, learnings and outcomes and makes them searchable, so a new session starts with what the last ones found. A sweep picks up new sessions every 20 minutes.

## The bots

{{< dial >}}

{{< ledger "bots" >}}

## Staytion

[Staytion](https://staytioncoliving.com) is my paying-guest coliving business in Mumbai. Two clankers keep it running, alongside an Android app for property, tenant, rent and electricity tracking, with WhatsApp built in.

{{< ledger "staytion" >}}

{{< close >}}Want to compare setups? [surajtripathi793@gmail.com](mailto:surajtripathi793@gmail.com){{< /close >}}
