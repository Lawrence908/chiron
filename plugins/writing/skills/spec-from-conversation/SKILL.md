---
name: spec-from-conversation
description: "Extract structured specifications, requirements, or implementation plans from unstructured conversation history or chat transcripts. Use when: Converting chat discussions into formal specifications, Documenting decisions made in conversations, Creating implementation plans from brainstorming sessions, Extracting requirements from user discussions, Formalizing ad-hoc planning into structured docs, Creating tickets or tasks from conversation context."
metadata:
  category: writing
---

## Purpose
Extract structured specifications, requirements, or implementation plans from unstructured conversation history or chat transcripts.

## When to Use
- Converting chat discussions into formal specifications
- Documenting decisions made in conversations
- Creating implementation plans from brainstorming sessions
- Extracting requirements from user discussions
- Formalizing ad-hoc planning into structured docs
- Creating tickets or tasks from conversation context

## Inputs Required
- Conversation transcript or chat history
- Relevant context (project, system, or domain)
- Desired output format (spec, plan, ticket, etc.)
- Key topics or decisions to extract
- Stakeholders or participants mentioned

## Outputs Produced
- Structured specification document
- Requirements list with priorities
- Implementation plan with steps
- Decision log with rationale
- Action items or tasks
- Technical details and constraints
- Timeline or milestones (if discussed)

## Workflow
1. Read through conversation to identify key topics and decisions.
2. Extract requirements, features, or goals mentioned.
3. Identify technical constraints or limitations discussed.
4. Document decisions made and their rationale.
5. Create structured sections (Overview, Requirements, Design, Implementation).
6. Extract action items or next steps.
7. Include relevant code snippets or examples from conversation.
8. Add context or background if needed for clarity.
9. Format according to target specification format.
10. Review for completeness and accuracy.

## Constraints & Guardrails
- Preserve original intent - don't add requirements not discussed.
- Clearly distinguish between decided items and open questions.
- Mark assumptions or ambiguities explicitly.
- Include context needed to understand decisions.
- Don't over-formalize - keep it practical and actionable.
- Preserve technical details mentioned in conversation.

## Integration Points
- Technical Documentation Skill (for formatting the spec)
- Prompt Design Skill (for extracting structured info from unstructured text)
- Agent Orchestration Skill (for multi-step extraction workflows)

## Example Usage
**Input**: Conversation about adding authentication to an API
**Output**:
```markdown
# Authentication Feature Specification

## Overview
Add JWT-based authentication to the Task Management API to secure endpoints and enable user-specific features.

## Requirements

### Functional Requirements
1. User registration with email and password
2. User login returning JWT token
3. Protected endpoints requiring valid JWT
4. Token refresh mechanism
5. Password reset functionality

### Non-Functional Requirements
- Tokens expire after 24 hours
- Passwords must be hashed (bcrypt)
- Support for refresh tokens (7-day expiry)

## Technical Design

### Authentication Flow
1. User submits credentials to `/auth/login`
2. Server validates and returns JWT + refresh token
3. Client includes JWT in `Authorization: Bearer <token>` header
4. Server validates JWT on protected routes

### Implementation Details
- Use `python-jose` for JWT encoding/decoding
- Store refresh tokens in database
- Use FastAPI `Depends()` for route protection
- Password hashing with `passlib[bcrypt]`

## Database Schema
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL
);
```

## API Endpoints

### POST /auth/register
- Request: `{email, password}`
- Response: `{user_id, email}`

### POST /auth/login
- Request: `{email, password}`
- Response: `{access_token, refresh_token, expires_in}`

### POST /auth/refresh
- Request: `{refresh_token}`
- Response: `{access_token, expires_in}`

## Open Questions
- [ ] Should we support OAuth providers?
- [ ] Rate limiting for login attempts?
- [ ] Email verification required?

## Action Items
1. [ ] Implement user registration endpoint
2. [ ] Add JWT token generation
3. [ ] Create authentication dependency
4. [ ] Add password reset flow
5. [ ] Write tests for auth endpoints

## Timeline
- Week 1: Core authentication (register, login, JWT)
- Week 2: Refresh tokens and password reset
- Week 3: Testing and documentation
```

## Anti-Patterns
- Adding requirements not mentioned in conversation.
- Over-formalizing simple decisions.
- Missing context needed to understand decisions.
- Not marking open questions or ambiguities.
- Losing important technical details from conversation.
- Creating specs that don't match what was discussed.
