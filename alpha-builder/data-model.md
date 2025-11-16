# AlphaBuilder Data Model

## Core Entities

### Users
```typescript
interface User {
  id: string; // UUID
  email: string;
  name: string;
  company?: string;
  role: 'admin' | 'estimator' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  settings: UserSettings;
}

interface UserSettings {
  defaultOverheadPercent: number;
  defaultProfitPercent: number;
  defaultTaxRate: number;
  currency: string;
  timezone: string;
}
```

### Projects
```typescript
interface Project {
  id: string; // UUID
  userId: string; // Owner
  name: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  address: Address;
  status: ProjectStatus;
  overheadPercent: number;
  profitPercent: number;
  taxRate: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  wonAt?: Date;
  lostAt?: Date;
  expiresAt?: Date;
  totalAmount?: number; // Cached total
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

type ProjectStatus = 'draft' | 'submitted' | 'won' | 'lost' | 'archived';
```

### Trade Categories
```typescript
interface TradeCategory {
  id: string;
  projectId: string;
  name: string; // "Framing", "Electrical", etc.
  code: string; // "FRAM", "ELEC", etc.
  order: number; // Display order
  description?: string;
  color?: string; // For UI
  materialSubtotal: number; // Calculated
  laborSubtotal: number; // Calculated
  createdAt: Date;
  updatedAt: Date;
}
```

### Line Items
```typescript
interface LineItem {
  id: string;
  tradeCategoryId: string;
  code: string; // "FRAM-001"
  description: string;
  unit: UnitType;
  quantity: number;
  materialUnitCost: number;
  laborUnitCost: number;
  materialTotalCost: number; // quantity * materialUnitCost
  laborTotalCost: number; // quantity * laborUnitCost
  markup?: number; // Optional item-specific markup
  notes?: string;
  order: number;
  isOptional: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type UnitType = 'each' | 'sqft' | 'lnft' | 'hours' | 'days' | 
                 'cubic_yard' | 'ton' | 'gallon' | 'sheet' | 'bundle';
```

### Templates
```typescript
interface TradeTemplate {
  id: string;
  name: string;
  code: string;
  category: string;
  lineItemTemplates: LineItemTemplate[];
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LineItemTemplate {
  id: string;
  tradeTemplateId: string;
  code: string;
  description: string;
  unit: UnitType;
  defaultMaterialUnitCost: number;
  defaultLaborUnitCost: number;
  formula?: string; // For calculated quantities
  order: number;
}
```

### Calculations
```typescript
interface ProjectCalculation {
  projectId: string;
  materialSubtotal: number;
  laborSubtotal: number;
  combinedSubtotal: number;
  overheadAmount: number;
  profitAmount: number;
  subtotalWithMarkup: number;
  taxAmount: number;
  grandTotal: number;
  lastCalculatedAt: Date;
}

interface TradeCalculation {
  tradeCategoryId: string;
  materialSubtotal: number;
  laborSubtotal: number;
  lineItemCount: number;
  percentOfProject: number;
}
```

### Export History
```typescript
interface ExportHistory {
  id: string;
  projectId: string;
  userId: string;
  format: 'pdf' | 'excel' | 'csv';
  fileName: string;
  fileUrl?: string;
  emailedTo?: string;
  createdAt: Date;
  expiresAt?: Date; // For temporary URLs
}
```

### Audit Log
```typescript
interface AuditLog {
  id: string;
  userId: string;
  projectId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldValues?: object;
  newValues?: object;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

type AuditAction = 'create' | 'update' | 'delete' | 'export' | 
                    'share' | 'submit' | 'win' | 'lose';
```

## Relationships

```sql
-- Users -> Projects (1:many)
Users.id -> Projects.userId

-- Projects -> TradeCategories (1:many)
Projects.id -> TradeCategories.projectId

-- TradeCategories -> LineItems (1:many)
TradeCategories.id -> LineItems.tradeCategoryId

-- Projects -> ProjectCalculation (1:1)
Projects.id -> ProjectCalculation.projectId

-- TradeCategories -> TradeCalculation (1:1)
TradeCategories.id -> TradeCalculation.tradeCategoryId

-- Projects -> ExportHistory (1:many)
Projects.id -> ExportHistory.projectId

-- Users -> ExportHistory (1:many)
Users.id -> ExportHistory.userId

-- TradeTemplate -> LineItemTemplate (1:many)
TradeTemplate.id -> LineItemTemplate.tradeTemplateId
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_projects_user_status ON projects(userId, status);
CREATE INDEX idx_projects_updated ON projects(updatedAt DESC);
CREATE INDEX idx_trade_categories_project ON trade_categories(projectId, order);
CREATE INDEX idx_line_items_trade ON line_items(tradeCategoryId, order);
CREATE INDEX idx_audit_log_project ON audit_log(projectId, timestamp DESC);
CREATE INDEX idx_export_history_project ON export_history(projectId, createdAt DESC);

-- Search indexes
CREATE INDEX idx_projects_search ON projects(name, clientName);
CREATE INDEX idx_line_items_description ON line_items(description);
```

## Migrations

### V1 - Initial Schema
- Create all base tables
- Add foreign key constraints
- Create indexes

### V2 - Add Templates
- Create template tables
- Migrate existing data to templates
- Add template references

### V3 - Add Audit System
- Create audit log table
- Add triggers for audit logging
- Backfill critical actions

## Seed Data

### Default Trade Templates
1. Framing
2. Electrical
3. Plumbing
4. HVAC
5. Insulation
6. Drywall
7. Painting
8. Flooring
9. Roofing
10. Concrete

### Default Line Items per Trade
Each trade template includes 10-20 common line items with:
- Standard descriptions
- Default units
- Regional average costs
- Common formulas

### Sample Projects
3 sample projects in different stages:
1. "Sample Residential" - Draft status
2. "Sample Commercial" - Submitted status
3. "Sample Renovation" - Won status
