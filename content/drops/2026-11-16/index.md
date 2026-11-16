---
title: "Allowing two helpers didn't forbid the rest"
date: 2026-11-16T21:00:00+05:30
tags: ["ai-agents", "permissions", "security", "claude-code"]
images: ["cover.png"]
draft: false
---

![](cover.png)

I run an AI coding agent on a timer with nobody watching, so I limit what it may do, including which helper agents it can start. Foreman, my scheduled AI coding job, has a settings file with an allow list that names two helper types, scout and Explore, and I read that as "only these two".

Then I switched off my guard hook, a small script that checks every action before it runs, so I could test each safety layer on its own. A general-purpose helper, the kind with the widest reach, started without complaint.

An allow entry turned out to mean "this one may run", not "only these may run". The only thing keeping the other helper types out had been the hook.

The fix is a deny rule for each type I don't want, and with the hook still off, those rules refused general-purpose and builder while scout kept working. The catch is that any new helper type stays open until I add its name.

An allow list is not a deny list.

[What drops are, and the names in them](https://surajtripathi.info/drops/)
