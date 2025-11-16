# Roadmaps Database (Notion Blueprint)

## Schema

### Properties
- **Title** (Title)
- **Product** (Select: BEARO, AlphaBuilder, Primape, Chimpanion)
- **Quarter** (Select: Q1 2025, Q2 2025, Q3 2025, Q4 2025)
- **Status** (Select: Planning, In Spec, In Progress, Shipped, Delayed)
- **Priority** (Select: P0-Critical, P1-High, P2-Medium, P3-Low)
- **Owner** (Person)
- **Linear Epic** (URL)
- **GitHub Milestone** (URL)
- **Target Date** (Date)
- **Completion %** (Number)
- **Dependencies** (Relation to self)

## Views

1. **Current Quarter** - Filtered by current quarter, grouped by Product
2. **By Product** - Grouped by Product, then Status
3. **Timeline** - Calendar view by Target Date
4. **Blockers** - Filtered by Status = Delayed
5. **Shipped** - Gallery of completed features

## Automations

- Status "In Spec" → Create Linear Epic
- Status "Shipped" → Archive after 30 days
- Weekly summary to Slack #product-updates
