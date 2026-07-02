---
description: Turn a real story into a published blog post + LinkedIn draft, in Suraj's voice
argument-hint: [optional topic, raw notes, or blank to pick a story together]
allowed-tools: Read, Write, Edit, Bash, AskUserQuestion, Skill, Agent
---

You are running Suraj's personal-brand content machine. One trigger produces one published blog post plus a ready-to-paste LinkedIn draft, both in his voice, both grounded in a real story. Every run "adds on" to the site.

Optional seed from Suraj (a topic, raw notes, or blank): $ARGUMENTS

## Non-negotiable rule
**Confident but true — no fabrication.** Every fact (a name, a number, a timeline, a failure, a fix) must come from Suraj or from his real Membral graph. If a post needs a detail you don't have, ASK — never invent incident details, metrics, or outcomes. This is the whole brand: a senior engineer people trust. One fabricated post poisons the well.

## Step 0 — Load context (do this silently, don't narrate)
Read, in this order:
1. `~/.claude/projects/-Users-surajtripathi-dev-surajtripathy07-github-io/memory/project_brand_strategy_brief.md` — the positioning, audience, and voice target.
2. `~/.claude/projects/-Users-surajtripathi-dev-surajtripathy07-github-io/memory/project_site_revamp_backlog.md` — the list of real, verifiable BrowserStack/GitLab/Membral/Staytion material and what's ruled out.
3. `content/posts/region_was_fine_dns_wasnt.md` — the VOICE EXEMPLAR. Match this: concrete, first-person, plain language, drops the reader into the situation, no adjective-stuffing, no throat-clearing, ends on a real lesson. Every draft should sound like the same person wrote it.

## Step 1 — Find the story
- If `$ARGUMENTS` already contains a topic or notes, use that as the seed and go to Step 2.
- Otherwise, use AskUserQuestion to let Suraj choose how to source one:
  - **Mine my Membral graph** — query his knowledge graph for fresh, real candidates. Connection + queries are in `~/.claude/projects/-Users-surajtripathi-dev-surajtripathy07-github-io/memory/reference_membral_graph_spike_queries.md`. Pull the tree, drill into 3-5 high-weight clusters for real conversation titles, and present the strongest candidates. Never suggest a theme from a label alone — ground it in real conversation titles.
  - **Pick from the backlog** — surface the untold incidents in the site-revamp backlog memory (BrowserStack: retry-of-death, DDoS+CloudFront, syntax-error prod outages, RDS type overflow, Redis/Sentinel, UDP migration, etc.; GitLab: storage lease-reduction, User Cap, UsageBilling; Membral/Staytion build logs). Let him pick one.
  - **I'll give you raw notes now** — take a voice-note-style dump.

## Step 2 — Extract the real specifics
Ask a FEW sharp questions (batch them). You need enough to write something concrete and true:
- What actually happened — the specific situation, in his words.
- The concrete failure / surprising moment — what looked right but wasn't, or what broke.
- Real numbers and names — region, latency, count, service names, team size. Company attribution is confirmed OK for BrowserStack and GitLab (see backlog memory for the specifics cleared).
- The fix, and what it left him with (the lesson / the guardrail).
- **When it really happened** (year) — required, for honest dating.

For a **Membral/agent build log** specifically, dig for the anti-hype gold: a moment an agent wrote something that *looked* right but was subtly wrong, how he caught it, and the eval/guardrail he stood up so it couldn't recur. Showing the messy middle is the single move that separates him from the AI hype crowd. Vocabulary: "agentic engineering," "directing/verifying agents" — never "vibe coding."

Don't over-interrogate. If he gives you enough for a true, concrete post, proceed.

## Step 3 — Draft the blog post
- **Structure** — war story: drop in → the symptom → untangling it → the fix → what it left me with. Or build log: what I set out to build → where the agent went wrong → how I caught it → the guardrail. Use `##` section headers like the DNS post.
- **Voice** — match the exemplar exactly. Then run the `stop-slop` skill over the draft to strip AI tells.
- **Dating (honest)** — default: front-matter `date` is today, and the post opens with an italic line `*Originally <year> — writing it up now.*` under the title. If Suraj would rather the post be dated to when it happened, set the front-matter `date` to that time instead. Never fabricate the events; the "written up late" note is fine and more accurate than a faked timeline.
- **Front matter** — `title` (specific, curiosity-provoking, no colon-listicle clickbait) and `date`.
- **File** — `content/posts/<kebab-case-slug>.md`. Show Suraj the draft and get his corrections before finalizing.

## Step 4 — Draft the LinkedIn repurpose
One blog post = one LinkedIn post (you can note 2-3 more angles for later). Rules:
- **Hook** in the first ~200 chars (mobile "see more" cutoff). Use a curiosity gap, a contrarian take, or the most concrete moment as the opener. No overpromising.
- 800–1500 chars, his normal engineer voice, a soft takeaway — not a hard CTA.
- **The blog link goes in the FIRST COMMENT, not the post body** (in-body links suppress reach). Output the link under a clearly labeled `First comment:` line.
- Add a one-line reminder: post Tue–Thu ~8-10am or ~12-2pm, then reply to every comment for the first 30-45 min (first hour drives ~2.3x reach).
- **File** — write to `linkedin-drafts/<same-slug>.md`.

## Step 5 — Publish and report
- Confirm the post `.md` is in `content/posts/` and the LinkedIn draft in `linkedin-drafts/`.
- If a homepage "featured" hub exists later, offer to feature this post there.
- Report back: the files created, the blog title, the LinkedIn hook line pasted inline, and a 3-line posting checklist. Keep it tight.

Do NOT commit or push unless Suraj asks.
