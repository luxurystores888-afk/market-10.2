import { Router } from 'express';
import { performanceMonitor, DatabasePerformanceTracker } from '../middleware/performanceMonitoring';
import { apiLimiter } from '../middleware';
import { requireAdmin } from '../middleware/auth';

const performanceRoutes = Router();

// 📊 Get real-time performance metrics (ADMIN ONLY)
performanceRoutes.get('/metrics', apiLimiter, requireAdmin, (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const metrics = performanceMonitor.getMetrics(limit);
    const systemHealth = performanceMonitor.getSystemHealth();
    const endpointStats = performanceMonitor.getEndpointStats(60); // Last 60 minutes
    const queryStats = DatabasePerformanceTracker.getQueryStats();

    res.json({
      success: true,
      data: {
        systemHealth,
        recentMetrics: metrics,
        endpointStats,
        databaseStats: queryStats,
        averageResponseTime: performanceMonitor.getAverageResponseTime(5),
        serverInfo: {
          nodeVersion: process.version,
          platform: process.platform,
          architecture: process.arch,
          uptime: Math.round(process.uptime()),
          pid: process.pid
        }
      }
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics'
    });
  }
});

// 📊 Get system health summary (ADMIN ONLY)  
performanceRoutes.get('/health', apiLimiter, requireAdmin, (req, res) => {
  try {
    const health = performanceMonitor.getSystemHealth();
    const memUsage = process.memoryUsage();
    
    res.json({
      success: true,
      health: health.status,
      metrics: {
        avgResponseTime: health.avgResponseTime,
        memoryUsage: health.memoryUsage,
        requestsPerMinute: health.requestsPerMinute,
        errorRate: health.errorRate,
        memoryDetails: {
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
          rss: Math.round(memUsage.rss / 1024 / 1024), // MB
          external: Math.round(memUsage.external / 1024 / 1024) // MB
        },
        uptime: Math.round(process.uptime()),
        loadAverage: process.platform === 'linux' ? require('os').loadavg() : null
      }
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
});

// 📊 Get endpoint statistics (ADMIN ONLY)
performanceRoutes.get('/endpoints', apiLimiter, requireAdmin, (req, res) => {
  try {
    const minutes = parseInt(req.query.minutes as string) || 60;
    const stats = performanceMonitor.getEndpointStats(minutes);
    
    // Sort by request count
    const sortedStats = Object.entries(stats)
      .map(([endpoint, data]) => ({ endpoint, ...data }))
      .sort((a, b) => b.count - a.count);
    
    res.json({
      success: true,
      data: {
        timeRange: `Last ${minutes} minutes`,
        endpoints: sortedStats,
        summary: {
          totalEndpoints: sortedStats.length,
          totalRequests: sortedStats.reduce((sum, ep) => sum + ep.count, 0),
          avgResponseTime: Math.round(
            sortedStats.reduce((sum, ep) => sum + ep.avgResponseTime * ep.count, 0) /
            sortedStats.reduce((sum, ep) => sum + ep.count, 0)
          ) || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching endpoint stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch endpoint statistics'
    });
  }
});

// 📊 Get slow queries (ADMIN ONLY)
performanceRoutes.get('/slow-queries', apiLimiter, requireAdmin, (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 100;
    const slowQueries = DatabasePerformanceTracker.getSlowQueries(threshold);
    
    res.json({
      success: true,
      data: {
        threshold: `${threshold}ms`,
        slowQueries: slowQueries.slice(0, 50), // Last 50 slow queries
        stats: DatabasePerformanceTracker.getQueryStats()
      }
    });
  } catch (error) {
    console.error('Error fetching slow queries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch slow queries'
    });
  }
});

export { performanceRoutes };