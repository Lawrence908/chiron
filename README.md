# chiron

Agent skills for AI engineering, development, writing and research. A Claude Code plugin marketplace.

21 skills across 4 plugins. Generated from a private source tree by `scripts/publish-marketplace.py` in `context-pack`. Do not edit here; changes are overwritten on the next publish.

## Install

```
/plugin marketplace add Lawrence908/chiron
/plugin install ai@chiron
/plugin install dev@chiron
/plugin install writing@chiron
/plugin install meta@chiron
```

## Plugins

| Plugin | Skills | Description |
|--------|--------|-------------|
| `ai` | 3 | AI and Agents |
| `dev` | 9 | Development |
| `writing` | 6 | Writing |
| `meta` | 3 | Meta |

### AI and Agents (`ai`)

| Skill | Description |
|-------|-------------|
| `agent-orchestration` | Design and orchestrate multi-step agent workflows that combine multiple skills, tools, and context sources to accomplish complex tasks |
| `mcp-integration` | Design, implement, and integrate Model Context Protocol (MCP) tools and servers to extend LLM capabilities with external data sources and APIs |
| `prompt-engineering` | Design effective prompts for LLMs that produce consistent, accurate, and useful outputs for specific tasks and workflows |

### Development (`dev`)

| Skill | Description |
|-------|-------------|
| `api-debugging` | Systematically debug API issues including authentication failures, routing problems, request/response errors, and integration issues |
| `docker-compose-editing` | Safely create, modify, or diagnose docker-compose.yml files across a self-hosted service stack |
| `dragon-hunt` | Run an adversarial end-to-end bug hunt across product, backend, auth, data, integrations, MCP/agent surfaces, and deployment assumptions — then prove, fix, test, and log every defect found |
| `fastapi-development` | Design, implement, and maintain FastAPI applications with proper structure, error handling, authentication, and API best practices |
| `frontend-nextjs` | Develop, maintain, and debug Next.js applications with React, TypeScript, and modern frontend patterns for production-ready web applications |
| `full-systems-audit` | Audit a codebase end to end across architecture, code quality, modularization, and surface-naming truth, producing a human-readable report plus a routed backlog with stable IDs that later work can cite |
| `python-refactor` | Refactor Python modules, services, or utility scripts into cleaner, modular, testable structures without changing behavior unless requested |
| `ui-design` | Design and build production-grade frontend interfaces from scratch, covering the full arc: context gathering, reference collection, visual direction, implementation, and polish |
| `visual-qa-dogfood` | Force screenshot-backed verification of any change that touches a user-visible surface, so a task is never called done on passing metrics alone |

### Writing (`writing`)

| Skill | Description |
|-------|-------------|
| `academic-essay` | Assist with writing, editing, and refining academic essays in Chris's voice - balancing scholarly rigor with personal authenticity |
| `canary-skill` | Temporary canary used to verify that deletions propagate to the published marketplace |
| `seo-titles` | Write HTML title tags and meta descriptions that both rank and get clicked, treating the title as an ad competing against nine other results rather than a keyword slot |
| `spec-from-conversation` | Extract structured specifications, requirements, or implementation plans from unstructured conversation history or chat transcripts |
| `technical-documentation` | Create clear, comprehensive technical documentation including guides, READMEs, API documentation, and procedural instructions |
| `word-docs` | Convert a markdown draft into a styled, shareable Word document while keeping the markdown as the source of truth |

### Meta (`meta`)

| Skill | Description |
|-------|-------------|
| `advisory-board` | Convene a council of agents with deliberately conflicting mandates, run them in isolation so none can soften against another, then force one adjudicator to resolve the conflict into a ranked recommendation rather than a summary |
| `deep-research` | Orchestrate a multi-agent deep research run on a topic and write a synthesized report to disk |
| `prompt-design` | Design high-signal prompts that orchestrate multiple skills and produce deterministic outcomes |
