# Slack → Linear Automation Rules

## Rule 1 — BEARO TODOs
**Channel**: #bearo-engineering  
**Prefixes**: TODO:, ISSUE:, FEATURE:  
**Linear Team**: BEARO  
**Default Priority**: P1  
**Auto-labels**: product:bearo  

## Rule 2 — AlphaBuilder Tasks
**Channel**: #alphabuilder-engineering  
**Prefixes**: TODO:, TASK:, FIX:  
**Linear Team**: AlphaBuilder  
**Default Priority**: P2  
**Auto-labels**: product:alphabuilder  

## Rule 3 — Bug Reports
**Channel**: Any product channel  
**Prefixes**: BUG:, BROKEN:, ERROR:  
**Linear Team**: Matches channel  
**Default Priority**: P1  
**Auto-labels**: type:bug, needs-triage  

## Rule 4 — Feature Requests
**Channel**: Any product channel  
**Prefixes**: FEATURE:, REQUEST:, IDEA:  
**Linear Team**: Matches channel  
**Default Priority**: P3  
**Auto-labels**: type:feature, needs-spec  

## Rule 5 — Customer Issues
**Channel**: #customer-support  
**Prefixes**: URGENT:, CUSTOMER:, SUPPORT:  
**Linear Team**: BEARO (default)  
**Default Priority**: P1  
**Auto-labels**: customer-reported, needs-triage  

## Rule 6 — PR Alerts
**Trigger**: PR opened or merged  
**Action**: 
- Notify channel
- Link to Linear issue
- Update issue status
- Add has-pr label

## Advanced Rules

### Priority Escalation
- Message contains "🚨" or "urgent" → P0
- Message contains "ASAP" or "blocking" → P1
- From founder/investor → Increase priority by 1

### Smart Assignment
- Message mentions @user → Assign to that user
- In thread → Assign to thread starter
- Contains "AI" or "agent" → Add appropriate agent: label

### Context Capture
- Thread replies → Add as Linear comments
- Attachments → Upload to Linear issue
- Reactions → Track sentiment

## Parsing Format

### Standard Format
```
TODO: [Title]
Description: [Optional longer description]
Priority: [P0-P3]
Assign: @username
Labels: label1, label2
```

### Quick Format
```
TODO: Fix login bug on mobile app
```
Creates issue with smart defaults

### Batch Format
```
TODOS:
- [ ] First task
- [ ] Second task
- [ ] Third task
```
Creates multiple linked issues

## Channel-Specific Overrides

### #founders Channel
- All items default to P1
- Auto-add "strategic" label
- Notify all team leads

### #customer-support Channel
- Parse customer email if included
- Link to CRM entry in Notion
- Auto-add "customer-reported"

### Engineering Channels
- Parse stack traces
- Link GitHub commits/PRs
- Add technical labels
