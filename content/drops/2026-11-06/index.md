---
title: "One deadline doing two jobs"
date: 2026-11-06T21:00:00+05:30
tags: ["testing", "flaky-tests", "membral"]
images: ["cover.png"]
draft: false
---

![](cover.png)

A test that fails only now and then is worse than one that always fails, because everyone learns to just rerun it. [Membral](https://github.com/surajtripathy07/membral), the memory layer I build for AI coding sessions, had one: it checks that uploading a saved session gets cancelled if the upload hangs past a 200-millisecond deadline.

The bug was one timestamp doing two jobs. The same deadline also marked the latest moment the upload was allowed to start, so those 200 ms first had to cover reading the session file and running git, and on a busy test server they ran out before the upload began.

I could not make it fail on demand: the old test passed 10 runs out of 10 with 16 busy loops hogging the CPU. So the fix takes real time out of the test instead of tuning it: freeze the test's fake clock, wait until the upload has actually started, and only then move the clock forward 200 ms.

If a test depends on how fast the machine is, it is testing the machine.

[What drops are, and the names in them](https://surajtripathi.info/drops/)
