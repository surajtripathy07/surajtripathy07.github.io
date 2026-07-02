---
title: The Region Was Fine, DNS Wasn't
date: "2026-07-02"
---

*Originally ~2019 — writing it up now.*

BrowserStack's real-device product streams your test session off a physical phone or tablet sitting in a data center, over WebRTC, straight into your browser tab. Getting that connection up involves a negotiation phase: the device sits behind its own network, so before it can start streaming, it has to reach out to a relay server and hand over its identification details. That relay is a TURN server, part of the standard ICE process every WebRTC connection goes through when a direct peer-to-peer path isn't available.

## The Symptom

One day the fallback rate for a single region started climbing. "Fallback" is what we called it when a device failed to establish that streaming connection: the session didn't get a device, and the request fell back to something else. From the outside this looked like two problems stacked on top of each other. Users in the affected region waited far longer than normal, because devices from other regions were getting picked to serve them instead. Inside that region, the pool of usable devices kept shrinking on its own: our automation flagged every device that failed to connect for a 20-minute cleanup cycle. Once enough devices piled into that "cleaning" state at the same time, the failure rate in the region climbed, which pushed more devices into cleanup, which pushed the failure rate higher still.

## Untangling the Loop

We didn't solve this alone. It took three or four of us pulling logs from different parts of the pipeline before "devices from this region aren't connecting" turned into anything resembling a location. Streaming failures are an ambiguous symptom: they can come from network, orchestration, mobile config, or something in between. Isolating even the right layer took a team, not a solo debugging session.

## Finding DNS

The trail pointed at DNS. Devices in the affected region couldn't find the TURN servers they needed to complete the WebRTC handshake, because DNS wasn't resolving those hostnames for them. We confirmed it: ran dig and nslookup against a server we suspected was affected, and got back what you don't want to see, no resolution.

We pointed it to a different DNS resolver for interim relief while we kept digging, then restarted the DNS service itself. That's what closed the gap. The region's devices weren't broken, and the network path wasn't broken either. DNS stopped resolving for one class of hostname, and that was enough to pull an entire region's device pool into a self-reinforcing loop of connection failures and automated cleanups.

## What It Left Me With

What stuck with me was how far the blast radius traveled from a single point of failure. A DNS lookup that should take milliseconds broke a loop that dragged connection rates down across an entire region for as long as it went unnoticed. The automation that was supposed to protect us, the 20-minute cleanup for failed devices, did exactly its job and made the incident worse. It had no way to tell one bad device apart from every device failing for the same external reason.
