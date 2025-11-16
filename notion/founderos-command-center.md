# FounderOS — BearifiedCo Command Center

This document captures exactly how to implement **Step 2 — Notion Architecture** from the FounderOS Implementation Plan. Share it with the exec team while you build the workspace so the schema, relations, and starter content stay 1:1 with the blueprint.

---

## 1. Central Page Layout

| Area | What To Add | Notes |
| --- | --- | --- |
| **Hero section** | Title `FounderOS — BearifiedCo Command Center`, mission statement, CTA buttons to Linear, Slack `#founder-os`, GitHub | Pin this page to the workspace sidebar and grant edit access to the exec & ops pods. |
| **Blueprint reference** | Paste the Step 1 architecture summary (agents, integrations, automation rules). Use toggles or callouts for each domain (Slack/Linear/GitHub/Notion). | Keeps the canonical schema visible while building. |
| **Quick links** | Buttons/links to Products, Projects, Tasks, Team, CRM, Content Machine DBs plus Founder Dashboard. | Add an inline table-of-contents block for quick scanning. |
| **Status callout** | Checklist for Step 2 milestones (Databases, Sample Data, Product Hubs, Dashboard stub). | Update this as each milestone ships so the Chairman has instant context. |

---

## 2. Core Database Schemas

Create each database as a full-page database under the Command Center and be precise with property types/options.

### 🗂 Products

| Property | Type | Options / Description |
| --- | --- | --- |
| Name | Title | Product / initiative name. |
| Description | Text | 1–2 sentence summary + success metric. |
| Product Lead | Person (or Relation → Team) | Whoever owns delivery. |
| Status | Select | `Ideation`, `In Development`, `Launched`, `On Hold`. |
| Launch Date | Date | Target beta/GA. |
| GTM Tier | Select | `Core`, `Incubation`, `Sunset` (optional). |
| Related Projects | Relation → Projects | Auto-populated reciprocal view lives in Projects. |
| Related Tasks (optional) | Relation → Tasks | Use if certain tasks bypass projects. |
| Slack Channel | Text | e.g. `#bearo-product`. |

### 🗂 Projects

| Property | Type | Options / Description |
| --- | --- | --- |
| Name | Title | Project / epic. |
| Description & Goals | Text | Include success metric & exit criteria. |
| Status | Select | `Not Started`, `In Progress`, `Blocked`, `Completed`, `Archived`. |
| Owner | Person / Relation → Team | DRI for the project. |
| Product | Relation → Products | Mandatory. |
| Start Date | Date | |
| End Date | Date | |
| Related Tasks | Relation → Tasks | Reciprocal view appears in Tasks. |
| % Done | Rollup | Roll up completed tasks / total tasks (formula). |
| Linear Epic | URL | Link to Linear epic. |

### 🗂 Tasks

| Property | Type | Options / Description |
| --- | --- | --- |
| Name | Title | Task or user story. |
| Details | Text | Acceptance criteria / links. |
| Status | Status property | `Backlog`, `Ready`, `In Progress`, `Blocked`, `Done`. |
| Priority | Select | `P0`, `P1`, `P2`, `P3`. |
| Due Date | Date | |
| Assignee | Person / Relation → Team | Required for accountability. |
| Project | Relation → Projects | Filtered views power each Product Hub. |
| Product | Relation → Products (optional) | Useful for cross-project chores. |
| Linear Issue | URL | Deep link for bi-directional traceability. |
| GitHub PR | URL | Optional. |

### 🧑‍🤝‍🧑 Team

| Property | Type | Options / Description |
| --- | --- | --- |
| Name | Title | Member name. |
| Role / Title | Text | e.g. Head of Product. |
| Department | Select | `Product`, `Engineering`, `Design`, `Ops`, `Growth`. |
| Email | Email | |
| Time Zone | Text | Helps when coordinating standups. |
| Slack Handle | Text | `@alex`. |
| Start Date | Date | |
| Status | Select | `Full-Time`, `Contract`, `Advisor`, `Alumni`. |
| Products | Multi-select | Products they support. |
| Linear Handle | Text | Optional for automation. |

### 🗂 CRM (Optional for AlphaBuilder v1)

| Property | Type | Options / Description |
| --- | --- | --- |
| Name | Title | Person or company. |
| Email | Email | |
| Company | Text | |
| Type | Select | `Lead`, `Customer`, `Partner`, `Investor`, `Advisor`. |
| Status | Select | `Active`, `Nurturing`, `Cold`, `Converted`. |
| Product Interest | Multi-select | BEARO, AlphaBuilder, Primape, Chimpanion. |
| Source | Select | `Inbound`, `Outbound`, `Referral`, `Event`. |
| Last Contact | Date | |
| Owner | Person / Relation → Team | |
| Notes | Rich Text | |
| Deal Value | Number ($) | Optional. |
| Gmail Thread | URL | Link to conversation. |

### 🗂 Content Machine

Schema already lives in `notion/content-machine.md`. Embed that page or replicate the properties here so the calendar, Kanban, and product filters match the blueprint.

---

## 3. Relations & Validation

1. **Products ↔ Projects**: Set the Projects `Product` relation to Products. Rename the reciprocal property in Products to `Projects`.  
2. **Projects ↔ Tasks**: Tasks `Project` relation connects to Projects. Rename reciprocal to `Tasks`.  
3. **Products ↔ Tasks (optional)**: Adds flexibility for chores that skip projects.  
4. **Tasks ↔ Team (Assignee)**: If you prefer, set `Assignee` to Relation → Team instead of Person so you can roll up work per teammate.  
5. **CRM ↔ Products (optional multi-select)**: Use multi-select tags or add a relation if you want to see which leads belong to which product.  

After adding each relation, create a quick filtered view in the receiving database to prove the linkage works (e.g., open a Project and ensure the `Tasks` sub-table auto-populates).

---

## 4. Sample Data (for verification)

Populate these entries to confirm filters, rollups, and hub templates work:

| Object | Sample Values | Linked Items |
| --- | --- | --- |
| **Product** | Name: **BEARO**. Description: “Self-custodial payment app for local businesses.” Status: `In Development`. Product Lead: *Nia Carter*. Launch Date: `2025-02-03`. Slack: `#bearo-product`. | Links to Project **“BEARO v1 Payment Flows”**. |
| **Project** | Name: **BEARO v1 Payment Flows**. Status: `In Progress`. Owner: *Nia Carter*. Product: BEARO. Dates: `2024-12-01 → 2025-02-15`. Linear Epic: `https://linear.app/bearifiedco/BEARO-101`. | Auto-rolls up Tasks below. |
| **Task A** | Name: **Design KYC + onboarding spec**. Status `In Progress`. Priority `P1`. Due `2024-12-08`. Assignee: *Nia Carter*. Project: BEARO v1 Payment Flows. | Linear issue link placeholder. |
| **Task B** | Name: **Integrate Plaid sandbox**. Status `Backlog`. Priority `P0`. Due `2024-12-15`. Assignee: *Leo Martin*. Project: BEARO v1 Payment Flows. | Same relation structure. |
| **Team Member** | Name: **Nia Carter**. Role: Product Lead. Dept: Product. Email: `nia@bearified.co`. Slack: `@nia`. Status `Full-Time`. Products: BEARO. | Appears as Product Lead + Task assignee. |

Once these rows exist, open the BEARO product page and confirm the template shows the linked Projects and Tasks filtered to BEARO automatically.

---

## 5. Product Hub Templates & Step 3 Prep

Create a Products database template called `📊 Product Hub Template` that injects the following sections whenever a product entry is opened:

1. **Projects Board** – linked Projects DB, filtered `Product = current page`, board view grouped by Status.  
2. **Tasks List** – linked Tasks DB filtered by `Project.Product = current page`, list view sorted by Due Date.  
3. **Milestones** – rollup summary from Projects `% Done`.  
4. **Key Resources** – callout block for GitHub repo, Linear team, Slack channel, Figma.  

Prepare empty stubs (pages or simply apply the template) for:

- **BEARO Hub**  
- **AlphaBuilder Hub**  
- **Primape Hub**  
- **Chimpanion Hub**  
- **BEARCO Ecosystem Hub**

Leave content placeholders that say “Populated in Step 3” so the team knows these will be fleshed out later.

---

## 6. Founder Dashboard Stub (Step 4 Placeholder)

Create a page `🧠 Founder Dashboard` under the Command Center with empty sections:

1. **Key Projects Board** – linked Projects view filtered to `Status != Completed`.  
2. **Upcoming Tasks** – linked Tasks view filtered to `Due Date within next 7 days` OR `Priority <= P1`.  
3. **CRM Highlight** – linked CRM view filtered to `Status = Active`.  
4. **Content Pipeline** – linked Content Machine Kanban filtered to `Status != Posted`.  
5. **Product Quick Links** – buttons to each product hub.  
6. **CEO Notes** – simple callout/text area for daily updates.  

Add a banner callout: “Dashboard visuals populated in Step 4 once data is flowing.”

---

## 7. Handoff Checklist

- [ ] Command Center page created & shared.  
- [ ] All six databases exist with exact schemas.  
- [ ] Relations validated via the sample BEARO data.  
- [ ] Product Hub template applied to every product + Step 3 stubs ready.  
- [ ] `🧠 Founder Dashboard` stub created and linked from the Command Center.  
- [ ] Slack update drafted for `#founder-os`: “Step 2 Notion databases + sample data complete. Ready for Step 3 (Product hubs).”  

Once the above is green, reply to the Chairman with the Command Center link and move to Step 3 implementation.
