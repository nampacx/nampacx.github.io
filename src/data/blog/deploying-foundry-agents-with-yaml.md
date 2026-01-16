---
author: Michael Kokonowskyj
pubDatetime: 2026-01-15T12:00:00Z
title: "Deploying Azure AI Foundry Agents with YAML: An Infrastructure-as-Code Approach"
postSlug: deploying-foundry-agents-with-yaml
featured: true
draft: false
tags:
  - azure
  - foundry
  - dotnet
  - automation
  - infrastructure-as-code
  - ai-agents
description: Learn how to automate the deployment of Azure AI Foundry agents using YAML configuration files with this open-source .NET tool that brings a declarative, IaC-inspired approach to agent management.
---

## 🚧 The Challenge with AI Foundry Agent Management

If you've worked with Microsoft Azure AI Foundry (the classic portal), you've probably noticed something frustrating: there's no native Infrastructure as Code (IaC) support for creating and managing persistent agents. While you can create agents programmatically using the Azure SDK, there's no declarative, configuration-file-based approach that lets you define your agents as code and version them alongside your application.

For developers who value reproducibility, version control, and automated deployments, this is a significant pain point. How do you maintain consistency across environments? How do you version your agent configurations? How do you deploy them as easily as you deploy your infrastructure with Terraform or Bicep?

I faced these exact challenges while building multi-agent systems for Azure AI Foundry, and the solution I created is a .NET console application that brings YAML-based agent deployment to the classic portal.

## ✨ Introducing DeployAgent

[DeployAgent](https://github.com/nampacx/Microsoft-Foundry-Agent-Deployment) is an open-source tool that automates the deployment and management of Microsoft Foundry Agents using YAML configuration files. It brings a declarative, IaC-inspired approach to AI agent management—define your agents in YAML, version them in git, and deploy them with a single command.

### Key Features

- **📝 YAML-based Configuration**: Define agents and tools in a simple, declarative format
- **🔌 OpenAPI Tool Integration**: Automatically fetches and configures OpenAPI specifications
- **🔗 Connected Agents**: Support for multi-agent orchestration
- **🔐 Azure Identity Integration**: Secure authentication using DefaultAzureCredential
- **📦 Batch Deployment**: Deploy multiple agents from a single configuration file
- **🛡️ CI/CD Ready**: Built for automation with service principal support

## ⚙️ How It Works

DeployAgent reads YAML configuration files that define your agents and their tools, then programmatically creates them in your Azure AI Foundry project using the Azure SDK. Here's a simple example:

```yaml
agents:
  - type: agent
    name: WeatherAgent
    model: gpt-4o-mini-deployment
    instructions: |
      You are a specialized agent for retrieving weather information.
      Use the WeatherServiceAPI tool to get current conditions and forecasts.
    tools:
      - WeatherServiceAPI

tools:
  - type: tool
    kind: OpenAPI
    name: WeatherServiceAPI
    spec_url: https://api.example.com/openapi/v3.json
    description: Retrieves weather information for a given location.
```

Deploy this configuration with a single command:

```bash
dotnet run -- agents.yaml \
  --project-endpoint https://your-project.services.ai.azure.com/api/projects/your-project
```

The tool handles the rest—fetching the OpenAPI specification, creating the agent, and configuring the tools.

## 🤝 Multi-Agent Orchestration

One of the most powerful features is support for **connected agents**—agents that can use other agents as tools. This enables sophisticated multi-agent workflows where specialized agents collaborate to solve complex tasks.

Here's an example of an orchestrator agent that coordinates multiple specialized agents:

```yaml
agents:
  - type: agent
    name: EmployeeInfoAgent
    model: gpt-4o-mini-deployment
    instructions: |
      You retrieve and provide employee CV information.
      Always format responses in a clear, professional manner.
    tools:
      - EmployeeAPI

  - type: agent
    name: OrchestratorAgent
    model: gpt-4o-mini-deployment
    instructions: |
      You coordinate multiple specialized agents to fulfill user requests.
      Route employee-related queries to EmployeeInfoAgent.
      Route format conversions to ConverterAgent.
    tools:
      - EmployeeInfoAgent
      - ConverterAgent

tools:
  - type: tool
    kind: OpenAPI
    name: EmployeeAPI
    spec_url: https://api.example.com/employees/openapi.json
    description: Retrieves employee information.

  # Define agents as tools for other agents
  - type: tool
    kind: agent
    name: EmployeeInfoAgent
    description: Retrieves and formats employee CV information.

  - type: tool
    kind: agent
    name: ConverterAgent
    description: Converts content to different formats.
```

This pattern allows you to build modular, maintainable agent systems where each agent has a specific responsibility, and a coordinator agent orchestrates the workflow.

## 🔄 CI/CD Integration

For production deployments, DeployAgent supports service principal authentication, making it perfect for CI/CD pipelines. Here's how to set it up:

### Create a Service Principal

```bash
# Create the service principal
az ad sp create-for-rbac \
  --name "DeployAgentSP" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}

# Assign the Azure AI User role
az role assignment create \
  --assignee {appId-from-previous-step} \
  --role "Azure AI User" \
  --scope /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}
```

### Configure Pipeline Environment Variables

Set these environment variables in your CI/CD pipeline, and `DefaultAzureCredential` will automatically authenticate:

```bash
export AZURE_CLIENT_ID="{appId}"
export AZURE_CLIENT_SECRET="{password}"
export AZURE_TENANT_ID="{tenant}"
```

Now your pipeline can deploy agents automatically on every commit, environment promotion, or scheduled run.

## 💡 Real-World Benefits

After using DeployAgent in production, I've seen several significant benefits:

### Version Control

Agent configurations live in git alongside your application code. You can track changes, review pull requests, and roll back to previous versions when needed.

### Environment Consistency

The same YAML file deploys identical agents across development, staging, and production environments. No more manual configuration drift or "it works in dev" issues.

### Rapid Iteration

Tweaking agent instructions or adding tools becomes a simple YAML edit and redeploy. No clicking through portal wizards or copy-pasting between environments.

### Team Collaboration

YAML configurations are human-readable and easy to review. Team members can propose agent changes via pull requests with full context and discussion.

## ⚠️ Important Considerations

Before adopting DeployAgent, understand these limitations:

**Classic Portal Only**: This tool is designed for the Azure AI Foundry classic portal. The new Foundry portal uses a different YAML format, so migration would require code modifications.

**Tool Support**: Currently implements OpenAPI Tools and Connected Agents. Other tool types (like Code Interpreter or File Search) can be added in the future.

**YAML Format**: The YAML format differs from the new portal's format, so it's not a direct export/import between portals.

These tradeoffs made sense for my use case—I needed IaC capabilities immediately and was willing to work within the classic portal's constraints. Your mileage may vary depending on your requirements.

## 🚀 Getting Started

Ready to try it out? Here's the quick start:

### Prerequisites

- .NET 10.0 SDK or later
- Azure subscription with Azure AI Foundry access
- Azure credentials configured (Azure CLI, environment variables, or managed identity)
- An Azure AI Foundry project

### Installation & Usage

```bash
# Clone the repository
git clone https://github.com/nampacx/Microsoft-Foundry-Agent-Deployment.git
cd Microsoft-Foundry-Agent-Deployment

# Create your agents.yaml configuration
# (See examples in the repository)

# Deploy your agents
dotnet run --project src/DeployAgent/DeployAgent.csproj -- \
  path/to/agents.yaml \
  --project-endpoint https://your-project.services.ai.azure.com/api/projects/your-project
```

Check out the [sample YAML files](https://github.com/nampacx/Microsoft-Foundry-Agent-Deployment/tree/main/sample) in the repository for complete examples, including multi-agent configurations.

## 🔮 What's Next?

I built DeployAgent to solve a specific problem, and it's been invaluable for my Azure AI Foundry projects. I'm continuing to enhance it based on real-world usage and community feedback.

Some ideas for future improvements:

- Support for additional tool types (Code Interpreter, File Search)
- Agent update and deletion operations
- Validation and dry-run modes
- Template and reusable configuration patterns
- Migration tooling for the new portal format

If you're working with Azure AI Foundry agents and want a declarative, version-controlled approach to agent deployment, give DeployAgent a try. Contributions, issues, and feedback are welcome on [GitHub](https://github.com/nampacx/Microsoft-Foundry-Agent-Deployment).

## 🎁 Wrapping Up

Declarative configuration management isn't just for virtual machines and databases—it's equally valuable for AI agents. By treating agent configurations as code with an IaC-inspired approach, we get all the benefits of modern DevOps practices: version control, code review, automated testing, and reliable deployments.

DeployAgent is my answer to this need in the Azure AI Foundry classic portal. It's not perfect, and it's opinionated, but it's working in production and solving real problems.

Have you built similar tooling for managing AI agents? I'd love to hear about your approaches and challenges. Feel free to reach out or open an issue on the repository.

Happy deploying! 🚀
