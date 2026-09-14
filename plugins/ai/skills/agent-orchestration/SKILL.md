---
name: agent-orchestration
description: "Design and orchestrate multi-step agent workflows that combine multiple skills, tools, and context sources to accomplish complex tasks. Use when: Tasks requiring multiple skills or tools in sequence, Workflows that need to combine code generation, testing, and deployment, Complex refactoring that spans multiple files or systems, Multi-phase infrastructure changes, End-to-end feature development workflows."
metadata:
  category: ai
---

## Purpose
Design and orchestrate multi-step agent workflows that combine multiple skills, tools, and context sources to accomplish complex tasks.

## When to Use
- Tasks requiring multiple skills or tools in sequence
- Workflows that need to combine code generation, testing, and deployment
- Complex refactoring that spans multiple files or systems
- Multi-phase infrastructure changes
- End-to-end feature development workflows

## Inputs Required
- Overall task objective
- Required skills or tools to combine
- Dependencies between steps
- Context sources (files, APIs, databases)
- Success criteria for each phase
- Rollback requirements

## Outputs Produced
- Orchestration plan with step sequence
- Skill/tool selection and combination strategy
- Context loading strategy
- Intermediate validation checkpoints
- Error handling and rollback procedures
- Final output format specification

## Workflow
1. Break down task into discrete phases or steps.
2. Identify required skills for each phase (from skills pack).
3. Determine dependencies between steps (what must complete before next).
4. Design context loading strategy (which files/APIs needed when).
5. Create orchestration prompt that:
   - Lists required skills in order
   - Specifies context to load for each phase
   - Defines validation checkpoints
   - Includes error handling
6. Specify intermediate outputs and final deliverable format.
7. Add rollback procedures for each destructive step.
8. Test orchestration with sample task.

## Constraints & Guardrails
- Never skip validation checkpoints between phases.
- Always load context incrementally (don't overwhelm context window).
- For destructive operations, require explicit confirmation at each step.
- Maintain clear separation between phases to enable rollback.
- Don't combine unrelated skills - keep workflows focused.
- Always specify what success looks like for each phase.

## Integration Points
- Prompt Design Skill (for creating orchestration prompts)
- All other skills (as building blocks for orchestration)
- MCP Integration Skill (for tool-based workflows)

## Example Usage
**Input**: "Orchestrate adding a new Docker service to homelab with change planning, compose editing, and deployment"
**Output**:
```
# Orchestration Plan: Add Docker Service to Homelab

## Phase 1: Planning (Homelab Change Plan Skill)
- Load: Current docker-compose.yml, homelab topology docs
- Output: Change plan with rollback steps
- Validation: Plan reviewed and approved

## Phase 2: Configuration (Docker Compose Editing Skill)
- Load: Change plan, service requirements, port mappings
- Output: Updated docker-compose.yml snippet
- Validation: YAML syntax valid, no port conflicts

## Phase 3: Deployment Prep (Homelab Change Plan Skill)
- Load: Updated compose file, current system state
- Output: Deployment checklist and verification steps
- Validation: Pre-flight checks pass

## Phase 4: Execution (Manual or automated)
- Execute: docker-compose up -d
- Verify: Service health checks, logs review
- Rollback: docker-compose down if issues

## Final Output
- Updated docker-compose.yml
- Deployment verification report
- Rollback instructions
```

## Anti-Patterns
- Combining too many unrelated skills in one workflow.
- Skipping validation between phases.
- Not loading context incrementally (context window overflow).
- Missing rollback procedures for destructive steps.
- Unclear success criteria for each phase.
- Not testing orchestration before deployment.
