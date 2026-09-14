---
name: technical-documentation
description: "Create clear, comprehensive technical documentation including guides, READMEs, API documentation, and procedural instructions. Use when: Writing project README files, Creating setup or installation guides, Documenting API endpoints or library usage, Writing troubleshooting guides or runbooks, Creating architecture or design documentation, Documenting deployment procedures, Writing code comments or inline documentation."
metadata:
  category: writing
---

## Purpose
Create clear, comprehensive technical documentation including guides, READMEs, API documentation, and procedural instructions.

## When to Use
- Writing project README files
- Creating setup or installation guides
- Documenting API endpoints or library usage
- Writing troubleshooting guides or runbooks
- Creating architecture or design documentation
- Documenting deployment procedures
- Writing code comments or inline documentation

## Inputs Required
- Project or system to document
- Target audience (developers, users, operators)
- Documentation type (README, guide, API docs, etc.)
- Existing code, configuration, or system details
- Examples or use cases to include
- Format requirements (Markdown, reStructuredText, etc.)

## Outputs Produced
- Structured documentation with clear sections
- Code examples and usage patterns
- Step-by-step procedures
- Troubleshooting sections
- API reference or function documentation
- Diagrams or visual aids (if needed)
- Table of contents for longer documents

## Workflow
1. Identify target audience and documentation purpose.
2. Outline document structure (sections, subsections).
3. Write introduction explaining what the document covers.
4. Document setup/installation if applicable.
5. Provide usage examples with code snippets.
6. Document configuration options or parameters.
7. Add troubleshooting section for common issues.
8. Include API reference or detailed function docs if needed.
9. Add links to related resources or documentation.
10. Review for clarity, completeness, and accuracy.

## Constraints & Guardrails
- Write for the target audience's technical level.
- Use clear, concise language - avoid jargon unless necessary.
- Include working code examples, not pseudocode.
- Keep examples up-to-date with actual code.
- Document edge cases and error conditions.
- Use consistent formatting and style throughout.
- Never assume prior knowledge - explain context when needed.

## Integration Points
- Spec from Conversation Skill (for extracting docs from chat history)
- FastAPI Development Skill (for API documentation)
- Python Refactor Skill (for code documentation)

## Example Usage
**Input**: "Create a README for a FastAPI task management API"
**Output**:
```markdown
# Task Management API

A RESTful API for managing tasks, built with FastAPI.

## Features

- Create, read, update, and delete tasks
- User authentication with JWT tokens
- Task filtering and search
- RESTful API design

## Installation

### Prerequisites

- Python 3.11+
- PostgreSQL 14+

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/user/task-api.git
   cd task-api
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database and JWT secret
   ```

5. Run database migrations:
   ```bash
   alembic upgrade head
   ```

6. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Usage

### Authentication

Get a JWT token:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'
```

### Create Task

```bash
curl -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My task", "description": "Task description"}'
```

## API Reference

See [API Documentation](docs/api.md) for complete endpoint reference.

## Troubleshooting

### Database Connection Errors

Ensure PostgreSQL is running and credentials in `.env` are correct:
```bash
psql -U postgres -h localhost -d taskdb
```

### JWT Token Errors

Verify `JWT_SECRET` in `.env` matches the secret used to sign tokens.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
```

## Anti-Patterns
- Assuming readers have prior knowledge of the system.
- Outdated code examples that don't match current implementation.
- Missing installation or setup instructions.
- Vague or incomplete troubleshooting sections.
- Inconsistent formatting or style.
- Not explaining why certain steps are necessary.
