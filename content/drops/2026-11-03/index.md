---
title: "Teaching my search to say nothing found"
date: 2026-11-03T21:00:00+05:30
tags: ["membral", "search", "embeddings", "measurement"]
images: ["cover.png"]
draft: false
---

![](cover.png)

Meaning-based search never says "nothing found" on its own. Ask it about something you never discussed and it still hands back the closest match, however far off.

[Membral](https://github.com/surajtripathy07/membral), the memory layer I build that saves your AI coding chats so you can search them later, needs a cut-off: a minimum closeness score, from 0 to 1, a result must reach before it is shown. I tested cut-offs against 6 questions that have no true answer in my history, so the right result for each one was an empty list.

Lower cut-offs still let a wrong match through on at least one of the 6. For raw chat text only 0.68 returned nothing on all 6, stricter than the 0.66 that works for the short notes Membral pulls out of those chats.

Raw chat is noisier than notes, so it has to clear a higher bar before it counts as an answer.

[Names in this post, explained](https://surajtripathi.info/drops/)
