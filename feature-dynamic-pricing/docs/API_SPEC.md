# 🌐 Dynamic Pricing API Specification

## Base URL
```
Development: http://localhost:3002
Production: https://pricing.cybermart2077.com
```

---

## Endpoints

### 1. GET /api/pricing/optimize

**Description:** Get optimized prices for all active products

**Request:**
```http
GET /api/pricing/optimize HTTP/1.1
Host: pricing.cybermart2077.com
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-10-09T12:00:00.000Z",
  "productsOptimized": 247,
  "responseTimeMs": 45,
  "prices": [
    {
      "productId": "prod-1",
      "currentPrice": 99.99,
      "optimizedPrice": 104.99,
      "priceChange": 5.0,
      "confidence": 0.87,
      "reasoning": "High demand detected - capturing willingness to pay",
      "estimatedImpact": {
        "revenueChange": "+3.5%",
        "marginChange": "+5.0%",
        "salesChange": "-1.5%"
      }
    }
  ],
  "modelStats": {
    "statesLearned": 1247,
    "totalQValues": 8729,
    "epsilon": 0.1,
    "alpha": 0.1,
    "gamma": 0.95
  }
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

### 2. GET /api/pricing/product/:id

**Description:** Get optimized price for a specific product

**Request:**
```http
GET /api/pricing/product/prod-123 HTTP/1.1
```

**Response:**
```json
{
  "success": true,
  "productId": "prod-123",
  "currentPrice": 99.99,
  "optimizedPrice": 104.99,
  "decision": {
    "priceChange": 5.0,
    "confidence": 0.87,
    "reasoning": "High demand, low inventory - maximizing margin"
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Product not found
- `500` - Server error

---

### 3. POST /api/pricing/update

**Description:** Apply a pricing change to product(s)

**Request:**
```http
POST /api/pricing/update HTTP/1.1
Content-Type: application/json

{
  "productId": "prod-123",
  "newPrice": 104.99,
  "reason": "RL model recommendation"
}
```

**Response:**
```json
{
  "success": true,
  "productId": "prod-123",
  "newPrice": 104.99,
  "appliedAt": "2025-10-09T12:01:30.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request
- `500` - Update failed

---

### 4. GET /api/pricing/stats

**Description:** Get model performance statistics

**Request:**
```http
GET /api/pricing/stats HTTP/1.1
```

**Response:**
```json
{
  "model": {
    "statesLearned": 1247,
    "totalQValues": 8729,
    "epsilon": 0.1,
    "modelAge": "Active"
  },
  "metrics": {
    "totalOptimizations": 15247,
    "successRate": 99.8,
    "metricsCollected": 10000
  },
  "performance": {
    "avgResponseTime": 42.5,
    "successRate": 99.8,
    "optimizationsToday": 1440
  }
}
```

---

### 5. POST /api/pricing/train

**Description:** Trigger model training on historical data

**Request:**
```http
POST /api/pricing/train HTTP/1.1
Content-Type: application/json

{
  "days": 30,
  "batchSize": 1000
}
```

**Response:**
```json
{
  "success": true,
  "dataPointsProcessed": 43200,
  "modelStats": {
    "statesLearned": 2847,
    "improvementScore": 15.7
  }
}
```

---

### 6. GET /api/pricing/health

**Description:** Health check endpoint (for load balancers/K8s)

**Request:**
```http
GET /api/pricing/health HTTP/1.1
```

**Response:**
```json
{
  "status": "healthy",
  "service": "dynamic-pricing",
  "timestamp": "2025-10-09T12:00:00.000Z",
  "uptime": 86400,
  "memory": {
    "rss": 52428800,
    "heapTotal": 31457280,
    "heapUsed": 18874368
  },
  "model": {
    "loaded": true,
    "states": 1247
  }
}
```

**Status Codes:**
- `200` - Healthy
- `503` - Unhealthy

---

### 7. GET /api/pricing/readiness

**Description:** Readiness check (for K8s)

**Response:**
```json
{
  "status": "ready"
}
```

**Status Codes:**
- `200` - Ready
- `503` - Not ready

---

## 🔒 Authentication

### API Key (Production):

```http
GET /api/pricing/optimize HTTP/1.1
Authorization: Bearer YOUR_API_KEY
```

### Rate Limits:
- Anonymous: 10 req/min
- Authenticated: 100 req/min
- Internal: Unlimited

---

## 📊 Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Add API key |
| 404 | Not Found | Check product ID |
| 429 | Too Many Requests | Slow down |
| 500 | Server Error | Retry with backoff |
| 503 | Service Unavailable | Check health endpoint |

---

## 🔄 Webhooks (Optional)

Subscribe to pricing events:

```http
POST /api/pricing/webhooks/subscribe
Content-Type: application/json

{
  "url": "https://your-api.com/webhooks/pricing",
  "events": ["price_changed", "optimization_complete"]
}
```

**Webhook Payload:**
```json
{
  "event": "price_changed",
  "timestamp": "2025-10-09T12:00:00.000Z",
  "data": {
    "productId": "prod-123",
    "oldPrice": 99.99,
    "newPrice": 104.99,
    "reason": "RL optimization"
  }
}
```

---

## 💡 Usage Examples

### JavaScript/TypeScript:
```typescript
// Get optimized prices
const response = await fetch('http://localhost:3002/api/pricing/optimize');
const data = await response.json();

// Apply recommended prices
for (const price of data.prices) {
  await fetch('http://localhost:3002/api/pricing/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: price.productId,
      newPrice: price.optimizedPrice,
      reason: 'RL recommendation'
    })
  });
}
```

### cURL:
```bash
# Get optimized prices
curl http://localhost:3002/api/pricing/optimize

# Update price
curl -X POST http://localhost:3002/api/pricing/update \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod-123","newPrice":104.99,"reason":"RL"}'

# Get stats
curl http://localhost:3002/api/pricing/stats
```

### Python:
```python
import requests

# Get optimized prices
response = requests.get('http://localhost:3002/api/pricing/optimize')
data = response.json()

# Apply prices
for price in data['prices']:
    requests.post('http://localhost:3002/api/pricing/update', json={
        'productId': price['productId'],
        'newPrice': price['optimizedPrice'],
        'reason': 'RL recommendation'
    })
```

---

## 📈 Expected Performance

### Latency:
- p50: <30ms
- p95: <100ms
- p99: <200ms

### Throughput:
- 1,000 req/sec sustained
- 5,000 req/sec burst

### Availability:
- 99.9% uptime SLA
- <1 minute recovery time

---

For more details, see OpenAPI spec: `openapi.yaml`

