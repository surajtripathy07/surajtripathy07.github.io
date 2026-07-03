---
title: "Five Months on WhatsApp Before I Wrote a Line of Code"
date: "2026-07-03"
---

Staytion is the app I run a small paying-guest rental business on: six flats, forty-two tenants ([@staytioncoliving](https://www.instagram.com/staytioncoliving/) on Instagram), a side hustle alongside my day job. It's a native Android app now: onboarding, rent, electricity, deposits, caretakers, offboarding, a call log that matches incoming calls to leads, all in one place. Full feature rundown is on the [projects page](/projects/) if you want the tour. This post is about why it ended up shaped the way it did.

## The Business Existed Before the App

The business ran for about five months before any app existed. Leads came in through Housing, MagicBricks, Instagram ads, all landing in WhatsApp. Qualifying a lead, turning it into a tenant, sending reminders, settling deposits. All of it lived in WhatsApp chat threads, because that's where the conversation already was.

The very first piece of Staytion tooling had nothing to do with property management. It was a Google Form that fed into a Telegram bot, generating the rent agreement and police-verification paperwork instead of me typing it out by hand for every new tenant. Paperwork was the first pain worth automating; scheduling and billing came later.

## Not Another App to Install

Every tenant already has WhatsApp. Asking them to install something else, log in, and learn a new interface just to pay rent or see a bill is friction for no real reason. What I needed was something for myself: an admin layer that sits on top of WhatsApp instead of replacing it, so the day-to-day conversation and reminder trail stays exactly where tenants already expect it, while I get a place to run the business behind it.

## The Admin App Started Even Smaller

The app itself started narrower than any of that: a call comes in, I need to send this person details on WhatsApp, and I want a call log where I can jump straight from the incoming call to their WhatsApp thread on that number instead of copy-pasting it between apps. The same call log surfaced the recording of the call itself, so if I couldn't remember exactly what I'd told someone, I could just listen back instead of guessing.

From there it grew by the same logic every time: whatever chore was most annoying that week became the next feature. I kept losing track of what I'd already told a lead and what stage they were at, so I'd walk into a callback cold. That became lead tracking: notes per lead, a visible stage, and if someone said "call me back on the 23rd," the app surfaced it on the day instead of me trying to remember.

In parallel, I was tracking income per bed, chasing pending deposits, and reminding tenants about rent by hand. We let tenants pay on whatever date they originally moved in instead of forcing everyone to the 1st, which is friendlier for them but means rent reminders don't land on one predictable day for the whole building. Keeping that straight by hand was the real pain driving all of it, more than any abstract need for a property management system. I turned that pain into the Flat model: rooms, beds, AC or no AC, added one piece at a time as each manual task got annoying enough to automate.

{{< gallery >}}
<img src="/images/staytion/dashboard.png" alt="Staytion dashboard — per-flat occupancy, revenue, and margin">
<img src="/images/staytion/manage-1.png" alt="Staytion rent collection view">
<img src="/images/staytion/manage-2.png" alt="Staytion rent collection view, another flat">
{{< /gallery >}}

*The dashboard (per-flat occupancy, revenue, margin) and rent collection (per-tenant, with overdue flags and one-tap reminders) — real flats, real tenants, real numbers.*

Not everything survived. Around the same time, I started a separate Next.js/Prisma site meant to be my own lead funnel, direct inbound outside Housing and MagicBricks. I dropped it partway through: it needed the same flat and bed data the admin app has now, and back then that data didn't exist anywhere except in my head. I was building the funnel before the operational model underneath it existed.

## The Real Differentiator: Electricity

Some PGs fold electricity into a flat rent; a few run pay-and-use coin meters. I didn't want either: flat-rate subsidizes heavy users at everyone else's expense, and pay-and-use is friction tenants notice every day. I wanted usage-based billing that stayed invisible until the bill arrived.

The mechanism: every room's AC sits on its own sub-meter. When a tenant moves in or out mid-cycle, I capture that AC's meter reading on that exact day. When the monthly bill comes in, I capture the reading for every AC in the flat. That gives a clean start/end reading per tenant, even for someone who only lived there twelve days of a thirty-one-day cycle. Common-area charges come from a separate pool, split per person per day they were there, so someone who moved in mid-cycle doesn't pay for days before they arrived.

Doing that by hand took 20 to 25 minutes per flat per month, in one sitting if everything went smoothly. Six flats and growing meant that was real hours every month spent on arithmetic instead of on the business. What comes out the other end, once it's automated, is a WhatsApp message like this, per tenant, per billing cycle:

> Hi, the total electricity bill for May–Jun is ₹11,200.
> Your AC usage for the cycle comes to ₹780.
> Your share of the common electricity charges is ₹233.50.
> 👉 Your total share = ₹1,013.50 (rounded to ₹1,014).

Behind that one message is a full per-tenant breakdown: AC-days occupied, common-charge segments recalculated every time someone's move-in or move-out date splits the cycle, individual and rounded totals reconciled back against the bill. The app is where I capture the raw meter readings, and where all of that gets computed and sent automatically per tenant, per flat, based on whoever's lifecycle applies to that cycle.

## Kotlin, Supabase, No Server

Native Android decided Kotlin. That part was never really a question. What decided the backend was that I initially just wanted CRUD: create a flat, add a tenant, record a payment. Supabase gives you that directly: Postgres with an auto-generated REST API the Android client calls straight from Kotlin, plus auth and row-level security, without me standing up and hosting a separate server. Just a database and a client, and that's held up as everything else got added.

The behavior that isn't plain CRUD, like moving a tenant out and freeing their bed as one step, or deactivating a flat and clearing everyone still attached to it in one shot, lives in Postgres functions I call over RPC. Anything that has to be all-or-nothing runs as a single database transaction. A client-side loop over several writes has no rollback if one of them fails partway through.

More of the domain behavior now lives in Kotlin: what counts as a valid move-out, how a reservation differs from an active tenancy, backed by integration tests against a local Supabase instance. That test suite is also how I work with an agent: I write the tests that pin down the behavior I want, then let Claude implement against them without hovering over every line. The tests are the contract; the agent gets to go full out on the implementation as long as it holds.

{{<mermaid>}}
flowchart LR
    subgraph Device["Android device"]
        App["Staytion app\nKotlin + Jetpack Compose"]
    end

    subgraph Supabase["Supabase (hosted)"]
        Auth["Auth\nGoogle Sign-In + RLS"]
        API["Auto-generated REST API\n(PostgREST)"]
        RPC["Postgres functions\n(RPC, transactional)"]
        DB[("Postgres")]
    end

    WA["WhatsApp\n(wa.me deep link)"]

    App -- "sign in" --> Auth
    App -- "plain CRUD" --> API
    App -- "multi-step writes" --> RPC
    API --> DB
    RPC --> DB
    App -- "opens chat via intent" --> WA
{{</mermaid>}}

No app server sits in the middle. The client talks to Supabase directly for everything, and reaches WhatsApp only through a deep link, never an API.

## What It Left Me With

None of this came from a spec. It came from doing the same manual thing three times and getting annoyed enough to automate it the fourth. The app followed the shape of the business: WhatsApp-first because that's where tenants already were, electricity transparency because that's what we'd already decided to compete on. It never bent the business to fit whatever a generic property-management tool assumed. The Next.js funnel is the counter-example: I built that one ahead of the data it needed, and it never earned back the time it cost.
