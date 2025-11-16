# Slack Alerts and Notifications Configuration

## Critical Alerts (24/7, @channel)

### Production Down
- **Channels**: #bearo-engineering, #founders
- **Conditions**: 
  - API returns 5xx for >1 min
  - Database connection lost
  - Payment processor offline
- **Message**: "🚨 PRODUCTION DOWN: {service} - {error}"

### Security Breach
- **Channels**: #founders, #security
- **Conditions**:
  - Unauthorized access detected
  - Rate limit exceeded by 10x
  - Suspicious transaction pattern
- **Message**: "🔴 SECURITY ALERT: {type} - Immediate action required"

## High Priority (Business Hours, @here)

### Deploy Status
- **Channels**: Product engineering channels
- **Conditions**: Deploy started/completed/failed
- **Message**: "🚀 Deploy {status}: {service} v{version}"

### Customer Churn Risk
- **Channels**: #customer-support, #founders
- **Conditions**: 
  - High-value customer inactive >7 days
  - Multiple support tickets
  - Cancellation initiated
- **Message**: "⚠️ Churn Risk: {customer} - {reason}"

### PR Review Needed
- **Channels**: Engineering channels
- **Conditions**: PR open >24 hours
- **Message**: "👀 Review needed: {title} by @{author}"

## Standard Notifications

### Daily Standups
- **Channels**: All product channels
- **Time**: 9 AM PST
- **Format**:
  ```
  📅 Daily Standup for {team}
  • In Progress: {count} issues
  • Blocked: {list}
  • Completed Yesterday: {list}
  • Priority Today: {top-3}
  ```

### Weekly Metrics
- **Channels**: #founders, #metrics
- **Time**: Monday 9 AM PST
- **Metrics**:
  - Active users
  - Revenue
  - Issues closed
  - Deploy count
  - Customer satisfaction

### Sprint Summary
- **Channels**: Product channels
- **Time**: End of sprint
- **Content**:
  - Completed stories
  - Velocity
  - Carry-over items
  - Retrospective highlights

## Smart Notifications

### Blocker Detection
- Monitor "blocked" label in Linear
- Alert if blocked >4 hours
- Suggest owner or escalation

### Stale Issues
- No activity >7 days
- Alert owner
- Suggest close or re-prioritize

### PR Size Warning
- PR >500 lines
- Suggest breaking up
- Alert reviewers

## Integration-Specific

### GitHub → Slack
- PR opened → Engineering channel
- PR merged → Celebration in #wins
- Build failed → Engineering channel
- Release created → #general

### Linear → Slack
- P0 created → #founders + engineering
- Sprint started → Team channel
- Issue blocked → Owner DM
- Milestone complete → #general

### Notion → Slack
- Roadmap updated → #product-updates
- New contributor → #team
- Content published → #marketing

## Notification Preferences

### DM Triggers
- You're assigned an issue
- You're mentioned in comment
- Your PR reviewed
- Issue you created updated

### Channel Mutes
- #github-activity: Mute dependabot
- #linear-updates: Mute status changes
- Engineering: Mute between 6 PM - 9 AM

### Custom Keywords
Each user can set keywords:
- Founder: "investor", "revenue", "urgent"
- Engineers: Tech stack keywords
- Marketing: "campaign", "launch", "content"

## Escalation Path

1. **Level 1**: Channel notification
2. **Level 2**: DM to owner
3. **Level 3**: DM to team lead
4. **Level 4**: Call founder
5. **Level 5**: Page on-call engineer

## Do Not Disturb Rules

### Global DND
- 10 PM - 7 AM PST
- Weekends (except P0)
- Company holidays

### Override Keywords
These bypass DND:
- "emergency"
- "security"
- "down"
- "breach"
- "@channel urgent"
