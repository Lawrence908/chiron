---
name: seo-titles
description: "Write HTML title tags and meta descriptions that both rank and get clicked, treating the title as an ad competing against nine other results rather than a keyword slot. Use when: Adding or auditing the title tag on a page, Writing titles for a new app or landing page on chrislawrence.ca, A page ranks but gets no clicks, Bulk-reviewing titles across a site or the projects registry, Naming a blog post, docs page, or project card for search."
metadata:
  category: writing
---

# SEO Titles

## Purpose

Produce title tags that earn the click. A keyword-stuffed title nobody clicks is
worse than a compelling title carrying one keyword.

## When to Use

- Writing or auditing `<title>` on any public page.
- Launching a new service on `*.chrislawrence.ca` that has a public face.
- Reviewing the titles emitted into the projects registry or landing page.
- A page has impressions but a poor click-through rate.

## Do Not Use

- Internal-only tools behind Cloudflare Access or on the Tailnet. Nobody is
  searching for them; a plain descriptive title is fine.
- Long-form body copy or headlines inside a page. This skill is about the tag
  that appears in search results.

## Rules

1. **50-60 characters.** Google truncates around 60. Everything past that is
   invisible. Count before committing.

2. **Primary keyword in the first five words.** Early terms carry more weight.
   "What Is Agent Experience" beats "Understanding the Concept of Agent
   Experience."

3. **One keyword, used naturally.** Never repeat a word. "Agent Harness for AI
   Agents" says "agent" twice — that is stuffing, not optimisation.

4. **Trigger curiosity or name a pain.** People click titles that make them feel
   something:
   - Curiosity: "What If Your Agent Never Forgot Who It Was?"
   - Pain: "Why Your AI Agent Forgets Everything Between Sessions"
   - Promise: "Build an AI Agent in 150 Lines of TypeScript"
   - Challenge: "Persistence Isn't Enough for AI Agents"

5. **Match search intent.** Ask what someone would actually type into Google to
   find this page. The title should read as the answer to that query.

6. **Brand at the end.** `| Chris Lawrence` or `— chrislawrence.ca` as a suffix,
   never a prefix. The homepage is the one exception; it may lead with the brand.

7. **No filler.** "A Comprehensive Guide to Understanding" becomes "How to."
   Every word earns its place.

8. **Specific beats vague.**
   - Bad: "Getting Started" → Good: "Get Started in 3 Minutes"
   - Bad: "Documentation" → Good: "Docs — API, Deploy, Troubleshooting"

9. **Questions work.** "What Is an Agent Harness?" matches the query directly and
   implies the page holds the answer.

10. **The click test.** Read the title as one of ten blue links. If it does not
    stand out, rewrite it.

## Process

1. Identify the primary search query this page answers.
2. Write the title as a response to that query, with curiosity, pain, or promise.
3. Count characters — must be 60 or fewer.
4. Check: primary keyword in the first five words?
5. Check: no repeated words?
6. Check: would you click this over nine competitors?
7. Add the brand suffix unless this is the homepage.

## Anti-Patterns

- Keyword stuffing: "AI Agent Harness for Persistent AI Agents"
- Too vague: "Why This Project"
- Over 60 characters.
- Brand first on a non-homepage: "Chris Lawrence | Getting Started Guide"
- Filler: "A Complete Guide to Understanding How..."
- All-caps power words: "ULTIMATE Guide", "BEST Framework"

---

Adapted from `ourostack/ouroboros-skills` (`skills/seo-titles`), with the brand
convention retargeted to `chrislawrence.ca`.
