---
applyTo: "/src/data/blog/*.md"
---

# Blog Content Creation Instructions

This document outlines the guidelines and structure for creating blog posts in Astro markdown files for the mikokono blog.

## File Structure and Naming

- **Location**: All blog posts must be placed in `src/data/blog/`
- **File Extension**: Use `.md` for standard markdown or `.mdx` for markdown with JSX components
- **Naming Convention**: Use kebab-case for filenames (e.g., `my-awesome-blog-post.md`)
- **Slug**: The filename will be used as the URL slug unless overridden in frontmatter

## Required Frontmatter

Every blog post must include YAML frontmatter at the top of the file with the following required fields:

```yaml
---
author: Michael Kokonowskyj
pubDatetime: 2024-01-20T14:23:00Z
title: Your Blog Post Title
postSlug: optional-custom-slug
featured: true
draft: false
tags:
  - tag1
  - tag2
  - tag3
description: A brief description of your blog post that appears in meta tags and post previews
---
```

### Frontmatter Field Descriptions

- **author**: Author name (default: "Michael Kokonowskyj")
- **pubDatetime**: Publication date and time in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
- **title**: The blog post title (used in SEO and navigation)
- **postSlug**: Optional custom URL slug (defaults to filename if not provided)
- **featured**: Boolean indicating if post should be featured on homepage
- **draft**: Boolean indicating if post is a draft (won't be published if true)
- **tags**: Array of tags for categorization and filtering
- **description**: Brief description for SEO meta tags and post previews
- **ogImage**: Optional custom Open Graph image (path or URL)
- **canonicalURL**: Optional canonical URL for SEO

## Content Guidelines

### Voice and Point of View

- Write in Michael's first-person voice when describing a project, experiment, or lesson learned. Make clear what he tried and what actually happened.
- Open with a specific motivation, question, conversation, or problem that led to the work. Get to the technical subject quickly; avoid generic scene-setting.
- Let the enthusiasm for technology come through as curiosity and excitement about exploring an idea, trying things, and discovering how they work. Make the reader feel they are following the investigation, not reading a detached product announcement.
- Keep the tone approachable and candid. Light humor, understatement, and occasional asides are part of the voice, but use them naturally rather than forcing a joke into every section.
- Use emojis as colorful emphasis in headings and occasional key statements when they reinforce the point or mood. Keep them intentional and readable; they should add personality, not compete with the technical content.
- Be honest about what was easy, confusing, surprising, broken, or still limited. Prefer concrete observations over hype or broad claims.
- Explain technical details clearly for fellow developers without flattening the post into a formal manual. Define unfamiliar terms when readers need them, and connect implementation choices to the problem they solve.
- Keep prose direct and readable. Vary sentence length; use contractions and conversational phrasing when they sound natural. Avoid padded introductions, repeated summaries, and marketing language.

### Structure and Flow

- Start the body with a concise `## TL;DR` section immediately after the frontmatter. Summarize the problem or idea, what was explored or built, and the key result or lesson in a few quick bullets so readers can get the value at a glance.
- Let the story determine the structure. For exploratory posts, take the reader along the journey: the initial question, the experiments and obstacles, the discoveries, and where things landed. A reference-style post can use a more direct walkthrough while still making the investigation and outcome clear.
- Use descriptive H2 and H3 headings that help readers scan the post. Headings may be conversational, but should still make the section's subject clear.
- Do not require a fixed "Introduction" or "Conclusion" section. End with the useful takeaway, current state, limitation, or next step that fits the post; invite readers to compare notes when that feels genuine.
- Include the relevant repository or working demo when one exists. Use screenshots, diagrams, and code examples to make the actual system or important steps easier to understand, not as decoration.
- Keep technical claims grounded in what was tested. Distinguish personal observations, preview behavior, and documented guarantees; link to primary documentation for details that may change.

### Code Blocks

Use fenced code blocks with language specification:

```typescript
// Example TypeScript code
function example(): string {
  return "Hello, World!";
}
```

### Images and Assets

- Keep post images with the existing blog assets under `src/assets/images/` and follow the relative Markdown paths used by neighboring posts (for example, `../../assets/images/<folder>/<image>.png`).
- Prefer Markdown image syntax with concise, descriptive alt text that explains what the image shows. Avoid raw HTML and inline styles unless Markdown cannot express a necessary presentation requirement.
- Use screenshots of the real app or relevant diagrams when they clarify the workflow, result, or architecture. Do not add images merely to break up text.

### Links

- Use descriptive link text and link directly to repositories, demos, or primary documentation when relevant.
- Use the site's established absolute routes for internal post links (for example, `/posts/<slug>`). Avoid fragile filesystem-relative links for site navigation.

### Components in Posts

- Use `.mdx` only when a component is genuinely useful to the post. Before using one, verify that it exists, check its current API, and follow a nearby example in the repository.
- Keep ordinary prose, code, and images in Markdown; do not convert a post to MDX just to use raw HTML for styling.

## Tag Guidelines

Reuse the spelling and casing of relevant tags from existing posts. Choose a small set that describes the technology and subject; do not add personal-name tags or generic tags unless they are already part of the site's established taxonomy and genuinely help discovery.

## SEO Best Practices

- Write compelling titles (50-60 characters)
- Create descriptive meta descriptions (150-160 characters)
- Use relevant tags for better discoverability
- Include proper heading hierarchy (H1 is the title, start content with H2)
- Add alt text to all images

## Example Template

````markdown
---
author: Michael Kokonowskyj
pubDatetime: 2024-01-20T14:23:00Z
title: How to Create Amazing React Components
postSlug: amazing-react-components
featured: false
draft: false
tags:
  - react
  - components
  - best-practices
description: Learn how to create reusable and maintainable React components with modern patterns and best practices.
---

## TL;DR

- What I set out to explore or solve
- What I built or tried, and the main discovery
- The practical result or takeaway

Then tell the story: what sparked the idea, how the exploration unfolded, what surprised you, and where it landed. Use headings that fit the journey rather than copying a fixed template; add an emoji where it gives a heading or key moment the right emphasis.

```typescript
// Example code with proper syntax highlighting
function MyComponent(): JSX.Element {
  return <div>Hello, World!</div>;
}
```
````

```

## Publication Checklist

Before publishing, ensure:
- [ ] All required frontmatter fields are filled
- [ ] Date is in correct ISO format
- [ ] Tags are relevant and consistent
- [ ] Images have proper alt text
- [ ] Code blocks have language specification
- [ ] Links are working and properly formatted
- [ ] A concise TL;DR appears immediately after the frontmatter and gives readers the key information quickly
- [ ] The post conveys curiosity and discovery, with a clear account of what was tried and learned
- [ ] Emojis are used intentionally to add color or emphasize key moments
- [ ] The post sounds candid and specific, with humor only where it feels natural
- [ ] Technical claims match what was tested and any changeable behavior is qualified
- [ ] Description accurately summarizes the post
- [ ] Draft is set to `false` when ready to publish
```
