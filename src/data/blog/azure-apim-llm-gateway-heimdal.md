---
author: Michael Kokonowskyj
pubDatetime: 2026-10-09T09:00:00Z
title: "One Gateway for Foundry, Local Models, and Agents"
postSlug: azure-apim-llm-gateway-heimdal
featured: true
draft: fasle
tags:
  - azure
  - apim
  - foundry
  - llm
  - ollama
  - nampacx
description: An interview question about per-user token usage turned into an Azure APIM LLM gateway, live model routing, token limits, a workbook, and local Ollama.
---

## TL;DR

- A conversation after an AI engineering interview got me thinking about per-user token usage, limits, and model routing.
- With Claude Code, I built HEIMDAL: an Azure API Management gateway with notebooks to explore routing, token limits, agents, and monitoring.
- The experiment grew into a Foundry-hosted agent that calls a model running locally in Ollama, through the same gateway.
- It works, but at roughly €700/month for my deployed setup, this is a learning playground, not my personal production stack.

## It started after an interview

I had just come out of a technical interview for an AI engineering role. We had talked about monitoring token usage by user, controlling consumption, and routing requests to different models.

That conversation stuck with me. What would it look like to put Azure API Management (APIM) in front of the models and let the gateway handle those concerns? I was bored, had a new best friend in Claude Code, and apparently needed a project.

So I asked Claude Code to help me build an APIM LLM gateway and a set of notebooks that would let me test what the gateway could do. The result is [HEIMDAL: Azure API Management as an LLM and agent gateway](https://github.com/nampacx/Azue-APIM-LLM-Gateway).

The name is a nod to the guardian of the Bifrost. In this experiment, APIM is the Bifrost: clients cross one gateway, and it decides where their requests go.

## One endpoint, several models

The bit I wanted to try first was the client experience. Instead of configuring every app with a different model endpoint, the client talks to the gateway. APIM forwards the request to the selected model and handles the backend authentication.

The notebooks make that behavior tangible. They explore:

- Per-user token accounting and gateway logs
- Routing based on prompt length or complexity
- Per-user token limits, including a `429` for one user while other users can continue
- Foundry agents and MCP tools using the gateway

The routing settings are APIM named values, so I could change a mode or threshold and observe the result without rebuilding the client. That made the notebooks more than setup examples; they became a way to poke at the system and see what it actually did.

## The workbook was the obvious next experiment

The notebooks already included checks against the gateway's metrics and logs. While running them, I caught myself thinking: _Wouldn't it be nice to have an Azure dashboard for this?_

So I asked my coding agent for an Azure Monitor workbook too. It is deployed alongside the rest of the infrastructure and lets me explore token usage by user, model, routing tier, and agent. The exact request data comes from APIM's LLM gateway logs, joined with gateway logs to associate a request with its APIM subscription.

It is useful for seeing what happened, but it is not a cost dashboard: it doesn't translate tokens into money, and it doesn't provide budgets or alerts. The data can also take a few minutes to arrive. Those details matter when you're interpreting an empty panel right after running a notebook.

## Notebook 7 gave me an idea

Notebook 7 creates a Foundry Agent Service agent that calls a model through the APIM connection instead of connecting directly to a Foundry model endpoint. My first reaction was: _Cool, I can bring my own model._

Then I had a bit of a JD-from-_Scrubs_ moment: _Cool, I can run my own model. Why not connect a local model to an agent in Foundry?_

I had the ingredients, but no guarantee the cake would rise. Claude Code (with Sonnet helping on the next steps) helped me connect Ollama, ngrok, and the gateway. After a little iteration and a redeploy or two, it worked: I could create a Foundry-hosted agent whose model calls went through APIM to a model running on my own machine.

The optional local-model path uses Ollama to serve the model and an ngrok tunnel to make it reachable from Azure. The tunnel is protected with basic authentication. APIM then routes requests for that model through the same gateway, so the client still uses the gateway endpoint and subscription key. The gateway can apply its token limit and emit its metrics just as it does for the Foundry backends.

The especially fun part was seeing a Foundry agent use that local model. The agent is hosted in Foundry, but the model response comes from Ollama on my laptop. A model name in the Foundry connection points to the APIM gateway; APIM routes it through ngrok to the machine at home.

## It works. It is not fast.

The local model did work, but performance was not exactly breathtaking on my Snapdragon X Elite laptop. A more capable machine would likely make the experience better. Still, the point of the experiment was not to beat a hosted model on latency. It was to prove that this route was possible and then inspect the traffic through the same gateway.

There are practical limitations: the laptop needs to stay on and online, the ngrok endpoint is public (though protected by the tunnel's basic auth), and there is no automatic failover to Foundry if the local machine disappears. This is a demo feature, not a production-ready model-hosting pattern. It does make me curious about connecting models hosted elsewhere, including on AWS or Google Cloud, through a similar gateway pattern.

## Trying it yourself

The repository includes deployment instructions and ten notebooks, from the first gateway call through token usage, routing, limits, MCP, agents, and the optional local Ollama path. The deployment uses `azd up`; APIM provisioning can take around 20–40 minutes, so do have a coffee, tea, or beer handy.

At a high level, you'll need Azure CLI, Azure Developer CLI, Python 3.11 or later, permission to create the resources, and model quota in the chosen region. The repo's README has the current prerequisites and commands; the short version looks like this:

```bash
pip install -r requirements.txt
azd auth login
az login
azd env new heimdal-dev
azd env set AZURE_LOCATION swedencentral
azd env set HEIMDAL_PUBLISHER_EMAIL you@example.com
azd up
```

After deployment, open the notebooks in order and select the project virtual environment as the kernel. To enable the local Ollama option, install and configure Ollama and ngrok, then set `HEIMDAL_ENABLE_OLLAMA=true` and the model name before provisioning. The [README](https://github.com/nampacx/Azue-APIM-LLM-Gateway#readme) and the [local Ollama guide](https://github.com/nampacx/Azue-APIM-LLM-Gateway/blob/main/docs/local-ollama.md) cover the details.

One thing to keep in mind before deploying: my setup came out to roughly **€700 per month** while the resources were running. That is my rough estimate, not a universal price, and model usage can add more. APIM and Foundry resources are billed while deployed, so this is not a cheap personal playground. Tear the environment down when you're done experimenting; the repository documents `azd down --purge` for that.

## A surprisingly good experiment

This started with a conversation about token monitoring and ended with one gateway in front of Foundry models, agents, MCP tools, and a local Ollama model. I wanted to understand how the pieces behave together, and the notebooks made the answers visible instead of theoretical.

Would I pay to keep this running for personal use? No. Was it satisfying to watch a Foundry-hosted agent call a model on my laptop through Azure APIM? Absolutely. There are more details, caveats, and experiments in the [repository](https://github.com/nampacx/Azue-APIM-LLM-Gateway).
