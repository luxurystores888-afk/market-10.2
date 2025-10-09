# 🚀 Dynamic Pricing Microservice - Deployment Guide

## 📋 Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Docker Hub account
- GitHub repository with Actions enabled
- PostgreSQL database (for main platform)

---

## 🔧 Local Development Setup

### 1. Install Dependencies

```bash
cd feature-dynamic-pricing
npm install
```

### 2. Configure Environment

Create `.env`:
```env
PORT=3002
NODE_ENV=development
MAIN_API_URL=http://localhost:3001
RL_EPSILON=0.1
RL_ALPHA=0.1
RL_GAMMA=0.95
```

### 3. Start Service

```bash
npm run dev
```

Service runs on: `http://localhost:3002`

### 4. Test API

```bash
# Health check
curl http://localhost:3002/api/pricing/health

# Get optimized prices
curl http://localhost:3002/api/pricing/optimize

# View stats
curl http://localhost:3002/api/pricing/stats
```

### 5. Open Dashboard

```
http://localhost:3002/dashboard.html
```

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t cybermart/dynamic-pricing:latest .
```

### Run Container

```bash
docker run -d \
  -p 3002:3002 \
  -e NODE_ENV=production \
  -e MAIN_API_URL=http://main-api:3001 \
  --name dynamic-pricing \
  cybermart/dynamic-pricing:latest
```

### Test

```bash
curl http://localhost:3002/api/pricing/health
```

---

## ☸️ Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl create namespace pricing-service
```

### 2. Create Secrets (if needed)

```bash
kubectl create secret generic pricing-secrets \
  --from-literal=api-key=YOUR_API_KEY \
  -n pricing-service
```

### 3. Apply Configurations

```bash
cd feature-dynamic-pricing/k8s

# Apply in order
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f hpa.yaml
```

### 4. Verify Deployment

```bash
# Check pods
kubectl get pods -n pricing-service

# Check service
kubectl get svc -n pricing-service

# Check HPA
kubectl get hpa -n pricing-service

# View logs
kubectl logs -f deployment/dynamic-pricing -n pricing-service
```

### 5. Test Service

```bash
# Port forward for testing
kubectl port-forward svc/dynamic-pricing 3002:80 -n pricing-service

# Test API
curl http://localhost:3002/api/pricing/health
```

---

## 🔄 GitHub Actions Deployment

### 1. Configure Secrets

Add to GitHub repository secrets:

```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-token
KUBE_CONFIG=base64-encoded-kubeconfig
SERVICE_URL=https://pricing.cybermart2077.com
SLACK_WEBHOOK=https://hooks.slack.com/services/xxx
```

### 2. Push to Trigger

```bash
git add feature-dynamic-pricing/
git commit -m "Deploy dynamic pricing v1.0"
git push origin main
```

### 3. Monitor Workflow

- Go to GitHub Actions tab
- Watch workflow progress
- Check for success ✅ or failure ❌

### 4. Verify Deployment

```bash
# Check GitHub Actions output
# Or check K8s directly
kubectl get pods -n pricing-service
```

---

## 📊 Monitoring Setup

### Prometheus Metrics

```bash
# Apply Prometheus config
kubectl apply -f k8s/prometheus/

# Port forward
kubectl port-forward svc/prometheus 9090:9090

# Open: http://localhost:9090
```

### Grafana Dashboard

```bash
# Apply Grafana
kubectl apply -f k8s/grafana/

# Port forward
kubectl port-forward svc/grafana 3000:3000

# Open: http://localhost:3000
# Login: admin/admin
# Import dashboard: dashboards/pricing-dashboard.json
```

---

## 🔄 Rollback Strategy

### Manual Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/dynamic-pricing -n pricing-service

# Rollback to specific revision
kubectl rollout undo deployment/dynamic-pricing \
  --to-revision=3 \
  -n pricing-service

# Check status
kubectl rollout status deployment/dynamic-pricing -n pricing-service
```

### Automatic Rollback

Configured in GitHub Actions:
- If smoke tests fail → Auto rollback
- If health checks fail → Auto rollback
- If error rate >5% → Auto rollback

### Circuit Breaker

```typescript
// In main application
const fallbackPricing = {
  useStaticPrices: true,
  timeout: 1000, // 1 second
  retries: 3
};

try {
  const prices = await fetch('/api/pricing/optimize', { 
    timeout: fallbackPricing.timeout 
  });
} catch (error) {
  // Fallback to static pricing
  console.warn('Pricing service unavailable, using static prices');
  return staticPrices;
}
```

---

## 🔍 Troubleshooting

### Service Won't Start

```bash
# Check logs
kubectl logs deployment/dynamic-pricing -n pricing-service

# Check events
kubectl get events -n pricing-service --sort-by='.lastTimestamp'

# Describe pod
kubectl describe pod dynamic-pricing-xxx -n pricing-service
```

### API Returns Errors

```bash
# Check health
curl http://pricing-service/api/pricing/health

# Check readiness
curl http://pricing-service/api/pricing/readiness

# Check main API connectivity
kubectl exec -it dynamic-pricing-xxx -n pricing-service -- \
  curl http://main-api:3001/api/health
```

### Model Not Learning

```bash
# Check if data ingestion working
curl http://pricing-service/api/pricing/stats

# Manually trigger training
curl -X POST http://pricing-service/api/pricing/train

# Check model file exists
kubectl exec -it dynamic-pricing-xxx -n pricing-service -- \
  ls -la /app/models/
```

---

## 📈 Scaling

### Manual Scaling

```bash
# Scale to 5 replicas
kubectl scale deployment dynamic-pricing \
  --replicas=5 \
  -n pricing-service
```

### Auto-Scaling

Already configured via HPA:
- Min: 2 replicas
- Max: 10 replicas
- Target: 70% CPU

---

## 🔐 Security Hardening

### Enable Network Policies

```bash
kubectl apply -f k8s/network-policy.yaml
```

### Enable Pod Security

```bash
kubectl apply -f k8s/pod-security-policy.yaml
```

### Enable mTLS (Service Mesh)

If using Istio:
```bash
kubectl label namespace pricing-service istio-injection=enabled
kubectl rollout restart deployment/dynamic-pricing -n pricing-service
```

---

## 📊 Performance Tuning

### Optimize Resources

```yaml
# Increase if needed
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Optimize Node.js

```dockerfile
# Add to Dockerfile
ENV NODE_OPTIONS="--max-old-space-size=1024 --optimize-for-size"
```

---

## 🎯 Production Checklist

- [ ] All tests passing
- [ ] Docker image built
- [ ] K8s cluster ready
- [ ] Secrets configured
- [ ] Monitoring setup
- [ ] Alerts configured
- [ ] Load testing completed
- [ ] Rollback tested
- [ ] Documentation reviewed
- [ ] Team trained
- [ ] Runbook prepared
- [ ] On-call schedule set

---

## 📞 Support

For issues:
1. Check logs: `kubectl logs -f deployment/dynamic-pricing -n pricing-service`
2. Check metrics: Grafana dashboard
3. Review docs: `/docs` folder
4. Contact: devops@cybermart2077.com

---

**Deployment complete! 🎉**

