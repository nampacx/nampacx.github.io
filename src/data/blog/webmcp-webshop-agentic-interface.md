---
author: Michael Kokonowskyj
pubDatetime: 2026-07-17T08:00:00Z
title: "From Confused to Sold: Turning a Web Shop Into an Agentic App with webMCP"
postSlug: webmcp-webshop-agentic-interface
featured: true
draft: false
tags:
  - mcp
  - ai-agents
  - web
  - automation
  - nampacx
  - claude
description: I explored webMCP with a sample web shop and learned how quickly web apps can become agent-friendly for search, cart updates, profile edits, and checkout.
---

## Why I Even Looked at webMCP

This post started with a conversation with Diana Dreher from Microsoft.

At first, I honestly did not get the point of webMCP. I had the usual thought: "Why do I need another protocol if agents can already click buttons like a caffeinated intern?"

Then we had a longer discussion about where agents are still weak today:

- They are often forced into fragile RPA-style browser automation
- They struggle with reliable intent-to-action mapping on complex UIs
- They have no consistent contract for "what can I do on this website?"

We also talked about the business side and monetization opportunities, but this post sticks to the technical side.

## The Experiment: Build a Real Sample

I decided to test the idea with a practical app instead of theorizing forever.

I asked Claude Code to generate a sample Contoso-style shop and then enhanced it with:

- Better logging, so I could actually see what was happening
- A webMCP implementation on top of existing capabilities

Sample repo:

- [nampacx/webMCP-WebShop](https://github.com/nampacx/webMCP-WebShop)

After about one to two hours, I had a working shop and could start testing the agent flow end to end.

## What Actually Worked

And yes, it is kind of cool.

Through the Claude browser extension, I could:

- Search products
- Add products to the cart
- Update user profile data
- Execute checkout

One important detail: I had to explicitly tell Claude to check for a webMCP implementation first. If I did not, it often tried the default UI-driving path.

I also tested it with the Claude desktop app. It still had to spin up a browser session, but the flow worked.

## The Part That Blew My Mind

Making the shop "agentic" was much easier than expected.

Most sites today bolt on a chat assistant in the bottom-right corner with a custom UI and awkward handoff patterns. You know the one.

With webMCP, I could skip that pattern entirely for agent clients:

1. Open the chatbot panel in the browser
2. Tell it to use webMCP
3. Let the agent interact through explicit capabilities instead of guessing UI behavior

Right now I only have this running nicely with Claude, not Copilot, but the direction is very promising.

## Why This Matters for Existing Websites

The most practical takeaway: I did not rebuild core shop logic.

I told the coding agent to reuse what already existed and expose another interface for it. That means a lot of current websites could be adapted without a full rewrite.

In other words:

- Keep existing business logic
- Add a machine-usable contract layer
- Gain a cleaner path for agent interactions

## Conclusion

Fun project, solid learning.

If webMCP discovery becomes more automatic in clients, this gets even better.

Given how quickly this worked in a real sample, I now see webMCP as a very practical way to make existing web apps more agent-friendly without adding another awkward chatbot bubble to every page.
