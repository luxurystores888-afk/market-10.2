# 🔄 Rollback Strategy - Dynamic Pricing Service

## 🎯 When to Rollback

### Automatic Triggers:
- ❌ Smoke tests fail after deployment
- ❌ Health check fails (3+ consecutive)
- ❌ Error rate >5% for 5 minutes
- ❌ API response time >500ms (p95)
- ❌ Revenue decrease >10% in 1 hour

### Manual Triggers:
- Bad pricing decisions detected
- Model behaving erratically
- Customer complaints spike
- Database connection issues

---

## ⚡ Automatic Rollback

### GitHub Actions (Built-in)

Configured in `.github/workflows/deploy.yml`:

```yaml
# If smoke tests fail → Automatic rollback
rollback:
  name: Rollback on Failure
  runs-on: ubuntu-latest
  needs: smoke-test
  if: failure()
  
  steps:
    - name: Rollback deployment
      run: kubectl rollout undo deployment/dynamic-pricing -n pricing-service
```

**Process:**
1. Deployment completes
2. Smoke tests run
3. If fail → Rollback triggered
4. Previous version restored
5. Team notified via Slack

**Time to Rollback:** <2 minutes

---

## 🔧 Manual Rollback

### Option 1: Rollback to Previous Version

```bash
# Quick rollback
kubectl rollout undo deployment/dynamic-pricing -n pricing-service

# Check status
kubectl rollout status deployment/dynamic-pricing -n pricing-service

# Verify pods
kubectl get pods -n pricing-service
```

**Time:** 1-2 minutes

---

### Option 2: Rollback to Specific Version

```bash
# View revision history
kubectl rollout history deployment/dynamic-pricing -n pricing-service

# Output:
# REVISION  CHANGE-CAUSE
# 1         Initial deployment
# 2         Fixed bug XYZ
# 3         Added feature ABC
# 4         Current (problematic)

# Rollback to revision 2
kubectl rollout undo deployment/dynamic-pricing \
  --to-revision=2 \
  -n pricing-service
```

**Time:** 1-2 minutes

---

### Option 3: Emergency Static Pricing

If microservice completely fails:

```bash
# Enable feature flag in main platform
curl -X POST http://main-api:3001/api/config/set \
  -d '{"USE_STATIC_PRICING": true}'

# Or environment variable
kubectl set env deployment/main-api USE_DYNAMIC_PRICING=false
```

**Fallback Flow:**
```typescript
// In main platform code:
async function getPricing(productId) {
  try {
    // Try dynamic pricing
    const response = await fetch(`/api/pricing/product/${productId}`, {
      timeout: 1000
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Dynamic pricing unavailable, using static');
  }
  
  // Fallback to static pricing
  return { price: product.basePrice };
}
```

**Time:** Instant (feature flag flip)

---

## 📊 Rollback Verification

### Post-Rollback Checks:

```bash
# 1. Check pods are healthy
kubectl get pods -n pricing-service
# All should be "Running" and "Ready 1/1"

# 2. Check health endpoint
curl http://pricing-service/api/pricing/health
# Should return {"status": "healthy"}

# 3. Check a pricing request
curl http://pricing-service/api/pricing/optimize
# Should return valid prices

# 4. Check error logs
kubectl logs deployment/dynamic-pricing -n pricing-service --tail=100
# Should show no errors

# 5. Monitor metrics
# Open Grafana dashboard
# Watch for 5-10 minutes
# Verify normal behavior
```

---

## 🔍 Post-Mortem Process

After rollback, conduct post-mortem:

### 1. Gather Data
```bash
# Export logs from problematic deployment
kubectl logs deployment/dynamic-pricing \
  --previous \
  -n pricing-service \
  > rollback-logs-$(date +%Y%m%d).txt

# Export metrics
# Screenshot Grafana dashboards
```

### 2. Root Cause Analysis
- What triggered rollback?
- What was the impact?
- Which users were affected?
- How long was the issue?

### 3. Action Items
- [ ] Fix identified bug
- [ ] Add test to prevent recurrence
- [ ] Update monitoring/alerts
- [ ] Improve deployment process

### 4. Documentation
- Update runbook
- Add to known issues
- Share lessons learned

---

## 🛡️ Preventing Need for Rollback

### Pre-Deployment:
- ✅ All tests passing (unit, integration, performance)
- ✅ Code review completed
- ✅ Load testing on staging
- ✅ Gradual rollout (canary)

### During Deployment:
- ✅ Monitor metrics in real-time
- ✅ Watch logs for errors
- ✅ Have rollback command ready
- ✅ Team on standby

### Post-Deployment:
- ✅ Run smoke tests
- ✅ Monitor for 1 hour
- ✅ Compare metrics to baseline
- ✅ Get customer feedback

---

## 🎯 Canary Deployment (Advanced)

For safer deployments:

```yaml
# Deploy to 10% of pods first
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: dynamic-pricing
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: dynamic-pricing
  service:
    port: 80
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 10
  metrics:
  - name: request-success-rate
    threshold: 99
  - name: request-duration
    threshold: 500
```

**Process:**
1. Deploy to 10% of pods
2. Monitor for 5 minutes
3. If healthy → Increase to 20%
4. Continue until 100%
5. If issues → Auto rollback

---

## 📞 Emergency Contacts

| Issue | Contact | Phone |
|-------|---------|-------|
| Service Down | DevOps On-Call | xxx-xxx-xxxx |
| Bad Pricing | Product Lead | xxx-xxx-xxxx |
| Revenue Drop | CEO | xxx-xxx-xxxx |

---

## 🔧 Runbook

### Service Down

```bash
# 1. Check pod status
kubectl get pods -n pricing-service

# 2. Check logs
kubectl logs -f deployment/dynamic-pricing -n pricing-service

# 3. Restart if needed
kubectl rollout restart deployment/dynamic-pricing -n pricing-service

# 4. If still down → Rollback
kubectl rollout undo deployment/dynamic-pricing -n pricing-service

# 5. Enable static pricing fallback
kubectl set env deployment/main-api USE_DYNAMIC_PRICING=false
```

### Bad Pricing Decisions

```bash
# 1. Check recent price changes
curl http://pricing-service/api/pricing/stats

# 2. Review model decisions
# Check dashboard for anomalies

# 3. If confirmed bad → Rollback prices
curl -X POST http://pricing-service/api/pricing/update \
  -d '{"productId":"all","action":"revert_last"}'

# 4. If severe → Rollback deployment
kubectl rollout undo deployment/dynamic-pricing -n pricing-service

# 5. Retrain model
curl -X POST http://pricing-service/api/pricing/train
```

---

## ✅ Rollback Success Criteria

After rollback, verify:
- [ ] All pods healthy (Running)
- [ ] Health endpoint returns 200
- [ ] API responses valid
- [ ] No error spike in logs
- [ ] Metrics returned to normal
- [ ] Revenue stabilized
- [ ] Customer complaints stopped

---

**Safe rollback = happy customers! 😊**

