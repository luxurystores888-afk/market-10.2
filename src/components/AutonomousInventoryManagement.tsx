import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Truck, Factory, AlertTriangle, CheckCircle, 
  Clock, TrendingUp, TrendingDown, BarChart3, Calendar,
  Zap, Settings, Play, Pause, RotateCcw, Download,
  Eye, Brain, Activity, Target, MapPin, Users,
  DollarSign, ShoppingCart, Gauge, Boxes, Archive,
  ArrowUp, ArrowDown, ArrowRight, Plus, Minus,
  Bell, Wifi, WifiOff, Bot, Cpu, Database
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mockDataGenerators } from '@/lib/mockData';

// Types
interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  reorderPoint: number;
  reorderQuantity: number;
  averageDailySales: number;
  leadTime: number; // days
  cost: number;
  price: number;
  supplier: string;
  lastOrdered: Date;
  status: 'healthy' | 'low' | 'critical' | 'overstock';
  forecastDemand: number[];
  autoReorderEnabled: boolean;
}

interface SupplierData {
  id: string;
  name: string;
  reliability: number; // 0-100%
  avgLeadTime: number; // days
  avgCost: number;
  orderCount: number;
  lastOrder: Date;
  status: 'active' | 'inactive' | 'issues';
  performance: {
    onTimeDelivery: number;
    qualityScore: number;
    responsiveness: number;
  };
}

interface ReorderSuggestion {
  id: string;
  itemId: string;
  itemName: string;
  currentStock: number;
  suggestedQuantity: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
  estimatedDelivery: Date;
  cost: number;
  supplier: string;
  confidence: number;
  aiPrediction: string;
}

interface StockAlert {
  id: string;
  type: 'low_stock' | 'critical' | 'overstock' | 'supplier_issue' | 'demand_spike';
  itemId: string;
  itemName: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
  actionTaken?: string;
}

interface DemandForecast {
  itemId: string;
  itemName: string;
  currentTrend: 'rising' | 'falling' | 'stable';
  forecastDays: number[];
  confidence: number;
  seasonality: boolean;
  events: string[];
}

interface AutonomousInventoryManagementProps {
  isOpen: boolean;
  onToggle: () => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function AutonomousInventoryManagement({
  isOpen,
  onToggle,
  position,
  onPositionChange
}: AutonomousInventoryManagementProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(true);
  const [forecastPeriod, setForecastPeriod] = useState('30');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Data states
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [reorderSuggestions, setReorderSuggestions] = useState<ReorderSuggestion[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [demandForecasts, setDemandForecasts] = useState<DemandForecast[]>([]);
  const [analytics, setAnalytics] = useState<any>({});

  // Mock data now centralized in shared/mockData.ts for better maintainability



  // All mock data generation now handled by centralized shared/mockData.ts utility

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as Element).classList.contains('drag-handle')) {
      setIsDragging(true);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      const maxX = window.innerWidth - containerRef.current.offsetWidth;
      const maxY = window.innerHeight - containerRef.current.offsetHeight;
      
      onPositionChange({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Initialize data
  useEffect(() => {
    if (isOpen) {
      refreshInventoryData();
    }
  }, [isOpen]);

  // Auto-refresh
  useEffect(() => {
    if (autonomousMode) {
      const interval = setInterval(() => {
        refreshInventoryData();
      }, 60000); // Refresh every minute

      return () => clearInterval(interval);
    }
  }, [autonomousMode]);

  const refreshInventoryData = async () => {
    setIsAnalyzing(true);
    
    try {
      console.log('📦 Refreshing inventory data');
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use centralized mock data utility - code quality improvement
      const mockInventory = mockDataGenerators.inventory(15).map((item, i) => ({
        ...item,
        sku: `SKU-${(1000 + i).toString()}`,
        minThreshold: Math.floor(item.reorderLevel * 0.8),
        maxCapacity: item.currentStock * 3,
        reorderPoint: item.reorderLevel,
        reorderQuantity: Math.floor(Math.random() * 200) + 50,
        averageDailySales: Math.floor(Math.random() * 20) + 1,
        leadTime: Math.floor(Math.random() * 14) + 3,
        price: item.cost * 1.6,
        lastOrdered: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: item.currentStock <= item.reorderLevel ? ('low' as const) : ('healthy' as const),
        forecastDemand: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30) + 5),
        autoReorderEnabled: Math.random() > 0.3
      }));
      
      const mockSupplierData = mockDataGenerators.suppliers(5).map(supplier => ({
        ...supplier,
        avgLeadTime: Math.floor(Math.random() * 10) + 5,
        avgCost: Math.floor(Math.random() * 200) + 100,
        orderCount: Math.floor(Math.random() * 100) + 20,
        lastOrder: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        status: supplier.reliability > 80 ? ('active' as const) : ('issues' as const),
        performance: {
          onTimeDelivery: supplier.reliability,
          qualityScore: Math.floor(Math.random() * 25) + 75,
          responsiveness: Math.floor(Math.random() * 30) + 70
        }
      }));

      const mockReorders = mockDataGenerators.reorderSuggestions(8).map((suggestion, i) => ({
        id: `reorder-${i}`,
        itemId: `item-${i}`,
        itemName: suggestion.productName,
        currentStock: suggestion.currentStock,
        suggestedQuantity: suggestion.suggestedOrderQuantity,
        urgency: suggestion.urgency,
        reasoning: suggestion.reason,
        estimatedDelivery: new Date(Date.now() + (Math.random() * 14 + 3) * 24 * 60 * 60 * 1000),
        cost: suggestion.estimatedCost,
        supplier: `Supplier ${Math.floor(Math.random() * 3) + 1}`,
        confidence: Math.floor(Math.random() * 25) + 75,
        aiPrediction: `AI predicts ${suggestion.urgency} priority based on current trends`
      }));

      const mockStockAlerts = mockDataGenerators.alerts(12).map(alert => ({
        id: alert.id,
        type: alert.type === 'stock' ? ('low_stock' as const) : 
               alert.type === 'quality' ? ('supplier_issue' as const) : 
               alert.type === 'delivery' ? ('supplier_issue' as const) : ('demand_spike' as const),
        itemId: `item-${Math.floor(Math.random() * 10)}`,
        itemName: `Product ${Math.floor(Math.random() * 10) + 1}`,
        message: alert.message,
        severity: alert.priority === 'low' ? ('info' as const) : 
                 alert.priority === 'medium' ? ('warning' as const) : 
                 alert.priority === 'high' ? ('error' as const) : ('critical' as const),
        timestamp: alert.timestamp,
        acknowledged: alert.resolved,
        actionTaken: alert.resolved ? 'Auto-reorder initiated' : undefined
      }));

      setInventoryItems(mockInventory);
      setSuppliers(mockSupplierData);
      setReorderSuggestions(mockReorders);
      setStockAlerts(mockStockAlerts);

      // Generate analytics
      setAnalytics({
        totalItems: 156,
        totalValue: 2450000,
        lowStockItems: 23,
        criticalItems: 8,
        overstockItems: 12,
        autoReordersToday: 15,
        supplierHealth: 94,
        turnoverRate: 8.5,
        forecastAccuracy: 87,
        costSavings: 125000
      });

      toast({
        title: "Inventory Data Updated",
        description: "Latest inventory analysis and forecasts refreshed",
      });

    } catch (error) {
      console.error('Error refreshing inventory data:', error);
      toast({
        title: "Update Failed",
        description: "Failed to refresh inventory data",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const executeReorder = async (suggestion: ReorderSuggestion) => {
    try {
      console.log('🚀 Executing auto-reorder:', suggestion);
      
      toast({
        title: "Auto-Reorder Initiated",
        description: `Ordering ${suggestion.suggestedQuantity} units of ${suggestion.itemName}`,
      });

      // Remove from suggestions
      setReorderSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      
      // Add success alert
      const successAlert: StockAlert = {
        id: `success-${Date.now()}`,
        type: 'demand_spike',
        itemId: suggestion.itemId,
        itemName: suggestion.itemName,
        message: `Auto-reorder completed: ${suggestion.suggestedQuantity} units ordered`,
        severity: 'info',
        timestamp: new Date(),
        acknowledged: false,
        actionTaken: 'Auto-reorder executed'
      };
      
      setStockAlerts(prev => [successAlert, ...prev]);

    } catch (error) {
      console.error('Reorder failed:', error);
      toast({
        title: "Reorder Failed",
        description: "Failed to execute automatic reorder",
        variant: "destructive"
      });
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setStockAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 border-green-500';
      case 'low': return 'text-yellow-400 border-yellow-500';
      case 'critical': return 'text-red-400 border-red-500';
      case 'overstock': return 'text-blue-400 border-blue-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-400 border-red-500';
      case 'high': return 'text-orange-400 border-orange-500';
      case 'medium': return 'text-yellow-400 border-yellow-500';
      case 'low': return 'text-green-400 border-green-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20';
      case 'error': return 'text-orange-400 bg-orange-900/20';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20';
      case 'info': return 'text-blue-400 bg-blue-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Button
          onClick={onToggle}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Package className="h-6 w-6 text-white" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000
      }}
      className={cn(
        "w-[1000px] h-[700px] bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900",
        "border border-green-500/50 rounded-xl shadow-2xl backdrop-blur-xl",
        "cursor-move select-none overflow-hidden"
      )}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="drag-handle flex items-center justify-between p-4 border-b border-green-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600/20 rounded-lg">
            <Package className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Autonomous Inventory Management</h3>
            <p className="text-sm text-green-300">AI-Powered Demand Forecasting & Auto-Reordering</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("border-green-500", autonomousMode ? "text-green-400" : "text-gray-400")}>
            {autonomousMode ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
            {autonomousMode ? 'Autonomous' : 'Manual'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshInventoryData}
            disabled={isAnalyzing}
            className="text-green-400 hover:text-white hover:bg-green-600/20"
          >
            <RotateCcw className={cn("h-4 w-4", isAnalyzing && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-green-400 hover:text-white hover:bg-green-600/20"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100%-80px)]">
        {/* Sidebar */}
        <div className="w-72 bg-black/20 border-r border-green-500/30 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Key Metrics */}
            <div>
              <Label className="text-green-300 text-sm font-medium">Inventory Overview</Label>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Items:</span>
                  <span className="text-white font-medium">{analytics.totalItems || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Value:</span>
                  <span className="text-green-400 font-medium">${(analytics.totalValue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Low Stock:</span>
                  <span className="text-yellow-400 font-medium">{analytics.lowStockItems || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Critical:</span>
                  <span className="text-red-400 font-medium">{analytics.criticalItems || 0}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-green-500/30" />

            {/* AI Settings */}
            <div>
              <Label className="text-green-300 text-sm font-medium">AI Configuration</Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-green-300 text-sm">Autonomous Mode</Label>
                  <Switch
                    checked={autonomousMode}
                    onCheckedChange={setAutonomousMode}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-green-300 text-sm">Auto Reorder</Label>
                  <Switch
                    checked={autoReorderEnabled}
                    onCheckedChange={setAutoReorderEnabled}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-green-300 text-sm font-medium">Forecast Period</Label>
              <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                <SelectTrigger className="mt-1 bg-gray-800/50 border-green-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-green-500/30">
                  <SelectItem value="7" className="text-white hover:bg-green-600/20">7 Days</SelectItem>
                  <SelectItem value="14" className="text-white hover:bg-green-600/20">14 Days</SelectItem>
                  <SelectItem value="30" className="text-white hover:bg-green-600/20">30 Days</SelectItem>
                  <SelectItem value="90" className="text-white hover:bg-green-600/20">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-green-300 text-sm font-medium">Category Filter</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-1 bg-gray-800/50 border-green-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-green-500/30">
                  <SelectItem value="all" className="text-white hover:bg-green-600/20">All Categories</SelectItem>
                  <SelectItem value="neural" className="text-white hover:bg-green-600/20">Neural Interfaces</SelectItem>
                  <SelectItem value="quantum" className="text-white hover:bg-green-600/20">Quantum Processors</SelectItem>
                  <SelectItem value="holo" className="text-white hover:bg-green-600/20">Holographic</SelectItem>
                  <SelectItem value="cyber" className="text-white hover:bg-green-600/20">Cyber Implants</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-green-500/30" />

            {/* Performance Metrics */}
            <div>
              <Label className="text-green-300 text-sm font-medium">AI Performance</Label>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Forecast Accuracy:</span>
                  <span className="text-green-400 font-medium">{analytics.forecastAccuracy || 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Auto Reorders Today:</span>
                  <span className="text-white font-medium">{analytics.autoReordersToday || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Cost Savings:</span>
                  <span className="text-green-400 font-medium">${(analytics.costSavings || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-600">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="inventory" className="data-[state=active]:bg-green-600">
                Inventory
              </TabsTrigger>
              <TabsTrigger value="reorders" className="data-[state=active]:bg-green-600">
                Reorders ({reorderSuggestions.length})
              </TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-green-600">
                Alerts ({stockAlerts.filter(a => !a.acknowledged).length})
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="data-[state=active]:bg-green-600">
                Suppliers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-4 space-y-4">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800/50 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Inventory Value</p>
                        <p className="text-2xl font-bold text-white">${(analytics.totalValue || 0) / 1000000}M</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Turnover Rate</p>
                        <p className="text-2xl font-bold text-white">{analytics.turnoverRate || 0}x</p>
                      </div>
                      <Activity className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Supplier Health</p>
                        <p className="text-2xl font-bold text-white">{analytics.supplierHealth || 0}%</p>
                      </div>
                      <Truck className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">AI Accuracy</p>
                        <p className="text-2xl font-bold text-white">{analytics.forecastAccuracy || 0}%</p>
                      </div>
                      <Brain className="h-8 w-8 text-cyan-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-800/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-300 flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Recent Auto-Reorders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reorderSuggestions.slice(0, 4).map(suggestion => (
                        <div key={suggestion.id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                          <div>
                            <p className="font-medium text-white">{suggestion.itemName}</p>
                            <p className="text-sm text-gray-400">{suggestion.suggestedQuantity} units</p>
                          </div>
                          <Badge variant="outline" className={getUrgencyColor(suggestion.urgency)}>
                            {suggestion.urgency}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-300 flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Active Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stockAlerts.filter(a => !a.acknowledged).slice(0, 4).map(alert => (
                        <div key={alert.id} className={cn("flex items-start gap-3 p-2 rounded", getSeverityColor(alert.severity))}>
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{alert.itemName}</p>
                            <p className="text-xs opacity-80">{alert.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="mt-4">
              {/* Inventory Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Inventory Status</h3>
                
                <div className="grid gap-3">
                  {inventoryItems.slice(0, 10).map(item => (
                    <Card key={item.id} className="bg-gray-800/50 border-green-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <h4 className="font-medium text-white">{item.name}</h4>
                              <p className="text-sm text-gray-400">{item.sku} • {item.category}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold text-white">{item.currentStock} units</p>
                              <p className="text-sm text-gray-400">Min: {item.minThreshold}</p>
                            </div>
                            
                            <div className="w-24">
                              <Progress 
                                value={(item.currentStock / item.maxCapacity) * 100} 
                                className="h-2"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                {Math.floor((item.currentStock / item.maxCapacity) * 100)}% capacity
                              </p>
                            </div>
                            
                            <Badge variant="outline" className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Daily Sales:</p>
                              <p className="font-medium text-white">{item.averageDailySales}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reorders" className="mt-4">
              {/* Reorder Suggestions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">AI Reorder Suggestions</h3>
                  <Button
                    onClick={() => {
                      reorderSuggestions.forEach(s => {
                        if (s.urgency === 'critical' && autoReorderEnabled) {
                          executeReorder(s);
                        }
                      });
                    }}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!autoReorderEnabled}
                  >
                    Auto-Execute Critical
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {reorderSuggestions.map(suggestion => (
                    <Card key={suggestion.id} className="bg-gray-800/50 border-green-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-white">{suggestion.itemName}</h4>
                              <Badge variant="outline" className={getUrgencyColor(suggestion.urgency)}>
                                {suggestion.urgency}
                              </Badge>
                              <Badge variant="outline" className="border-blue-500 text-blue-300">
                                {suggestion.confidence}% confidence
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-400 mb-2">{suggestion.reasoning}</p>
                            <p className="text-xs text-cyan-400 mb-3">{suggestion.aiPrediction}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Current Stock:</span>
                                <p className="font-medium text-white">{suggestion.currentStock} units</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Suggested Order:</span>
                                <p className="font-medium text-white">{suggestion.suggestedQuantity} units</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Cost:</span>
                                <p className="font-medium text-white">${suggestion.cost.toFixed(2)}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Delivery:</span>
                                <p className="font-medium text-white">{suggestion.estimatedDelivery.toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              onClick={() => executeReorder(suggestion)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Execute
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-500 text-gray-300 hover:bg-gray-600/20"
                            >
                              Review
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="mt-4">
              {/* Stock Alerts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Stock Alerts & Notifications</h3>
                  <Button
                    onClick={() => {
                      stockAlerts.forEach(alert => {
                        if (!alert.acknowledged) {
                          acknowledgeAlert(alert.id);
                        }
                      });
                    }}
                    variant="outline"
                    size="sm"
                    className="border-green-500/50 text-green-300 hover:bg-green-600/20"
                  >
                    Acknowledge All
                  </Button>
                </div>
                
                <div className="grid gap-3">
                  {stockAlerts.map(alert => (
                    <Card key={alert.id} className={cn(
                      "bg-gray-800/50 border-green-500/30",
                      !alert.acknowledged && "ring-1 ring-yellow-500/50"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={cn("w-2 h-2 rounded-full mt-2", {
                              'bg-red-400': alert.severity === 'critical',
                              'bg-orange-400': alert.severity === 'error',
                              'bg-yellow-400': alert.severity === 'warning',
                              'bg-blue-400': alert.severity === 'info'
                            })} />
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-white">{alert.itemName}</h4>
                                <Badge variant="outline" className={cn(
                                  getSeverityColor(alert.severity).replace('bg-', 'border-').replace('/20', '/50')
                                )}>
                                  {alert.severity}
                                </Badge>
                                <Badge variant="outline" className="border-gray-500 text-gray-400">
                                  {alert.type.replace('_', ' ')}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-gray-400 mb-2">{alert.message}</p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{alert.timestamp.toLocaleString()}</span>
                                {alert.actionTaken && (
                                  <span className="text-green-400">• {alert.actionTaken}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {!alert.acknowledged && (
                            <Button
                              onClick={() => acknowledgeAlert(alert.id)}
                              size="sm"
                              variant="outline"
                              className="border-green-500/50 text-green-300 hover:bg-green-600/20"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="mt-4">
              {/* Supplier Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Supplier Performance</h3>
                
                <div className="grid gap-4">
                  {suppliers.map(supplier => (
                    <Card key={supplier.id} className="bg-gray-800/50 border-green-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="text-lg font-bold text-white">{supplier.name}</h4>
                              <Badge variant="outline" className={cn({
                                'border-green-500 text-green-400': supplier.status === 'active',
                                'border-red-500 text-red-400': supplier.status === 'issues',
                                'border-gray-500 text-gray-400': supplier.status === 'inactive'
                              })}>
                                {supplier.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                              <div>
                                <span className="text-gray-400">Reliability:</span>
                                <p className="font-medium text-white">{supplier.reliability}%</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Avg Lead Time:</span>
                                <p className="font-medium text-white">{supplier.avgLeadTime} days</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Order Count:</span>
                                <p className="font-medium text-white">{supplier.orderCount}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Last Order:</span>
                                <p className="font-medium text-white">{supplier.lastOrder.toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <span className="text-sm text-gray-400">On-Time Delivery:</span>
                                <Progress value={supplier.performance.onTimeDelivery} className="mt-1" />
                                <span className="text-xs text-gray-500">{supplier.performance.onTimeDelivery}%</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-400">Quality Score:</span>
                                <Progress value={supplier.performance.qualityScore} className="mt-1" />
                                <span className="text-xs text-gray-500">{supplier.performance.qualityScore}%</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-400">Responsiveness:</span>
                                <Progress value={supplier.performance.responsiveness} className="mt-1" />
                                <span className="text-xs text-gray-500">{supplier.performance.responsiveness}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Contact
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-500/50 text-green-300 hover:bg-green-600/20"
                            >
                              View Orders
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}