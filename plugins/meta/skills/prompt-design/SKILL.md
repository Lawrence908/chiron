---
name: prompt-design
description: "Design high-signal prompts that orchestrate multiple skills and produce deterministic outcomes. Use when: Anytime a workflow requires multiple skills, When defining system instructions or agent behavior, When preparing prompts for Homelab, Django, ML, or infra tasks."
metadata:
  category: meta
---

## Purpose
Design high-signal prompts that orchestrate multiple skills and produce deterministic outcomes.

## When to Use
- Anytime a workflow requires multiple skills
- When defining system instructions or agent behavior
- When preparing prompts for Homelab, Django, ML, or infra tasks

## Inputs Required
- The objective
- The set of skills to combine
- Constraints (tool limits, context window size, format requirements)

## Outputs Produced
- A final consolidated prompt that injects relevant skills
- An ordered plan describing how the agent should use each skill
- Verification instructions

## Workflow
1. Identify required skills for the task.
2. Extract their Purpose, Workflow, Constraints.
3. Merge overlapping workflows into one unified execution plan.
4. Create a structured prompt:
   - Task summary
   - Constraints
   - Ordered process
   - Output format
5. Add a verification step (“Check for errors, omissions, contradictions”).

## Constraints & Guardrails
- Keep prompts short, specific, and operational.
- Avoid vague goals or open-ended instructions.
- Never include contradicting directions.

## Integration Points
- All other skills
- Can generate bundles (task-level context packs)

## Example Usage
“Combine Homelab Change Plan + Proxmox Admin + Docker Compose Editing to produce a full migration plan.”

## Anti-Patterns
- Overlong prompts
- Skills dumped without structure
