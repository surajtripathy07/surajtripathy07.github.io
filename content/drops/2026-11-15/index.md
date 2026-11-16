---
title: "A status script stalled every command for minutes"
date: 2026-11-15T21:00:00+05:30
tags: ["debugging", "macos", "ai-agents", "terminal"]
images: ["cover.png"]
draft: false
---

![](cover.png)

Every step my AI coding agent took suddenly cost four minutes, and nothing showed an error. I use Claude Code, an AI assistant that runs commands in my terminal, and from 07:27 one morning each command it ran sat for about 240 seconds before anything happened.

The cause was a status hook, a small script my terminal app iTerm2 runs before and after each command to show what the agent is doing. The script asked iTerm2 for permission through AppleScript, the Mac's built-in scripting tool, and iTerm2 never replied, so AppleScript waited its default 120 seconds, twice per command.

Even the check misled us: pgrep, the usual way to find a running program, said iTerm2 was not running while it was open on my screen, and the agent concluded it had quit. The fix, live at 10:38, is a wrapper that gives the hook 2 seconds, always reports success, and skips it for 5 minutes after a timeout.

A status light should never be able to stop the machine.

[What drops are, and the names in them](https://surajtripathi.info/drops/)
