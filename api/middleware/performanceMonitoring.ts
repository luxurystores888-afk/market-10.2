import { Request, Response, NextFunction } from 'express';

// 🚀 Performance monitoring middleware for comprehensive API metrics
export interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  cpuUsage?: number;
  timestamp: Date;
  endpoint: string;
  method: string;
  statusCode: number;
  userAgent?: string;
  ip?: string;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private readonly MAX_METRICS = 1000; // Keep last 1000 requests

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only last MAX_METRICS entries
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }
  }

  getMetrics(limit?: number): PerformanceMetrics[] {
    const recentMetrics = this.metrics.slice().reverse();
    return limit ? recentMetrics.slice(0, limit) : recentMetrics;
  }

  getAverageResponseTime(minutes: number = 5): number {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoffTime);
    
    if (recentMetrics.length === 0) return 0;
    
    const total = recentMetrics.reduce((sum, metric) => sum + metric.responseTime, 0);
    return Math.round(total / recentMetrics.length);
  }

  getEndpointStats(minutes: number = 60): Record<string, { 
    count: number; 
    avgResponseTime: number; 
    maxResponseTime: number; 
    minResponseTime: number;
    errorRate: number;
  }> {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoffTime);
    
    const stats: Record<string, {
      responseTimes: number[];
      errorCount: number;
      totalCount: number;
    }> = {};

    for (const metric of recentMetrics) {
      const key = `${metric.method} ${metric.endpoint}`;
      if (!stats[key]) {
        stats[key] = { responseTimes: [], errorCount: 0, totalCount: 0 };
      }
      
      stats[key].responseTimes.push(metric.responseTime);
      stats[key].totalCount++;
      
      if (metric.statusCode >= 400) {
        stats[key].errorCount++;
      }
    }

    const result: Record<string, {
      count: number;
      avgResponseTime: number;
      maxResponseTime: number;
      minResponseTime: number;
      errorRate: number;
    }> = {};

    for (const [endpoint, data] of Object.entries(stats)) {
      const responseTimes = data.responseTimes;
      result[endpoint] = {
        count: data.totalCount,
        avgResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
        maxResponseTime: Math.max(...responseTimes),
        minResponseTime: Math.min(...responseTimes),
        errorRate: Math.round((data.errorCount / data.totalCount) * 100)
      };
    }

    return result;
  }

  getSystemHealth(): {
    status: 'healthy' | 'degraded' | 'critical';
    avgResponseTime: number;
    memoryUsage: number;
    requestsPerMinute: number;
    errorRate: number;
  } {
    const recentMetrics = this.metrics.filter(m => 
      m.timestamp >= new Date(Date.now() - 5 * 60 * 1000)
    );
    
    if (recentMetrics.length === 0) {
      return {
        status: 'healthy',
        avgResponseTime: 0,
        memoryUsage: 0,
        requestsPerMinute: 0,
        errorRate: 0
      };
    }

    const avgResponseTime = this.getAverageResponseTime(5);
    const memoryUsage = recentMetrics[recentMetrics.length - 1]?.memoryUsage.percentage || 0;
    const requestsPerMinute = Math.round(recentMetrics.length / 5);
    const errorCount = recentMetrics.filter(m => m.statusCode >= 400).length;
    const errorRate = Math.round((errorCount / recentMetrics.length) * 100);

    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    if (avgResponseTime > 1000 || memoryUsage > 90 || errorRate > 10) {
      status = 'critical';
    } else if (avgResponseTime > 500 || memoryUsage > 70 || errorRate > 5) {
      status = 'degraded';
    }

    return {
      status,
      avgResponseTime,
      memoryUsage,
      requestsPerMinute,
      errorRate
    };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// 📊 Response time tracking middleware
export const responseTimeTracker = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();
  
  // Use res.on('finish') instead of overriding res.end
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const responseTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    // Get memory usage
    const memUsage = process.memoryUsage();
    const totalMem = memUsage.heapTotal;
    const usedMem = memUsage.heapUsed;
    
    const metric: PerformanceMetrics = {
      responseTime: Math.round(responseTime * 100) / 100, // Round to 2 decimal places
      memoryUsage: {
        used: Math.round(usedMem / 1024 / 1024), // MB
        total: Math.round(totalMem / 1024 / 1024), // MB
        percentage: Math.round((usedMem / totalMem) * 100)
      },
      timestamp: new Date(),
      endpoint: req.route?.path || req.path,
      method: req.method,
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    };
    
    performanceMonitor.addMetric(metric);
    
    // Log slow requests (>1000ms)
    if (responseTime > 1000) {
      console.warn(`⚠️ SLOW REQUEST: ${req.method} ${req.path} - ${responseTime.toFixed(2)}ms`);
    }
    
    // Add response header for debugging (only if headers not sent)
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${responseTime.toFixed(2)}ms`);
    }
  });
  
  next();
};

// 🔍 Database query performance tracker
export class DatabasePerformanceTracker {
  private static queryMetrics: Array<{
    query: string;
    duration: number;
    timestamp: Date;
    params?: any;
  }> = [];

  static trackQuery<T>(queryName: string, queryFn: () => Promise<T>, params?: any): Promise<T> {
    const startTime = process.hrtime.bigint();
    
    return queryFn().then(result => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      
      this.queryMetrics.push({
        query: queryName,
        duration: Math.round(duration * 100) / 100,
        timestamp: new Date(),
        params
      });
      
      // Keep only last 500 queries
      if (this.queryMetrics.length > 500) {
        this.queryMetrics = this.queryMetrics.slice(-500);
      }
      
      // Log slow queries (>100ms)
      if (duration > 100) {
        console.warn(`⚠️ SLOW QUERY: ${queryName} - ${duration.toFixed(2)}ms`, params);
      }
      
      return result;
    }).catch(error => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000;
      
      console.error(`❌ QUERY ERROR: ${queryName} - ${duration.toFixed(2)}ms`, error);
      throw error;
    });
  }

  static getSlowQueries(thresholdMs: number = 100): typeof this.queryMetrics {
    return this.queryMetrics.filter(q => q.duration > thresholdMs);
  }

  static getQueryStats() {
    const recentQueries = this.queryMetrics.filter(q => 
      q.timestamp >= new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
    );

    if (recentQueries.length === 0) return null;

    const totalDuration = recentQueries.reduce((sum, q) => sum + q.duration, 0);
    const avgDuration = totalDuration / recentQueries.length;
    const slowQueries = recentQueries.filter(q => q.duration > 100).length;

    return {
      totalQueries: recentQueries.length,
      avgDuration: Math.round(avgDuration * 100) / 100,
      slowQueries,
      slowQueryRate: Math.round((slowQueries / recentQueries.length) * 100)
    };
  }
}