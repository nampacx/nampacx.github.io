---
author: Michael Kokonowskyj
pubDatetime: 2026-10-16T10:00:00Z
title: "STARK: Learning Microsoft Foundry, from Dummy to Vision"
featured: true
draft: false
tags:
  - azure
  - foundry
  - ai-agents
description: "A coffee chat led me to build STARK: a hands-on Microsoft Foundry
  learning repo, from first model calls to hosted agents, skills, workflows, and
  their costs."
---

## TL;DR

- An invitation to help at the Microsoft AI Tour sent me back to the workshop to brush up on Microsoft Foundry.
- [STARK: Microsoft Foundry from 0 to hero](https://github.com/nampacx/MS-Foundry-from-0-to-hero) brings 17 notebooks together, from a first model call to skills, hosted agents, workflows, and A2A.
- It is a learning repo with rough edges, not a production blueprint. Hosted-agent compute also has a bill beyond model tokens.

## A coffee chat, then a little homework

A few days ago, during our virtual coffee at Xebia, my colleague Thomas asked whether I wanted to support him at the Microsoft Foundry booth at the Microsoft AI Tour in Cologne the following week. Of course I said yes. A chance to meet people, exchange ideas, and help them get started? Absolutely.

Afterwards came the second thought: oh... maybe I should do a little skill-up first.

I had already worked with Foundry, but there were plenty of corners I had barely touched. Hosted agents, skills, workflows, and how all those pieces fit together. I wanted somewhere to experiment with MCP and A2A, but also with less flashy things like a simple sequential pipeline.

And honestly, I don't particularly enjoy reading Microsoft documentation. It is much better than years ago, but finding the right information for the right version can still be hard. I wanted a connected learning path, with examples and links I could return to. Hopefully one that helps others too.

## From a cave and a hammer to Vision

I love the MCU, so Tony Stark came to mind. We start with a cave and a hammer, and eventually get to Vision. That felt like a fitting theme for building up our own understanding, one experiment at a time.

The result is **STARK**. The story moves from Dummy through J.A.R.V.I.S. and F.R.I.D.A.Y., takes an Ultron-shaped detour into guardrails, and ends with Vision as the A2A capstone. Thankfully, the notebooks have smaller ambitions than saving the world.

The [repository](https://github.com/nampacx/MS-Foundry-from-0-to-hero) uses Python notebooks, Bicep, and Azure Developer CLI infrastructure. Its chapters cover:

- **The foundations:** model calls, streaming, structured output, conversations, tracing, and monitoring.
- **Agents and capabilities:** prompt agents, built-in tools, a custom MCP server, skills, YAML definitions, and hosted agents.
- **Checking the results:** datasets, evaluations, guardrails, and red teaming, plus OCR, Document Intelligence, and Content Understanding.
- **Working together:** sequential and concurrent workflows, group chat, handoffs, and agent-to-agent delegation through A2A.

Start with the [getting-started guide](https://github.com/nampacx/MS-Foundry-from-0-to-hero/blob/main/docs/getting-started.md) and notebook 00, or read [the story](https://github.com/nampacx/MS-Foundry-from-0-to-hero/blob/main/story.md) first. Each chapter has a matching explanation. The idea is to read a little, run something, change it, and see what happens.

## Hosted agents: my code, Foundry's runtime

A prompt agent is mostly instructions, a model, and tool configuration. A **hosted agent runs your own code** on Foundry-managed compute. You control the orchestration and dependencies; Foundry supplies the hosting, endpoint, identity, and platform integration.

The [hosted-agent chapter](https://github.com/nampacx/MS-Foundry-from-0-to-hero/blob/main/docs/hosted-agents.md) uses source-code deployment: the agent's Python code and dependencies are packaged, and Foundry builds the runtime remotely. You do not need to build a Docker image locally for this path.

Two concrete examples are the invoice workflow, which extracts, reviews, and reports in a fixed sequence, and the morning briefing, which asks specialists in parallel before combining their answers. Both were deployed and called on a live Foundry project. That does **not** mean every preview path in the repo has been verified.

One practical detail: the hosted code does not inherit your personal Azure permissions. Its runtime identity needs access to the services it calls, such as Document Intelligence.

And yes, workflows are moving while I am learning them. Microsoft's [retirement notice](https://learn.microsoft.com/azure/foundry/agents/concepts/workflow) gives **December 1, 2026** for Foundry's visual workflow designer and in-portal execution. That is not the end of orchestration: the repo explores Microsoft Agent Framework workflows, including running them as hosted agents.

## Skills: procedures, not another tool

For these examples, MCP connects an agent to tools it can call; a **skill describes how to approach a task**. Think of an invoice-review procedure rather than the function that looks up an approval limit. A2A has a different role again: delegating work to another agent.

[Foundry skills](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/skills) are currently in preview. Instructions live in a `SKILL.md` file and can be stored as immutable versions. Compatible clients can discover them through a toolbox as MCP resources, or your hosted code can load the content into its instructions.

The [skills chapter](https://github.com/nampacx/MS-Foundry-from-0-to-hero/blob/main/docs/mcp-skills.md) includes an important caveat: attaching a skill reference to a default prompt agent had no observed effect in the repo's test. The alternative Copilot harness path was gated and could not be run successfully on that subscription. An accepted configuration is not proof that the agent used the skill.

Direct instruction loading makes that behavior easier to inspect. Versioning also makes changes reviewable, but bundled copies still need refreshing; updating a centrally stored skill does not magically update files already deployed with your agent. And a skill is guidance, not an authorization boundary. Approval limits still belong in code or tools.

## The part I don't want to forget: hosting costs

The repo still needs a fuller cost guide, especially for hosted agents. Here is the important distinction, based on Microsoft's documentation checked on **October 16, 2026**:

**Hosted-agent cost includes model usage, tool usage, and container compute.** The [pricing page](https://azure.microsoft.com/en-us/pricing/details/foundry-agent-service/) lists hosting in vCPU-hours and GiB-hours. Monitoring, storage, and other connected services can add separate charges.

The [runtime documentation](https://learn.microsoft.com/azure/foundry/agents/concepts/hosted-agents#scaling-and-right-sizing) describes **per-session sandboxes**, not one fixed container shared by every conversation. Compute remains allocated until the idle timeout, which defaults to **15 minutes** and is configurable from **2 to 60 minutes**. More requests reset that timer. Scale-to-zero helps, but finishing a model response does not immediately release the compute.

For a simple sizing example, the repo's invoice workflow requests **0.5 vCPU and 1 GiB** per session. Ten sessions each holding compute for one hour total **5 vCPU-hours and 10 GiB-hours**, before tokens, tools, or monitoring. Multiply those quantities by the applicable unit rates. This is an illustration, not a measured bill from the repo.

I could not verify a numeric hosting rate from the public pricing page: its compute fields returned **N/A** when checked. That does not mean free. Use the [Azure pricing calculator](https://azure.microsoft.com/en-us/pricing/calculator/?service=azure-ai-agent-service) with your region and offer, and confirm actual usage in Cost Management.

For experimenting, keep session sizes and idle timeouts appropriate, limit multi-agent turns, and set budget alerts. Alerts are not a spending cap. When finished, follow the repository's teardown instructions, checking the target environment first: cleanup deletes the learning resources, and stopping notebook execution does not remove them.

## Something to keep coming back to

This is version 0.1, with preview features, incomplete verification, and APIs that will keep moving. I see it as a workshop and a starting point for your own experiments, not something to copy unchanged into production.

I hope it helps you find the right information, understand how the pieces connect, and try them yourself. It already gives me a place to come back to, and I will keep an eye on keeping it up to date as Foundry evolves. If something breaks or an explanation misses the point, an issue or contribution in the [STARK repository](https://github.com/nampacx/MS-Foundry-from-0-to-hero) is welcome.
