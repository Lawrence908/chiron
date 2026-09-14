---
name: fastapi-development
description: "Design, implement, and maintain FastAPI applications with proper structure, error handling, authentication, and API best practices. Use when: Creating new FastAPI projects or MVPs, Adding endpoints, routes, or features to existing FastAPI apps, Implementing authentication, authorization, or API security, Designing API schemas and request/response models, Debugging FastAPI routing, dependency injection, or middleware issues, Optimizing FastAPI performance or database queries."
metadata:
  category: dev
---

## Purpose
Design, implement, and maintain FastAPI applications with proper structure, error handling, authentication, and API best practices.

## When to Use
- Creating new FastAPI projects or MVPs
- Adding endpoints, routes, or features to existing FastAPI apps
- Implementing authentication, authorization, or API security
- Designing API schemas and request/response models
- Debugging FastAPI routing, dependency injection, or middleware issues
- Optimizing FastAPI performance or database queries

## Inputs Required
- Project requirements or feature specifications
- Existing codebase structure (if extending)
- API design requirements (endpoints, methods, schemas)
- Authentication/authorization needs
- Database models or ORM setup
- Deployment constraints

## Outputs Produced
- FastAPI application code with proper structure
- Pydantic models for request/response validation
- Route handlers with dependency injection
- Error handling and HTTP status codes
- Database integration (SQLAlchemy, async queries)
- Authentication/authorization implementation
- Testing examples or test structure
- API documentation notes

## Workflow
1. **Plan MVP scope** - Define core features, skip auth initially if learning-focused
2. **Choose architecture** - Domain-driven modules (fantasy/, arena/, staking/) vs feature-based
3. **Design API structure** - Routes, models, dependencies, service layer
4. **Create Pydantic models** - Request/response validation schemas
5. **Implement route handlers** - Proper HTTP methods, async/await
6. **Set up dependency injection** - Shared logic (auth, DB sessions, services)
7. **Add error handling** - HTTPException, custom exceptions, proper status codes
8. **Integrate database** - SQLAlchemy async with connection pooling
9. **Add authentication** - JWT, OAuth, API keys (if needed for MVP)
10. **Add input validation** - Pydantic validators, error responses
11. **Structure for scalability** - Service layer, base CRUD, reusable patterns

## Constraints & Guardrails
- Always use Pydantic models for request/response validation.
- Use dependency injection for shared resources (DB, auth).
- Return proper HTTP status codes (200, 201, 400, 401, 404, 500).
- Never expose sensitive data in error messages.
- Use async/await for I/O operations (database, external APIs).
- Follow FastAPI best practices (router organization, response models).
- Never skip input validation - validate all user inputs.

## Integration Points
- API Debugging Skill (for troubleshooting FastAPI issues)
- Python Refactor Skill (for restructuring FastAPI code)
- MCP Integration Skill (for FastAPI-based MCP servers)

## Example Usage

### MVP Planning Pattern
**Input**: "I want to build a FastAPI MVP for a fantasy sports backend"

**Typical workflow:**
1. Define MVP scope (skip auth initially, focus on core features)
2. Choose domain-driven structure: `fantasy/`, `arena/`, `staking/` modules
3. Plan external API integration (sportsdata.io or mock data)
4. Design modular structure with routers, services, models

### Code Structure Example
```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

app = FastAPI(title="ChainArena API", version="1.0.0")

# Domain-driven module structure
# fantasy/
#   - models.py (SQLAlchemy models)
#   - schemas.py (Pydantic models)
#   - router.py (FastAPI routes)
#   - service.py (Business logic)

# Pydantic models
class PlayerCreate(BaseModel):
    name: str
    position: str

class PlayerResponse(BaseModel):
    id: int
    name: str
    position: str

# Dependencies
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_db() -> AsyncSession:
    # Async database session
    async with get_async_session() as session:
        yield session

# Routes with dependency injection
@app.post("/players", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
async def create_player(
    player: PlayerCreate,
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    # Create player logic with service layer
    # token contains the OAuth2 bearer token from Authorization header
    ...
```

### Common Patterns from Actual Usage
- **Domain-driven modules** - Organize by business domain (fantasy, arena, staking)
- **Service layer** - Business logic in services, not routes
- **Base CRUD** - Reusable CRUD operations for common patterns
- **Async SQLAlchemy** - Always use async for database operations
- **Modular routers** - Include routers from domain modules

## Anti-Patterns
- Mixing sync and async code without understanding implications
- Not using Pydantic models for validation
- Exposing database models directly in responses
- Missing error handling or returning generic 500 errors
- Not using dependency injection for shared resources
- Skipping input validation on user inputs
- **Putting business logic in route handlers** - Use service layer instead
- **Synchronous database queries** - Always use async SQLAlchemy
- **Flat project structure** - Use domain-driven modules for larger projects
- **Skipping MVP planning** - Define scope before building scaffold
