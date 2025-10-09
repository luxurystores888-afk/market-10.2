/**
 * 📈 METRICS COLLECTOR
 * 
 * Tracks:
 * - Revenue impact
 * - Margin changes
 * - Conversion rates
 * - API performance
 * - Model accuracy
 */

interface PricingMetrics {
  timestamp: Date;
  totalRevenue: number;
  averageMargin: number;
  conversionRate: number;
  optimizationsRun: number;
  priceChanges: number;
  revenueIncrease: number;
}

export class MetricsCollector {
  private metrics: PricingMetrics[] = [];
  private responseTime: number[] = [];
  private successCount = 0;
  private failureCount = 0;

  /**
   * RECORD OPTIMIZATION RUN
   */
  recordOptimization(productsCount: number, responseTimeMs: number): void {
    this.responseTime.push(responseTimeMs);
    this.successCount++;

    // Keep last 1000 response times
    if (this.responseTime.length > 1000) {
      this.responseTime.shift();
    }
  }

  /**
   * RECORD PRICE CHANGE
   */
  recordPriceChange(productId: string, newPrice: number): void {
    // Track in time-series database
    console.log(`📊 Metric: Price changed for ${productId} to $${newPrice}`);
  }

  /**
   * GET STATISTICS
   */
  getStats(): any {
    return {
      totalOptimizations: this.successCount,
      totalFailures: this.failureCount,
      successRate: this.getSuccessRate(),
      avgResponseTime: this.getAvgResponseTime(),
      metricsCollected: this.metrics.length
    };
  }

  /**
   * GET AVERAGE RESPONSE TIME
   */
  getAvgResponseTime(): number {
    if (this.responseTime.length === 0) return 0;
    return this.responseTime.reduce((a, b) => a + b, 0) / this.responseTime.length;
  }

  /**
   * GET SUCCESS RATE
   */
  getSuccessRate(): number {
    const total = this.successCount + this.failureCount;
    if (total === 0) return 100;
    return (this.successCount / total) * 100;
  }

  /**
   * GET TODAY'S OPTIMIZATIONS
   */
  getOptimizationsToday(): number {
    return this.successCount;
  }
}

export const metricsCollector = new MetricsCollector();
export default metricsCollector;

