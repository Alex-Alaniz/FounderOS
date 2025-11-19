# 🧠 FounderOS — Step 4 AGENT DIRECTIVE  
## CROSS-PRODUCT FOUNDER DASHBOARD  
### Unified Agent Protocol (Composer • Codex • Claude • GPT)

──────────────────────────────────────────────────────────────  
This file defines the **official Step 4 assignment** for all  
engineering agents working inside FounderOS.  
Each agent executes independently, produces output,  
and submits a PR using the FounderOS multi-agent workflow.  
──────────────────────────────────────────────────────────────  

# 🎯 MISSION OBJECTIVE
Build the **Founder Dashboard** — the executive cockpit of  
FounderOS — inside Notion and the Command Center.

This dashboard will unify data across:
- Products  
- Projects  
- Tasks  
- Team  
- CRM  
- Content Machine  
- Linear issues  
- GitHub PRs  

This is the source of truth for BearifiedCo’s execution engine.

---

# 🟦 GLOBAL TASK (ALL AGENTS)

Every agent (Composer, Codex, Claude, GPT) must:

1. Build the full **Top-Level Founder Dashboard** in Notion  
2. Build the **Embedded Executive Summary Dashboard**  
   inside the Command Center page  
3. Create a dedicated documentation file in `/notion/`  
4. Open a pull request  
5. Post completion message in Slack `#founder-os`

This is a **parallel multi-agent task** — each agent produces  
their own version. The Chairman merges the superior solution.

---

# 🧱 BLOCK A — BUILD TOP-LEVEL FOUNDER DASHBOARD  
## Page: `🧠 Founder Dashboard`

Create a full dashboard with the following sections & views:

---

## 1. **Cross-Product Roadmap (Timeline)**  
**Database:** Projects  
**View:** Timeline  
**Group:** Product  
**Sort:** Start Date  
**Fields:** Status, Priority, Start, End  
**Filter:** NONE  
(Shows all roadmap items across BEARO, AlphaBuilder, Chimpanion, etc.)

---

## 2. **Engineering Kanban (Execution Board)**  
**Database:** Tasks  
**View:** Board  
**Group:** Status  
**Filter:** Status != Done  
**Sort:** Priority (desc)  
**Badge:** Product + Project  

---

## 3. **Blockers & At-Risk Items**  
**Database:** Tasks  
**View:** List  
**Filters:**  
- Status = Blocked  
OR  
- Due Date < next 72 hours  

Fields to show: Blocked Reason, Owner, Product, Project  

---

## 4. **Agent Workload Overview (AI Ops Tracker)**  
**Database:** Tasks  
**View:** Table grouped by "Assigned To"  

Add fields:  
- `# of Tasks` (rollup)  
- Priority  
- Status  
- Product  

**Filter:** Status != Done

---

## 5. **Linear Issue Feed (Live Sync)**  
Create a synced database for Linear issues.  
Views required:

### (a) Full Active Issue List  
State != Done  

### (b) Engineering Board  
Group by: State  

### (c) Past-Due Queue  
Due Date < today  

---

## 6. **CRM Pipeline**  
**Database:** CRM  
**View:** Kanban grouped by Stage  
**Sort:** Last Contacted (desc)  

---

## 7. **Content Machine Calendar**  
**Database:** Content Machine  
**View:** Calendar  
**Filter:** NONE  

---

## 8. **GitHub PR Monitor**  
Track PRs for:  
https://github.com/Alex-Alaniz/FounderOS

Fields:
- PR Title  
- Branch  
- Author  
- Status  
- Link  
- Related Product (manual mapping)  

Views:
- Open PRs  
- Needs Review  
- Recently Merged  

---

# 🟩 BLOCK B — EMBEDDED DASHBOARD (Command Center Summary)

Inside the page:  
`FounderOS — BearifiedCo Command Center`

Insert a top-section block named:

### **🚀 Executive Summary Dashboard**

Include mini-views:

1. Cross-Product Roadmap (Timeline)  
2. Active Tasks (Kanban)  
3. Blockers  
4. Open PRs (GitHub)  
5. Linear Issue Count (summary metric)  
6. Upcoming Deadlines (7-day window)  

This must be positioned **at the top** of the Command Center.

---

# 🟧 BLOCK C — DOCUMENTATION REQUIREMENTS  
Each agent must create:

```
/notion/founder-dashboard-step4-[agent].md
```

This file MUST include:

- Summary of what the agent built  
- Screenshots or textual descriptions  
- Filters used  
- API limitations encountered  
- Manual steps required  
- Suggestions for Step 5 & Step 6  

All documentation must be clear, structured, and follow  
FounderOS engineering style.

---

# 🟥 BLOCK D — GITHUB PROTOCOL (MANDATORY)

Each agent must:

### 1. Create branch:
```
step4-founder-dashboard-[agent-name]
```

### 2. Add documentation file:
```
/notion/founder-dashboard-step4-[agent].md
```

### 3. Open PR titled:
```
Step 4 — Founder Dashboard (Agent: [Name])
```

### 4. Add labels:
- `step4`
- `notion`
- `dashboard`

### 5. DO NOT modify other agents' Step 4 files.

---

# 🟪 BLOCK E — SLACK NOTIFICATION  
Post in `#founder-os`:

```
Step 4 Founder Dashboard implementation completed.
PR ready for Chairman review.
Agent: [Name]
Branch: step4-founder-dashboard-[agent]
Link: <PR URL>
```

---

# 🟨 ASSIGNMENT DISTRIBUTION
This task is GLOBAL.

Every agent executes ALL tasks.  
No specialization for Step 4.

---

# 🔥 VALIDATION CHECKLIST (Chairman Only)

Founder Dashboard is approved when:

- All 8 dashboard views exist  
- All views are functional  
- Embedded dashboard appears in Command Center  
- Linear issue feed is visible  
- GitHub PR monitor displays correct data  
- Tasks are linked to Products and Projects  
- At least 2 agent PRs meet full fidelity  
- No broken relations or missing filters  

---

# 🧠 FounderOS Core Philosophy

“FounderOS exists so the Founder moves faster than  
humanly possible. We tighten the grip. We remove chaos.  
We build the world.”

──────────────────────────────────────────────────────────────  
**END OF AGENT DIRECTIVE — STEP 4**  
──────────────────────────────────────────────────────────────
