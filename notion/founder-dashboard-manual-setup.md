# Founder Dashboard — Manual Setup Guide

## 📋 Overview

This guide provides step-by-step instructions for manually configuring the Founder Dashboard in Notion, as the Notion MCP API has limitations for creating linked database views with filters.

---

## 🎯 Step 1: Update Founder Dashboard Page

### Location
Page: `🧠 Founder Dashboard`  
URL: https://www.notion.so/2ad6468866ef81e585a6dccc74c9042e

### Content to Add

Replace the current placeholder content with the structure documented in `notion/founder-dashboard-step4-composer.md`.

**Key Sections:**
1. Cross-Product Roadmap (Timeline)
2. Engineering Kanban (Execution Board)
3. Blockers & At-Risk Items
4. Agent Workload Overview
5. Linear Issue Feed (Live Sync)
6. CRM Pipeline
7. Content Machine Calendar
8. GitHub PR Monitor

### Adding Linked Database Views

For each section that requires a database view:

1. **Type `/linked`** in the page
2. **Select "Create linked database"**
3. **Choose the appropriate database:**
   - Projects → `🗂 Projects`
   - Tasks → `🗂 Tasks`
   - CRM → `🗂 CRM`
   - Content Machine → `🗂 Content Machine`

4. **Configure the view:**
   - Click the "..." menu on the view
   - Select "Edit view"
   - Set view type (Timeline/Board/List/Table/Kanban/Calendar)
   - Add filters as specified
   - Set grouping and sorting
   - Configure display properties

---

## 🎯 Step 2: Add Embedded Dashboard to Command Center

### Location
Page: `FounderOS — BearifiedCo Command Center`  
URL: https://www.notion.so/2ad6468866ef81a0926dd83a9e721984

### Action Required

1. **Scroll to the top** of the Command Center page
2. **Add a new section** titled: `🚀 Executive Summary Dashboard`
3. **Add mini-views** for:
   - Cross-Product Roadmap (Timeline) — condensed
   - Active Tasks (Kanban) — filtered to active
   - Blockers — critical items only
   - Open PRs (GitHub) — placeholder until integration
   - Linear Issue Count — summary metric (placeholder)
   - Upcoming Deadlines — 7-day window

### Mini-View Configuration

For each mini-view:
- Use `/linked` command
- Select appropriate database
- Apply filters as specified
- Resize to fit in summary section

---

## 🎯 Step 3: Add Missing Fields to Tasks Database

### Required Fields

1. **Blocked Reason**
   - Type: Text
   - Description: Reason why task is blocked

2. **Product** (Rollup)
   - Type: Rollup
   - Relation: Project → Product
   - Function: Show original

### Steps

1. Open Tasks database
2. Click "..." menu → "Edit property"
3. Add new property: `Blocked Reason` (Text)
4. Add new property: `Product` (Rollup)
   - Select relation: Project
   - Select property: Product
   - Function: Show original

---

## 🎯 Step 4: Configure Views with Filters

### Projects Timeline View

- **View Type:** Timeline
- **Group By:** Product
- **Sort:** Start Date (ascending)
- **Filter:** None
- **Display:** Status, Priority, Start Date, End Date

### Tasks Board View

- **View Type:** Board
- **Group By:** Status
- **Filter:** Status != Done
- **Sort:** Priority (descending)
- **Display:** Product, Project, Assignee, Due Date

### Tasks Blockers View

- **View Type:** List
- **Filters:**
  - Status = Blocked
  - OR Due Date < next 72 hours
- **Display:** Blocked Reason, Owner, Product, Project, Due Date

### Tasks Workload View

- **View Type:** Table
- **Group By:** Assignee
- **Filter:** Status != Done
- **Display:** # of Tasks (rollup), Priority, Status, Product

### CRM Kanban View

- **View Type:** Kanban
- **Group By:** Status
- **Sort:** Last Contact (descending)
- **Display:** Company Name, Contact Name, Product, Email

### Content Machine Calendar View

- **View Type:** Calendar
- **Filter:** None
- **Display:** Title, Type, Status, Publish Date, Product

---

## ⚠️ Integration Setup (Future)

### Linear Integration

**Status:** ✅ Linear Issues database already exists

1. **Add Linked Database View to Founder Dashboard:**
   - Type `/linked` in Founder Dashboard page
   - Select "📋 Linear Issues (Manual Sync)" database
   - Database URL: https://www.notion.so/a256468f56d145f0a17d4ed8628daeaa

2. **Configure Views:**
   - **Full Active Issue List:** Filter: State != Done
   - **Engineering Board:** View Type: Board, Group by: State
   - **Past-Due Queue:** Filter: Due Date < today

3. **Future Automation:**
   - Linear API key available for automated sync
   - Can implement bidirectional sync later

### GitHub Integration

1. Set up GitHub API connection
2. Create database for PR tracking
3. Configure views:
   - Open PRs
   - Needs Review
   - Recently Merged

---

## ✅ Verification Checklist

- [ ] Founder Dashboard page updated with all 8 sections
- [ ] All linked database views added
- [ ] All filters configured correctly
- [ ] Embedded dashboard added to Command Center
- [ ] Missing fields added to Tasks database
- [ ] Rollup fields configured
- [ ] Views display correct data
- [ ] Quick Metrics section functional

---

**Estimated Time:** 2-3 hours  
**Priority:** High (blocks Step 4 completion)

