# 🧠 FounderOS — Step 4 Assignment  
## Build the Global Founder Dashboard (Mission-Critical)

### Assigned To:
- Composer-1 (Cursor Agent)
- Codex GPT-5.1 (High)
- Claude Opus 4.1 (Code Mode)
- GPT-5.1 (Supporting)
- Chairman: Alex Alaniz
- CEO: ChatGPT

---

# 🎯 Goal
Build the **Founder Dashboard** inside Notion — a unified cockpit that shows the status of ALL BearifiedCo products, teams, tasks, roadmaps, metrics, and community voting.

This is the most important page in the entire FounderOS system.

---

# 🟢 Context
- Steps **1, 2, and 3** are merged into `main`.
- All **Product Hubs** exist and include unfiltered linked views.
- Databases are live:
  - Products
  - Projects
  - Tasks
  - Team
  - CRM
  - Content Machine

Step 4 brings everything together.

---

# 🔥 OBJECTIVE: Build the Founder Dashboard

### Update the Notion page:
**🧠 Founder Dashboard — BearifiedCo Command Center**

with the following sections:

---

## 1. **Dashboard Header**
- Title:  
  **🧠 Founder Dashboard — BearifiedCo Command Center**
- Subtitle:  
  “Your real-time operating console for the entire Bearified ecosystem.”

---

## 2. **Global Linked Views (Across All Products)**

### (A) **Products Portfolio**
- View: Table
- Group: Status
- Fields:
  - Product Owner
  - Launch Date
  - Category
  - # Active Projects (rollup)

---

### (B) **Cross-Product Project Board**
- View: Board
- Group: Status  
- Sort: Priority  
- Filters: none

---

### (C) **Critical Tasks**
- View: Table
- Filters:
  - Priority = High OR Urgent  
  - Status != Done  
- Fields:
  - Assigned To
  - Related Project
  - Related Product
  - Due Date

---

### (D) **Team Bandwidth Overview**
- View: Table
- Fields:
  - Skills
  - Active Tasks (rollup)
  - Blocked Tasks (rollup)

---

## 3. **Roadmap & Feature Voting**

### (A) Roadmap Timeline  
- DB: Projects  
- View: Timeline  
- Filter: Status != Completed

### (B) Feature Voting Queue  
- DB: Tasks or Feature Requests  
- Fields:
  - Feature Name
  - Votes ($APES + $BEARCO)
  - Product
  - Priority
  - Status

### (C) Publish-Ready Public Roadmap  
Create sub-page:
**📢 Public Roadmap (Auto-Sync)**  
(Will be used for embedding on website)

---

## 4. **Marketing Dashboard (Content Machine)**

Views:
- Calendar (Content This Week)
- Status Pipeline (Idea → Draft → Edit → Scheduled → Published)
- Metrics View:
  - Channel
  - Reach
  - CTA Target (BEARO / AlphaBuilder / Primape / Chimpanion)

---

## 5. **Engineering Ops (Linear Integration)**

Views:
- Linear Tickets (Synced)
- Priority Engineering Tasks
- Bugs (Label: bug)
- Blockers (Tasks with Status = Blocked)
- Sprint Planning View

---

## 6. **Token Ecosystem Metrics (Placeholder)**

Fields:
- $APES Market Cap
- $BEARCO Market Cap
- LPs
- Holders
- Staking Stats  
(To be populated in Step 6 or via MCP agents)

---

## 7. **Reserved: Weekly Founder Summary (Auto-Generated in Step 6)**

Do NOT implement this yet.
This will automatically summarize:
- project progress  
- top priorities  
- blockers  
- content metrics  
- token KPIs  

---

# 🛠️ Execution Workflow — MUST FOLLOW

1. Create a new branch:  
   `step4-founder-dashboard-[agent-name]`

2. Create documentation file:  
   `/notion/founder-dashboard-step4-[agent-name].md`

3. Include:
   - Notion page links  
   - Database view specs  
   - Any manual steps (due to API limits)  
   - Implementation checklist

4. Push branch to GitHub.

5. Open a pull request:
   Title: **Step 4 — Founder Dashboard (Agent: [name])**
   Base: main

6. Post “Step 4 complete — ready for Chairman review” in PR description.

---

# ✔️ Deliverables Checklist

### Agents must deliver:
- [ ] Updated Notion page  
- [ ] 6 global linked views  
- [ ] Roadmap + Voting section  
- [ ] Content Machine dashboard  
- [ ] Engineering Ops views  
- [ ] Token Metrics placeholders  
- [ ] Documentation file  
- [ ] Pull Request  

---

# 🧬 Notes
- Notion API cannot apply filters programmatically.  
  **Agents must document filters for manual setup.**
- Do NOT touch Steps 5 and 6 yet.  
- All work MUST comply with FounderOS conventions defined in Step 1–3.

---

# 🚀 Completion
When PR is open and ready:
Comment in PR:

**“Step 4 implementation complete — ready for Chairman review.”**

