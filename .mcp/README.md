# FounderOS MCP Configuration

This directory contains Model Context Protocol (MCP) server configurations for integrating FounderOS with AI assistants like Claude Desktop.

## Overview

MCP enables AI assistants to directly interact with your tools and services. This configuration connects:
- **Linear**: Task and project management
- **Notion**: Documentation and knowledge base
- **GitHub**: Code repositories and pull requests

## Structure

```
.mcp/
├── config.json           # Master configuration
├── servers/              # Individual server configs
│   ├── linear.json
│   ├── notion.json
│   └── github.json
└── README.md            # This file
```

## Setup

### 1. Install MCP Servers

The MCP servers are automatically installed via npx when needed. No manual installation required.

### 2. Configure Environment Variables

Create a `.env` file in your FounderOS root directory with:

```bash
# Linear API Key
LINEAR_API_KEY=lin_api_...

# Notion API Key
NOTION_API_KEY=secret_...

# GitHub Personal Access Token
GITHUB_PAT=ghp_...
```

**Getting API Keys:**

- **Linear**: Settings → API → Personal API Keys
- **Notion**: https://www.notion.so/my-integrations → Create new integration
- **GitHub**: Settings → Developer settings → Personal access tokens → Generate new token

### 3. Configure Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-linear"],
      "env": {
        "LINEAR_API_KEY": "your-linear-api-key"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "your-notion-api-key"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-pat"
      }
    }
  }
}
```

### 4. Restart Claude Desktop

After updating the configuration, restart Claude Desktop to load the MCP servers.

## Usage

Once configured, Claude can:

### Linear
- List and search issues
- Create and update issues
- Manage labels and assignees
- Track project progress

### Notion
- Read and search pages
- Create and update pages
- Query databases
- Manage properties

### GitHub
- List repositories and issues
- Create pull requests
- Review code
- Manage branches

## Configuration Details

### Master Config (config.json)

The master configuration defines:
- **Version**: Configuration schema version
- **Servers**: Metadata about each integrated service
- **Workspace Info**: Organization and team identifiers

### Server Configs (servers/*.json)

Each server configuration specifies:
- **Command**: How to launch the MCP server
- **Args**: Command-line arguments
- **Env**: Required environment variables

## Security

- **Never commit API keys** to version control
- Store sensitive credentials in `.env` (add to `.gitignore`)
- Use environment variable substitution: `${VAR_NAME}`
- Rotate API keys regularly
- Use minimal required permissions for each API key

## Workspace Information

- **Linear Team**: BearifiedCo (ID: `199361fb-b484-4f6b-8bea-4ab36b87e487`)
- **Notion Workspace**: FounderOS - BearifiedCo Command Center
- **GitHub Organization**: BearifiedCo
- **Primary Repositories**: FounderOS, storefront-labs-iot-backend

## Troubleshooting

### MCP Server Not Loading
1. Check Claude Desktop logs: `~/Library/Logs/Claude/`
2. Verify environment variables are set correctly
3. Test API keys manually using curl or API clients
4. Ensure npx can access the MCP server packages

### Permission Errors
1. Verify API key has required scopes
2. Check Notion integration has access to required databases
3. Ensure GitHub token has appropriate repository permissions

### Connection Issues
1. Restart Claude Desktop
2. Check network connectivity
3. Verify API endpoints are accessible
4. Review API rate limits

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Linear MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/linear)
- [Notion MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/notion)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)

## Support

For issues or questions:
- Check existing Linear issues
- Review Notion documentation pages
- Contact team via Slack #founderos-support
