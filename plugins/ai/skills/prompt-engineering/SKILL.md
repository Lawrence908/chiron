---
name: prompt-engineering
description: "Design effective prompts for LLMs that produce consistent, accurate, and useful outputs for specific tasks and workflows. Use when: Creating system prompts for agents or assistants, Designing prompts for code generation, refactoring, or debugging, Crafting prompts for documentation, writing, or analysis tasks, Optimizing prompts for better accuracy or consistency, Creating reusable prompt templates for common workflows, Generating context files or instruction sets, Creating setup prompts for infrastructure (Proxmox, Docker, etc.), Designing prompts that orchestrate multiple skills."
metadata:
  category: ai
---

## Purpose
Design effective prompts for LLMs that produce consistent, accurate, and useful outputs for specific tasks and workflows.

## When to Use
- Creating system prompts for agents or assistants
- Designing prompts for code generation, refactoring, or debugging
- Crafting prompts for documentation, writing, or analysis tasks
- Optimizing prompts for better accuracy or consistency
- Creating reusable prompt templates for common workflows
- Generating context files or instruction sets
- Creating setup prompts for infrastructure (Proxmox, Docker, etc.)
- Designing prompts that orchestrate multiple skills

## Inputs Required
- Task description and desired outcome
- Context or examples to include
- Output format requirements
- Constraints or guardrails
- Examples of good/bad outputs

## Outputs Produced
- Final prompt text (system + user prompts)
- Prompt structure explanation
- Example inputs and expected outputs
- Testing methodology
- Iteration notes if prompt was refined

## Workflow
1. Define clear task objective and success criteria.
2. Identify required context (code, docs, examples).
3. Structure prompt with clear sections (role, task, context, constraints, format).
4. Include few-shot examples if helpful.
5. Specify output format (JSON, markdown, code blocks).
6. Add guardrails and constraints explicitly.
7. Test prompt with sample inputs.
8. Iterate based on results, refining clarity and specificity.
9. Document prompt version and usage guidelines.

## Constraints & Guardrails
- Keep prompts focused - avoid trying to do too much in one prompt.
- Be explicit about format requirements (JSON schema, markdown structure).
- Include examples when task is complex or ambiguous.
- Specify constraints clearly (no breaking changes, maintain style, etc.).
- Avoid vague instructions - use concrete, actionable language.
- Test prompts with edge cases before deployment.

## Integration Points
- Agent Orchestration Skill (for multi-step prompts)
- Prompt Design Skill (for meta-prompting workflows)
- Writing/Documentation Skills (for content generation prompts)

## Example Usage
**Input**: "Create a prompt for refactoring Python code to be more modular"
**Output**:
```
# System Prompt
You are an expert Python developer specializing in code refactoring. Your goal is to improve code structure, maintainability, and testability without changing behavior.

# Task
Refactor the provided Python code to be more modular by:
1. Extracting functions for single responsibilities
2. Reducing code duplication
3. Improving naming clarity
4. Adding type hints where appropriate

# Constraints
- Do not change external API or function signatures
- Maintain backward compatibility
- Follow PEP 8 style guidelines
- Do not introduce new dependencies unless necessary
- Preserve all existing functionality

# Output Format
Provide the refactored code in a code block with:
1. Brief explanation of changes made
2. Before/after comparison for key functions
3. Notes on any trade-offs or considerations

# Example
[Include 1-2 examples of good refactoring]
```

## Anti-Patterns
- Vague or ambiguous instructions
- Trying to accomplish too many things in one prompt
- Not specifying output format
- Missing constraints or guardrails
- Not testing with edge cases
- Overly long prompts that lose focus
- **Not including context** - Reference relevant files, examples, or previous work
- **Assuming prior knowledge** - Be explicit about requirements and constraints
- **Not iterating** - Test and refine prompts based on actual outputs
- **Missing examples** - Few-shot examples dramatically improve results for complex tasks
