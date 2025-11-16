# Gmail → CRM Automation Rules

## Inbound Email Processing

### Lead Capture Rules

#### Rule 1: New Inquiry
**Trigger**: Email to hello@bearified.co, info@*, contact@*  
**Conditions**: From unknown sender  
**Actions**:
1. Create CRM entry in Notion
2. Set Type = "Lead"
3. Set Status = "New"
4. Parse email for:
   - Company (from domain)
   - Product interest (keywords)
   - Urgency (subject line)
5. Notify #sales Slack channel
6. Auto-reply with template

#### Rule 2: Customer Email
**Trigger**: Email from known customer (in CRM)  
**Actions**:
1. Update "Last Contact" in CRM
2. Add to customer thread in Notion
3. If contains "problem", "issue", "bug":
   - Create Linear issue
   - Alert #customer-support
4. Tag for human review

#### Rule 3: Investor Email
**Trigger**: Email from VC domains or contains "invest", "fund"  
**Actions**:
1. Priority flag
2. Forward to founder immediately
3. Create CRM entry with Type = "Investor"
4. Add to #founders Slack
5. Calendar link for meeting

## Email Templates

### Auto-Responses

#### New Lead
```
Subject: Thanks for reaching out to BearifiedCo!

Hi {name},

Thanks for your interest in {detected_product}!

We've received your message and will respond within 24 hours.

In the meantime:
- Check out our docs: {docs_link}
- Join our Discord: {discord_link}
- Book a demo: {calendar_link}

Best,
The BearifiedCo Team
```

#### Support Ticket Created
```
Subject: Support Ticket #{ticket_id} Created

Hi {name},

We've received your support request and created ticket #{ticket_id}.

Expected response time: {sla_time}
Priority: {priority}

You can track your ticket: {linear_link}

Best,
Support Team
```

## Parsing Rules

### Product Detection
Keywords → Product mapping:
- "payment", "checkout", "card" → BEARO
- "construction", "estimate", "bid" → AlphaBuilder
- "prediction", "game", "bet" → Primape
- "wallet", "assistant", "AI" → Chimpanion

### Priority Detection
**P0 Keywords**: "urgent", "down", "broken", "emergency"  
**P1 Keywords**: "ASAP", "today", "blocking"  
**P2 Keywords**: "soon", "this week"  
**P3 Keywords**: Default for all others

### Sentiment Analysis
**Positive**: "love", "amazing", "great", "thanks"  
**Negative**: "frustrated", "disappointed", "problem"  
**Neutral**: Default

## Outbound Rules

### Follow-up Automation
**Trigger**: No response to outbound in 3 days  
**Action**: 
1. Send follow-up template
2. Update CRM status to "Following Up"
3. Schedule next follow-up in 7 days
4. After 3 attempts → Set status "Cold"

### Newsletter Rules
**Trigger**: Weekly on Thursday  
**Recipients**: All "Active" + "Nurturing" in CRM  
**Content**: Pull from Notion Content Machine  
**Tracking**: Opens, clicks → Update CRM engagement score

## Label System

### Gmail Labels → CRM Fields
- `customer` → Type: Customer
- `lead` → Type: Lead  
- `investor` → Type: Investor
- `partner` → Type: Partner
- `product:*` → Product Interest
- `priority:*` → Linear Priority

### Auto-Labeling
- From domain in customers list → `customer`
- Contains invoice/payment → `billing`
- Contains unsubscribe → `unsubscribe-request`
- From noreply@ → `automated`

## Integration Points

### Notion CRM Sync
- Every email → CRM activity log
- Attachments → Notion files
- Calendar invites → Notion calendar
- Email threads → Notion page comments

### Linear Issue Creation
Conditions for auto-issue:
- Customer email with "bug", "broken", "error"
- Email with priority:p0 or priority:p1 label
- Subject contains "URGENT" or "CRITICAL"

### Slack Notifications
- New lead → #sales
- Customer issue → #customer-support
- Investor email → #founders
- Partner inquiry → #partnerships
- Unsubscribe → #marketing

## Data Enrichment

### Company Lookup
For new leads, auto-fetch:
- Company size (from LinkedIn)
- Industry (from website)
- Location (from domain WHOIS)
- Social media (Twitter, LinkedIn)

### Contact Enrichment
- Full name parsing
- Title detection from signature
- Phone extraction
- Social profiles

## Metrics Tracking

Track in CRM:
- Response time
- Thread length
- Sentiment score
- Product interest
- Conversion probability
- Lifetime value estimate

Weekly report includes:
- New leads
- Response rate
- Average response time
- Conversion rate
- Customer satisfaction
- Top inquiry topics
