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
  Gamepad2, Users, Globe, Cpu, Zap, Settings,
  RotateCcw, Download, Upload, Eye, EyeOff,
  Play, Pause, Volume2, VolumeX, Maximize,
  Share2, Heart, Star, ShoppingCart, Package,
  User, UserCircle, Palette, Shirt, Crown,
  Map, Compass, Navigation, Target, Home,
  Camera, Video, Mic, MicOff, Monitor,
  Wifi, WifiOff, Signal, Battery, Clock,
  TrendingUp, BarChart3, Activity, Hash
} from 'lucide-react';
// Simple toast implementation since useToast is not available
const useToast = () => ({
  toast: ({ title, description, variant }: any) => {
    console.log(`${variant === 'destructive' ? '❌' : '✅'} ${title}: ${description}`);
  }
});

// Types
interface VirtualWorld {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  platform: 'VRChat' | 'Horizon' | 'Roblox' | 'Fortnite' | 'Minecraft' | 'Custom';
  playerCount: number;
  maxPlayers: number;
  storeCount: number;
  revenue24h: number;
  status: 'online' | 'maintenance' | 'offline';
  features: string[];
  compatibility: string[];
  lastUpdated: Date;
}

interface VirtualStore {
  id: string;
  name: string;
  worldId: string;
  owner: string;
  category: string;
  visitors24h: number;
  revenue24h: number;
  rating: number;
  products: number;
  location: { x: number; y: number; z: number };
  theme: string;
  immersiveFeatures: string[];
  status: 'active' | 'setup' | 'closed';
  vrExperience: boolean;
  arSupport: boolean;
}

interface Avatar {
  id: string;
  name: string;
  userId: string;
  platform: string;
  appearance: {
    model: string;
    skin: string;
    hair: string;
    clothing: string[];
    accessories: string[];
    animations: string[];
  };
  stats: {
    level: number;
    experience: number;
    achievements: string[];
    socialScore: number;
    shoppingScore: number;
  };
  inventory: Array<{ itemId: string; quantity: number; equipped: boolean }>;
  lastActive: Date;
}

interface VirtualProduct {
  id: string;
  name: string;
  description: string;
  category: 'avatar' | 'wearable' | 'furniture' | 'vehicle' | 'experience';
  price: number;
  currency: 'virtual' | 'real';
  model3D: string;
  textures: string[];
  animations: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  compatibility: string[];
  sales: number;
  rating: number;
  metaverse: string[];
}

interface SocialInteraction {
  id: string;
  type: 'chat' | 'voice' | 'gesture' | 'trade' | 'friend_request' | 'group_invite';
  fromUser: string;
  toUser: string;
  content: string;
  timestamp: Date;
  worldId: string;
  location: { x: number; y: number; z: number };
  status: 'pending' | 'accepted' | 'declined' | 'completed';
}

interface CrossPlatformSync {
  id: string;
  platform: string;
  accountId: string;
  linkedAt: Date;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSync: Date;
  dataTypes: string[];
  permissions: string[];
}

interface MetaverseCommerceBridgeProps {
  isOpen?: boolean;
  onToggle?: () => void;
  position?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export default function MetaverseCommerceBridge({
  isOpen = true,
  onToggle = () => {},
  position = { x: 100, y: 100 },
  onPositionChange = () => {}
}: MetaverseCommerceBridgeProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnecting, setIsConnecting] = useState(false);
  const [metaverseEnabled, setMetaverseEnabled] = useState(true);
  const [vrMode, setVrMode] = useState(false);
  const [arMode, setArMode] = useState(false);
  const [voiceChat, setVoiceChat] = useState(true);
  const [selectedWorld, setSelectedWorld] = useState('vrchat-mall');
  const [selectedPlatform, setSelectedPlatform] = useState('VRChat');
  
  // Data states
  const [virtualWorlds, setVirtualWorlds] = useState<VirtualWorld[]>([]);
  const [virtualStores, setVirtualStores] = useState<VirtualStore[]>([]);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [virtualProducts, setVirtualProducts] = useState<VirtualProduct[]>([]);
  const [socialInteractions, setSocialInteractions] = useState<SocialInteraction[]>([]);
  const [crossPlatformSync, setCrossPlatformSync] = useState<CrossPlatformSync[]>([]);
  const [metaverseMetrics, setMetaverseMetrics] = useState<any>({});

  // Mock data generators
  const generateMockVirtualWorlds = (): VirtualWorld[] => {
    const platforms: ('VRChat' | 'Horizon' | 'Roblox' | 'Fortnite' | 'Minecraft' | 'Custom')[] = 
      ['VRChat', 'Horizon', 'Roblox', 'Fortnite', 'Minecraft', 'Custom'];
    const statuses: ('online' | 'maintenance' | 'offline')[] = ['online', 'maintenance', 'offline'];
    
    const worldNames = [
      'Cyber Shopping Mall', 'Neon Market Plaza', 'Virtual Fashion District', 
      'Tech Valley Stores', 'Digital Bazaar', 'Future Commerce Hub'
    ];
    
    return Array.from({ length: 6 }, (_, i) => ({
      id: `world-${i}`,
      name: worldNames[i % worldNames.length],
      description: `A futuristic shopping experience in the ${worldNames[i % worldNames.length]} with immersive stores and social features.`,
      thumbnail: `https://api.dicebear.com/7.x/shapes/svg?seed=world${i}`,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      playerCount: Math.floor(Math.random() * 5000) + 100,
      maxPlayers: Math.floor(Math.random() * 10000) + 1000,
      storeCount: Math.floor(Math.random() * 500) + 50,
      revenue24h: Math.random() * 50000 + 5000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      features: getRandomFeatures(),
      compatibility: getRandomCompatibility(),
      lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Last 24 hours
    }));
  };

  const getRandomFeatures = (): string[] => {
    const features = ['VR Support', 'AR Integration', 'Voice Chat', 'Hand Tracking', 'Eye Tracking', 'Haptic Feedback', '3D Audio', 'AI NPCs'];
    return features.filter(() => Math.random() > 0.5).slice(0, 4);
  };

  const getRandomCompatibility = (): string[] => {
    const devices = ['Quest 2', 'Quest 3', 'Pico 4', 'Valve Index', 'HTC Vive', 'PSVR', 'Mobile AR', 'Desktop'];
    return devices.filter(() => Math.random() > 0.6);
  };

  const generateMockVirtualStores = (): VirtualStore[] => {
    const categories = ['Fashion', 'Tech', 'Gaming', 'Art', 'Collectibles', 'Experiences'];
    const themes = ['Cyberpunk', 'Futuristic', 'Minimalist', 'Fantasy', 'Retro', 'Neon'];
    const statuses: ('active' | 'setup' | 'closed')[] = ['active', 'setup', 'closed'];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: `store-${i}`,
      name: `Virtual Store ${i + 1}`,
      worldId: `world-${Math.floor(Math.random() * 3)}`,
      owner: `user-${Math.floor(Math.random() * 100)}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      visitors24h: Math.floor(Math.random() * 10000) + 100,
      revenue24h: Math.random() * 5000 + 100,
      rating: 3.5 + Math.random() * 1.5, // 3.5-5.0
      products: Math.floor(Math.random() * 500) + 10,
      location: {
        x: Math.random() * 1000 - 500,
        y: Math.random() * 100,
        z: Math.random() * 1000 - 500
      },
      theme: themes[Math.floor(Math.random() * themes.length)],
      immersiveFeatures: getRandomImmersiveFeatures(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      vrExperience: Math.random() > 0.3,
      arSupport: Math.random() > 0.5
    }));
  };

  const getRandomImmersiveFeatures = (): string[] => {
    const features = ['3D Product Preview', 'Virtual Try-On', 'Interactive Demos', 'AI Assistant', 'Social Shopping', 'Personalized Recommendations'];
    return features.filter(() => Math.random() > 0.4).slice(0, 3);
  };

  const generateMockAvatars = (): Avatar[] => {
    const platforms = ['VRChat', 'Horizon', 'Roblox', 'Custom'];
    const models = ['Humanoid', 'Robot', 'Fantasy', 'Anime', 'Realistic'];
    
    return Array.from({ length: 4 }, (_, i) => ({
      id: `avatar-${i}`,
      name: `Avatar ${i + 1}`,
      userId: `user-${i}`,
      platform: platforms[i % platforms.length],
      appearance: {
        model: models[Math.floor(Math.random() * models.length)],
        skin: `skin-${Math.floor(Math.random() * 10)}`,
        hair: `hair-${Math.floor(Math.random() * 20)}`,
        clothing: getRandomClothing(),
        accessories: getRandomAccessories(),
        animations: getRandomAnimations()
      },
      stats: {
        level: Math.floor(Math.random() * 100) + 1,
        experience: Math.floor(Math.random() * 10000),
        achievements: getRandomAchievements(),
        socialScore: Math.floor(Math.random() * 1000),
        shoppingScore: Math.floor(Math.random() * 500)
      },
      inventory: generateAvatarInventory(),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
    }));
  };

  const getRandomClothing = (): string[] => {
    const clothing = ['Cyber Jacket', 'Neon Pants', 'Tech Boots', 'Digital Gloves', 'Holographic Shirt'];
    return clothing.filter(() => Math.random() > 0.5);
  };

  const getRandomAccessories = (): string[] => {
    const accessories = ['Neural Implant', 'Cyber Goggles', 'Data Bracelet', 'Holo Watch', 'Light Sword'];
    return accessories.filter(() => Math.random() > 0.6);
  };

  const getRandomAnimations = (): string[] => {
    const animations = ['Wave', 'Dance', 'Point', 'Thumbs Up', 'Clap', 'Peace Sign'];
    return animations.filter(() => Math.random() > 0.4).slice(0, 3);
  };

  const getRandomAchievements = (): string[] => {
    const achievements = ['First Purchase', 'Social Butterfly', 'Fashion Icon', 'Tech Enthusiast', 'Explorer'];
    return achievements.filter(() => Math.random() > 0.5);
  };

  const generateAvatarInventory = (): Array<{ itemId: string; quantity: number; equipped: boolean }> => {
    return Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, i) => ({
      itemId: `item-${i}`,
      quantity: Math.floor(Math.random() * 10) + 1,
      equipped: Math.random() > 0.7
    }));
  };

  const generateMockVirtualProducts = (): VirtualProduct[] => {
    const categories: ('avatar' | 'wearable' | 'furniture' | 'vehicle' | 'experience')[] = 
      ['avatar', 'wearable', 'furniture', 'vehicle', 'experience'];
    const rarities: ('common' | 'rare' | 'epic' | 'legendary')[] = ['common', 'rare', 'epic', 'legendary'];
    const currencies: ('virtual' | 'real')[] = ['virtual', 'real'];
    
    const productNames = [
      'Cyber Wings', 'Neon Helmet', 'Quantum Sword', 'Holo Throne', 'Speed Bike',
      'Energy Shield', 'Light Saber', 'Tech Armor', 'Digital Pet', 'Magic Wand'
    ];
    
    return Array.from({ length: 12 }, (_, i) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      
      return {
        id: `product-${i}`,
        name: productNames[i % productNames.length],
        description: `A ${rarity} ${category} item for your virtual world adventures.`,
        category,
        price: getRarityPrice(rarity),
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        model3D: `model-${i}.glb`,
        textures: [`texture-${i}-1.png`, `texture-${i}-2.png`],
        animations: getProductAnimations(category),
        rarity,
        compatibility: getRandomCompatibility(),
        sales: Math.floor(Math.random() * 10000) + 50,
        rating: 3.5 + Math.random() * 1.5,
        metaverse: getRandomMetaverseSupport()
      };
    });
  };

  const getRarityPrice = (rarity: string): number => {
    const prices = {
      common: Math.random() * 50 + 10, // $10-60
      rare: Math.random() * 200 + 50, // $50-250
      epic: Math.random() * 500 + 200, // $200-700
      legendary: Math.random() * 2000 + 500 // $500-2500
    };
    return prices[rarity as keyof typeof prices];
  };

  const getProductAnimations = (category: string): string[] => {
    const animations = {
      avatar: ['Idle', 'Walk', 'Run', 'Jump'],
      wearable: ['Equip', 'Glow', 'Float'],
      furniture: ['Open', 'Close', 'Rotate'],
      vehicle: ['Start', 'Drive', 'Brake'],
      experience: ['Activate', 'Deactivate', 'Upgrade']
    };
    return animations[category as keyof typeof animations] || ['Basic'];
  };

  const getRandomMetaverseSupport = (): string[] => {
    const platforms = ['VRChat', 'Horizon', 'Roblox', 'Fortnite', 'Minecraft'];
    return platforms.filter(() => Math.random() > 0.4);
  };

  const generateMockSocialInteractions = (): SocialInteraction[] => {
    const types: ('chat' | 'voice' | 'gesture' | 'trade' | 'friend_request' | 'group_invite')[] = 
      ['chat', 'voice', 'gesture', 'trade', 'friend_request', 'group_invite'];
    const statuses: ('pending' | 'accepted' | 'declined' | 'completed')[] = ['pending', 'accepted', 'declined', 'completed'];
    
    return Array.from({ length: 15 }, (_, i) => ({
      id: `interaction-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      fromUser: `user-${Math.floor(Math.random() * 50)}`,
      toUser: `user-${Math.floor(Math.random() * 50)}`,
      content: getInteractionContent(types[Math.floor(Math.random() * types.length)]),
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Last 24 hours
      worldId: `world-${Math.floor(Math.random() * 3)}`,
      location: {
        x: Math.random() * 1000 - 500,
        y: Math.random() * 100,
        z: Math.random() * 1000 - 500
      },
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  };

  const getInteractionContent = (type: string): string => {
    const content = {
      chat: 'Hey! Check out this new store!',
      voice: 'Voice chat session started',
      gesture: 'Waved hello',
      trade: 'Trade request: Cyber Wings for 100 credits',
      friend_request: 'Friend request sent',
      group_invite: 'Invited to Shopping Squad group'
    };
    return content[type as keyof typeof content] || 'Interaction';
  };

  const generateMockCrossPlatformSync = (): CrossPlatformSync[] => {
    const platforms = ['VRChat', 'Meta Horizon', 'Roblox', 'Fortnite', 'Discord'];
    const statuses: ('connected' | 'syncing' | 'error' | 'disconnected')[] = ['connected', 'syncing', 'error', 'disconnected'];
    
    return platforms.map((platform, i) => ({
      id: `sync-${i}`,
      platform,
      accountId: `account-${Math.random().toString(36).substr(2, 9)}`,
      linkedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastSync: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000), // Last 6 hours
      dataTypes: ['Avatar', 'Inventory', 'Friends', 'Achievements'],
      permissions: ['Read Profile', 'Sync Inventory', 'Social Features']
    }));
  };

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
      refreshMetaverseData();
    }
  }, [isOpen]);

  const refreshMetaverseData = async () => {
    setIsConnecting(true);
    
    try {
      console.log('🌐 Refreshing metaverse data');
      
      // Simulate metaverse API calls
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      setVirtualWorlds(generateMockVirtualWorlds());
      setVirtualStores(generateMockVirtualStores());
      setAvatars(generateMockAvatars());
      setVirtualProducts(generateMockVirtualProducts());
      setSocialInteractions(generateMockSocialInteractions());
      setCrossPlatformSync(generateMockCrossPlatformSync());

      // Generate metaverse metrics
      setMetaverseMetrics({
        activeWorlds: 156,
        totalUsers: 45678,
        virtualStores: 234,
        salesVolume: 1254000,
        averageSession: 45,
        socialInteractions: 8934,
        avatarCreated: 12450,
        crossPlatformSync: 5
      });

      toast({
        title: "Metaverse Connected",
        description: "Virtual worlds and avatar data synchronized",
      });

    } catch (error) {
      console.error('Error refreshing metaverse data:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to metaverse platforms",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const enterVirtualWorld = async (worldId: string) => {
    try {
      setIsConnecting(true);
      console.log('🚪 Entering virtual world:', worldId);
      
      // Simulate world connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSelectedWorld(worldId);
      
      toast({
        title: "Entered Virtual World",
        description: "Successfully connected to the virtual shopping experience",
      });

    } catch (error) {
      console.error('Failed to enter world:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to enter virtual world",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const customizeAvatar = async (avatarId: string, changes: any) => {
    try {
      console.log('👤 Customizing avatar:', avatarId, changes);
      
      setAvatars(prev => 
        prev.map(avatar => 
          avatar.id === avatarId 
            ? { ...avatar, appearance: { ...avatar.appearance, ...changes }, lastActive: new Date() }
            : avatar
        )
      );

      toast({
        title: "Avatar Updated",
        description: "Avatar customization saved successfully",
      });

    } catch (error) {
      console.error('Avatar customization failed:', error);
      toast({
        title: "Customization Failed",
        description: "Failed to update avatar",
        variant: "destructive"
      });
    }
  };

  const createVirtualStore = async (storeData: any) => {
    try {
      console.log('🏪 Creating virtual store:', storeData);
      
      const newStore: VirtualStore = {
        id: `store-${Date.now()}`,
        name: storeData.name,
        worldId: selectedWorld,
        owner: 'current-user',
        category: storeData.category,
        visitors24h: 0,
        revenue24h: 0,
        rating: 5.0,
        products: 0,
        location: { x: Math.random() * 1000 - 500, y: 10, z: Math.random() * 1000 - 500 },
        theme: storeData.theme,
        immersiveFeatures: [],
        status: 'setup',
        vrExperience: true,
        arSupport: true
      };
      
      setVirtualStores(prev => [newStore, ...prev]);

      toast({
        title: "Virtual Store Created",
        description: "Your new store is being set up in the metaverse",
      });

    } catch (error) {
      console.error('Store creation failed:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create virtual store",
        variant: "destructive"
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-400 border-purple-500';
      case 'epic': return 'text-pink-400 border-pink-500';
      case 'rare': return 'text-blue-400 border-blue-500';
      case 'common': return 'text-gray-400 border-gray-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': case 'active': case 'connected': return 'text-green-400 border-green-500';
      case 'setup': case 'syncing': return 'text-yellow-400 border-yellow-500';
      case 'offline': case 'closed': case 'disconnected': return 'text-gray-400 border-gray-500';
      case 'maintenance': case 'error': return 'text-red-400 border-red-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-20 left-4 z-50"
      >
        <Button
          onClick={onToggle}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Gamepad2 className="h-6 w-6 text-white" />
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
        "w-[1150px] h-[850px] bg-gradient-to-br from-gray-900 via-indigo-900 to-cyan-900",
        "border border-indigo-500/50 rounded-xl shadow-2xl backdrop-blur-xl",
        "cursor-move select-none overflow-hidden"
      )}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="drag-handle flex items-center justify-between p-4 border-b border-indigo-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <Gamepad2 className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Metaverse Commerce Bridge</h3>
            <p className="text-sm text-indigo-300">Virtual Reality Shopping & Avatar Commerce Platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("border-green-500", metaverseEnabled ? "text-green-400" : "text-gray-400")}>
            {metaverseEnabled ? <Globe className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
            {metaverseEnabled ? 'Connected' : 'Offline'}
          </Badge>
          <Badge variant="outline" className="border-purple-500 text-purple-400">
            {vrMode ? 'VR' : 'Desktop'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshMetaverseData}
            disabled={isConnecting}
            className="text-indigo-400 hover:text-white hover:bg-indigo-600/20"
          >
            <RotateCcw className={cn("h-4 w-4", isConnecting && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-indigo-400 hover:text-white hover:bg-indigo-600/20"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100%-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-black/20 border-r border-indigo-500/30 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Metaverse Status */}
            <div>
              <Label className="text-indigo-300 text-sm font-medium">Metaverse Status</Label>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Active Worlds:</span>
                  <span className="text-indigo-400 font-medium">{metaverseMetrics.activeWorlds || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Users:</span>
                  <span className="text-green-400 font-medium">{(metaverseMetrics.totalUsers || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sales Volume:</span>
                  <span className="text-purple-400 font-medium">${(metaverseMetrics.salesVolume || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Avg Session:</span>
                  <span className="text-white font-medium">{metaverseMetrics.averageSession || 0} min</span>
                </div>
              </div>
            </div>

            <Separator className="bg-indigo-500/30" />

            {/* VR/AR Settings */}
            <div>
              <Label className="text-indigo-300 text-sm font-medium">Immersive Settings</Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300 text-sm">Metaverse Bridge</Label>
                  <Switch
                    checked={metaverseEnabled}
                    onCheckedChange={setMetaverseEnabled}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300 text-sm">VR Mode</Label>
                  <Switch
                    checked={vrMode}
                    onCheckedChange={setVrMode}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300 text-sm">AR Mode</Label>
                  <Switch
                    checked={arMode}
                    onCheckedChange={setArMode}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-indigo-300 text-sm">Voice Chat</Label>
                  <Switch
                    checked={voiceChat}
                    onCheckedChange={setVoiceChat}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-indigo-300 text-sm font-medium">Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="mt-1 bg-gray-800/50 border-indigo-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-indigo-500/30">
                  <SelectItem value="VRChat" className="text-white hover:bg-indigo-600/20">VRChat</SelectItem>
                  <SelectItem value="Horizon" className="text-white hover:bg-indigo-600/20">Meta Horizon</SelectItem>
                  <SelectItem value="Roblox" className="text-white hover:bg-indigo-600/20">Roblox</SelectItem>
                  <SelectItem value="Fortnite" className="text-white hover:bg-indigo-600/20">Fortnite Creative</SelectItem>
                  <SelectItem value="Custom" className="text-white hover:bg-indigo-600/20">Custom World</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-indigo-500/30" />

            {/* Current Avatar */}
            <div>
              <Label className="text-indigo-300 text-sm font-medium">Current Avatar</Label>
              <div className="mt-2">
                {avatars.length > 0 && (
                  <div className="flex items-center gap-3 p-2 bg-gray-800/30 rounded">
                    <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{avatars[0].name}</p>
                      <p className="text-sm text-gray-400">Level {avatars[0].stats.level}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-indigo-500/30" />

            {/* Cross-Platform Sync */}
            <div>
              <Label className="text-indigo-300 text-sm font-medium">Platform Sync</Label>
              <div className="mt-2 space-y-2">
                {crossPlatformSync.slice(0, 3).map(sync => (
                  <div key={sync.id} className="flex items-center justify-between text-sm bg-gray-800/30 rounded p-2">
                    <span className="text-gray-400">{sync.platform}:</span>
                    <Badge variant="outline" className={getStatusColor(sync.status)}>
                      {sync.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-indigo-500/30" />

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                onClick={() => enterVirtualWorld(selectedWorld)}
                disabled={isConnecting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Globe className="h-4 w-4 mr-2" />
                Enter Metaverse
              </Button>
              
              <Button
                onClick={() => createVirtualStore({ name: 'My Store', category: 'Fashion', theme: 'Cyberpunk' })}
                variant="outline"
                className="w-full border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/20"
              >
                <Package className="h-4 w-4 mr-2" />
                Create Store
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Avatar
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-indigo-600">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="worlds" className="data-[state=active]:bg-indigo-600">
                Virtual Worlds
              </TabsTrigger>
              <TabsTrigger value="stores" className="data-[state=active]:bg-indigo-600">
                Virtual Stores
              </TabsTrigger>
              <TabsTrigger value="avatars" className="data-[state=active]:bg-indigo-600">
                Avatars
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-indigo-600">
                Virtual Products
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-indigo-600">
                Social
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-4 space-y-4">
              {/* Metaverse Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800/50 border-indigo-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Virtual Stores</p>
                        <p className="text-2xl font-bold text-white">{metaverseMetrics.virtualStores || 0}</p>
                      </div>
                      <Package className="h-8 w-8 text-indigo-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-indigo-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Active Users</p>
                        <p className="text-2xl font-bold text-white">{(metaverseMetrics.totalUsers || 0).toLocaleString()}</p>
                      </div>
                      <Users className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-indigo-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Sales Volume</p>
                        <p className="text-2xl font-bold text-white">${(metaverseMetrics.salesVolume || 0) / 1000}K</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-indigo-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Avatars Created</p>
                        <p className="text-2xl font-bold text-white">{(metaverseMetrics.avatarCreated || 0).toLocaleString()}</p>
                      </div>
                      <UserCircle className="h-8 w-8 text-cyan-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Featured Virtual Worlds */}
              <Card className="bg-gray-800/50 border-indigo-500/30">
                <CardHeader>
                  <CardTitle className="text-indigo-300 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Featured Virtual Worlds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {virtualWorlds.slice(0, 3).map(world => (
                      <div key={world.id} className="relative rounded-lg overflow-hidden bg-gray-700/30">
                        <img 
                          src={world.thumbnail} 
                          alt={world.name}
                          className="w-full h-32 object-cover bg-gray-600"
                        />
                        <div className="p-3">
                          <h4 className="font-medium text-white">{world.name}</h4>
                          <p className="text-sm text-gray-400 mb-2">{world.platform}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={getStatusColor(world.status)}>
                              {world.status}
                            </Badge>
                            <span className="text-sm text-gray-400">{world.playerCount} users</span>
                          </div>
                          <Button 
                            onClick={() => enterVirtualWorld(world.id)}
                            size="sm" 
                            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700"
                          >
                            Enter World
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Social Activity */}
              <Card className="bg-gray-800/50 border-indigo-500/30">
                <CardHeader>
                  <CardTitle className="text-indigo-300 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Social Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {socialInteractions.slice(0, 5).map(interaction => (
                      <div key={interaction.id} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <Badge variant="outline" className="border-blue-500 text-blue-400">
                          {interaction.type}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm text-white">{interaction.content}</p>
                          <p className="text-xs text-gray-500">{interaction.fromUser} → {interaction.toUser}</p>
                        </div>
                        <span className="text-xs text-gray-400">{interaction.timestamp.toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="worlds" className="mt-4">
              {/* Virtual Worlds */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Virtual Shopping Worlds</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {virtualWorlds.map(world => (
                    <Card key={world.id} className="bg-gray-800/50 border-indigo-500/30 hover:border-indigo-400/50 transition-colors">
                      <CardContent className="p-4">
                        <img 
                          src={world.thumbnail} 
                          alt={world.name}
                          className="w-full h-40 object-cover rounded-lg bg-gray-600 mb-3"
                        />
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-white">{world.name}</h4>
                          <p className="text-sm text-gray-400">{world.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              {world.platform}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(world.status)}>
                              {world.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">Players:</span>
                              <p className="font-medium text-white">{world.playerCount}/{world.maxPlayers}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Stores:</span>
                              <p className="font-medium text-white">{world.storeCount}</p>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-400 text-sm">Revenue (24h):</span>
                            <p className="font-bold text-purple-400">${world.revenue24h.toFixed(0)}</p>
                          </div>
                          
                          <Button 
                            onClick={() => enterVirtualWorld(world.id)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                          >
                            Enter World
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stores" className="mt-4">
              {/* Virtual Stores */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Virtual Stores</h3>
                  <Button onClick={() => createVirtualStore({ name: 'New Store', category: 'Tech', theme: 'Futuristic' })} className="bg-indigo-600 hover:bg-indigo-700">
                    <Package className="h-4 w-4 mr-2" />
                    Create Store
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {virtualStores.map(store => (
                    <Card key={store.id} className="bg-gray-800/50 border-indigo-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-medium text-white">{store.name}</h4>
                              <Badge variant="outline" className="border-purple-500 text-purple-400">
                                {store.category}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(store.status)}>
                                {store.status}
                              </Badge>
                              {store.vrExperience && (
                                <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                                  VR
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-400">Visitors (24h):</span>
                                <p className="font-medium text-white">{store.visitors24h}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Revenue (24h):</span>
                                <p className="font-medium text-white">${store.revenue24h.toFixed(0)}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Rating:</span>
                                <p className="font-medium text-white">{store.rating.toFixed(1)} ⭐</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Products:</span>
                                <p className="font-medium text-white">{store.products}</p>
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-sm text-gray-400">Theme: {store.theme}</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {store.immersiveFeatures.map((feature, i) => (
                                  <Badge key={i} variant="outline" className="border-indigo-500/50 text-indigo-300 text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                              <Eye className="h-4 w-4 mr-1" />
                              Visit
                            </Button>
                            <Button size="sm" variant="outline" className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/20">
                              <Settings className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="avatars" className="mt-4">
              {/* Avatar Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Avatar Collection</h3>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Create Avatar
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {avatars.map(avatar => (
                    <Card key={avatar.id} className="bg-gray-800/50 border-indigo-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center">
                            <UserCircle className="h-10 w-10 text-indigo-400" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-white">{avatar.name}</h4>
                              <Badge variant="outline" className="border-blue-500 text-blue-400">
                                {avatar.platform}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div>
                                <span className="text-gray-400">Level:</span>
                                <p className="font-medium text-white">{avatar.stats.level}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Experience:</span>
                                <p className="font-medium text-white">{avatar.stats.experience}</p>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <span className="text-sm text-gray-400">Appearance:</span>
                              <p className="text-sm text-white">
                                {avatar.appearance.model} • {avatar.appearance.skin} • {avatar.appearance.hair}
                              </p>
                            </div>
                            
                            <div className="mb-3">
                              <span className="text-sm text-gray-400">Equipped Items:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {avatar.appearance.clothing.slice(0, 3).map((item, i) => (
                                  <Badge key={i} variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => customizeAvatar(avatar.id, { skin: 'new-skin' })}
                                size="sm" 
                                className="bg-indigo-600 hover:bg-indigo-700"
                              >
                                <Palette className="h-3 w-3 mr-1" />
                                Customize
                              </Button>
                              <Button size="sm" variant="outline" className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/20">
                                <Shirt className="h-3 w-3 mr-1" />
                                Wardrobe
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-4">
              {/* Virtual Products */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Virtual Product Marketplace</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {virtualProducts.map(product => (
                    <Card key={product.id} className="bg-gray-800/50 border-indigo-500/30 hover:border-indigo-400/50 transition-colors">
                      <CardContent className="p-3">
                        <div className="w-full h-32 bg-gray-600 rounded-lg mb-3 flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-white truncate">{product.name}</h4>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={getRarityColor(product.rarity)}>
                              {product.rarity}
                            </Badge>
                            <Badge variant="outline" className="border-gray-500 text-gray-400">
                              {product.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">Price</p>
                              <p className="font-bold text-white">${product.price.toFixed(0)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Rating</p>
                              <p className="font-bold text-white">{product.rating.toFixed(1)} ⭐</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500">Sales: {product.sales}</p>
                            <p className="text-xs text-gray-500">Platforms: {product.metaverse.length}</p>
                          </div>
                          
                          <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Buy Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="mt-4">
              {/* Social Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Social Interactions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-800/50 border-indigo-500/30">
                    <CardHeader>
                      <CardTitle className="text-indigo-300 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Recent Interactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {socialInteractions.slice(0, 6).map(interaction => (
                          <div key={interaction.id} className="flex items-center gap-3 p-2 bg-gray-700/30 rounded">
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              {interaction.type}
                            </Badge>
                            <div className="flex-1">
                              <p className="text-sm text-white">{interaction.content}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{interaction.fromUser}</span>
                                <span>→</span>
                                <span>{interaction.toUser}</span>
                                <span>•</span>
                                <span>{interaction.timestamp.toLocaleTimeString()}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className={getStatusColor(interaction.status)}>
                              {interaction.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-indigo-500/30">
                    <CardHeader>
                      <CardTitle className="text-indigo-300 flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Cross-Platform Sync
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {crossPlatformSync.map(sync => (
                          <div key={sync.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
                            <div>
                              <h4 className="font-medium text-white">{sync.platform}</h4>
                              <p className="text-sm text-gray-400">Account: {sync.accountId.slice(0, 8)}...</p>
                              <p className="text-xs text-gray-500">Last sync: {sync.lastSync.toLocaleString()}</p>
                            </div>
                            <Badge variant="outline" className={getStatusColor(sync.status)}>
                              {sync.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}