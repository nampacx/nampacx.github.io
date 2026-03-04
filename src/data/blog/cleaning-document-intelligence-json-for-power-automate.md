---
author: Michael Kokonowskyj
pubDatetime: 2026-03-04T10:00:00Z
title: "Making Document Intelligence Beautiful: Cleaning OCR Noise for Power Automate"
postSlug: cleaning-document-intelligence-json-for-power-automate
featured: true
draft: false
tags:
  - azure
  - document-intelligence
  - power-automate
  - azure-functions
  - c#
  - dotnet
  - automation
description: How Azure Functions can transform noisy Document Intelligence responses into clean, structured JSON that Power Automate workflows actually want to consume.
---

Repository: [nampacx/A-more-beautifull-Document-Ingelligence](https://github.com/nampacx/A-more-beautifull-Document-Ingelligence)

## The Problem with Perfect OCR

Azure Document Intelligence is incredibly powerful. Point it at an invoice, and you get back structured data—line items, totals, vendor information, the whole package. But here's the catch: you also get **everything else**.

Bounding boxes. Polygon coordinates. Span metadata. Confidence scores for every character. Layout geometry that would make a cartographer jealous.

When you're building a Power Automate flow that just needs to know "what was the invoice total?" this flood of metadata becomes noise. You don't want to write complex expressions to navigate through layers of OCR metadata just to extract a simple field value.

## A Real-World Use Case

A customer wanted to automate invoice processing: email arrives with PDF attachment, Power Automate triggers, Document Intelligence reads the invoice, structured data flows into their business system. Simple workflow, right?

The challenge wasn't the OCR accuracy—Document Intelligence nailed that part. The challenge was making the JSON response **usable** in Power Automate without writing a PhD thesis worth of filter expressions.

That's where this project comes in.

## The Solution: Less Metadata Soup, More Business Data

[A More Beautiful Document Intelligence](https://github.com/nampacx/A-more-beautifull-Document-Ingelligence) is a .NET Azure Functions app that acts as a JSON cleanup layer between Document Intelligence and Power Automate.

It provides three HTTP-triggered functions, each addressing a specific cleanup need:

### BeautifulTables: Normalize Table Structures

Takes Document Intelligence table arrays and normalizes them into one of two semantic types:

- **Key-value tables**: Label → value pairs (think metadata sections)
- **Columnar tables**: Headers + data rows (think line item lists)

Strips the OCR layout noise while preserving the actual table content and structure.

```powershell
$tables = Get-Content "tables.json" -Raw
Invoke-RestMethod `
  -Method Post `
  -Uri "https://your-function.azurewebsites.net/api/BeautifulTables" `
  -ContentType "application/json" `
  -Body $tables
```

### BeautifulContent: Extract Clean Text

Accepts full Document Intelligence analyze-result payloads and returns just the page and paragraph content—plain text, no geometry.

Perfect when you need the document text without caring about where exactly on the page each word appeared.

### BeautifulEntries: Parse Invoice Line Items

The most specialized function. Extracts structured invoice line entries from paragraph-based JSON:

- Position numbers
- Item descriptions
- Quantities and units
- VAT rates
- Unit prices and totals

All the business-critical fields, none of the OCR metadata.

```powershell
$payload = Get-Content "invoice-paragraphs.json" -Raw
Invoke-RestMethod `
  -Method Post `
  -Uri "https://your-function.azurewebsites.net/api/BeautifulEntries" `
  -ContentType "application/json" `
  -Body $payload
```

## Architecture: Keep It Simple

The project structure follows clean separation of concerns:

```
azfnct/
├── Functions/       # HTTP endpoints
├── Services/        # Transformation logic
└── Models/          # DTOs

infra/               # Bicep deployment
```

Each function accepts JSON via POST, runs transformations through service classes, and returns clean DTOs. No state, no databases, no complexity—just pure data transformation.

The deployment includes Bicep infrastructure-as-code, so you can spin up your own instance with a single script.

## Integration with Power Automate

In a typical workflow:

1. Email arrives with invoice PDF
2. Power Automate extracts attachment
3. Calls Document Intelligence (prebuilt-invoice or prebuilt-read)
4. **Sends raw response to your cleanup function**
5. Receives clean JSON
6. Maps fields directly to your business system

Step 4 is the secret sauce. Instead of wrestling with Document Intelligence's verbose response in Power Automate expressions, you get structured data shaped exactly how you need it.

## Disclaimer: Shaped by Real Documents

The extraction rules here were tuned using a specific set of customer invoices. Invoice formats vary wildly across vendors, regions, and industries.

**This won't work perfectly for every invoice out of the box.**

Think of this as a baseline implementation. The real value is having a customizable cleanup layer you control. When you encounter a new invoice format, you tweak the service logic, redeploy, and your Power Automate flow keeps working without changes.

Vibe coding with notebooks (the repo includes sample Jupyter notebooks) makes iterating on extraction rules surprisingly fast.

## Technical Stack

- **.NET 10.0**: Modern C# with top-level statements and minimal APIs
- **Azure Functions v4**: HTTP-triggered, stateless endpoints
- **Bicep**: Infrastructure-as-code for deployment
- **PowerShell**: Testing scripts and examples

No external dependencies for the core transformation logic—just good old C# object mapping.

## Running Locally

Local development is straightforward:

```bash
cd azfnct
dotnet build
cd bin/Debug/net10.0
func host start
```

Functions run on `http://localhost:7071` by default. Test with curl, Postman, or the included PowerShell scripts.

## When to Use This Pattern

This cleanup-layer approach makes sense when:

- **You're integrating Document Intelligence with low-code tools** (Power Automate, Logic Apps) where complex JSON navigation is painful
- **You need consistent output schemas** regardless of which Document Intelligence model you use
- **Business users need to understand the data shape** without learning OCR metadata structures
- **You want to normalize responses** across different document types (invoices, receipts, forms)

If you're building a custom application with full backend control, you might handle cleanup in your application code instead. But for automation scenarios where the "backend" *is* Power Automate, having this intermediary function is a game-changer.

## Next Steps

Check out the [repository](https://github.com/nampacx/A-more-beautifull-Document-Ingelligence) for full code, deployment scripts, and sample payloads.

If you're automating document processing, consider where in your pipeline a cleanup layer would simplify downstream consumption. Sometimes the best architecture decision is adding one simple, focused service that makes everything else easier.

Less noise. More signal. That's what beautiful Document Intelligence looks like.
