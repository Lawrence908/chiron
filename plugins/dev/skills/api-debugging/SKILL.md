---
name: api-debugging
description: "Systematically debug API issues including authentication failures, routing problems, request/response errors, and integration issues. Use when: API endpoints returning unexpected errors (4xx, 5xx), Authentication or authorization failures (OAuth, JWT, API keys), Request/response format mismatches, Integration issues between services (OAuth providers, webhooks), Performance problems or timeouts, CORS or network connectivity issues, OAuth token refresh issues, Webhook delivery failures, Rate limiting or quota errors."
metadata:
  category: dev
---

## Purpose
Systematically debug API issues including authentication failures, routing problems, request/response errors, and integration issues.

## When to Use
- API endpoints returning unexpected errors (4xx, 5xx)
- Authentication or authorization failures (OAuth, JWT, API keys)
- Request/response format mismatches
- Integration issues between services (OAuth providers, webhooks)
- Performance problems or timeouts
- CORS or network connectivity issues
- OAuth token refresh issues
- Webhook delivery failures
- Rate limiting or quota errors

## Inputs Required
- Error messages or status codes
- Request details (method, URL, headers, body)
- Response details (status, headers, body)
- API documentation or expected behavior
- Logs or stack traces
- Environment details (dev, staging, production)

## Outputs Produced
- Root cause analysis of the issue
- Step-by-step debugging procedure
- Corrected code or configuration
- Verification steps to confirm fix
- Prevention strategies for similar issues
- Logging or monitoring recommendations

## Workflow
1. Reproduce the issue with exact request details.
2. Check HTTP status code and response body for error details.
3. Verify request format (headers, body, query parameters).
4. Check authentication/authorization (tokens, API keys, permissions).
5. Review server logs for errors or exceptions.
6. Validate request against API schema/documentation.
7. Test with minimal request to isolate issue.
8. Check network/CORS if cross-origin requests.
9. Verify environment configuration (endpoints, credentials).
10. Provide fix with explanation and verification steps.

## Constraints & Guardrails
- Never assume error messages are accurate - verify actual behavior.
- Always check authentication before investigating other issues.
- Don't expose sensitive data in error responses or logs.
- Verify request format matches API documentation exactly.
- Check both client and server logs for full picture.
- Test with minimal requests to isolate the problem.

## Integration Points
- FastAPI Development Skill (for FastAPI-specific debugging)
- MCP Integration Skill (for MCP tool debugging)
- Docker Compose Editing Skill (for service integration issues)

## Example Usage
**Input**: "API endpoint returns 401 Unauthorized but token looks valid"
**Output**:
```bash
# 1. Verify token format
echo $TOKEN | cut -d. -f1 | base64 -d  # Decode JWT header
echo $TOKEN | cut -d. -f2 | base64 -d  # Decode JWT payload

# 2. Check token expiration
jq '.exp' <<< $(echo $TOKEN | cut -d. -f2 | base64 -d)

# 3. Test with curl
curl -v -H "Authorization: Bearer $TOKEN" https://api.example.com/endpoint

# 4. Check server logs
tail -f /var/log/api/error.log | grep "401"

# 5. Verify token validation logic
# Check: token signature, expiration, issuer, audience
```

**Common Issues:**
- Token expired → Check `exp` claim, implement refresh flow
- Wrong token format → Verify `Authorization: Bearer <token>` header
- Invalid signature → Check secret/key configuration, algorithm mismatch
- Missing scope → Verify required permissions in token claims
- OAuth callback failures → Check redirect_uri matches exactly
- Webhook delivery issues → Verify signature validation, retry logic
- Rate limiting → Check headers (X-RateLimit-*), implement backoff
- CORS errors → Verify allowed origins, credentials, headers

**OAuth-Specific Debugging:**
- Verify redirect_uri matches exactly (including trailing slashes)
- Check state parameter for CSRF protection
- Validate token response format (access_token, refresh_token, expires_in)
- Test token refresh flow before access token expires
- Verify scope permissions match requirements

## Anti-Patterns
- Assuming error messages are always accurate
- Not checking authentication before other debugging
- Exposing sensitive data in error responses
- Not verifying request format against documentation
- Skipping log review
- Not testing with minimal requests to isolate issues
- **Ignoring OAuth state parameter** - Always validate for security
- **Not handling token refresh** - Implement refresh before expiration
- **Hardcoding API endpoints** - Use environment variables
- **Not validating webhook signatures** - Always verify webhook authenticity
