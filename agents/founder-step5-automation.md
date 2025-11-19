# 🤖 FounderOS — Step 5 AGENT DIRECTIVE  
## Daily Automation Loop — Notion ↔ Linear ↔ GitHub  
### Unified Agent Protocol (Composer • Codex • Claude)

──────────────────────────────────────────────────────────────  
This file defines the **official Step 5 assignment** for all  
engineering agents working inside FounderOS.  
Each agent executes independently, produces output,  
and submits a PR using the FounderOS multi-agent workflow.  
──────────────────────────────────────────────────────────────  

# 🎯 MISSION OBJECTIVE
Build a **daily automation loop** that performs the following:

- Sync Linear issues ↔ Notion tasks bidirectionally
- Sync GitHub PRs ↔ Notion & Linear tasks
- Assign tasks to agents based on load
- Update task status across platforms (e.g. PR merged → Task = Done)
- Log execution results in Notion or Markdown
- Schedule to run once per day

This automation must operate as an **autonomous agent loop**  
that enables FounderOS to self-orchestrate engineering work.

---

# 🟦 BLOCK A — AUTOMATION SCRIPTS  
Each agent must implement:

## 1. `automation/notion-to-linear.js`
- Read Notion Tasks database
- Create or update matching Linear issues
- Handle new, updated, or deleted tasks

## 2. `automation/linear-to-notion.js`
- Read Linear issues
- Create or update matching Notion tasks
- Update relations (e.g., Product, Project, Owner)

## 3. `automation/pr-sync.js`
- Read PRs from GitHub repo
- Sync PR metadata (title, status, branch, assignee) to Notion + Linear
- Mark task/issue as Done if PR merged

## 4. `automation/task-manager.js`
- Load all Tasks/Issues across sources
- Assign unassigned tasks to available agents (Composer, Codex, Claude)
- Respect workload balance (≤ 3 tasks per agent)

---

# 🟧 BLOCK B — SCHEDULER CONFIG  
Create a cron-like schedule file:

`automation/schedule/daily-sync.yaml`

