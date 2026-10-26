---
author: Michael Kokonowskyj
pubDatetime: 2026-10-26T12:00:00Z
title: Trying Foundry Routines with a Stock Watch Hosted Agent
featured: true
draft: false
tags:
  - azure
  - foundry
  - dotnet
  - automation
  - ai-agents
description: A train ride experiment with Foundry routines, a hosted stock
  research agent, keyless Table storage access, and a GitHub connection detour
  still to resolve.
---

## TL;DR

- A train ride home from the Microsoft Frontier Tour turned into an experiment with Foundry routines.
- Stock Watch runs a hosted agent on a schedule, researches companies from a watchlist, and saves reports to Table storage using its own identity. A first for me.
- A small web viewer reads the reports through an Azure Function. No storage keys in the browser, though the viewer itself is public.
- This was supposed to be a GitHub issue triage demo. The connections had other plans.

## This Started on a Train. Again

Most of my experiments seem to start on trains. This one was no different: I was heading home from the Microsoft Frontier Tour with plenty of time to read. We left 45 minutes late and arrived 73 minutes late. Apparently, the initial delay was just a starting point.

Somewhere in that generously extended reading time, I came across routines in Microsoft Foundry. My reaction: "Okay, that sounds fun. Let's try it."

A day of technology talks wasn't enough. I needed homework. Voluntary homework, which is somehow worse.

The appealing bit was the combination of a routine and a hosted agent. Foundry handles the schedule and hosts the agent. No separate scheduler to wire up, no container host for me to maintain just to run a recurring job.

I ended up with [Foundry Stock Watch Agent](https://github.com/nampacx/Foundry-Stock-Watch-Agent), a small demo that researches companies from a watchlist and displays the reports in a web viewer. Stocks were a convenient job to give it. The interesting part was getting the schedule, hosted agent, and identity working together.

But stocks weren't my first idea.

## First, a GitHub Detour

The original plan was a GitHub issue triage agent. An issue arrives, a routine triggers the agent, and the agent looks into it. Simple enough on paper.

I started code-first with my loyal AI companion. But the connections weren't coming together as planned, so I switched to the portal to see what I was missing.

Through the routines UI, I got a GitHub connection working and a routine to trigger. Good. Then I tried setting it up from the tools section and got a different UI. Even going back to edit the connection I'd successfully created opened a different view.

Same intention, different screens, increasingly confused developer. I came here to triage GitHub issues. So far, the only thing needing triage was my understanding of the portal.

At that point: okay, stop. Let's try something else.

I'm still not sure whether that was my setup, a limitation, or the portal. Getting the trigger to fire wasn't the same as getting the agent's GitHub tools working. I'll come back to it, but I wanted to try the rest of the idea first.

## So, What Are Foundry Routines?

A [Foundry routine](https://learn.microsoft.com/azure/foundry/agents/concepts/routines) connects a trigger to an agent invocation. It answers a specific question: **when should this agent run?**

That can be:

- **Once**, at a specified future time.
- **On a schedule**, using a cron expression and time zone.
- **After an event**, with support for GitHub issue events and Microsoft Teams channel messages.

A routine has one trigger and one action: invoke a prompt agent or hosted agent with some input. Foundry keeps the run history and links to the response and traces, so you can check what actually happened.

It doesn't do the agent's job for it. Branching, approvals, or coordination across multiple agents still belong in a workflow or the agent's own code. The routine just gets things started.

For my demo, that's exactly what I needed: **07:00 on weekdays, Europe/Berlin**, invoke `stockwatch-agent` through the Responses API, and tell it: "Run the daily analyst review."

These are preview features, so check the [current routines guide](https://learn.microsoft.com/azure/foundry/agents/how-to/use-routines) when trying it yourself. Field names and limitations can change.

## Give It a Watchlist and a Job

The hosted agent uses C# and Microsoft Agent Framework. Its job:

1. Read active companies from the `watchlist` table in Azure Table storage.
2. Research each company's analyst activity over the previous 24 hours using web search.
3. Store the results in the `reports` table, with one row per company and run.

Rating changes, price targets, analyst commentary: that sort of thing. The instructions ask for source URLs and tell the researcher to say when it finds nothing in the time window. No news is a perfectly acceptable result. We're not billing by the paragraph.

One thing I didn't leave to the model: remembering to work through every company. A C# `ReviewRunner`, exposed as the `run_stock_watch` tool, handles that. An inner research agent does the research, one company at a time by default. If research fails for one company, that failure gets recorded and the others still get their turn.

Plain code for the loop, an agent for the research. C# has been handling `foreach` without a motivational prompt for years. The [implementation is here](https://github.com/nampacx/Foundry-Stock-Watch-Agent/blob/main/src/stockwatch-agent/Support.cs).

And before anyone puts their savings behind it: this is web search plus generated summaries, not a licensed financial data feed. Check the sources. The reports can be wrong or incomplete, and they aren't investment advice.

## The Agent Gets Its Own Identity

This was another first for me: the hosted agent accesses storage using **its own identity**.

No storage account key to pass around. Its Entra instance identity gets `Storage Table Data Contributor` on the data storage account, which lets it read the watchlist and write reports. Shared-key access is disabled.

The catch: the identity only exists **after** the agent is deployed. So the role assignments happen in a [post-deployment script](https://github.com/nampacx/Foundry-Stock-Watch-Agent/blob/main/scripts/grant-agent-access.ps1), which looks up the identity and grants access. It also assigns `Azure AI User` on the Foundry account.

The schedule gets the agent running. The identity lets it do something useful once it's there. Two separate pieces, both needed.

## A Viewer, Not a Storage Key Delivery Service

Reading reports through a storage browser gets old quickly, so there's a small React viewer on Azure Static Web Apps too.

To keep it at least a bit sensible, I put an Azure Function app between the frontend and Table storage. It's linked under `/api` and reads the data using its own managed identity with `Storage Table Data Reader`.

That gives each part a small job:

- The **hosted agent** reads the watchlist and writes research results.
- The **Function app** reads stored data for the viewer.
- The **Static Web App** displays the data without receiving storage credentials.

No storage credentials in frontend JavaScript. No write access needed by the viewer's API.

Important distinction, though: **keyless isn't private**. The viewer is currently public, so anyone with the URL can read the reports. Before putting sensitive data there, I'd need authentication and authorization on the viewer and API routes.

## Not the Demo I Planned, Still a Useful One

I set out to try routines and ended up learning about agent identity along the way. The stock research gave me a concrete job to run, and the viewer gave me somewhere to see the result.

The [repo has the code and setup instructions](https://github.com/nampacx/Foundry-Stock-Watch-Agent). It's a demo, not a production-ready research service, but it was a useful way to try the pieces together.

As for GitHub issue triage: postponed, not abandoned. I still want to know why those connection screens behaved differently. That's the next investigation.
