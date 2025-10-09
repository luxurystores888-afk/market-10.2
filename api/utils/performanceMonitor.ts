/**
 * ⚡ PERFORMANCE MONITOR
 * Tracks response times, memory, CPU
 * Helps optimize for speed!
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

class PerformanceMonitor {
  private metrics = {
    totalRequests: 0,
    averageResponseTime: 0,
    slowestEndpoint: { path: '', time: 0 },
    fastestEndpoint: { path: '', time: 0 },
    errors: 0
  };

  // Middleware to track request timing
  trackRequest = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Track when response finishes
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      this.metrics.totalRequests++;
      
      // Update average
      this.metrics.averageResponseTime = 
        (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + duration) / 
        this.metrics.totalRequests;

      // Track slowest
      if (duration > this.metrics.slowestEndpoint.time) {
        this.metrics.slowestEndpoint = { path: req.path, time: duration };
      }

      // Track fastest (ignore very fast ones)
      if (duration > 10 && (this.metrics.fastestEndpoint.time === 0 || duration < this.metrics.fastestEndpoint.time)) {
        this.metrics.fastestEndpoint = { path: req.path, time: duration };
      }

      // Log slow requests
      if (duration > 1000) {
        logger.warn(`🐌 Slow request: ${req.method} ${req.path} took ${duration}ms`);
      }

      // Track errors
      if (res.statusCode >= 400) {
        this.metrics.errors++;
      }
    });

    next();
  };

  getMetrics() {
    return {
      ...this.metrics,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage()
    };
  }

  logStats() {
    logger.info('📊 Performance Stats:');
    logger.info(`   Total Requests: ${logger.number(this.metrics.totalRequests)}`);
    logger.info(`   Avg Response Time: ${this.metrics.averageResponseTime.toFixed(2)}ms`);
    logger.info(`   Slowest: ${this.metrics.slowestEndpoint.path} (${this.metrics.slowestEndpoint.time}ms)`);
    logger.info(`   Errors: ${this.metrics.errors}`);
    
    const memory = process.memoryUsage();
    logger.info(`   Memory: ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Log stats every 15 minutes
setInterval(() => {
  performanceMonitor.logStats();
}, 15 * 60 * 1000);

export default performanceMonitor;
