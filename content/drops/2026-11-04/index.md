---
title: "Each save downloaded every saved lesson"
date: 2026-11-04T21:00:00+05:30
tags: ["membral", "postgres", "pgvector", "egress", "performance"]
images: ["cover.png"]
draft: false
---

![](cover.png)

My hosted database plan charges for egress, the data that leaves the database, and on Nov 2 one app pushed about 2.5 GB of it in a day, past the free quota. The app was [Membral](https://github.com/surajtripathy07/membral), the memory layer I build that saves your AI coding sessions so you can search them later.

Each time Membral saves a new lesson from a session, it first checks for near-duplicates by comparing embeddings, lists of numbers that capture what a text means. That comparison ran in my app code instead of the database, so every save job downloaded every stored lesson in the project, twice, at about 19.4 KB each.

On a project with about 2,000 lessons, that comes to roughly 79 MB per job, all to keep only the closest few matches. The fix is one database query that returns just those few, because Postgres with the pgvector extension can rank vectors itself.

Send the question to the data, not the data to the question.

[What drops are, and the names in them](https://surajtripathi.info/drops/)
