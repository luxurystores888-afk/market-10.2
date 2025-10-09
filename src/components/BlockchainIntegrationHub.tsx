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
  Coins, Wallet, Link, Globe, Cpu, Database,
  Zap, Settings, RotateCcw, Download, Upload,
  Image, Play, Pause, CheckCircle, XCircle,
  TrendingUp, TrendingDown, BarChart3, PieChart,
  Users, ShoppingCart, Activity, Target, Hash,
  Key, Lock, Unlock, Eye, EyeOff, Search,
  ArrowUp, ArrowDown, ArrowRight, Plus, Minus,
  Star, Heart, Share2, ExternalLink, Copy
} from 'lucide-react';
// Simple toast implementation since useToast is not available
const useToast = () => ({
  toast: ({ title, description, variant }: any) => {
    console.log(`${variant === 'destructive' ? '❌' : '✅'} ${title}: ${description}`);
  }
});

// Types
interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  totalSupply: number;
  mintedCount: number;
  floorPrice: number;
  volume24h: number;
  owners: number;
  royalty: number;
  creator: string;
  verified: boolean;
  blockchain: 'ethereum' | 'polygon' | 'solana' | 'avalanche';
  contractAddress: string;
  created: Date;
}

interface NFTItem {
  id: string;
  tokenId: string;
  collectionId: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  traits: Array<{ trait_type: string; value: string; rarity: number }>;
  price: number;
  lastSale: number;
  owner: string;
  creator: string;
  listed: boolean;
  blockchain: string;
  contractAddress: string;
  tokenStandard: 'ERC-721' | 'ERC-1155' | 'SPL-Token';
  metadata: any;
}

interface SmartContract {
  id: string;
  name: string;
  type: 'ERC-20' | 'ERC-721' | 'ERC-1155' | 'Custom';
  address: string;
  blockchain: string;
  status: 'deployed' | 'pending' | 'failed' | 'verified';
  deployedAt: Date;
  gasUsed: number;
  totalSupply?: number;
  decimals?: number;
  symbol?: string;
  functions: string[];
  events: string[];
  verified: boolean;
  auditScore: number;
}

interface WalletConnection {
  id: string;
  address: string;
  type: 'MetaMask' | 'WalletConnect' | 'Coinbase' | 'Phantom' | 'Rainbow';
  blockchain: string;
  balance: number;
  tokenBalances: Array<{ symbol: string; balance: number; value: number }>;
  nftCount: number;
  transactionCount: number;
  connected: boolean;
  lastActivity: Date;
}

interface BlockchainTransaction {
  id: string;
  hash: string;
  type: 'mint' | 'transfer' | 'sale' | 'bid' | 'deploy';
  from: string;
  to: string;
  value: number;
  gasUsed: number;
  gasPrice: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockchain: string;
  blockNumber: number;
  timestamp: Date;
  nftTokenId?: string;
  contractAddress?: string;
}

interface DeFiIntegration {
  id: string;
  protocol: 'Uniswap' | 'SushiSwap' | 'Curve' | 'Aave' | 'Compound';
  type: 'dex' | 'lending' | 'staking' | 'yield_farming';
  tvl: number;
  apy: number;
  userBalance: number;
  rewards: number;
  status: 'active' | 'paused' | 'emergency';
  riskLevel: 'low' | 'medium' | 'high';
}

interface BlockchainIntegrationHubProps {
  isOpen?: boolean;
  onToggle?: () => void;
  position?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export default function BlockchainIntegrationHub({
  isOpen = true,
  onToggle = () => {},
  position = { x: 100, y: 100 },
  onPositionChange = () => {}
}: BlockchainIntegrationHubProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnecting, setIsConnecting] = useState(false);
  const [web3Enabled, setWeb3Enabled] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [selectedBlockchain, setSelectedBlockchain] = useState('ethereum');
  const [selectedWallet, setSelectedWallet] = useState('MetaMask');
  
  // Data states
  const [nftCollections, setNftCollections] = useState<NFTCollection[]>([]);
  const [nftItems, setNftItems] = useState<NFTItem[]>([]);
  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);
  const [walletConnections, setWalletConnections] = useState<WalletConnection[]>([]);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [defiIntegrations, setDefiIntegrations] = useState<DeFiIntegration[]>([]);
  const [blockchainMetrics, setBlockchainMetrics] = useState<any>({});

  // Mock data generators
  const generateMockNFTCollections = (): NFTCollection[] => {
    const names = ['Cyber Punks', 'Neural Networks', 'Quantum Crystals', 'Digital Spirits', 'Tech Oracles'];
    const blockchains: ('ethereum' | 'polygon' | 'solana' | 'avalanche')[] = ['ethereum', 'polygon', 'solana', 'avalanche'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: `collection-${i}`,
      name: names[i % names.length],
      symbol: `CP${i}`,
      description: `A collection of ${names[i % names.length]} representing the future of digital art and technology.`,
      image: `https://api.dicebear.com/7.x/shapes/svg?seed=collection${i}`,
      totalSupply: Math.floor(Math.random() * 10000) + 1000,
      mintedCount: Math.floor(Math.random() * 8000) + 500,
      floorPrice: Math.random() * 2 + 0.1, // 0.1-2.1 ETH
      volume24h: Math.random() * 1000 + 100,
      owners: Math.floor(Math.random() * 5000) + 200,
      royalty: Math.floor(Math.random() * 10) + 2, // 2-12%
      creator: `0x${Math.random().toString(16).substr(2, 8)}...`,
      verified: Math.random() > 0.3,
      blockchain: blockchains[Math.floor(Math.random() * blockchains.length)],
      contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Last year
    }));
  };

  const generateMockNFTItems = (): NFTItem[] => {
    const rarities: ('common' | 'uncommon' | 'rare' | 'epic' | 'legendary')[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const standards: ('ERC-721' | 'ERC-1155' | 'SPL-Token')[] = ['ERC-721', 'ERC-1155', 'SPL-Token'];
    
    return Array.from({ length: 12 }, (_, i) => {
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      const price = getRarityPrice(rarity);
      
      return {
        id: `nft-${i}`,
        tokenId: `${i + 1}`,
        collectionId: `collection-${Math.floor(Math.random() * 3)}`,
        name: `Cyber Item #${i + 1}`,
        description: `A unique digital asset with ${rarity} rarity and special properties.`,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=nft${i}`,
        rarity,
        traits: generateTraits(rarity),
        price,
        lastSale: price * (0.8 + Math.random() * 0.4), // ±20% of current price
        owner: `0x${Math.random().toString(16).substr(2, 8)}...`,
        creator: `0x${Math.random().toString(16).substr(2, 8)}...`,
        listed: Math.random() > 0.4,
        blockchain: 'ethereum',
        contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        tokenStandard: standards[Math.floor(Math.random() * standards.length)],
        metadata: { attributes: [], external_url: '', animation_url: '' }
      };
    });
  };

  const getRarityPrice = (rarity: string): number => {
    const prices = {
      common: 0.1 + Math.random() * 0.4, // 0.1-0.5 ETH
      uncommon: 0.3 + Math.random() * 0.7, // 0.3-1.0 ETH
      rare: 0.8 + Math.random() * 1.2, // 0.8-2.0 ETH
      epic: 1.5 + Math.random() * 2.5, // 1.5-4.0 ETH
      legendary: 3.0 + Math.random() * 7.0 // 3.0-10.0 ETH
    };
    return prices[rarity as keyof typeof prices];
  };

  const generateTraits = (rarity: string): Array<{ trait_type: string; value: string; rarity: number }> => {
    const traits = [
      { trait_type: 'Background', value: ['Cyber', 'Neon', 'Matrix', 'Void', 'Quantum'][Math.floor(Math.random() * 5)], rarity: Math.random() * 100 },
      { trait_type: 'Eyes', value: ['Laser', 'Holographic', 'Neural', 'Cyber', 'Digital'][Math.floor(Math.random() * 5)], rarity: Math.random() * 100 },
      { trait_type: 'Accessory', value: ['Neural Link', 'Cyber Implant', 'Quantum Chip', 'Data Core'][Math.floor(Math.random() * 4)], rarity: Math.random() * 100 }
    ];
    
    // Legendary gets more traits
    if (rarity === 'legendary') traits.push({ trait_type: 'Aura', value: 'Legendary Glow', rarity: 1 });
    
    return traits;
  };

  const generateMockSmartContracts = (): SmartContract[] => {
    const types: ('ERC-20' | 'ERC-721' | 'ERC-1155' | 'Custom')[] = ['ERC-20', 'ERC-721', 'ERC-1155', 'Custom'];
    const statuses: ('deployed' | 'pending' | 'failed' | 'verified')[] = ['deployed', 'pending', 'failed', 'verified'];
    
    return Array.from({ length: 6 }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      
      return {
        id: `contract-${i}`,
        name: `${type} Contract ${i + 1}`,
        type,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        blockchain: 'ethereum',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        deployedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
        gasUsed: Math.floor(Math.random() * 5000000) + 100000,
        totalSupply: type === 'ERC-20' ? Math.floor(Math.random() * 1000000000) : undefined,
        decimals: type === 'ERC-20' ? 18 : undefined,
        symbol: type === 'ERC-20' ? `TKN${i}` : undefined,
        functions: getFunctionsByType(type),
        events: getEventsByType(type),
        verified: Math.random() > 0.3,
        auditScore: Math.floor(Math.random() * 40) + 60 // 60-100
      };
    });
  };

  const getFunctionsByType = (type: string): string[] => {
    const functions = {
      'ERC-20': ['transfer', 'approve', 'balanceOf', 'totalSupply', 'mint', 'burn'],
      'ERC-721': ['ownerOf', 'approve', 'transferFrom', 'mint', 'burn', 'tokenURI'],
      'ERC-1155': ['balanceOf', 'setApprovalForAll', 'safeTransferFrom', 'mint', 'burn'],
      'Custom': ['initialize', 'execute', 'stake', 'withdraw', 'claim', 'updateConfig']
    };
    return functions[type as keyof typeof functions] || [];
  };

  const getEventsByType = (type: string): string[] => {
    const events = {
      'ERC-20': ['Transfer', 'Approval'],
      'ERC-721': ['Transfer', 'Approval', 'ApprovalForAll'],
      'ERC-1155': ['TransferSingle', 'TransferBatch', 'ApprovalForAll'],
      'Custom': ['Initialized', 'Executed', 'Staked', 'Withdrawn']
    };
    return events[type as keyof typeof events] || [];
  };

  const generateMockWalletConnections = (): WalletConnection[] => {
    const types: ('MetaMask' | 'WalletConnect' | 'Coinbase' | 'Phantom' | 'Rainbow')[] = 
      ['MetaMask', 'WalletConnect', 'Coinbase', 'Phantom', 'Rainbow'];
    const blockchains = ['ethereum', 'polygon', 'solana', 'avalanche'];
    
    return Array.from({ length: 3 }, (_, i) => ({
      id: `wallet-${i}`,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      type: types[i % types.length],
      blockchain: blockchains[i % blockchains.length],
      balance: Math.random() * 10 + 0.1, // 0.1-10.1 ETH
      tokenBalances: [
        { symbol: 'USDC', balance: Math.floor(Math.random() * 10000), value: Math.floor(Math.random() * 10000) },
        { symbol: 'WETH', balance: Math.random() * 5, value: Math.floor(Math.random() * 8000) },
        { symbol: 'DAI', balance: Math.floor(Math.random() * 5000), value: Math.floor(Math.random() * 5000) }
      ],
      nftCount: Math.floor(Math.random() * 50) + 5,
      transactionCount: Math.floor(Math.random() * 1000) + 50,
      connected: i === 0, // First wallet connected
      lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Last 24 hours
    }));
  };

  const generateMockTransactions = (): BlockchainTransaction[] => {
    const types: ('mint' | 'transfer' | 'sale' | 'bid' | 'deploy')[] = ['mint', 'transfer', 'sale', 'bid', 'deploy'];
    const statuses: ('pending' | 'confirmed' | 'failed')[] = ['pending', 'confirmed', 'failed'];
    
    return Array.from({ length: 15 }, (_, i) => ({
      id: `tx-${i}`,
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      type: types[Math.floor(Math.random() * types.length)],
      from: `0x${Math.random().toString(16).substr(2, 8)}...`,
      to: `0x${Math.random().toString(16).substr(2, 8)}...`,
      value: Math.random() * 5 + 0.01,
      gasUsed: Math.floor(Math.random() * 500000) + 21000,
      gasPrice: Math.floor(Math.random() * 100) + 20, // 20-120 gwei
      status: statuses[Math.floor(Math.random() * statuses.length)],
      blockchain: 'ethereum',
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
      nftTokenId: Math.random() > 0.5 ? `${Math.floor(Math.random() * 10000)}` : undefined,
      contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`
    }));
  };

  const generateMockDeFiIntegrations = (): DeFiIntegration[] => {
    const protocols: ('Uniswap' | 'SushiSwap' | 'Curve' | 'Aave' | 'Compound')[] = 
      ['Uniswap', 'SushiSwap', 'Curve', 'Aave', 'Compound'];
    const types: ('dex' | 'lending' | 'staking' | 'yield_farming')[] = ['dex', 'lending', 'staking', 'yield_farming'];
    const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    
    return protocols.map((protocol, i) => ({
      id: `defi-${i}`,
      protocol,
      type: types[i % types.length],
      tvl: Math.floor(Math.random() * 1000000000) + 10000000, // 10M-1B
      apy: Math.random() * 50 + 2, // 2-52%
      userBalance: Math.random() * 10000 + 100,
      rewards: Math.random() * 500 + 10,
      status: Math.random() > 0.1 ? 'active' : 'paused',
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)]
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
      refreshBlockchainData();
    }
  }, [isOpen]);

  // Auto-sync
  useEffect(() => {
    if (autoSync) {
      const interval = setInterval(() => {
        syncBlockchainData();
      }, 45000); // Sync every 45 seconds

      return () => clearInterval(interval);
    }
  }, [autoSync]);

  const refreshBlockchainData = async () => {
    setIsConnecting(true);
    
    try {
      console.log('⛓️ Refreshing blockchain data');
      
      // Simulate blockchain API calls
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setNftCollections(generateMockNFTCollections());
      setNftItems(generateMockNFTItems());
      setSmartContracts(generateMockSmartContracts());
      setWalletConnections(generateMockWalletConnections());
      setTransactions(generateMockTransactions());
      setDefiIntegrations(generateMockDeFiIntegrations());

      // Generate blockchain metrics
      setBlockchainMetrics({
        totalNFTs: 1250,
        totalVolume: 45687.8,
        activeContracts: 89,
        connectedWallets: 3,
        totalTVL: 125000000,
        averageGas: 45,
        blockHeight: 18456789,
        networkHealth: 97
      });

      toast({
        title: "Blockchain Data Synced",
        description: "Latest Web3 data and NFT marketplace updated",
      });

    } catch (error) {
      console.error('Error refreshing blockchain data:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to refresh blockchain data",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const syncBlockchainData = async () => {
    if (isConnecting) return;
    
    console.log('🔄 Syncing blockchain data');
    
    // Update existing data with small changes
    setTransactions(prev => [generateMockTransactions()[0], ...prev.slice(0, 14)]);
    
    // Update metrics
    setBlockchainMetrics((prev: any) => ({
      ...prev,
      blockHeight: prev.blockHeight + Math.floor(Math.random() * 5) + 1,
      averageGas: Math.max(10, prev.averageGas + (Math.random() - 0.5) * 10),
      networkHealth: Math.max(85, Math.min(100, prev.networkHealth + (Math.random() - 0.5) * 5))
    }));
  };

  const connectWallet = async (walletType: string) => {
    try {
      setIsConnecting(true);
      console.log('🔗 Connecting wallet:', walletType);
      
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setWalletConnections(prev => 
        prev.map(wallet => 
          wallet.type === walletType 
            ? { ...wallet, connected: true, lastActivity: new Date() }
            : wallet
        )
      );

      toast({
        title: "Wallet Connected",
        description: `${walletType} wallet connected successfully`,
      });

    } catch (error) {
      console.error('Wallet connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const deployContract = async (contractData: any) => {
    try {
      console.log('🚀 Deploying smart contract:', contractData);
      
      const newContract: SmartContract = {
        id: `contract-${Date.now()}`,
        name: contractData.name,
        type: contractData.type,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        blockchain: selectedBlockchain,
        status: 'pending',
        deployedAt: new Date(),
        gasUsed: Math.floor(Math.random() * 5000000) + 100000,
        functions: getFunctionsByType(contractData.type),
        events: getEventsByType(contractData.type),
        verified: false,
        auditScore: 0
      };
      
      setSmartContracts(prev => [newContract, ...prev]);

      toast({
        title: "Contract Deployment Started",
        description: "Smart contract deployment is in progress",
      });

      // Simulate deployment completion
      setTimeout(() => {
        setSmartContracts(prev => 
          prev.map(contract => 
            contract.id === newContract.id 
              ? { ...contract, status: 'deployed', verified: true, auditScore: 85 }
              : contract
          )
        );
        
        toast({
          title: "Contract Deployed",
          description: "Smart contract deployed successfully",
        });
      }, 5000);

    } catch (error) {
      console.error('Contract deployment failed:', error);
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy smart contract",
        variant: "destructive"
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-400 border-purple-500';
      case 'epic': return 'text-pink-400 border-pink-500';
      case 'rare': return 'text-blue-400 border-blue-500';
      case 'uncommon': return 'text-green-400 border-green-500';
      case 'common': return 'text-gray-400 border-gray-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': case 'verified': case 'confirmed': case 'active': return 'text-green-400 border-green-500';
      case 'pending': return 'text-yellow-400 border-yellow-500';
      case 'failed': return 'text-red-400 border-red-500';
      case 'paused': return 'text-orange-400 border-orange-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 border-green-500';
      case 'medium': return 'text-yellow-400 border-yellow-500';
      case 'high': return 'text-red-400 border-red-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-72 z-50"
      >
        <Button
          onClick={onToggle}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Coins className="h-6 w-6 text-white" />
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
        "w-[1100px] h-[800px] bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900",
        "border border-purple-500/50 rounded-xl shadow-2xl backdrop-blur-xl",
        "cursor-move select-none overflow-hidden"
      )}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="drag-handle flex items-center justify-between p-4 border-b border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <Coins className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Blockchain Integration Hub</h3>
            <p className="text-sm text-purple-300">Web3 NFT Marketplace & Smart Contract Platform</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("border-green-500", web3Enabled ? "text-green-400" : "text-gray-400")}>
            {web3Enabled ? <Link className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
            {web3Enabled ? 'Web3 Active' : 'Offline'}
          </Badge>
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            Block: {blockchainMetrics.blockHeight || 0}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshBlockchainData}
            disabled={isConnecting}
            className="text-purple-400 hover:text-white hover:bg-purple-600/20"
          >
            <RotateCcw className={cn("h-4 w-4", isConnecting && "animate-spin")} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-purple-400 hover:text-white hover:bg-purple-600/20"
          >
            ✕
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100%-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-black/20 border-r border-purple-500/30 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Blockchain Status */}
            <div>
              <Label className="text-purple-300 text-sm font-medium">Blockchain Status</Label>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Health:</span>
                  <span className="text-green-400 font-medium">{blockchainMetrics.networkHealth || 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Volume:</span>
                  <span className="text-purple-400 font-medium">{(blockchainMetrics.totalVolume || 0).toFixed(1)}Ξ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Gas Price:</span>
                  <span className="text-blue-400 font-medium">{blockchainMetrics.averageGas || 0} gwei</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Connected Wallets:</span>
                  <span className="text-white font-medium">{blockchainMetrics.connectedWallets || 0}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-purple-500/30" />

            {/* Web3 Configuration */}
            <div>
              <Label className="text-purple-300 text-sm font-medium">Web3 Settings</Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-purple-300 text-sm">Web3 Integration</Label>
                  <Switch
                    checked={web3Enabled}
                    onCheckedChange={setWeb3Enabled}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-purple-300 text-sm">Auto Sync</Label>
                  <Switch
                    checked={autoSync}
                    onCheckedChange={setAutoSync}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-purple-300 text-sm font-medium">Blockchain Network</Label>
              <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
                <SelectTrigger className="mt-1 bg-gray-800/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <SelectItem value="ethereum" className="text-white hover:bg-purple-600/20">Ethereum</SelectItem>
                  <SelectItem value="polygon" className="text-white hover:bg-purple-600/20">Polygon</SelectItem>
                  <SelectItem value="solana" className="text-white hover:bg-purple-600/20">Solana</SelectItem>
                  <SelectItem value="avalanche" className="text-white hover:bg-purple-600/20">Avalanche</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-purple-300 text-sm font-medium">Wallet Provider</Label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger className="mt-1 bg-gray-800/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-500/30">
                  <SelectItem value="MetaMask" className="text-white hover:bg-purple-600/20">MetaMask</SelectItem>
                  <SelectItem value="WalletConnect" className="text-white hover:bg-purple-600/20">WalletConnect</SelectItem>
                  <SelectItem value="Coinbase" className="text-white hover:bg-purple-600/20">Coinbase Wallet</SelectItem>
                  <SelectItem value="Rainbow" className="text-white hover:bg-purple-600/20">Rainbow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-purple-500/30" />

            {/* Connected Wallets */}
            <div>
              <Label className="text-purple-300 text-sm font-medium">Connected Wallets</Label>
              <div className="mt-2 space-y-2">
                {walletConnections.filter(w => w.connected).map(wallet => (
                  <div key={wallet.id} className="flex items-center justify-between text-sm bg-gray-800/30 rounded p-2">
                    <div>
                      <p className="text-white font-medium">{wallet.type}</p>
                      <p className="text-gray-400">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</p>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      {wallet.balance.toFixed(2)}Ξ
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-purple-500/30" />

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                onClick={() => connectWallet(selectedWallet)}
                disabled={isConnecting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
              
              <Button
                onClick={() => deployContract({ name: 'New NFT Collection', type: 'ERC-721' })}
                variant="outline"
                className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
              >
                <Zap className="h-4 w-4 mr-2" />
                Deploy Contract
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-600/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="nft" className="data-[state=active]:bg-purple-600">
                NFT Marketplace
              </TabsTrigger>
              <TabsTrigger value="contracts" className="data-[state=active]:bg-purple-600">
                Smart Contracts
              </TabsTrigger>
              <TabsTrigger value="defi" className="data-[state=active]:bg-purple-600">
                DeFi
              </TabsTrigger>
              <TabsTrigger value="wallets" className="data-[state=active]:bg-purple-600">
                Wallets
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600">
                Transactions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-4 space-y-4">
              {/* Web3 Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800/50 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total NFTs</p>
                        <p className="text-2xl font-bold text-white">{blockchainMetrics.totalNFTs || 0}</p>
                      </div>
                      <Image className="h-8 w-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Volume (24h)</p>
                        <p className="text-2xl font-bold text-white">{(blockchainMetrics.totalVolume || 0).toFixed(1)}Ξ</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Smart Contracts</p>
                        <p className="text-2xl font-bold text-white">{blockchainMetrics.activeContracts || 0}</p>
                      </div>
                      <Cpu className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">TVL</p>
                        <p className="text-2xl font-bold text-white">${(blockchainMetrics.totalTVL || 0) / 1000000}M</p>
                      </div>
                      <Database className="h-8 w-8 text-cyan-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top NFT Collections */}
              <Card className="bg-gray-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Top NFT Collections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nftCollections.slice(0, 4).map(collection => (
                      <div key={collection.id} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <img 
                          src={collection.image} 
                          alt={collection.name}
                          className="w-12 h-12 rounded-lg bg-gray-600"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{collection.name}</h4>
                          <p className="text-sm text-gray-400">{collection.owners} owners</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{collection.floorPrice.toFixed(2)}Ξ</p>
                          <p className="text-sm text-gray-400">Floor</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-gray-800/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-300 flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map(tx => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={getStatusColor(tx.status)}>
                            {tx.type}
                          </Badge>
                          <div>
                            <p className="font-medium text-white">{tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}</p>
                            <p className="text-sm text-gray-400">{tx.timestamp.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{tx.value.toFixed(3)}Ξ</p>
                          <Badge variant="outline" className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nft" className="mt-4">
              {/* NFT Marketplace */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">NFT Marketplace</h3>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Collection
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {nftItems.map(nft => (
                    <Card key={nft.id} className="bg-gray-800/50 border-purple-500/30 hover:border-purple-400/50 transition-colors">
                      <CardContent className="p-3">
                        <img 
                          src={nft.image} 
                          alt={nft.name}
                          className="w-full h-40 object-cover rounded-lg bg-gray-600 mb-3"
                        />
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-white truncate">{nft.name}</h4>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={getRarityColor(nft.rarity)}>
                              {nft.rarity}
                            </Badge>
                            <Badge variant="outline" className="border-gray-500 text-gray-400">
                              #{nft.tokenId}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-400">Price</p>
                              <p className="font-bold text-white">{nft.price.toFixed(3)}Ξ</p>
                            </div>
                            {nft.listed && (
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                Buy Now
                              </Button>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Owner: {nft.owner.slice(0, 6)}...</span>
                            <span>{nft.tokenStandard}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="mt-4">
              {/* Smart Contracts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Smart Contracts</h3>
                  <Button onClick={() => deployContract({ name: 'New Contract', type: 'Custom' })} className="bg-purple-600 hover:bg-purple-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Deploy Contract
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {smartContracts.map(contract => (
                    <Card key={contract.id} className="bg-gray-800/50 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="font-medium text-white">{contract.name}</h4>
                              <Badge variant="outline" className="border-blue-500 text-blue-400">
                                {contract.type}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(contract.status)}>
                                {contract.status}
                              </Badge>
                              {contract.verified && (
                                <Badge variant="outline" className="border-green-500 text-green-400">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-400">Address:</span>
                                <p className="font-mono text-white">{contract.address.slice(0, 8)}...{contract.address.slice(-6)}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Gas Used:</span>
                                <p className="font-medium text-white">{contract.gasUsed.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Audit Score:</span>
                                <p className="font-medium text-white">{contract.auditScore}/100</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Deployed:</span>
                                <p className="font-medium text-white">{contract.deployedAt.toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-sm text-gray-400">Functions:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {contract.functions.slice(0, 3).map((func, i) => (
                                    <Badge key={i} variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
                                      {func}
                                    </Badge>
                                  ))}
                                  {contract.functions.length > 3 && (
                                    <Badge variant="outline" className="border-gray-500/50 text-gray-400 text-xs">
                                      +{contract.functions.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Etherscan
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="defi" className="mt-4">
              {/* DeFi Integrations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">DeFi Protocols</h3>
                
                <div className="grid gap-4">
                  {defiIntegrations.map(defi => (
                    <Card key={defi.id} className="bg-gray-800/50 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <h4 className="text-lg font-bold text-white">{defi.protocol}</h4>
                              <p className="text-sm text-gray-400 capitalize">{defi.type.replace('_', ' ')}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-400">APY</p>
                              <p className="text-xl font-bold text-green-400">{defi.apy.toFixed(2)}%</p>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm text-gray-400">TVL</p>
                              <p className="text-lg font-bold text-white">${(defi.tvl / 1000000).toFixed(1)}M</p>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Your Balance</p>
                              <p className="text-lg font-bold text-white">${defi.userBalance.toFixed(2)}</p>
                            </div>
                            
                            <Badge variant="outline" className={getStatusColor(defi.status)}>
                              {defi.status}
                            </Badge>
                            
                            <Badge variant="outline" className={getRiskColor(defi.riskLevel)}>
                              {defi.riskLevel} risk
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Pending Rewards:</span>
                            <span className="font-medium text-purple-400">${defi.rewards.toFixed(2)}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Stake
                            </Button>
                            <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20">
                              Claim
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wallets" className="mt-4">
              {/* Wallet Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Wallet Connections</h3>
                
                <div className="grid gap-4">
                  {walletConnections.map(wallet => (
                    <Card key={wallet.id} className="bg-gray-800/50 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-600/20 rounded-lg">
                              <Wallet className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{wallet.type}</h4>
                              <p className="text-sm text-gray-400 font-mono">{wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}</p>
                              <p className="text-xs text-gray-500">{wallet.blockchain}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">{wallet.balance.toFixed(4)}Ξ</p>
                            <p className="text-sm text-gray-400">{wallet.nftCount} NFTs</p>
                            <Badge variant="outline" className={wallet.connected ? "border-green-500 text-green-400" : "border-gray-500 text-gray-400"}>
                              {wallet.connected ? "Connected" : "Disconnected"}
                            </Badge>
                          </div>
                        </div>
                        
                        <Separator className="my-3 bg-purple-500/30" />
                        
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Token Balances:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {wallet.tokenBalances.map((token, i) => (
                              <div key={i} className="text-center p-2 bg-gray-700/30 rounded">
                                <p className="text-xs text-gray-400">{token.symbol}</p>
                                <p className="font-medium text-white">{token.balance.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">${token.value.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          {!wallet.connected ? (
                            <Button 
                              onClick={() => connectWallet(wallet.type)}
                              size="sm" 
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              Connect
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="border-red-500/50 text-red-300 hover:bg-red-600/20">
                              Disconnect
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-4">
              {/* Transaction History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Transaction History</h3>
                
                <div className="grid gap-3">
                  {transactions.map(tx => (
                    <Card key={tx.id} className="bg-gray-800/50 border-purple-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={getStatusColor(tx.status)}>
                              {tx.type}
                            </Badge>
                            <div>
                              <p className="font-mono text-white">{tx.hash.slice(0, 16)}...{tx.hash.slice(-12)}</p>
                              <p className="text-sm text-gray-400">{tx.timestamp.toLocaleString()}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>From: {tx.from}</span>
                                <ArrowRight className="h-3 w-3" />
                                <span>To: {tx.to}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">{tx.value.toFixed(4)}Ξ</p>
                            <p className="text-sm text-gray-400">Gas: {tx.gasUsed.toLocaleString()}</p>
                            <Badge variant="outline" className={getStatusColor(tx.status)}>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 text-sm">
                          <div className="flex items-center gap-4 text-gray-500">
                            <span>Block: #{tx.blockNumber}</span>
                            <span>Gas Price: {tx.gasPrice} gwei</span>
                            {tx.nftTokenId && <span>Token: #{tx.nftTokenId}</span>}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20">
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                            <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-600/20">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Explorer
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