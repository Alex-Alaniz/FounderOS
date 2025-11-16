# Linear Labels and Priorities System

## Priority Matrix

### P0 - Critical
- **Definition**: System down, blocking all users, security breach
- **Response**: Drop everything, all hands
- **SLA**: Fix within 4 hours
- **Color**: Red
- **Examples**: Payment system down, data breach, app crash for all users

### P1 - High
- **Definition**: Major feature, blocking some users, this sprint must-have
- **Response**: Primary focus after P0s
- **SLA**: Fix within 2 days
- **Color**: Orange
- **Examples**: Login broken, key feature not working, launch blocker

### P2 - Medium
- **Definition**: Important but not blocking, next sprint
- **Response**: Schedule for next cycle
- **SLA**: Fix within 2 weeks
- **Color**: Yellow
- **Examples**: UI improvements, minor bugs, feature enhancements

### P3 - Low
- **Definition**: Nice to have, backlog item
- **Response**: When time permits
- **SLA**: No commitment
- **Color**: Gray
- **Examples**: Cosmetic issues, minor optimizations

## Label Categories

### 1. Product Labels
Format: `product:[name]`
- Auto-assigns to correct team
- Links to product roadmap
- Filters dashboards

### 2. Technical Labels
- `frontend` - UI/UX work
- `backend` - Server/API work
- `database` - Schema/query work
- `devops` - Infrastructure/deployment
- `mobile` - React Native specific

### 3. Process Labels
- `needs-spec` - Requires product spec
- `blocked` - Waiting on dependency
- `review-needed` - Ready for code review
- `qa-needed` - Needs testing
- `docs-needed` - Requires documentation

### 4. Agent Labels
- `agent:cursor` - Assign to Cursor AI
- `agent:codex` - Assign to Codex AI
- `agent:claude` - Assign to Claude AI
- `agent:human` - Requires human intervention

## Auto-labeling Rules

1. Title contains "bug" → add `type:bug`
2. Title contains "feat" → add `type:feature`
3. PR linked → add `has-pr`
4. Overdue → add `attention-needed`
5. No activity 7 days → add `stale`
