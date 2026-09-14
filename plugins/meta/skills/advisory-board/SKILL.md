---
name: advisory-board
description: "Convene a council of agents with deliberately conflicting mandates, run them in isolation so none can soften against another, then force one adjudicator to resolve the conflict into a ranked recommendation rather than a summary. Produces structured disagreement instead of a single agreeable answer, and persists every run so a decision can be re-tested under different criteria weights. Use when: a decision is consequential, hard to reverse, or expensive to get wrong; several options must be compared across criteria of unequal importance; a past decision needs re-testing under changed assumptions; or the user asks for a board, council, panel, red team, pre-mortem, or second opinion."
metadata:
  category: meta
---

# Advisory Board

## Purpose
Convene a council of independent agents with conflicting mandates to interrogate a high-stakes decision, then force a single adjudicating agent to resolve the conflict into a ranked, defensible recommendation.

## When to Use
- A decision is consequential, hard to reverse, or expensive to get wrong
- The user needs structured disagreement rather than a single answer
- Multiple options must be compared across several criteria of unequal importance
- A prior decision needs re-testing under changed assumptions or weights
- The user asks for a board, council, panel, red team, or pre-mortem

## Do Not Use
- Factual lookups, or questions with one correct answer
- Small reversible choices where the deliberation costs more than the mistake
- Cases where the user wants a fast opinion, not a process

## Inputs Required
- **Problem frame**: stakes, timeline, definition of success, what is already decided
- **Options**: the candidate choices to compare, or a rule for generating them
- **Criteria and weights**: 5 to 9 criteria with explicit percentage weights summing to 100
- **Context dossier**: an honest, detailed briefing document on the situation
- **Roster**: which council to convene (default `family`, or `executive`, `technical`, or custom)

## Outputs Produced
- A persisted run directory containing the frame, the weights, every member's raw argument, and the adjudicated verdict
- A ranked recommendation with an explicit statement of what decides it
- An agreement map and a conflict map across members
- Named dissent: what the verdict discards and why
- On re-runs, a diff against the previous ranking
- A published board-record artifact summarising all of the above

## Where things live

The method ships with the skill. The user's situation does not.

**Bundled with this skill** (generic, versioned, shareable):

```
<skill>/
  references/rosters/   family.md, executive.md, technical.md, homelab.md
  references/artifact.md   the board-record page: build, structure, honesty rules
  assets/templates/     context-doc.md, frame.md
  assets/board-artifact.css   shared design system for the record
  scripts/              weight-sweep.js, embed-fonts.py
```

**In the user's home directory** (personal, never synced):

```
~/advisory-board/            (override with $ADVISORY_BOARD_HOME)
  dossiers/    <domain>.md   long-lived context documents, reused across decisions
  runs/        <decision-slug>/<YYYY-MM-DD-HHMM>/
```

Dossiers describe real people and real money; runs record real decisions. Neither belongs in a
version-controlled skills tree. Create `~/advisory-board/{dossiers,runs}` if it does not exist.

**Roster resolution order.** A user roster always wins, so someone can adapt a council without
editing the skill:

1. `$ADVISORY_BOARD_HOME/rosters/<name>.md` if present
2. `<skill>/references/rosters/<name>.md`

A new council is a new file in either location. Never edit this skill to add one.

A run directory contains:

```
runs/<slug>/<timestamp>/
  frame.md             problem frame + weights table, written BEFORE any member runs
  dossier.md           a copy of the dossier as it existed at run time
  members/
    pessimist.md       raw output, one file per member
    optimist.md
    liberator.md
  verdict.md           the Oracle's adjudication
  meta.yml             roster, models used, timestamp, parent run if this is a re-run
```

Copy the dossier into the run rather than linking it. A dossier that drifts silently makes past verdicts unreadable.

## Workflow

### 1. Establish the dossier
Look for an existing dossier in `dossiers/` covering this domain. If none exists, build one from `assets/templates/context-doc.md` (in this skill) with the user.

**Refuse to proceed on a thin dossier.** This is the step that decides output quality, and it is the one users skip. A dossier is thin if it lacks real numbers, names specific people only in the abstract, or omits the constraints that actually bind. Say so plainly and ask for what is missing.

Prefer updating an existing dossier over writing a new one. The dossier is the durable asset; individual runs are disposable.

### 2. Lock the frame and the weights
Write `frame.md` from `assets/templates/frame.md` (in this skill) before anything else runs. It must contain:
- Stakes, timeline, and an explicit definition of success
- The options under consideration
- 5 to 9 weighted criteria, weights summing to exactly 100

Weights are set **before** looking at any option, so the ranking cannot be reverse-engineered from a preferred answer. If the user cannot decide between two weightings, do not average them. Record both and run a sweep in step 5, because that uncertainty is itself a finding.

### 3. Run the order-1 group alone, first
Order matters. The members holding constraints and failure modes run before any upside framing exists, so nobody anchors on an optimistic case. In a roster that is the Pessimist; in `executive` it is the CFO and COO; in `technical` and `homelab` it is the SRE and Security.

Give them the dossier and the frame. Write each output to `members/<slug>.md`.

### 4. Run the remaining order groups in parallel, in isolation
Spawn each subsequent group concurrently in a single message. Every member receives the **identical** dossier and frame.

Order groups are a real barrier: wait for a group to finish before starting the next. Within a group, members run at the same time and never see each other.

**No member sees another member's output.** This is the whole mechanism. Separate agent contexts give you that for free; do not undermine it by summarizing one member into another's prompt. A softened Optimist is a useless Optimist.

Run members on a cheaper model (`sonnet`) when the roster is large. Their job is generative, not adjudicative.

### 5. Adjudicate
Give the Oracle the frame, the weights, and every member's full raw output. Run it on the strongest available model. Its output goes to `verdict.md`.

The Oracle's failure mode is producing a weighted average dressed up as a judgment. Reject any verdict that does not contain:
- Where members agreed, and whether the agreement is load-bearing or incidental
- Where members clashed, stated as the actual disagreement rather than a summary of both
- The single factor that decides it
- What is being discarded and why

If the user wants a weight sweep, run one Oracle per weight configuration over the **same** member outputs, then compare. Members argue; only the Oracle applies weights. Re-running members for a sweep wastes tokens and adds noise. See `scripts/weight-sweep.js` in this skill.

### 6. Report and persist
Present the ranking, the deciding factor, and the strongest surviving objection. Tell the user the run path. If this is a re-run, diff the ranking against the parent run and lead with what moved.

### 7. Publish the board record
Every completed run ends in a published artifact: the executive summary a real board would hand back. **Read `references/artifact.md` before writing it** - it carries the build command, the required sections, and the honesty rules.

In short: write the content to `<runDir>/board-record.src.html`, run `scripts/embed-fonts.py` over it with `assets/board-artifact.css`, publish the result with favicon `⚖️`.

The page must never read as more decisive than the verdict was. If options tied, say so in words. If the adjudicator overruled its own arithmetic, show both. If a member's ordering was inferred rather than stated, footnote it. A record that launders uncertainty into a clean ranking is worse than no record, because it will be trusted later.

## Rosters
A roster file defines the council. Each member has a name, a one-paragraph mandate written in the second person, and an optional model hint. The final member is always an adjudicator.

Default rosters:
- **family** — Optimist, Pessimist, Liberator, Oracle. For life decisions with named human stakeholders.
- **executive** — CEO, CFO, CTO, COO, CMO, Oracle. For business decisions.
- **technical** — Architect, SRE, Security, Maintainer, Oracle. For system and infrastructure decisions.
- **homelab** — the technical five plus a Liberator. For self-hosted systems a household depends on and one person maintains, where the operator's own growth and frustration are real costs.

Each member declares an `order:`. Lower orders run first and act as a barrier.

Adding a council means adding a file, never editing this skill.

## Constraints & Guardrails
- Never let members see each other's output before the Oracle runs
- Never proceed without written weights summing to 100
- Never let the Oracle average; it must adjudicate and name what it discards
- Never run the Optimist before the Pessimist
- Name specific people, never abstract categories. "What serves [named person] long-term" produces analysis that "what is best for the family" cannot
- State hard constraints as facts, not preferences. A constraint buried in prose gets optimized around
- Never rewrite a persisted run. Re-runs create a new timestamped directory recording their parent
- Do not present a verdict without at least one surviving objection. Unanimity means the board was badly constructed, not that the decision is safe

## Integration Points
- **Agent tool** — default execution. Spawn members concurrently in one message.
- **Workflow tool** — for weight sweeps and multi-configuration runs. Invoke with `{scriptPath: "<skill>/scripts/weight-sweep.js"}`, passing `home` and `runDir` in `args`. Requires explicit user opt-in.
- **spec-from-conversation** — turn an accepted verdict into an actionable plan.
- **deep-research** — gather external facts into the dossier before convening, not during.
