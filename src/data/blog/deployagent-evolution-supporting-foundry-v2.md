---
author: Michael Kokonowskyj
pubDatetime: 2026-01-23T10:00:00Z
title: "DeployAgent Evolution: Supporting Both Classic and Modern Azure AI Foundry Agents"
postSlug: deployagent-evolution-supporting-foundry-v2
featured: true
draft: false
tags:
  - azure
  - foundry
  - dotnet
  - automation
  - infrastructure-as-code
  - ai-agents
description: Major update to DeployAgent now supports both classic and modern Azure AI Foundry agent deployments with improved project structure for better reusability and maintainability.
---

Repository: [nampacx/Microsoft-Foundry-Agent-Deployment](https://github.com/nampacx/Microsoft-Foundry-Agent-Deployment)

## What's New

If you've been following my work with [DeployAgent](deploying-foundry-agents-with-yaml), you know it started as a tool to automate the deployment of Azure AI Foundry agents using YAML configuration files. When I first built it, I focused on the classic Azure AI Foundry portal because that's where the immediate need was.

But the Azure AI ecosystem never stands still. Microsoft has been evolving Foundry, and with that evolution comes a new generation of agents—what I'm calling the "modern" Foundry agents. The latest update to DeployAgent brings support for **both classic and modern Foundry agents** in a single, refactored codebase.

## Dual Agent Support

DeployAgent now supports both agent generations:

- **Classic agents**: Original Foundry agents with established patterns and connected agent support
- **Modern agents**: Newer generation with updated APIs and enhanced capabilities

Both deployment modes are available from the same tool, allowing flexibility based on your project requirements.

### Connected Agents

Connected agents (agents using other agents as tools) are no longer supported in modern Foundry deployments. This feature remains available in classic mode for backward compatibility. Modern deployments require alternative orchestration patterns, which I plan to cover in the future.

## Project Restructure

The codebase has been refactored with a modular architecture:

**Separation of Concerns**: Distinct modules for classic and modern agent handling with shared utilities for YAML parsing, authentication, and configuration management.

**Shared Infrastructure**: Centralized authentication, error handling, logging, and validation logic benefits both deployment modes.

**Extensibility**: New features can be added without modifying core deployment logic.

**Testability**: Modular design enables isolated component testing.

This restructure reduces code duplication, simplifies maintenance, and makes the codebase easier to extend with new Foundry capabilities.

### Usage

**Existing users**: YAML configurations remain backward-compatible.

**New users**: Choose deployment mode based on requirements:
- Classic mode for connected agents
- Modern mode for latest Foundry features

## Configuration

The tool supports both YAML formats:
- Classic configurations remain unchanged (backward compatible)
- Modern configurations use the updated structure aligned with current Foundry APIs

The tool handles API contract differences automatically.

## Deployment

The CLI supports the following arguments:

| Argument | Short | Required | Description |
|----------|-------|----------|-------------|
| `<yaml-file>` | - | ✅ | Path to your agent definition YAML |
| `--project-endpoint` | `-p` | ✅ | Your Azure AI Foundry project endpoint |
| `--sdk-version` | `-v` | ❌ | `v1` or `v2` (default: `v1`) |
| `--tenant-id` | `-t` | ❌ | Your Azure tenant ID (optional) |

Use the `--sdk-version` flag to specify which agent generation to deploy:

```bash
# Classic agents (v1 SDK - default)
dotnet run -- agents.yaml --project-endpoint <endpoint>

# Modern agents (v2 SDK)
dotnet run -- agents.yaml --project-endpoint <endpoint> --sdk-version v2
```

## Technical Details

For those interested in the architectural decisions, here's what the refactoring achieved:

### Shared Abstractions

Common interfaces for agent deployment, regardless of type:

```csharp
public interface IAgentDeployer
{
    Task<DeploymentResult> DeployAgentAsync(AgentConfiguration config);
    Task<ValidationResult> ValidateConfigurationAsync(AgentConfiguration config);
}
```

Classic and modern deployers implement this interface, allowing the CLI to work with either transparently.

### Configuration Parsing

YAML parsing now uses a two-stage approach:
1. Load and validate the base YAML structure
2. Transform to the appropriate internal model based on deployment mode

This means you can validate your YAML file's structure before even attempting authentication or deployment.

### Error Handling

Improved error messages now specify whether an issue is mode-specific ("Connected agents are not supported in modern deployments") or general ("Invalid OpenAPI specification URL").

## Future Plans

Potential additions:
- Enhanced pre-deployment validation
- Add more tools

## Summary

DeployAgent now supports both classic and modern Azure AI Foundry agents with a restructured, modular codebase. Existing configurations remain backward-compatible while new deployments can target either mode.

The project is [open source](https://github.com/nampacx/Microsoft-Foundry-Agent-Deployment). Feedback and contributions are welcome.

---

**Related Posts:**
- [Deploying Azure AI Foundry Agents with YAML: An Infrastructure-as-Code Approach](deploying-foundry-agents-with-yaml)
