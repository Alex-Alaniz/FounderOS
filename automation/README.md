# FounderOS Automation System

This directory contains the daily automation loop for syncing tasks across Notion, Linear, and GitHub.

## Overview

The automation system performs bidirectional synchronization between:
- **Notion Tasks** ↔ **Linear Issues**
- **GitHub PRs** → **Notion Tasks** & **Linear Issues**
- **Task Assignment** → Automatically assigns unassigned tasks to available agents

## Scripts

### Core Automation Scripts

1. **`notion-to-linear.js`** - Syncs Notion Tasks to Linear issues
2. **`linear-to-notion.js`** - Syncs Linear issues to Notion Tasks
3. **`pr-sync.js`** - Syncs GitHub PRs to tasks
4. **`task-manager.js`** - Assigns tasks to agents
5. **`daily-sync.js`** - Orchestrator script

### Utilities

- **`utils.js`** - Shared API clients and helper functions

## Setup

### Environment Variables

Create a `.env.local` file with:

```bash
NOTION_API_KEY=secret_...
LINEAR_API_KEY=...
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=BearifiedCo
GITHUB_REPO=FounderOS
```

### Installation

```bash
npm install
```

## Usage

```bash
# Run full daily sync
node automation/daily-sync.js

# Or run individual scripts
node automation/notion-to-linear.js
node automation/linear-to-notion.js
node automation/pr-sync.js
node automation/task-manager.js
```

## Logging

All scripts log to the `logs/` directory with daily log files.

See full documentation in `automation/README.md`.
