---
name: python-refactor
description: "Refactor Python modules, services, or utility scripts into cleaner, modular, testable structures without changing behavior unless requested. Use when: Improving clarity, structure, or maintainability, Preparing backend code for deployment, Restructuring a single file or small service."
metadata:
  category: dev
---

## Purpose
Refactor Python modules, services, or utility scripts into cleaner, modular, testable structures without changing behavior unless requested.

## When to Use
- Improving clarity, structure, or maintainability
- Preparing backend code for deployment
- Restructuring a single file or small service

## Inputs Required
- Original code
- Target architecture or style preference
- Constraints (backward compatibility, API shape)

## Outputs Produced
- Fully rewritten modules or functions
- Explanation of design decisions
- Before/after diff summary
- Optional test scaffolding

## Workflow
1. **Analyze existing code** - Structure issues, duplication, side effects, async/sync mixing
2. **Identify patterns** - Common operations that can be extracted, repeated logic
3. **Decide refactor approach** - Extract functions, move classes, split files, add service layer
4. **Apply transformations** - Minimal safe changes, preserve behavior
5. **Ensure consistency** - Naming conventions, import organization, type hints
6. **Add type hints** - Where appropriate for clarity
7. **Provide final code** - Complete with correct imports
8. **Describe testing** - How to verify changes don't break functionality

## Constraints & Guardrails
- Do not introduce breaking API changes unless specified.
- No unnecessary dependencies.
- Maintain deterministic formatting (PEP8, readable imports).

## Integration Points
- Prompt Design Skill
- Documentation generation skills

## Example Usage

**Input**: "Refactor this Django service to be more modular"

**Common refactoring patterns:**
- Extract repeated database queries into base CRUD class
- Move business logic from views to service layer
- Split large files into domain modules
- Convert sync functions to async where appropriate
- Add type hints for better IDE support

**Example transformation:**
```python
# Before: Logic in view
def create_player(request):
    data = request.POST
    player = Player.objects.create(name=data['name'])
    return JsonResponse({'id': player.id})

# After: Service layer
class PlayerService:
    @staticmethod
    async def create_player(name: str) -> Player:
        return await Player.objects.acreate(name=name)

# View becomes thin
async def create_player(request):
    player = await PlayerService.create_player(request.POST['name'])
    return JsonResponse({'id': player.id})
```

## Anti-Patterns
- Overengineering simple code
- Excessive abstraction for small scripts
- **Breaking existing APIs** without explicit permission
- **Changing behavior** during refactor (unless requested)
- **Removing working code** that seems redundant but has purpose
- **Not preserving async/sync patterns** - don't convert without understanding implications
