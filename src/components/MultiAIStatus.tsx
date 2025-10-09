import React, { useState, useEffect } from 'react';
import { Activity, Zap, Globe, Cpu, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

interface AIProvider {
  available: boolean;
  model: string;
  features: string[];
  status: string;
}

interface SystemStatus {
  systemHealth: 'healthy' | 'degraded' | 'critical';
  activeProvider: string;
  availableProviders: string[];
  providers: {
    gemini: AIProvider;
    openai: AIProvider;
    browser: AIProvider;
  };
  capabilities: string[];
  message: string;
}

export function MultiAIStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ai/status');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data);
        setLastUpdated(new Date());
      } else {
        setError(data.message || 'Failed to fetch AI status');
      }
    } catch (error) {
      console.error('Failed to fetch AI status:', error);
      setError('Network error fetching AI status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'degraded':
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 'critical':
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'gemini':
        return <Zap className="h-4 w-4 text-blue-400" />;
      case 'openai':
        return <Cpu className="h-4 w-4 text-purple-400" />;
      case 'browser':
        return <Globe className="h-4 w-4 text-green-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-4">
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="h-5 w-5 text-cyan-400 animate-spin" />
          <span className="text-cyan-400">Checking AI System Status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">Error: {error}</span>
          </div>
          <button
            onClick={fetchStatus}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r ${getHealthColor(status.systemHealth)} rounded-xl p-4 border`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getHealthIcon(status.systemHealth)}
          <div>
            <h3 className="text-lg font-bold text-white">Multi-AI Fusion System</h3>
            <p className="text-sm text-gray-400">
              {status.availableProviders.length} provider(s) • Primary: {status.activeProvider}
            </p>
          </div>
        </div>
        <button
          onClick={fetchStatus}
          className="text-gray-400 hover:text-cyan-400 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* System Message */}
      <div className="mb-4 p-3 bg-gray-900/30 rounded-lg">
        <p className="text-sm text-gray-200">{status.message}</p>
      </div>

      {/* Providers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {Object.entries(status.providers).map(([name, provider]) => (
          <div
            key={name}
            className={`p-3 rounded-lg border ${
              provider.available 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-gray-900/30 border-gray-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getProviderIcon(name)}
                <span className="font-semibold text-white capitalize">{name}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                provider.available ? 'bg-green-400' : 'bg-red-400'
              }`} />
            </div>
            
            <p className="text-xs text-gray-400 mb-2">{provider.model}</p>
            
            <div className="space-y-1">
              {provider.features.slice(0, 2).map((feature, idx) => (
                <div key={idx} className="text-xs text-gray-300">
                  • {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Capabilities */}
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-cyan-400 mb-2">System Capabilities</h4>
        <div className="flex flex-wrap gap-2">
          {status.capabilities.map((capability, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300"
            >
              {capability}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
          <span>Live Status</span>
        </div>
      </div>
    </div>
  );
}