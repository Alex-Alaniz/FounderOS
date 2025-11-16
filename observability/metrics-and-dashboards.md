# Metrics and Dashboards Specification

## Core Metrics Framework

### Golden Signals (Google SRE)

#### 1. Latency
- **Request latency**: Time to process requests
- **P50, P95, P99** percentiles
- **By endpoint**: Track each API route
- **By operation**: Database, external APIs, calculations

#### 2. Traffic
- **Requests per second** (RPS)
- **Active users**: Concurrent sessions
- **API calls**: By endpoint and method
- **Feature usage**: Clicks, views, interactions

#### 3. Errors
- **Error rate**: 4xx, 5xx responses
- **Error budget**: Against SLA
- **By type**: Validation, auth, system
- **Stack traces**: Aggregated by similarity

#### 4. Saturation
- **CPU utilization**: Server and function
- **Memory usage**: Heap and buffers
- **Database connections**: Pool utilization
- **Queue depth**: Background jobs

## Business Metrics

### Revenue Metrics
```yaml
payment_success_rate:
  formula: successful_payments / total_attempts
  target: > 95%
  alert: < 90%

average_transaction_value:
  formula: total_revenue / transaction_count
  track: daily, weekly, monthly

mrr_growth:
  formula: (current_mrr - previous_mrr) / previous_mrr
  target: > 10% monthly

churn_rate:
  formula: churned_customers / total_customers
  target: < 5% monthly
```

### User Metrics
```yaml
daily_active_users:
  definition: unique users with >1 action per day
  segment_by: product, plan, cohort

user_activation_rate:
  formula: activated_users / new_signups
  activation_criteria: 
    - profile_complete
    - first_action_taken
  target: > 60%

feature_adoption:
  formula: feature_users / total_users
  track_per_feature: true
  minimum_usage: 3_times

session_duration:
  track: p50, p75, p95
  segment_by: new_vs_returning
```

### Product-Specific Metrics

#### BEARO
```yaml
wallet_connection_success:
  formula: successful_connections / attempts
  target: > 90%

payment_processing_time:
  measure: end_to_end_transaction_time
  target: < 5_seconds
  
cart_abandonment_rate:
  formula: abandoned_carts / created_carts
  target: < 30%
```

#### AlphaBuilder
```yaml
estimate_creation_time:
  measure: start_to_export_duration
  target: < 10_minutes

pdf_generation_success:
  formula: successful_exports / attempts
  target: > 99%

calculation_accuracy:
  validate_against: excel_baseline
  target: 100%
```

## Dashboard Layouts

### 1. Executive Dashboard

```
┌─────────────────────────────────────────────────────────┐
│                    Executive Summary                      │
├──────────────┬──────────────┬──────────────┬────────────┤
│ Revenue      │ Active Users │ System Health│ Costs      │
│ $XXX,XXX     │ XX,XXX       │ 99.9%        │ $X,XXX     │
│ ↑ 15%        │ ↑ 8%         │ ✓ All Green  │ ↓ 5%       │
├──────────────┴──────────────┴──────────────┴────────────┤
│                   Revenue Trend (12 months)               │
│ [==================== Line Graph ====================]   │
├───────────────────────────────────────────────────────────┤
│ Product Performance          │ Top Issues                 │
│ • BEARO: $XX,XXX (↑10%)     │ 1. Slow API response      │
│ • AlphaBuilder: $XX,XXX     │ 2. High cart abandon      │
│ • Primape: $XX,XXX          │ 3. PDF generation delay   │
└───────────────────────────────────────────────────────────┘
```

### 2. Engineering Dashboard

```
┌─────────────────────────────────────────────────────────┐
│                   Service Health Map                      │
│                                                           │
│    [Frontend] ──→ [API] ──→ [Database]                  │
│        ✓           ✓          ⚠️                         │
│                    ↓                                      │
│                [External APIs]                           │
│                     ✓                                     │
├─────────────────────────────────────────────────────────┤
│ Response Time Distribution    │ Error Rate Trend         │
│ [====Histogram====]           │ [====Line Graph====]     │
├───────────────────────────────┴─────────────────────────┤
│ Recent Deployments            │ Active Incidents         │
│ • v2.3.1 - 2h ago ✓          │ • None                   │
│ • v2.3.0 - 1d ago ✓          │                          │
└─────────────────────────────────────────────────────────┘
```

### 3. Product Analytics Dashboard

```
┌─────────────────────────────────────────────────────────┐
│                    User Journey Funnel                    │
│                                                           │
│   Visit ──→ Signup ──→ Activate ──→ Retain              │
│   100%      40%        25%         20%                   │
├─────────────────────────────────────────────────────────┤
│ Feature Usage Heatmap         │ User Segments            │
│ [▓▓▓▓░░░░] Feature A         │ • New: 30%               │
│ [▓▓▓▓▓▓▓░] Feature B         │ • Active: 50%            │
│ [▓▓░░░░░░] Feature C         │ • Power: 20%             │
├───────────────────────────────┴─────────────────────────┤
│              Weekly Cohort Retention                      │
│ Week 0  1   2   3   4   5   6   7   8                   │
│ 100%  70% 50% 40% 35% 32% 30% 30% 30%                  │
└─────────────────────────────────────────────────────────┘
```

### 4. Real-time Operations Dashboard

```
┌─────────────────────────────────────────────────────────┐
│            Live Activity Feed (Auto-refresh 5s)           │
├─────────────────────────────────────────────────────────┤
│ Current Load                  │ Active Sessions          │
│ CPU: ▓▓▓▓▓▓░░░░ 62%         │ Users: 1,234             │
│ Mem: ▓▓▓▓░░░░░░ 41%         │ API: 523 req/s           │
│ DB:  ▓▓▓░░░░░░░ 28%         │                          │
├───────────────────────────────┴─────────────────────────┤
│ Request Map (Last 60s)                                   │
│ [========= Scatter Plot with Response Times =========]   │
├─────────────────────────────────────────────────────────┤
│ Recent Errors                 │ Slow Queries             │
│ • [API] 500 at /payment      │ • SELECT * FROM orders   │
│ • [DB] Connection timeout     │   (2.3s)                │
└─────────────────────────────────────────────────────────┘
```

## Alert Rules

### Critical Alerts (P0)
```yaml
production_down:
  condition: availability < 95%
  duration: 1_minute
  action: page_oncall

payment_failures:
  condition: error_rate > 10%
  duration: 2_minutes
  action: page_oncall + slack_critical

data_loss_risk:
  condition: backup_failure OR replication_lag > 5min
  action: page_oncall + email_team
```

### Warning Alerts (P1)
```yaml
high_latency:
  condition: p95_latency > 3_seconds
  duration: 5_minutes
  action: slack_alerts

approaching_limit:
  condition: resource_usage > 80%
  duration: 10_minutes
  action: slack_alerts + auto_scale

error_spike:
  condition: error_rate > 5%
  duration: 5_minutes
  action: slack_alerts + create_incident
```

## Custom Metrics Implementation

### Frontend (RUM)
```javascript
// Track custom events
datadog.rum.addAction('estimate_created', {
  product: 'alphabuilder',
  trade_count: 5,
  total_amount: 50000
});

// Track feature usage
datadog.rum.addAction('feature_used', {
  feature: 'pdf_export',
  success: true,
  duration_ms: 3500
});
```

### Backend (APM)
```javascript
// Business metrics
datadog.gauge('payment.amount', amount, ['currency:usd']);
datadog.increment('user.signup', 1, ['source:organic']);

// Custom traces
const span = tracer.startSpan('calculation.process');
span.setTag('trades', tradeCount);
// ... calculation logic
span.finish();
```

## SLO Definitions

### Service Level Objectives
```yaml
api_availability:
  target: 99.9%
  window: 30_days
  measurement: successful_requests / total_requests

api_latency:
  target: 95% of requests < 1s
  window: 7_days
  measurement: p95_latency

data_durability:
  target: 99.999%
  window: 365_days
  measurement: successful_backups / total_backups
```

## Maintenance & Review

### Weekly Reviews
- Alert noise ratio
- False positive rate
- Dashboard usage stats
- Metric cardinality

### Monthly Reviews
- SLO performance
- Cost analysis
- Dashboard optimization
- Alert threshold tuning

### Quarterly Reviews
- Metric relevance
- Dashboard redesign
- Integration updates
- Team training needs
