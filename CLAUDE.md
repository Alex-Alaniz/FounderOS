# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FounderOS** is the unified operating system for all BearifiedCo projects. It integrates multiple platforms (Slack, Notion, Linear, GitHub, Gmail) and serves as the central system for architecture, automation, and product specifications.

This repository stores:
- Agent instructions and roles
- Automation rules
- Architecture diagrams
- Roadmap management (Notion)
- Product specifications
- Observability plans
- Integration configurations

### Key Products
FounderOS powers these products:
- BEARO (payments app)
- AlphaBuilder (construction estimating)
- Primape (prediction gaming)
- Chimpanion (wallet assistant)
- BEARCO/APES token ecosystem

## Repository Structure

```
/agents            — AI agent definitions and roles
  /claude-code-agents.md    — Claude Code's role and responsibilities
  /cursor-agents.md         — Cursor agent assignments
  /founder-step-*-task.md   — Task briefs for implementation phases
/notion            — Notion workspace architecture and specs
/linear            — Linear workflow specs, labels, and team structure
/slack             — Slack automation rules and integration configs
/gmail             — CRM automation for email
/alpha-builder     — MVP specs for Construction AI app
/observability     — Datadog integration plans and metrics
```

## Development Workflow

### Current Implementation Phase: Step 4

**Status**: Step 3 (Product Hubs) merged to main. Step 4 (Founder Dashboard) in progress.

**Key Phases Completed**:
1. ✅ Step 1: Repository blueprint and multi-agent system architecture
2. ✅ Step 2: Notion workspace with 6 core databases
3. ✅ Step 3: Product Hub pages for all 5 products (PR #7 merged as base)
4. 🟢 Step 4: Founder Dashboard implementation (in progress)

**Current Tasks**:
- See `agents/founder-step-4-task.md` for full Founder Dashboard requirements
- See `agents/founder-dashboard-step4.md` for implementation guide
- Implement Linear API integration (critical gap from Step 3)

### Git Workflow

1. **Branch naming**: Use descriptive names aligned with task phases (e.g., `step4-founder-dashboard`, `linear-integration`)
2. **Commits**: Include meaningful messages referencing task/step context
3. **PRs**: Merge to `main` when step is complete
4. **Documentation**: Update relevant step completion files when milestones are reached

### Documentation Updates

When completing tasks, update:
- `/notion/step[N]-completion.md` — Completion summary and verification checklist
- Task files in `/agents/` — Mark as complete with notes
- Integration guides in relevant directories

## Claude Code's Role

**Claude Code = Chief Product & Technical Spec Officer**

Responsibilities:
1. **Transform vague ideas** into:
   - Product specifications
   - API designs
   - Data models
   - User flows
   - Edge-case diagrams
   - Feature documentation

2. **Maintain core documentation files**:
   - `/alpha-builder/` — Construction AI specs
   - `/notion/` — Notion architecture and specs
   - `/linear/` — Linear integration and workflow specs

3. **Support implementation phases**:
   - Review task requirements in `/agents/` directory
   - Ensure specifications are clear before implementation
   - Document completion and learnings

## Key Integration Points

### Notion Integration
- **Primary Database**: FounderOS workspace
- **Core Databases**: Projects, Tasks, Team, CRM, Content Machine
- **Current Status**: All 5 Product Hubs created (Step 3)
- **Limitation**: Notion API cannot apply filters programmatically (manual step required)
- **Next Step**: Implement Founder Dashboard with linked views and rollups

### Linear Integration
- **Status**: ⚠️ Critical gap identified in Step 3 (not yet integrated)
- **Requirement**: Implement Linear API integration for autonomous work cycles
- **Phase 1**: Basic read-only integration with metrics display
- **Phase 2**: Bidirectional sync (create/update/complete issues)
- **Resources**: See `LINEAR-INTEGRATION-EVALUATION.md` for technical analysis

### Slack Integration
- Rules and automation configurations in `/slack/`
- Used for async updates and notifications

### Gmail Integration
- CRM automation rules in `/gmail/`
- Inbound lead handling

## Important Files & References

### Task & Phase Documentation
- `STEP-3-TO-STEP-4-TRANSITION.md` — Complete Phase 3→4 transition summary
- `agents/founder-step-4-task.md` — Full Step 4 requirements and acceptance criteria
- `agents/founder-dashboard-step4.md` — Implementation details for dashboard
- `LINEAR-INTEGRATION-EVALUATION.md` — Technical evaluation of Linear integration approach
- `notion/step3-completion.md` — Step 3 completion summary with verification checklist

### Architecture Documents
- `notion/notion-architecture.md` — Core Notion workspace structure
- `notion/products-hierarchy.md` — Product relationships and hierarchy
- `notion/product-hub-templates.md` — Product Hub page structure
- `notion/founder-dashboard.md` — Founder Dashboard blueprint specs
- `alpha-builder/` — Construction AI product specifications

### Configuration Files
- `linear/` — Linear team structure, projects, labels, and workflows
- `slack/` — Slack automation and notification rules
- `observability/` — Datadog integration and metrics
- `agents/` — Agent assignments and workflow definitions

## Common Tasks

### Viewing Current Phase Status
```
# Check Step 3 completion and next steps
cat STEP-3-TO-STEP-4-TRANSITION.md

# View Step 4 requirements
cat agents/founder-step-4-task.md
```

### Implementing a New Feature/Task
1. Read the task brief in `/agents/` (e.g., `founder-step-4-task.md`)
2. Review existing architecture docs in `/notion/` to understand current state
3. Implement changes across relevant directories (Notion, Linear, etc.)
4. Update `/notion/step[N]-completion.md` with completion summary
5. Create a PR with descriptive commit messages

### Documenting a New Integration
1. Create a specification file in the appropriate directory
2. Document in the relevant agent assignment (e.g., `/agents/founder-step-X-task.md`)
3. Include implementation requirements and success criteria
4. Reference in the step completion documentation

### Adding a New Product
1. Ensure entry exists in Notion Products database
2. Create Product Hub page following templates in `notion/product-hub-templates.md`
3. Add navigation links in Founder Dashboard
4. Update `notion/products-hierarchy.md`

## Critical Gaps to Address

### 1. Linear Integration
- **Status**: Not yet implemented (gap identified in Step 3)
- **Impact**: Agents cannot create/complete tasks in Linear programmatically
- **Action**: Implement as part of Step 4
- **Resources**: `LINEAR-INTEGRATION-EVALUATION.md`

### 2. Team-Tasks Relation
- **Status**: May be missing from Notion schema
- **Impact**: Cannot calculate team velocity or per-person metrics
- **Action**: Add relation and update Founder Dashboard

### 3. Financial Data Integration
- **Status**: Not yet tracked in Notion
- **Impact**: Financial KPIs not available in Founder Dashboard
- **Action**: Define financial tracking system and integrate

## Model Benchmarking Insights (Step 3)

Different AI models excel in different areas:
- **Composer**: Fast scaffolding and structure
- **Claude Opus**: Balanced quality and documentation
- **Codex GPT-5.1**: Comprehensive foresight and long-term maintainability

**Recommendation**: Combine strengths going forward (speed + quality + documentation).

## Success Criteria for Current Phase

Step 4 (Founder Dashboard) is successful when:
- ✅ Dashboard displays all critical KPIs
- ✅ Linked views embedded and filtered correctly
- ✅ Linear integration enables autonomous work cycles
- ✅ Product comparison visible across all 5 products
- ✅ Alert & action items highlight urgent work
- ✅ Dashboard updates automatically from source data
- ✅ Visual hierarchy guides attention to critical information

## Notes for Future Instances

1. **Notion API Limitation**: Cannot apply filters programmatically. Manual filter configuration in Notion UI is required for linked views.

2. **Documentation Pattern**: Major phases include completion summary files (`step[N]-completion.md`) with implementation details and verification checklists.

3. **Agent Structure**: Each implementation phase has a corresponding task brief in `/agents/` with detailed requirements and acceptance criteria.

4. **Multi-Platform Mindset**: FounderOS decisions often affect multiple platforms (Notion, Linear, Slack, GitHub) simultaneously. Consider cross-platform impacts.

5. **Current Priority**: Linear integration is the critical gap preventing autonomous work cycles. This should be high priority in Step 4 completion.
