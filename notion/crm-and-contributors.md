# CRM and Contributors Database (Notion Blueprint)

## CRM Database Schema

### Properties
- **Name** (Title)
- **Email** (Email)
- **Company** (Text)
- **Type** (Select: Lead, Customer, Partner, Investor, Advisor)
- **Status** (Select: Active, Nurturing, Cold, Converted)
- **Product Interest** (Multi-select: BEARO, AlphaBuilder, Primape, Chimpanion)
- **Source** (Select: Inbound, Outbound, Referral, Event)
- **Last Contact** (Date)
- **Notes** (Rich Text)
- **Deal Value** ($Number)
- **Gmail Thread** (URL)

## Contributors Database Schema

### Properties
- **Name** (Title)
- **Role** (Select: Developer, Designer, Marketer, Advisor, Community)
- **GitHub** (URL)
- **Discord/Telegram** (Text)
- **Skills** (Multi-select tags)
- **Products** (Multi-select: BEARO, AlphaBuilder, Primape, Chimpanion)
- **Status** (Select: Active, Occasional, Alumni)
- **Compensation** (Select: Token, Cash, Equity, Volunteer)
- **Linear Access** (Checkbox)
- **Start Date** (Date)

## Views
- Active Pipeline (CRM)
- Contributors by Product
- Token Recipients
- Weekly Active Contributors
