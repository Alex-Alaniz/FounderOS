# Step 5 — Automation Loop Documentation (Agent: Codex)

## Overview
Codex implemented the Step 5 daily automation loop across Notion, Linear, and GitHub. The system includes modular Node.js scripts, a scheduler definition, and Markdown logging so every execution is auditable.

## Scripts Delivered
- [x] `automation/notion-to-linear.js`
- [x] `automation/linear-to-notion.js`
- [x] `automation/pr-sync.js`
- [x] `automation/task-manager.js`
- [x] `automation/schedule/daily-sync.yaml`

## Architecture Highlights
- Shared config (`automation/config.js`) centralizes env vars, status/priority maps, and agent roster.
- Typed API clients for Notion, Linear (GraphQL), and GitHub (REST).
- `automation/lib/logger.js` appends structured entries to `logs/automation-daily.md`.
- `automation/lib/notion.js` normalizes Tasks DB pages for reuse across scripts.
- All scripts expose `run()` for testing and can be executed via `node automation/<script>.js`.

## Required Environment Variables
| Key | Purpose |
| --- | --- |
| `NOTION_API_KEY` | Authenticate all Notion calls |
| `NOTION_TASK_DB_ID` | Tasks database ID |
| `NOTION_GITHUB_DB_ID` | GitHub PR monitor database ID |
| `NOTION_LINEAR_DB_ID` | Linear issue log (optional) |
| `LINEAR_API_KEY` | GraphQL access token |
| `GITHUB_TOKEN` | Repo PR access |
| `GITHUB_REPOSITORY` | Defaults to `BearifiedCo/FounderOS` |
| `NOTION_PRODUCT_RELATIONS` | JSON map `{ "bearo": "<page-id>" }` |
| `NOTION_ASSIGNEE_RELATIONS` | JSON map `{ "Codex": "<team-page-id>" }` |
| `LINEAR_TEAM_BY_PRODUCT` | JSON map from product slug to team ID |
| `LINEAR_ASSIGNEE_MAP` | JSON map `{ "Codex": "<linear-user-id>" }` |

Optional knobs: `AUTOMATION_MAX_TASKS_PER_AGENT`, `AUTOMATION_LOOKBACK_HOURS`, `AUTOMATION_AGENT_ROSTER`, `AUTOMATION_LOG_FILE`, `AUTOMATION_DRY_RUN`.

## Log Output
Daily entries append to `logs/automation-daily.md`. Each record tracks counts (created, updated, skipped) plus warnings per script.

## Manual Setup Checklist
- [ ] Populate `.env.local` with the env vars above.
- [ ] Map product + assignee IDs for both Notion and Linear.
- [ ] Configure GitHub PAT with `repo` scope.
- [ ] Wire Slack webhook referenced in `automation/schedule/daily-sync.yaml` if desired.

### Current Local `.env.local`
```
NOTION_API_KEY=ntn_***
NOTION_TASK_DB_ID=701e66c648e54c1ea025dac5888421f0
NOTION_PRODUCTS_DB_ID=3b67dfdd81fc4f7cacce9e0e3572b620
NOTION_TEAM_DB_ID=1a8e1f1d432f41ac826d14da993c9b6a
NOTION_GITHUB_DB_ID=a256468f56d145f0a17d4ed8628daeaa
LINEAR_API_KEY=lin_xxx (placeholder)
LINEAR_TEAM_BY_PRODUCT='{"bearo":"BEAR","alphabuilder":"ALPHA","primape":"PRIM","chimpanion":"CHIMP","founderos":"FOS"}'
LINEAR_ASSIGNEE_MAP='{"Composer":"usr_compose","Codex":"usr_codex","Claude":"usr_claude","Gemini":"usr_gemini"}'
LINEAR_STATE_MAP='{"To Do":"state_backlog","Backlog":"state_backlog","In Spec":"state_spec","Ready for Dev":"state_ready","In Progress":"state_in_progress","In Review":"state_in_review","Done":"state_done","Blocked":"state_blocked"}'
LINEAR_PRIORITY_MAP='{"P0":1,"P1":2,"P2":3,"P3":4}'
GITHUB_TOKEN=ghp_xxx (placeholder)
AUTOMATION_AGENT_ROSTER='["Composer","Codex","Claude","Gemini"]'
AUTOMATION_MAX_TASKS_PER_AGENT=3
AUTOMATION_LOOKBACK_HOURS=24
AUTOMATION_DRY_RUN=true
AUTOMATION_LOG_FILE=logs/automation-daily.md
```
> Replace `lin_xxx` / `ghp_xxx` / pseudo Linear IDs with live credentials + state IDs before running in production. Current Notion token is shared with the Tasks DB but the integration still needs to be invited to the database inside Notion.

## Testing Notes
1. Run scripts with `AUTOMATION_DRY_RUN=true` to preview.
2. Use `node automation/notion-to-linear.js` etc. after exporting env vars.
3. Validate `logs/automation-daily.md` updates and review Notion task mutations.

### Dry-run Attempt (Local, Nov 20 2025)
| Script | Result |
| --- | --- |
| `notion-to-linear` | ❌ Notion API returned `object_not_found` for DB `701e66c6…`. Integration must be shared with the Tasks DB. |
| `linear-to-notion` | ❌ Linear API rejected placeholder token (`401 Authentication required`). |
| `pr-sync` | ❌ GitHub API rejected placeholder PAT (`Bad credentials`). |
| `task-manager` | ❌ Same Notion DB access issue as above. |

No log entries were created because each script exited before writing summaries.

## Outstanding Risks
- Notion property names must match those referenced in the scripts (`Status`, `Priority`, `Linear Issue ID`, etc.).
- Linear state IDs inside `LINEAR_STATE_MAP` must be actual workflow IDs, not human-readable names.
- GitHub PR DB should include the `PR Number` property; otherwise upserts fall back to creation-only mode.

## Next Steps
1. Hook scripts into GitHub Actions or a cron host using `automation/schedule/daily-sync.yaml`.
2. Extend `task-manager` with SLA-based escalation (Slack alerts when backlog > threshold).
3. Add unit tests (Jest) once repo formalizes Node toolchain.

## CI/Scheduling
- Added `.github/workflows/daily-automation-loop.yml` which runs nightly at 05:00 UTC (and via `workflow_dispatch`). Job executes the four automation scripts sequentially using repository secrets for sensitive tokens.
- Required secrets: `NOTION_API_KEY`, `NOTION_LINEAR_DB_ID`, `NOTION_AUTOMATION_LOG_DB_ID`, `LINEAR_API_KEY`, `LINEAR_ASSIGNEE_MAP`, `LINEAR_STATE_MAP`, `AUTOMATION_GITHUB_TOKEN`.

