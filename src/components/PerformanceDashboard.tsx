import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, AlertTriangle, CheckCircle, TrendingUp, Server, Globe } from 'lucide-react';
import performanceMonitor from '../utils/performanceMonitoring';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  avgResponseTime: number;
  memoryUsage: number;
  requestsPerMinute: number;
  errorRate: number;
}

interface PerformanceData {
  systemHealth: SystemHealth;
  endpointStats: Record<string, {
    count: number;
    avgResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
    errorRate: number;
  }>;
  databaseStats: {
    totalQueries: number;
    avgDuration: number;
    slowQueries: number;
    slowQueryRate: number;
  } | null;
  serverInfo: {
    nodeVersion: string;
    platform: string;
    uptime: number;
  };
}

export function PerformanceDashboard() {
  const [backendPerformance, setBackendPerformance] = useState<PerformanceData | null>(null);
  const [frontendPerformance, setFrontendPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchPerformanceData();
    
    // Update every 10 seconds
    const interval = setInterval(fetchPerformanceData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setError(null);
      
      // Fetch backend performance
      const response = await fetch('/api/performance/metrics');
      const data = await response.json();
      
      if (data.success) {
        setBackendPerformance(data.data);
      }
      
      // Get frontend performance
      const frontendData = performanceMonitor.getCurrentPerformance();
      setFrontendPerformance(frontendData);
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch performance data:', err);
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'degraded': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'critical': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5" />;
      case 'degraded': return <AlertTriangle className="h-5 w-5" />;
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getWebVitalStatus = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 },
      'FCP': { good: 1800, poor: 3000 },
      'TTFB': { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'text-gray-400';
    
    if (value <= threshold.good) return 'text-green-400';
    if (value <= threshold.poor) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
          <span className="text-cyan-400">Loading Performance Dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg">
              <Activity className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Performance Dashboard</h2>
              <p className="text-gray-400">Real-time system & application metrics</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>Last updated: {lastUpdated.toLocaleTimeString()}</div>
            <button
              onClick={fetchPerformanceData}
              className="mt-1 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      {backendPerformance && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`border rounded-xl p-4 ${getStatusColor(backendPerformance.systemHealth.status)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">System Health</p>
                <p className="text-2xl font-bold capitalize">{backendPerformance.systemHealth.status}</p>
              </div>
              {getStatusIcon(backendPerformance.systemHealth.status)}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Response Time</p>
                <p className="text-2xl font-bold text-purple-400">{backendPerformance.systemHealth.avgResponseTime}ms</p>
              </div>
              <Clock className="h-5 w-5 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Memory Usage</p>
                <p className="text-2xl font-bold text-cyan-400">{backendPerformance.systemHealth.memoryUsage}%</p>
              </div>
              <Server className="h-5 w-5 text-cyan-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Requests/min</p>
                <p className="text-2xl font-bold text-green-400">{backendPerformance.systemHealth.requestsPerMinute}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
          </div>
        </div>
      )}

      {/* Frontend Web Vitals */}
      {frontendPerformance && frontendPerformance.webVitals && frontendPerformance.webVitals.length > 0 && (
        <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Globe className="h-5 w-5 text-cyan-400" />
            <span>Frontend Web Vitals</span>
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {frontendPerformance.webVitals.slice(-5).map((vital: any, index: number) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">{vital.metric}</div>
                <div className={`text-lg font-bold ${getWebVitalStatus(vital.metric, vital.value)}`}>
                  {vital.metric === 'CLS' ? vital.value.toFixed(3) : `${vital.value}ms`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Database Performance */}
      {backendPerformance && backendPerformance.databaseStats && (
        <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Database Performance</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400">Total Queries</div>
              <div className="text-lg font-bold text-white">{backendPerformance.databaseStats.totalQueries}</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400">Avg Duration</div>
              <div className="text-lg font-bold text-purple-400">{backendPerformance.databaseStats.avgDuration}ms</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400">Slow Queries</div>
              <div className="text-lg font-bold text-yellow-400">{backendPerformance.databaseStats.slowQueries}</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400">Slow Query Rate</div>
              <div className="text-lg font-bold text-red-400">{backendPerformance.databaseStats.slowQueryRate}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Top API Endpoints */}
      {backendPerformance && backendPerformance.endpointStats && (
        <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">API Endpoint Performance</h3>
          <div className="space-y-3">
            {Object.entries(backendPerformance.endpointStats)
              .sort(([,a], [,b]) => b.count - a.count)
              .slice(0, 5)
              .map(([endpoint, stats]) => (
                <div key={endpoint} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{endpoint}</div>
                      <div className="text-sm text-gray-400">{stats.count} requests</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyan-400">{stats.avgResponseTime}ms</div>
                      <div className="text-sm text-gray-400">avg response</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* System Info */}
      {backendPerformance && (
        <div className="bg-gray-900/50 border border-gray-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Node.js Version:</span>
              <div className="text-white font-medium">{backendPerformance.serverInfo.nodeVersion}</div>
            </div>
            <div>
              <span className="text-gray-400">Platform:</span>
              <div className="text-white font-medium">{backendPerformance.serverInfo.platform}</div>
            </div>
            <div>
              <span className="text-gray-400">Uptime:</span>
              <div className="text-white font-medium">{formatUptime(backendPerformance.serverInfo.uptime)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}