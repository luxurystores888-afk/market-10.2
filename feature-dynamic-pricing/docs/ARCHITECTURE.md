# 🏗️ Dynamic Pricing Microservice - Architecture

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CYBER MART 2077                          │
│                   Main E-Commerce Platform                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTP REST API
                   │
┌──────────────────▼──────────────────────────────────────────┐
│            DYNAMIC PRICING MICROSERVICE                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Layer (Express.js)                              │   │
│  │  - GET /api/pricing/optimize                         │   │
│  │  - POST /api/pricing/update                          │   │
│  │  - GET /api/pricing/stats                            │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   │                                           │
│  ┌────────────────▼────────────────────────────────────┐   │
│  │  Pricing Engine (RL Model)                           │   │
│  │  - Q-Learning Algorithm                              │   │
│  │  - State: inventory, sales, competitor prices        │   │
│  │  - Actions: -10% to +20% price changes              │   │
│  │  - Reward: Revenue + Margin + Sales velocity        │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   │                                           │
│  ┌────────────────▼────────────────────────────────────┐   │
│  │  Data Ingestion Pipeline                             │   │
│  │  - Real-time sales data (60s intervals)             │   │
│  │  - Inventory levels                                  │   │
│  │  - Competitor prices                                 │   │
│  │  - Demand signals                                    │   │
│  └────────────────┬────────────────────────────────────┘   │
│                   │                                           │
└───────────────────┼───────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼─────┐       ┌────────▼────────┐
│  PostgreSQL  │       │  Metrics Store   │
│  (Products)  │       │  (Prometheus)    │
└──────────────┘       └─────────────────┘
```

---

## 🔄 Data Flow

### Real-Time Pricing Loop (Every 60 seconds):

```
1. Data Ingestion
   ├── Fetch sales data (last hour)
   ├── Fetch inventory levels
   ├── Fetch competitor prices
   └── Fetch demand signals
   
2. State Construction
   ├── Normalize data
   ├── Calculate sales velocity
   ├── Determine demand level
   └── Build pricing state
   
3. RL Model Decision
   ├── Encode state
   ├── Lookup Q-table
   ├── ε-greedy action selection
   └── Calculate new price
   
4. Price Update
   ├── Validate bounds (floor/ceiling)
   ├── Call main API to update
   ├── Log change
   └── Track metrics
   
5. Model Learning
   ├── Observe results (after 60s)
   ├── Calculate reward
   ├── Update Q-values
   └── Improve policy
```

---

## 🧠 Reinforcement Learning Model

### Algorithm: Q-Learning

**State Space:**
- Price ratio vs competitor (0.5-2.0)
- Inventory level (low/medium/high)
- Sales velocity (low/medium/high)  
- Demand level (low/medium/high/very-high)

**Action Space:**
- Price changes: -10%, -5%, 0%, +5%, +10%, +15%, +20%

**Reward Function:**
```
R = 0.5 * (ΔRevenue/Revenue) + 
    0.3 * (ΔMargin/Margin) + 
    0.2 * (ΔSales/Sales)
```

**Update Rule:**
```
Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]

Where:
α = 0.1 (learning rate)
γ = 0.95 (discount factor)
ε = 0.1 (exploration rate)
```

---

## 🔒 Pricing Constraints

### Hard Constraints:
- **Floor Price:** Minimum price (e.g., cost + 20%)
- **Ceiling Price:** Maximum price (e.g., 3x cost)
- **Max Change:** ±20% per update
- **Update Frequency:** Once per minute

### Soft Constraints:
- Avoid price wars (don't go below competitor by >20%)
- Maintain margin targets (aim for 30-50%)
- Consider inventory turnover
- Respect demand elasticity

---

## 📊 Metrics & Monitoring

### Key Performance Indicators:

**Revenue Metrics:**
- Total revenue (daily/weekly/monthly)
- Revenue per product
- Revenue increase vs. static pricing
- Revenue increase vs. previous period

**Margin Metrics:**
- Average margin %
- Margin by category
- Margin trend
- Margin vs. target

**Operational Metrics:**
- Price changes per day
- API response time
- Model accuracy
- System uptime

**Business Metrics:**
- Conversion rate
- Average order value
- Sales velocity
- Customer lifetime value

---

## 🚀 Deployment Architecture

### Kubernetes Cluster:

```
┌─────────────────────────────────────────┐
│         Ingress Controller               │
│    (nginx/traefik)                       │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│     Service (ClusterIP)                  │
│     dynamic-pricing:80                   │
└────────────┬────────────────────────────┘
             │
     ┌───────┴───────┬───────────┐
     │               │           │
┌────▼────┐    ┌────▼────┐ ┌───▼─────┐
│ Pod 1    │    │ Pod 2    │ │ Pod 3    │
│ (Replica)│    │ (Replica)│ │ (Replica)│
└──────────┘    └──────────┘ └──────────┘

Horizontal Pod Autoscaler (HPA)
Min: 2 replicas
Max: 10 replicas
Target: 70% CPU, 80% Memory
```

### High Availability:
- **Replicas:** 3 (minimum 2)
- **Rolling updates:** Max surge 1, max unavailable 0
- **Health checks:** Liveness + Readiness probes
- **Auto-scaling:** Based on CPU/memory

---

## 🔐 Security

### API Security:
- Rate limiting (100 req/min per IP)
- Authentication (API keys)
- HTTPS only in production
- CORS properly configured

### Data Security:
- Encrypted connections
- Secrets in Kubernetes secrets
- No sensitive data in logs
- Regular security scans

---

## 📈 Scalability

### Horizontal Scaling:
- Stateless design (can add replicas freely)
- Load balanced across pods
- Auto-scales based on load

### Vertical Scaling:
- Resource limits configurable
- Can increase per-pod resources

### Performance Targets:
- API response: <100ms (p95)
- Pricing update: <1s end-to-end
- Handle: 1000 requests/second
- Optimize: 10,000 products/minute

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow:

```
Trigger: Push to main/master
   │
   ▼
┌──────────────────┐
│   Run Tests       │
│   - Unit          │
│   - Integration   │
│   - Performance   │
└─────┬────────────┘
      │ Pass ✓
      ▼
┌──────────────────┐
│  Build Docker     │
│  - Multi-stage    │
│  - Push to Hub    │
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│  Deploy to K8s    │
│  - Rolling update │
│  - Zero downtime  │
└─────┬────────────┘
      │
      ▼
┌──────────────────┐
│  Smoke Tests      │
│  - Health check   │
│  - API test       │
└─────┬────────────┘
      │
      ├─ Pass ✓ → Done
      └─ Fail ✗ → Rollback
```

---

## 📝 API Specification

See `API_SPEC.md` for complete OpenAPI/Swagger documentation.

---

## 🔧 Configuration

### Environment Variables:

```env
# Service
PORT=3002
NODE_ENV=production

# Main API
MAIN_API_URL=http://main-api:3001

# Model Parameters
RL_EPSILON=0.1
RL_ALPHA=0.1
RL_GAMMA=0.95

# Pricing Constraints
MAX_PRICE_CHANGE=0.20
UPDATE_INTERVAL=60000

# External APIs (optional)
COMPETITOR_API_KEY=xxx
GOOGLE_TRENDS_API_KEY=xxx
```

---

## 🎯 Next Steps

1. Deploy to Kubernetes cluster
2. Configure monitoring (Prometheus + Grafana)
3. Set up alerting (PagerDuty/Slack)
4. Train model on historical data
5. Gradually roll out (A/B test)
6. Monitor and optimize

---

For deployment instructions, see `DEPLOYMENT.md`
For API details, see `API_SPEC.md`
For testing, see `TESTING.md`

