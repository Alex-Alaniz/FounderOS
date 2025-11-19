# Step 3 — Product Hubs (Codex GPT-5.1 High)

## ✅ Deliverables Implemented
- Structured hero + navigation layout on every Product Hub page.
- Embedded database blocks (Projects, Tasks, Team, CRM, Content Machine) on each hub to host linked views.
- Documented filter/grouping targets per database so the views stay consistent as data grows.

| Product Hub | Notion URL |
|-------------|------------|
| BEARO | https://www.notion.so/2ad6468866ef812393d9deb1afd2c6a1 |
| AlphaBuilder | https://www.notion.so/2ad6468866ef81dabe13e7d460dda8cd |
| Primape | https://www.notion.so/2ad6468866ef812fb626f4d6487fdc5e |
| Chimpanion | https://www.notion.so/2ad6468866ef81c79e89c054adcf539c |
| BEARCO Ecosystem | https://www.notion.so/2ad6468866ef81b3ab2ce1f82cd83f7f |

## 🔗 View Specifications
Each hub now hosts five dedicated sections with embedded database blocks. The target configuration per view:

1. **Projects (Board)**
   - Filter: `Product == <Hub Product>`
   - Group by: `Status`
   - Visible props: `Priority`, `Quarter`, `Start Date`, `End Date`
2. **Tasks (Kanban)**
   - Filter: tasks whose related projects belong to `<Hub Product>`
   - Group by: `Status`
   - Visible props: `Due Date`, `Assignee`, `Priority`
3. **Team (Table)**
   - Filter: contributors actively assigned to `<Hub Product>` (via task assignments or manual tagging)
   - Fields: `Name`, `Role`, `Slack ID`, `Active`, `# of Tasks (rollup)`
4. **CRM (Table)**
   - Filter: opportunities where `Product` relation includes `<Hub Product>`
5. **Content Machine (Calendar)**
   - Filter: `Product == <Hub Product>`

> **Note:** Linked database filters/rollups are documented above; the Notion MCP interface currently exposes block creation but not fine-grained view editing. Filters/groupings should be applied directly in Notion UI by selecting each embedded block and configuring the saved view.

## 🔬 Verification Checklist
- [x] All five hub pages contain hero description + navigation section.
- [x] Projects/Tasks/Team/CRM/Content Machine blocks embedded on every page.
- [ ] Board/Kanban/Table/Calendar views configured with the filters listed above (requires in-app confirmation).
- [ ] Team rollup (`# of Tasks`) wired once schema exposes the necessary relation.

## 📓 Follow-ups / Known Gaps
1. Team database currently lacks a relation to Tasks, so the rollup + automatic filtering needs a schema update before it can be fully automated.
2. Notion MCP API does not yet allow programmatic editing of linked view filters; configure filters once via the Notion UI and they will persist.
3. Additional sample data for non-BEARO products will help validate that each view narrows correctly.

Once the above follow-ups are handled in the workspace UI, the hubs will operate as product-specific control centers that inherit live data from the six Step-2 databases.

