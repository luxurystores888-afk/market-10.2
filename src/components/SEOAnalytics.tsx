// 📊 SEO & ANALYTICS DASHBOARD - COMPREHENSIVE TRACKING
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  Globe, 
  Users, 
  Eye, 
  MousePointer, 
  ShoppingCart,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  Chrome,
  Firefox,
  Safari,
  Calendar,
  Filter,
  Download,
  Share,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';

interface SEOMetrics {
  organicTraffic: number;
  organicGrowth: number;
  avgPosition: number;
  keywords: number;
  backlinks: number;
  pageSpeed: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

interface AnalyticsData {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  revenue: number;
  topPages: Array<{
    page: string;
    views: number;
    conversions: number;
  }>;
  trafficSources: Array<{
    source: string;
    percentage: number;
    visitors: number;
  }>;
  devices: Array<{
    device: string;
    percentage: number;
  }>;
  browsers: Array<{
    browser: string;
    percentage: number;
  }>;
  countries: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
}

interface KeywordData {
  keyword: string;
  position: number;
  searchVolume: number;
  difficulty: number;
  traffic: number;
  trend: 'up' | 'down' | 'stable';
}

export function SEOAnalytics() {
  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics>({
    organicTraffic: 15420,
    organicGrowth: 23.5,
    avgPosition: 12.4,
    keywords: 847,
    backlinks: 1234,
    pageSpeed: 92,
    coreWebVitals: {
      lcp: 1.2,
      fid: 45,
      cls: 0.08
    }
  });

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    visitors: 28450,
    pageviews: 84320,
    bounceRate: 32.5,
    avgSessionDuration: 245,
    conversionRate: 3.8,
    revenue: 45620,
    topPages: [
      { page: '/products', views: 12450, conversions: 234 },
      { page: '/ai-assistant', views: 8920, conversions: 189 },
      { page: '/nft-marketplace', views: 6780, conversions: 156 },
      { page: '/crypto-payments', views: 5640, conversions: 123 },
      { page: '/automation', views: 4320, conversions: 98 }
    ],
    trafficSources: [
      { source: 'Organic Search', percentage: 45.2, visitors: 12850 },
      { source: 'Direct', percentage: 28.7, visitors: 8167 },
      { source: 'Social Media', percentage: 15.3, visitors: 4353 },
      { source: 'Referral', percentage: 6.8, visitors: 1935 },
      { source: 'Email', percentage: 4.0, visitors: 1138 }
    ],
    devices: [
      { device: 'Desktop', percentage: 52.3 },
      { device: 'Mobile', percentage: 41.2 },
      { device: 'Tablet', percentage: 6.5 }
    ],
    browsers: [
      { browser: 'Chrome', percentage: 68.4 },
      { browser: 'Safari', percentage: 18.2 },
      { browser: 'Firefox', percentage: 8.7 },
      { browser: 'Edge', percentage: 4.7 }
    ],
    countries: [
      { country: 'United States', visitors: 11380, percentage: 40.0 },
      { country: 'United Kingdom', visitors: 4264, percentage: 15.0 },
      { country: 'Canada', visitors: 2845, percentage: 10.0 },
      { country: 'Germany', visitors: 2276, percentage: 8.0 },
      { country: 'Australia', visitors: 1707, percentage: 6.0 }
    ]
  });

  const [keywords, setKeywords] = useState<KeywordData[]>([
    { keyword: 'ai ecommerce platform', position: 3, searchVolume: 8900, difficulty: 65, traffic: 1245, trend: 'up' },
    { keyword: 'crypto payment integration', position: 7, searchVolume: 5400, difficulty: 58, traffic: 892, trend: 'up' },
    { keyword: 'nft marketplace builder', position: 12, searchVolume: 3200, difficulty: 72, traffic: 456, trend: 'stable' },
    { keyword: 'automated revenue system', position: 5, searchVolume: 2800, difficulty: 61, traffic: 678, trend: 'up' },
    { keyword: 'cyberpunk ecommerce', position: 15, searchVolume: 1900, difficulty: 45, traffic: 234, trend: 'down' }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'analytics' | 'keywords'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Structured Data Generator
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Cyber Mart 2077",
      "url": "https://your-domain.com",
      "description": "AI-powered e-commerce platform with crypto payments and automated revenue generation",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://your-domain.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "sameAs": [
        "https://twitter.com/cybermart2077",
        "https://facebook.com/cybermart2077",
        "https://linkedin.com/company/cybermart2077"
      ]
    };
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Desktop': return <Monitor className="h-4 w-4" />;
      case 'Mobile': return <Smartphone className="h-4 w-4" />;
      case 'Tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getBrowserIcon = (browser: string) => {
    switch (browser) {
      case 'Chrome': return <Chrome className="h-4 w-4" />;
      case 'Safari': return <Safari className="h-4 w-4" />;
      case 'Firefox': return <Firefox className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            📊 SEO & Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Comprehensive tracking with structured data and advanced analytics
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <div className="bg-green-500/20 border border-green-400 px-4 py-2 rounded-full flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              +{seoMetrics.organicGrowth}% Organic Growth
            </div>
            <div className="bg-blue-500/20 border border-blue-400 px-4 py-2 rounded-full flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {analytics.pageviews.toLocaleString()} Page Views
            </div>
            <div className="bg-purple-500/20 border border-purple-400 px-4 py-2 rounded-full flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              ${analytics.revenue.toLocaleString()} Revenue
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {['7d', '30d', '90d', '1y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  timeRange === range 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <button className="bg-green-500/20 border border-green-400 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="bg-blue-500/20 border border-blue-400 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center">
              <Share className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {['overview', 'seo', 'analytics', 'keywords'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all capitalize ${
                activeTab === tab 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{analytics.visitors.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total Visitors</div>
                <div className="text-xs text-green-400 mt-1">+12.5% vs last period</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{analytics.conversionRate}%</div>
                <div className="text-sm text-gray-400">Conversion Rate</div>
                <div className="text-xs text-green-400 mt-1">+2.1% vs last period</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{analytics.bounceRate}%</div>
                <div className="text-sm text-gray-400">Bounce Rate</div>
                <div className="text-xs text-red-400 mt-1">-5.3% vs last period</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{formatDuration(analytics.avgSessionDuration)}</div>
                <div className="text-sm text-gray-400">Avg Session</div>
                <div className="text-xs text-green-400 mt-1">+18.2% vs last period</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Traffic Sources
                </h3>
                <div className="space-y-3">
                  {analytics.trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{source.source}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-12">{source.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                  <Smartphone className="h-5 w-5 mr-2" />
                  Device Usage
                </h3>
                <div className="space-y-3">
                  {analytics.devices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.device)}
                        <span className="text-gray-300">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-12">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Top Performing Pages
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3 text-gray-300">Page</th>
                      <th className="text-left p-3 text-gray-300">Views</th>
                      <th className="text-left p-3 text-gray-300">Conversions</th>
                      <th className="text-left p-3 text-gray-300">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topPages.map((page, index) => (
                      <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="p-3 text-white">{page.page}</td>
                        <td className="p-3 text-cyan-400">{page.views.toLocaleString()}</td>
                        <td className="p-3 text-green-400">{page.conversions}</td>
                        <td className="p-3 text-purple-400">
                          {((page.conversions / page.views) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            {/* SEO Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{seoMetrics.organicTraffic.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Organic Traffic</div>
                <div className="text-xs text-green-400">+{seoMetrics.organicGrowth}%</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{seoMetrics.avgPosition}</div>
                <div className="text-xs text-gray-400">Avg Position</div>
                <div className="text-xs text-green-400">+2.1</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">{seoMetrics.keywords}</div>
                <div className="text-xs text-gray-400">Keywords</div>
                <div className="text-xs text-green-400">+45</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{seoMetrics.backlinks}</div>
                <div className="text-xs text-gray-400">Backlinks</div>
                <div className="text-xs text-green-400">+89</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">{seoMetrics.pageSpeed}</div>
                <div className="text-xs text-gray-400">Page Speed</div>
                <div className="text-xs text-green-400">+5</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-pink-400 mb-1">A+</div>
                <div className="text-xs text-gray-400">SEO Grade</div>
                <div className="text-xs text-green-400">Excellent</div>
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Core Web Vitals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{seoMetrics.coreWebVitals.lcp}s</div>
                  <div className="text-sm text-gray-400 mb-1">Largest Contentful Paint</div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-xs text-green-400">Good</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{seoMetrics.coreWebVitals.fid}ms</div>
                  <div className="text-sm text-gray-400 mb-1">First Input Delay</div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-xs text-green-400">Good</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{seoMetrics.coreWebVitals.cls}</div>
                  <div className="text-sm text-gray-400 mb-1">Cumulative Layout Shift</div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-xs text-green-400">Good</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Data Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Structured Data Schema
              </h3>
              <pre className="bg-gray-900 border border-gray-600 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(generateStructuredData(), null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Keyword Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3 text-gray-300">Keyword</th>
                      <th className="text-left p-3 text-gray-300">Position</th>
                      <th className="text-left p-3 text-gray-300">Search Volume</th>
                      <th className="text-left p-3 text-gray-300">Difficulty</th>
                      <th className="text-left p-3 text-gray-300">Traffic</th>
                      <th className="text-left p-3 text-gray-300">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((keyword, index) => (
                      <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="p-3 text-white font-medium">{keyword.keyword}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            keyword.position <= 3 ? 'bg-green-500/20 text-green-400' :
                            keyword.position <= 10 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            #{keyword.position}
                          </span>
                        </td>
                        <td className="p-3 text-cyan-400">{keyword.searchVolume.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            keyword.difficulty <= 30 ? 'bg-green-500/20 text-green-400' :
                            keyword.difficulty <= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {keyword.difficulty}%
                          </span>
                        </td>
                        <td className="p-3 text-purple-400">{keyword.traffic}</td>
                        <td className="p-3">
                          <span className={`flex items-center ${
                            keyword.trend === 'up' ? 'text-green-400' :
                            keyword.trend === 'down' ? 'text-red-400' :
                            'text-gray-400'
                          }`}>
                            <TrendingUp className={`h-4 w-4 mr-1 ${
                              keyword.trend === 'down' ? 'rotate-180' : ''
                            }`} />
                            {keyword.trend}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Geographic Data */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Geographic Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {analytics.countries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{country.country}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
                            style={{ width: `${country.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-16">{country.visitors.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <div className="text-lg text-gray-400 mb-2">🌍</div>
                  <div className="text-sm text-gray-300">Interactive map would go here</div>
                  <div className="text-xs text-gray-400">Showing visitor distribution globally</div>
                </div>
              </div>
            </div>

            {/* Browser & Technology */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Browser Usage
                </h3>
                <div className="space-y-3">
                  {analytics.browsers.map((browser, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getBrowserIcon(browser.browser)}
                        <span className="text-gray-300">{browser.browser}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                            style={{ width: `${browser.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-12">{browser.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Real-Time Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Users</span>
                    <span className="text-2xl font-bold text-green-400">127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Pages/Session</span>
                    <span className="text-2xl font-bold text-cyan-400">2.96</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">New Visitors</span>
                    <span className="text-2xl font-bold text-purple-400">68.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Goal Completions</span>
                    <span className="text-2xl font-bold text-yellow-400">45</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
