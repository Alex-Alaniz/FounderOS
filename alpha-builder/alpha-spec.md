# AlphaBuilder — MVP Specification

## Summary

Construction estimating tool based on Excel workbook "Bid Template.xlsm".
Goal: Replace the workbook with a database + UI + PDF export system.

## Core MVP Features

1. Project creation
2. Add trades (Framing, Insulation, Drywall, etc.)
3. Line item quantity inputs
4. Auto labor/material calculations
5. Summary totals
6. Export PDF matching current layout

## Data Model

### Project
- id: UUID
- name: string
- address: string
- client: string
- created_at: timestamp
- updated_at: timestamp
- status: enum (draft, submitted, won, lost)

### Trade
- id: UUID
- project_id: UUID
- name: string (Framing, Insulation, etc.)
- order: integer
- subtotal_materials: decimal
- subtotal_labor: decimal

### LineItem
- id: UUID
- trade_id: UUID
- description: string
- unit: string
- quantity: decimal
- material_rate: decimal
- labor_rate: decimal
- material_total: decimal (calculated)
- labor_total: decimal (calculated)

### QuantityInput
- id: UUID
- line_item_id: UUID
- name: string
- value: decimal
- unit: string

### Totals
- project_id: UUID
- materials: decimal
- labor: decimal
- overhead: decimal
- profit: decimal
- grand_total: decimal

### User
- id: UUID
- email: string
- name: string
- company: string
- role: enum (admin, estimator, viewer)

## Screens

### 1. Project List
- Table of projects
- Status filters
- Search by name/client
- New project button
- Actions: Edit, Clone, Delete, Export

### 2. New/Edit Project
- Project details form
- Client information
- Job site address
- Project settings (overhead %, profit %)

### 3. Trade Input Screen
- Trade selector dropdown
- Line items table
- Quantity inputs
- Real-time calculation
- Save & Continue button

### 4. Summary Screen
- All trades overview
- Total by trade
- Grand totals
- Adjustments
- Notes section

### 5. Export Screen
- Preview PDF
- Download options
- Email to client
- Save to cloud

## API (Draft)

```
GET /projects
POST /projects
GET /projects/:id
PUT /projects/:id
DELETE /projects/:id

GET /projects/:id/trades
POST /projects/:id/trades
PUT /projects/:id/trades/:tradeId
DELETE /projects/:id/trades/:tradeId

GET /projects/:id/line-items
POST /projects/:id/line-items
PUT /projects/:id/line-items/:itemId

GET /projects/:id/totals
POST /projects/:id/calculate

POST /projects/:id/export
GET /projects/:id/export/:format (pdf, excel, csv)
```

## Technical Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- React Hook Form
- Tanstack Query

### Backend
- Next.js API routes
- Prisma ORM
- PostgreSQL
- NextAuth.js for auth
- React PDF for exports

### Infrastructure
- Vercel hosting
- Vercel Postgres
- Vercel Blob (file storage)
- SendGrid (email)

## Excel Migration

Map Excel formulas to database:
1. Parse Bid_Template.xlsm
2. Extract all trades/categories
3. Map formulas to calculation engine
4. Create seed data
5. Validate calculations match Excel

## MVP Milestones

### Phase 1: Foundation (Week 1-2)
- Database schema
- Auth system
- Project CRUD
- Basic UI shell

### Phase 2: Trade System (Week 3-4)
- Trade templates
- Line items
- Quantity inputs
- Calculations

### Phase 3: Export System (Week 5-6)
- PDF generation
- Excel export
- Email integration
- Cloud storage

### Phase 4: Polish (Week 7-8)
- UI/UX improvements
- Mobile responsive
- Performance optimization
- User testing

## Success Metrics

- Load time <2 seconds
- PDF export <5 seconds
- 100% calculation accuracy vs Excel
- Mobile responsive
- Multi-user support
- 99.9% uptime
