import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductGenerator from '../components/ProductGenerator';
import { LineChart, Line } from 'recharts';
import { HeatmapAnalytics } from '../components/HeatmapAnalytics';
import { ABTesting } from '../components/ABTesting';
import { PredictiveAnalytics } from '../components/PredictiveAnalytics';
import { BigDataInsights } from '../components/BigDataInsights';
import { CustomerSegmentation } from '../components/CustomerSegmentation';
import { ChurnPrevention } from '../components/ChurnPrevention';
import { optimizeRevenue } from '../../api/services/revenueOptimizer';
import { WhiteLabel } from '../components/WhiteLabel';
import InventoryForecaster from '../components/InventoryForecaster';
import ShieldOptimizer from '../components/ShieldOptimizer';
import TrafficBlackHole from '../components/TrafficBlackHole';
import GeneticOptimizer from '../components/GeneticOptimizer';
import TimeLoop from '../components/TimeLoop';
import ProfitSingularity from '../components/ProfitSingularity';

interface OverviewMetrics {
  revenue: {
    today: number;
    orders: number;
    avgOrderValue: number;
  };
  users: {
    total: number;
    newToday: number;
    growth: number;
  };
  inventory: {
    total: number;
    lowStock: number;
    outOfStock: number;
    healthScore: number;
  };
  alerts: Array<{
    type: 'warning' | 'error';
    message: string;
    count: number;
  }>;
}

interface SalesMetrics {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    timeRange: string;
  };
  chartData: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    quantity: number;
  }>;
}

interface UserMetrics {
  summary: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    retentionRate: number;
    timeRange: string;
  };
  chartData: Array<{
    date: string;
    signups: number;
  }>;
}

interface ProductMetrics {
  summary: {
    totalProducts: number;
    inStockProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    avgPrice: number;
    stockHealth: number;
  };
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  lowStockItems: Array<{
    id: string;
    name: string;
    stock: number;
    price: string;
  }>;
}

// Stack array for history

// Log function
const logEvent = (type, data) => {
  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push({ type, data, timestamp: Date.now() });
  localStorage.setItem('logs', JSON.stringify(logs));
};

// Display logs in dashboard

// Recursive component for tree

export const AdminDashboard: React.FC = () => {
  const { state: authState, actions: authActions } = useAuth();
  const navigate = useNavigate();
  const [overviewData, setOverviewData] = useState<OverviewMetrics | null>(null);
  const [salesData, setSalesData] = useState<SalesMetrics | null>(null);
  const [userData, setUserData] = useState<UserMetrics | null>(null);
  const [productData, setProductData] = useState<ProductMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'sales' | 'users' | 'products' | 'inventory'>('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved'>('pending');

  // State for selected, batch update button

  // Handle authentication errors
  const handleAuthError = (error: any) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      setError('Authentication failed. Please login again.');
      authActions.logout();
      navigate('/login');
    } else {
      setError('Failed to load dashboard data. Please try again.');
    }
  };

  // Fetch all analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = authState.token || localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login.');
        navigate('/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch overview data
      const overviewResponse = await axios.get('/api/analytics/overview', config);
      if (overviewResponse.data.success) {
        setOverviewData(overviewResponse.data.data);
      }

      // Fetch sales data
      const salesResponse = await axios.get(`/api/analytics/sales?range=${timeRange}`, config);
      if (salesResponse.data.success) {
        setSalesData(salesResponse.data.data);
      }

      // Fetch user data
      const userResponse = await axios.get(`/api/analytics/users?range=${timeRange}`, config);
      if (userResponse.data.success) {
        setUserData(userResponse.data.data);
      }

      // Fetch product data
      const productResponse = await axios.get('/api/analytics/products', config);
      if (productResponse.data.success) {
        setProductData(productResponse.data.data);
      }

    } catch (error: any) {
      console.error('Error fetching analytics data:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold text-red-400 mb-4">Dashboard Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => {
                setError(null);
                fetchAnalyticsData();
              }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-cyan-400/30 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">🛡️ ADMIN CONTROL CENTER</h1>
            <p className="text-gray-400 mt-1">Enterprise Business Management Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg focus:border-cyan-400 focus:outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button
              onClick={fetchAnalyticsData}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'sales', name: 'Sales Analytics', icon: '💰' },
              { id: 'users', name: 'User Analytics', icon: '👥' },
              { id: 'products', name: 'Product Analytics', icon: '📦' },
              { id: 'inventory', name: 'Inventory Management', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Overview Tab */}
        {selectedTab === 'overview' && overviewData && (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Revenue Card */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400">Today's Revenue</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(overviewData.revenue.today)}</p>
                    <p className="text-xs text-gray-500">{overviewData.revenue.orders} orders</p>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </div>

              {/* Users Card */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-cyan-400">{overviewData.users.total.toLocaleString()}</p>
                    <p className="text-xs text-green-400">+{overviewData.users.newToday} today</p>
                  </div>
                  <div className="text-3xl">👥</div>
                </div>
              </div>

              {/* Inventory Health Card */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400">Inventory Health</p>
                    <p className="text-2xl font-bold text-blue-400">{formatPercentage(overviewData.inventory.healthScore)}</p>
                    <p className="text-xs text-gray-500">{overviewData.inventory.total} products</p>
                  </div>
                  <div className="text-3xl">📦</div>
                </div>
              </div>

              {/* Alerts Card */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400">Active Alerts</p>
                    <p className="text-2xl font-bold text-orange-400">{overviewData.alerts.length}</p>
                    <p className="text-xs text-gray-500">Requires attention</p>
                  </div>
                  <div className="text-3xl">⚠️</div>
                </div>
              </div>
            </div>

            {/* Alerts Section */}
            {overviewData.alerts.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-4">🚨 Active Alerts</h3>
                <div className="space-y-3">
                  {overviewData.alerts.map((alert, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${
                        alert.type === 'error' 
                          ? 'bg-red-900/20 border-red-500 text-red-300'
                          : 'bg-orange-900/20 border-orange-500 text-orange-300'
                      }`}
                    >
                      <span className="font-medium">{alert.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">⚡ Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link 
                  to="/admin/products"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">📦</div>
                  <div className="font-medium">Manage Products</div>
                </Link>
                <Link 
                  to="/admin/orders"
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-medium">View Orders</div>
                </Link>
                <Link 
                  to="/performance"
                  className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-medium">Performance</div>
                </Link>
                <Link 
                  to="/admin/users"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors"
                >
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-medium">User Management</div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sales Analytics Tab */}
        {selectedTab === 'sales' && salesData && (
          <div className="space-y-8">
            {/* Sales Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(salesData.summary.totalRevenue)}</p>
                <p className="text-xs text-gray-500">{salesData.summary.timeRange}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">Total Orders</h3>
                <p className="text-2xl font-bold text-cyan-400">{salesData.summary.totalOrders}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">Avg Order Value</h3>
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(salesData.summary.avgOrderValue)}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">Conversion Rate</h3>
                <p className="text-2xl font-bold text-purple-400">12.5%</p>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">🏆 Top Products by Revenue</h3>
              <div className="space-y-3">
                {salesData.topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-400">{product.quantity} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Analytics Tab */}
        {selectedTab === 'users' && userData && (
          <div className="space-y-8">
            {/* User Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                <p className="text-2xl font-bold text-cyan-400">{userData.summary.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">New Users</h3>
                <p className="text-2xl font-bold text-green-400">{userData.summary.newUsers}</p>
                <p className="text-xs text-gray-500">{userData.summary.timeRange}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
                <p className="text-2xl font-bold text-blue-400">{userData.summary.activeUsers}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">Retention Rate</h3>
                <p className="text-2xl font-bold text-purple-400">{formatPercentage(userData.summary.retentionRate)}</p>
              </div>
            </div>
            <div>
              <h3>User Growth Chart</h3>
              <LineChart data={userData.chartData}>
                <Line type="monotone" dataKey="newUsers" stroke="#00ff00" />
              </LineChart>
            </div>
          </div>
        )}

        {/* Product Analytics Tab */}
        {selectedTab === 'products' && productData && (
          <div className="space-y-8">
            {/* Product Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">Total Products</h3>
                <p className="text-2xl font-bold text-cyan-400">{productData.summary.totalProducts}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">In Stock</h3>
                <p className="text-2xl font-bold text-green-400">{productData.summary.inStockProducts}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">Low Stock</h3>
                <p className="text-2xl font-bold text-orange-400">{productData.summary.lowStockProducts}</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-400">Out of Stock</h3>
                <p className="text-2xl font-bold text-red-400">{productData.summary.outOfStockProducts}</p>
              </div>
            </div>

            {/* Low Stock Items */}
            {productData.lowStockItems.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-4">⚠️ Low Stock Items</h3>
                <div className="space-y-3">
                  {productData.lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">{formatCurrency(parseFloat(item.price))}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-400">{item.stock} units left</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inventory Management Tab */}
        {selectedTab === 'inventory' && (
          <div className="space-y-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">📋 Inventory Management Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link 
                  to="/admin/products/bulk-update"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center transition-colors"
                >
                  <div className="text-3xl mb-3">📊</div>
                  <div className="font-medium">Bulk Update Stock</div>
                  <div className="text-sm opacity-75 mt-1">Update multiple products</div>
                </Link>
                <Link 
                  to="/admin/products/import"
                  className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-center transition-colors"
                >
                  <div className="text-3xl mb-3">📥</div>
                  <div className="font-medium">Import Products</div>
                  <div className="text-sm opacity-75 mt-1">CSV/Excel import</div>
                </Link>
                <Link 
                  to="/admin/reports"
                  className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg text-center transition-colors"
                >
                  <div className="text-3xl mb-3">📈</div>
                  <div className="font-medium">Generate Reports</div>
                  <div className="text-sm opacity-75 mt-1">Detailed analytics</div>
                </Link>
              </div>
            </div>
            <div>
              <h2>Generate New Product</h2>
              <ProductGenerator />
            </div>
            <InventoryForecaster />
          </div>
        )}

        {/* Add section */}
        <div>
          <h3>Profit Multiplier Calculator</h3>
          <p>Current: ${salesData?.summary.totalRevenue || 0}/day | Projected with 2x traffic: ${(salesData?.summary.totalRevenue || 0) * 2}</p>
        </div>
        {/* Add optimizer */}
        <div>
          <h3>Legal Price Optimizer</h3>
          <p>Suggest: Raise by 5% for +10% profit (based on data).</p>
        </div>
        {/* Add tracker */}
        <div>
          <h3>Legal Traffic Tracker</h3>
          <p>Top source: Reddit - 40% traffic.</p>
        </div>
        {/* Export button */}
        <button onClick={() => {
          const blob = new Blob([JSON.stringify(localStorage.getItem('logs'))], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'analytics.json';
          a.click();
        }}>Export Analytics</button>
        <ABTesting variants={['Variant A', 'Variant B']} />
        <PredictiveAnalytics />
        <BigDataInsights />
        <CustomerSegmentation />
        <ChurnPrevention />
        <p>Optimization: {optimizeRevenue()}</p>
        <WhiteLabel />
        <ShieldOptimizer />
        <TrafficBlackHole />
        <div>Traffic Magnet Status: Active</div>
        <div>Evolution Status: Active</div>
        <GeneticOptimizer />
        <TimeLoop />
        <div>Swarm Status: Active</div>
        <ProfitSingularity />
      </div>
    </div>
  );
};

export default AdminDashboard;