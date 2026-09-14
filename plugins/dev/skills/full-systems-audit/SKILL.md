---
name: full-systems-audit
description: "Audit a codebase end to end across architecture, code quality, modularization, and surface-naming truth, producing a human-readable report plus a routed backlog with stable IDs that later work can cite. Maps and routes rather than executing everything itself. Use when: Before a major refactor, Onboarding to an unfamiliar codebase, Code quality or architecture concerns have accumulated, Periodically, to catch boundary drift and god-module growth, The user asks for a codebase audit, architecture review, or tech-debt inventory."
metadata:
  category: dev
---

# Full Systems Audit

## Purpose

Map a system end to end and produce durable, actionable artifacts. You are the
mapper and router, not the one giant executor.

## When to Use

- Before a major refactoring effort.
- When onboarding to an unfamiliar codebase.
- When code quality or architecture concerns have accumulated.
- Periodically, to catch boundary drift and god-module growth.

## Do Not Use

- To hunt functional bugs. Use `dragon-hunt`.
- To review a single pull request. Use `/code-review`.
- To evaluate visual surfaces. Use `visual-qa-dogfood`.
- On a codebase you are about to delete or rewrite from scratch.

## Primary Contract

Your default output is not a giant planning document. It is two files:

1. `audit-report.md` — the human-readable map: system summary, findings,
   evidence, recommendations.
2. `audit-backlog.md` — routed findings with stable IDs that downstream work can
   cite directly.

If a campaign already has these files, resume and update them in place. Do not
spawn sibling audit files unless the user explicitly wants a fresh campaign.

## Audit Phases

### Phase 1: Manifest

1. List all source files, excluding `node_modules`, `dist`, `.git`, `.venv`,
   worktrees, and coverage output.
2. Count files and lines per directory or subsystem.
3. Extract imports from every source file to map the dependency graph.
4. Identify the most-imported modules (centrality).
5. Find the largest files. Over 500 lines is a split candidate.
6. Count cross-subsystem imports in both directions to detect layering
   violations.

### Phase 2: Documentation

1. README, ARCHITECTURE, CONTRIBUTING, CLAUDE.md, AGENTS.md, or equivalents.
2. Everything under `docs/`.
3. Any bundled skills.
4. Build and tool config: `pyproject.toml`, `package.json`, `tsconfig`, linter
   and test config, `compose.yaml`, `Makefile`.
5. Note what the docs *claim* the architecture is. You will compare against
   reality.

### Phase 3: Flow tracing

1. Identify the critical path (request → processing → response, or equivalent).
2. Trace it through every file, noting each handoff.
3. Identify where state is assembled and how many sources contribute.
4. Look for competing code paths — two modules doing similar things.
5. Look for invisible machinery: things that affect behaviour but are not
   visible to the operator.

### Phase 4: Control deck

1. List every config file, env var, and external state directory.
2. Map which configs affect which behaviours.
3. Assess whether an operator can predict system behaviour from config alone.
4. Note configs that are scattered, duplicated, or confusingly named.
5. For homelab services: check that the compose file, the `.env`, the Caddy site
   file, and the `services.yml` entry all agree on ports, container names, and
   URLs. Drift between these four is the recurring failure here.

### Phase 4b: Surface integrity (naming and contracts)

Audit every public surface for truth. Misnamed symbols compound quietly until
someone misuses one and the misuse looks correct on the page. **No nit too
small here.**

1. **Name vs. behaviour.** For every exported function, CLI flag, tool name, API
   route, and command: would a stranger reading the name aloud predict what the
   code does? If not, that is a finding.
2. **Near-duplicate pairs.** When two symbols look like they overlap, write down
   what each actually does and check the names contrast accurately:
   - `*_thread` / `*_conversation` / `*_message` / `*_body`
   - `*_status` / `*_show` / `*_get` / `*_list`
   - `*_create` / `*_new` / `*_init` / `*_ensure`
   - `*_remove` / `*_delete` / `*_drop` / `*_clear`
   - `check_*` / `verify_*` / `validate_*`
3. **Misleading parameters.** An `id` that accepts two different kinds of id
   without saying so. A `limit` that is really a max with an implicit floor. A
   `since` documented as a timestamp that takes a duration string.
4. **Doc vs. implementation drift.** Compare each docstring to its code. Flag
   where the doc describes an earlier version.
5. **Log and event strings.** Every `tool: "x"` audit string and
   `event: "subsystem.x"` should match the current canonical name. Renames miss
   these and leave a history wormhole.
6. **Discoverability.** Does the README or runbook list everything currently in
   the registry? Check drift in both directions.
7. **Symmetry holes.** Is there a `*_remove` for every `*_create`? A get-shape
   for every list-shape? Asymmetric surfaces force callers into workarounds.

A naming inversion — the canonical name attached to the non-canonical operation
— is `MEDIUM` minimum, `HIGH` when it has been load-bearing for a while.

### Phase 5: Findings synthesis

**CRITICAL** — Architectural violations, competing implementations, broken
layering, security or trust-boundary leaks.
**HIGH** — God modules, overloaded directories, misleading coverage, naming
inversions on load-bearing surfaces, doc drift on critical paths.
**MEDIUM** — Duplication, naming issues, inline complexity, tight coupling,
asymmetric surface, log/event drift after renames.
**LOW** — Vestigial code, missing lint rules, cosmetic issues, dead exports.

Every finding needs **What**, **Why it matters**, **Evidence** (file:line or a
traced flow), and **What to do**.

### Phase 6: Routing

Route each finding into a lane:

1. **plan-first** — architectural, cross-cutting, risky, or too large for one
   clean PR. Draft the change with `spec-from-conversation` or
   `homelab-change-plan` (for infra-shaped work) before touching code.
2. **single-pr** — self-contained; becomes one focused change once the large
   items have landed.
3. **defer** — intentional, ambiguous, product-dependent, or not worth the
   churn.

Recommend supporting skills per finding where useful: `python-refactor`,
`fastapi-development`, `ui-design`, `docker-compose-editing`,
`technical-documentation`, `dragon-hunt`, `visual-qa-dogfood`. Route into them;
do not try to become them.

### Phase 7: Review gate

Write the artifacts and present them. Do **not** automatically start execution.

If the operator wants every finding triaged before reviewing, triage means: for
every backlog item, either **fix it** (`Status: fixed`, link the commit), **mark
it no-op** (`Status: deferred` or `superseded`, with the reason in `Notes`), or
**hand it off** (`Status: in-progress`, with real linked work).

**Triage completion contract:** do not declare the audit done while any item is
`Status: open`. If the volume is too large for one sitting (more than ~20
actionable, or >50 total), say so up front and ask whether to chunk it. Do not
return control with a half-triaged backlog and a vague "more to do."

### Phase 8: Re-evaluation

When the large tranche is executed first, re-audit the affected areas after it
lands and reclassify surviving items. Many "small" items disappear, merge, or
change priority once the structural work is in.

## Backlog Item Format

```markdown
## A-001 — short finding title

**Source**: audit
**What**: One-sentence description.
**Why it matters**: Maintainability, correctness, or operability impact.
**Evidence**: `path/to/file.py:120`, flow notes, or dependency evidence.
**Severity**: critical | high | medium | low
**Blast radius**: self-contained | one module | multiple modules | crosses trust boundaries
**Dependencies**: (optional) item ids that should land first
**Recommended lane**: plan-first | single-pr | defer
**Suggested supporting skills**: (optional)
**Verification**: How a future agent revalidates this at current HEAD before changing code.
**Status**: open | in-progress | fixed | superseded | deferred
**Linked work**: (optional) plan path, PR URL, or commit
**Notes**: (optional)

---
```

## Traceability Contract

- Every item gets a stable ID at creation and keeps it forever. Never renumber.
- Downstream plans, PRs, and commits cite the ID verbatim.
- Update `Status` and `Linked work` as soon as there is real work to point at.
- When work lands or is invalidated, mark it `fixed`, `superseded`, or
  `deferred`. Never silently drop an item because the terrain changed.
- If a finding splits, mark the old one `superseded` and create new IDs.

## Constraints & Guardrails

- **Verify sub-agent findings.** Parallel exploration agents hallucinate:
  claiming a function lacks a guard it has, or a file is dead when it is
  registered via dynamic dispatch. Sample-verify the highest-severity findings
  by hand. When in doubt, drop the finding rather than ship one you could not
  verify. A few false positives destroy trust in the whole backlog.
- **Persist findings immediately.** Context compresses. Write to
  `audit-report.md` and `audit-backlog.md` as each phase completes, never at the
  end.
- **Inventory every file, but do not dump every file into context.** Use tooling
  for exhaustive scans; read deeply only where evidence points.
- Read-only by default. The audit does not change code unless the operator asked
  for triage-with-fixes.

## Outputs Produced

- `audit-report.md` — system summary, architecture notes, control-deck
  assessment, findings by severity with evidence, and what is healthy and should
  be preserved.
- `audit-backlog.md` — routed findings in the format above.

If the repo has its own task-doc convention, follow it. Otherwise put both files
in the working directory.

## Anti-Patterns

- Returning control with `Status: open` items and a vague "more to do."
- Listing a finding you could not reproduce or point at.
- Becoming the executor for every finding instead of routing.
- Skipping the re-evaluation phase and picking small fixes too early, which
  creates churn against the structural work.
- Judging severity by file length rather than impact.
- Failing to acknowledge what the architecture gets right.

## Learned Pitfalls

- **CI workflows reference build paths.** When moving source files, grep
  `.github/workflows/*.yml` for hardcoded paths into `dist/`, `build/`, or
  `bin/`. These break silently after a move.
- **Coverage differs between CI and local.** New files change the aggregate
  computation. Verify on CI.
- **Module-level side effects break test mocks.** They fire during import,
  before mock setup, and break unrelated tests.
- **Version sync across packages.** A monorepo bump usually needs more than one
  manifest updated; CI guards often fail on the mismatch.
- **Rename sweeps miss string literals.** Grep the old name across the whole
  repo, not just the file being renamed, before calling a rename complete.
- **Asymmetric surfaces force workarounds.** When add/list/edit exist but
  `remove` is missing, callers re-emit the whole record minus what they want
  gone — fragile and lossy.

---

Adapted from `ourostack/ouroboros-skills` (`skills/full-systems-audit`), with
the execution lanes rerouted from their work-suite to context-pack skills.
