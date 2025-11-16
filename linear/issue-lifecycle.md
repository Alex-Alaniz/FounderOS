# Linear Issue Lifecycle

## Statuses

- **Backlog** - Not yet prioritized
- **In Spec** - Being defined
- **Ready for Dev** - Spec complete, ready to build
- **In Progress** - Actively being worked on
- **In Review** - PR open, awaiting review
- **Done** - Merged and deployed

## Automations

### Inbound
- Slack TODO → Linear Backlog
- Notion Roadmap "In Spec" → Linear Epic
- GitHub Issue → Linear Issue

### Status Transitions
- PR opened → "In Review"
- PR merged → "Done"
- PR closed → "Backlog"
- Branch created → "In Progress"

### Notifications
- P0 created → Slack alert
- Blocked → Slack DM to owner
- Overdue → Daily Slack summary

## Labels

### Priority
- **priority:p0** - Critical, block everything
- **priority:p1** - High, this sprint
- **priority:p2** - Medium, next sprint
- **priority:p3** - Low, when possible

### Product
- **product:bearo**
- **product:alphabuilder**
- **product:primape**
- **product:chimpanion**
- **product:founderos**

### Agent Assignment
- **agent:cursor** - For Cursor AI
- **agent:codex** - For Codex AI
- **agent:claude** - For Claude AI
- **agent:gpt** - For GPT

### Type
- **type:bug**
- **type:feature**
- **type:docs**
- **type:infra**
- **type:refactor**
