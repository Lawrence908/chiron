---
name: mcp-integration
description: "Design, implement, and integrate Model Context Protocol (MCP) tools and servers to extend LLM capabilities with external data sources and APIs. Use when: Creating new MCP servers for custom tools, Integrating existing MCP tools (Linear, GitHub, Google Maps, etc.), Troubleshooting MCP connection or authentication issues, Designing MCP tool schemas and resource definitions, Configuring MCP clients (Claude Desktop, Cursor, custom clients), Setting up OAuth for MCP servers (Linear, GitHub), Accessing Linear projects, tickets, or issues via MCP, Creating or updating Linear tickets through MCP."
metadata:
  category: ai
---

## Purpose
Design, implement, and integrate Model Context Protocol (MCP) tools and servers to extend LLM capabilities with external data sources and APIs.

## When to Use
- Creating new MCP servers for custom tools
- Integrating existing MCP tools (Linear, GitHub, Google Maps, etc.)
- Troubleshooting MCP connection or authentication issues
- Designing MCP tool schemas and resource definitions
- Configuring MCP clients (Claude Desktop, Cursor, custom clients)
- Setting up OAuth for MCP servers (Linear, GitHub)
- Accessing Linear projects, tickets, or issues via MCP
- Creating or updating Linear tickets through MCP

## Inputs Required
- Target MCP server or tool to integrate
- Authentication credentials or API keys
- Desired capabilities (read files, API calls, database queries)
- Client configuration requirements
- Tool schema definitions

## Outputs Produced
- MCP server implementation (TypeScript/Python)
- Client configuration files (JSON/YAML)
- Authentication setup instructions
- Tool schema definitions
- Testing and verification steps
- Troubleshooting guide for common issues

## Workflow
1. **Identify requirements** - Tools, resources, prompts needed for the integration
2. **Choose MCP server** - Use existing (Linear, GitHub) or build custom
3. **Set up authentication** - OAuth flow, API keys, or environment variables
4. **Configure client** - Claude Desktop config.json or Cursor settings
5. **Test connection** - Verify MCP server is accessible
6. **Test tools** - Invoke tools and verify responses
7. **Handle errors** - Test error cases and edge conditions
8. **Document usage** - Examples, common patterns, troubleshooting

## Constraints & Guardrails
- Never hardcode API keys or credentials in code - use environment variables.
- Always validate input parameters before making external API calls.
- Implement proper error handling for network failures or API errors.
- Follow MCP specification for tool/resource schemas.
- For OAuth flows, ensure proper token refresh handling.
- Never expose sensitive data in tool responses without user consent.

## Integration Points
- Prompt Design Skill (for designing MCP tool prompts)
- Agent Orchestration Skill (for multi-tool workflows)
- API Debugging Skill (for troubleshooting MCP API issues)

## Example Usage
**Input**: "Create MCP server for Linear API integration with issue creation and listing tools"
**Output**:
```typescript
// mcp-linear-server.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { LinearClient } from "@linear/sdk";

const server = new Server({
  name: "linear-mcp",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
  },
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "create_linear_issue",
      description: "Create a new Linear issue",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string" },
          team: { type: "string" },
          description: { type: "string" },
        },
      },
    },
  ],
}));

// Client config (Claude Desktop)
// ~/.config/claude-desktop/claude_desktop_config.json
{
  "mcpServers": {
    "linear": {
      "command": "node",
      "args": ["/path/to/mcp-linear-server.js"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    }
  }
}
```

## Anti-Patterns
- Hardcoding credentials in source code
- Not validating input parameters
- Missing error handling for API failures
- Incorrect MCP schema definitions
- Not testing MCP connection before deployment
- Exposing sensitive data without proper handling
- **Not setting up OAuth properly** - Linear MCP requires OAuth flow, not just API key
- **Missing client configuration** - MCP servers must be configured in client (Claude Desktop/Cursor)
- **Not verifying access** - Always test "Can you access my Linear MCP" before assuming it works
- **Ignoring authentication errors** - OAuth tokens expire, need refresh flow
