import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, DollarSign, TrendingUp, Shield, Zap, 
  ArrowUpRight, ArrowDownLeft, RefreshCw, Copy,
  QrCode, Clock, CheckCircle, AlertTriangle,
  Bitcoin, Coins, Banknote, CreditCard, Smartphone,
  Network, Globe, Lock, Unlock, Eye, EyeOff,
  ArrowRightLeft, BarChart3, PieChart, LineChart,
  Settings, History, Filter, Download, Share2
} from 'lucide-react';

// Simple toast implementation since useToast is not available
const useToast = () => ({
  toast: ({ title, description, variant }: any) => {
    console.log(`${variant === 'destructive' ? '❌' : '✅'} ${title}: ${description}`);
  }
});

// Types
interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change24h: number;
  network: string;
  decimals: number;
  contractAddress?: string;
  isStablecoin: boolean;
  isNative: boolean;
  supported: boolean;
}

interface Wallet {
  id: string;
  type: 'metamask' | 'coinbase' | 'walletconnect' | 'hardware' | 'mobile';
  name: string;
  icon: string;
  address: string;
  connected: boolean;
  balance: Record<string, number>;
  network: string;
  features: string[];
}

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'stake' | 'unstake' | 'swap' | 'nft_purchase';
  status: 'pending' | 'confirming' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  hash?: string;
  blockNumber?: number;
  confirmations: number;
  requiredConfirmations: number;
  fee: number;
  gasUsed?: number;
  gasPrice?: number;
  fromAddress: string;
  toAddress: string;
  timestamp: Date;
  description: string;
  metadata?: Record<string, any>;
}

interface DeFiProtocol {
  id: string;
  name: string;
  icon: string;
  type: 'lending' | 'staking' | 'liquidity' | 'yield' | 'bridge';
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  supported: boolean;
  minAmount: number;
  lockPeriod?: number;
}

interface NFTCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  floorPrice: number;
  volume24h: number;
  supply: number;
  verified: boolean;
  category: string;
}

interface PaymentMethod {
  id: string;
  type: 'crypto' | 'fiat' | 'defi' | 'nft';
  name: string;
  icon: string;
  fees: number;
  processingTime: string;
  available: boolean;
  features: string[];
}

export default function AdvancedCryptoPayments() {
  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  
  // Crypto data
  const [cryptoCurrencies, setCryptoCurrencies] = useState<CryptoCurrency[]>([
    {
      id: 'btc',
      symbol: 'BTC',
      name: 'Bitcoin',
      logo: '₿',
      price: 65432.10,
      change24h: 2.45,
      network: 'Bitcoin',
      decimals: 8,
      isStablecoin: false,
      isNative: true,
      supported: true
    },
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      logo: 'Ξ',
      price: 3124.56,
      change24h: -1.23,
      network: 'Ethereum',
      decimals: 18,
      isStablecoin: false,
      isNative: true,
      supported: true
    },
    {
      id: 'usdc',
      symbol: 'USDC',
      name: 'USD Coin',
      logo: '$',
      price: 1.00,
      change24h: 0.01,
      network: 'Ethereum',
      decimals: 6,
      contractAddress: '0xA0b86a33E6417aBB1a1A74f75b8B5F7e2f5c8d9e',
      isStablecoin: true,
      isNative: false,
      supported: true
    },
    {
      id: 'matic',
      symbol: 'MATIC',
      name: 'Polygon',
      logo: '♦',
      price: 0.83,
      change24h: 5.67,
      network: 'Polygon',
      decimals: 18,
      isStablecoin: false,
      isNative: true,
      supported: true
    },
    {
      id: 'sol',
      symbol: 'SOL',
      name: 'Solana',
      logo: '◉',
      price: 145.23,
      change24h: 3.21,
      network: 'Solana',
      decimals: 9,
      isStablecoin: false,
      isNative: true,
      supported: true
    }
  ]);

  // Wallet state
  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: 'metamask',
      type: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      address: '0x742F...8d9E',
      connected: false,
      balance: {
        'ETH': 2.4567,
        'USDC': 1250.00,
        'BTC': 0.0312
      },
      network: 'Ethereum',
      features: ['DeFi', 'NFTs', 'Swaps', 'Staking']
    },
    {
      id: 'coinbase',
      type: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🟦',
      address: '0x123A...5f7B',
      connected: false,
      balance: {
        'ETH': 1.2345,
        'BTC': 0.0567,
        'SOL': 15.43
      },
      network: 'Multi-chain',
      features: ['Multi-chain', 'DeFi', 'NFTs']
    }
  ]);

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx_001',
      type: 'payment',
      status: 'completed',
      amount: 0.05,
      currency: 'ETH',
      hash: '0xabc123...def789',
      blockNumber: 18234567,
      confirmations: 12,
      requiredConfirmations: 12,
      fee: 0.002,
      gasUsed: 21000,
      gasPrice: 25,
      fromAddress: '0x742F...8d9E',
      toAddress: '0x123A...5f7B',
      timestamp: new Date(),
      description: 'Product Purchase - Wireless Headphones'
    },
    {
      id: 'tx_002',
      type: 'stake',
      status: 'pending',
      amount: 100,
      currency: 'USDC',
      confirmations: 3,
      requiredConfirmations: 6,
      fee: 5.2,
      fromAddress: '0x742F...8d9E',
      toAddress: '0xDeFi...Pool',
      timestamp: new Date(Date.now() - 300000),
      description: 'Stake USDC in Yield Pool'
    }
  ]);

  // DeFi protocols
  const [defiProtocols, setDefiProtocols] = useState<DeFiProtocol[]>([
    {
      id: 'aave',
      name: 'Aave',
      icon: '👻',
      type: 'lending',
      apy: 8.45,
      tvl: 12500000000,
      risk: 'low',
      supported: true,
      minAmount: 10,
      lockPeriod: 0
    },
    {
      id: 'compound',
      name: 'Compound',
      icon: '🏛️',
      type: 'lending',
      apy: 6.23,
      tvl: 8200000000,
      risk: 'low',
      supported: true,
      minAmount: 5,
      lockPeriod: 0
    },
    {
      id: 'ethereum_staking',
      name: 'Ethereum 2.0',
      icon: 'Ξ',
      type: 'staking',
      apy: 4.12,
      tvl: 28000000000,
      risk: 'medium',
      supported: true,
      minAmount: 32,
      lockPeriod: 365
    }
  ]);

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'direct_crypto',
      type: 'crypto',
      name: 'Direct Crypto',
      icon: '₿',
      fees: 0.1,
      processingTime: '5-15 min',
      available: true,
      features: ['Instant', 'Low fees', 'Decentralized']
    },
    {
      id: 'lightning',
      type: 'crypto',
      name: 'Lightning Network',
      icon: '⚡',
      fees: 0.001,
      processingTime: '< 1 min',
      available: true,
      features: ['Instant', 'Micro fees', 'Scalable']
    },
    {
      id: 'defi_payment',
      type: 'defi',
      name: 'DeFi Payment',
      icon: '🔮',
      fees: 0.25,
      processingTime: '2-5 min',
      available: true,
      features: ['Yield earning', 'Programmable', 'Composable']
    },
    {
      id: 'nft_payment',
      type: 'nft',
      name: 'NFT Payment',
      icon: '🎨',
      fees: 2.5,
      processingTime: '5-10 min',
      available: true,
      features: ['Unique', 'Collectible', 'Verifiable']
    }
  ]);

  const { toast } = useToast();

  // Connect wallet
  const connectWallet = async (walletId: string) => {
    try {
      console.log('Connecting wallet:', walletId);
      
      // Simulate wallet connection
      setWallets(prev => prev.map(w => 
        w.id === walletId 
          ? { ...w, connected: true }
          : { ...w, connected: false }
      ));
      
      const wallet = wallets.find(w => w.id === walletId);
      setSelectedWallet(wallet || null);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${wallet?.name}`,
      });

    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallets(prev => prev.map(w => ({ ...w, connected: false })));
    setSelectedWallet(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected successfully",
    });
  };

  // Send payment
  const sendPayment = async () => {
    if (!selectedWallet || !paymentAmount || !recipientAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all payment details",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Sending payment:', {
        amount: paymentAmount,
        currency: selectedCurrency,
        to: recipientAddress
      });

      // Create new transaction
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'payment',
        status: 'pending',
        amount: parseFloat(paymentAmount),
        currency: selectedCurrency,
        confirmations: 0,
        requiredConfirmations: 6,
        fee: parseFloat(paymentAmount) * 0.001,
        fromAddress: selectedWallet.address,
        toAddress: recipientAddress,
        timestamp: new Date(),
        description: 'Crypto Payment'
      };

      setTransactions(prev => [newTransaction, ...prev]);
      
      // Reset form
      setPaymentAmount('');
      setRecipientAddress('');
      
      toast({
        title: "Payment Sent",
        description: "Your crypto payment has been submitted to the network",
      });

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to send payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get currency info
  const getCurrency = (symbol: string) => {
    return cryptoCurrencies.find(c => c.symbol === symbol) || cryptoCurrencies[0];
  };

  const currency = getCurrency(selectedCurrency);

  return (
    <>
      {/* Floating Crypto Indicator */}
      <motion.div
        className="fixed top-32 right-4 z-40"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Card 
          className="bg-background/95 backdrop-blur border-accent/20 cursor-pointer hover:border-accent/40 transition-all duration-300"
          onClick={() => setIsExpanded(true)}
        >
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">₿</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold">Crypto Pay</span>
                  <Badge variant="outline" className="text-xs">
                    {cryptoCurrencies.filter(c => c.supported).length} coins
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  BTC ${cryptoCurrencies[0].price.toLocaleString()}
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  {selectedWallet ? (
                    <span className="text-green-400">Connected</span>
                  ) : (
                    <span className="text-orange-400">Disconnected</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Advanced Crypto Payments Panel */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-6xl w-full max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-cyber text-primary flex items-center space-x-2">
              <Bitcoin className="h-6 w-6" />
              <span>Advanced Crypto Payments</span>
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="defi">DeFi</TabsTrigger>
              <TabsTrigger value="nft">NFTs</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Wallet Tab */}
            <TabsContent value="wallet" className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Wallet Connection */}
              <Card className="cyberpunk-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5" />
                    <span>Wallet Connection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedWallet ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{selectedWallet.icon}</div>
                          <div>
                            <div className="font-semibold">{selectedWallet.name}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {selectedWallet.address}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Connected
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {Object.entries(selectedWallet.balance).map(([currency, balance]) => (
                          <div key={currency} className="bg-muted/20 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold">{balance}</div>
                            <div className="text-sm text-muted-foreground">{currency}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {selectedWallet.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={disconnectWallet}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {wallets.map((wallet) => (
                        <Card 
                          key={wallet.id} 
                          className="cursor-pointer hover:border-accent/40 transition-all"
                          onClick={() => connectWallet(wallet.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">{wallet.icon}</div>
                                <div>
                                  <div className="font-semibold">{wallet.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {wallet.network}
                                  </div>
                                </div>
                              </div>
                              <Button size="sm" className="cyberpunk-button">
                                Connect
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Supported Currencies */}
              <Card className="cyberpunk-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Coins className="h-5 w-5" />
                    <span>Supported Cryptocurrencies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {cryptoCurrencies.filter(c => c.supported).map((crypto) => (
                      <div key={crypto.id} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{crypto.logo}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{crypto.symbol}</span>
                              <span className="text-sm text-muted-foreground">{crypto.name}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">{crypto.network}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold">${crypto.price.toLocaleString()}</div>
                          <div className={cn(
                            "text-sm flex items-center space-x-1",
                            crypto.change24h >= 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {crypto.change24h >= 0 ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownLeft className="h-3 w-3" />
                            )}
                            <span>{Math.abs(crypto.change24h)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Payment Form */}
              <Card className="cyberpunk-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Send Crypto Payment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!selectedWallet ? (
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <div className="text-lg font-semibold mb-2">Connect Wallet</div>
                      <div className="text-muted-foreground mb-4">
                        Please connect a wallet to send payments
                      </div>
                      <Button onClick={() => setActiveTab('wallet')}>
                        Go to Wallet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Currency Selection */}
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {cryptoCurrencies.filter(c => c.supported).map((crypto) => (
                              <SelectItem key={crypto.id} value={crypto.symbol}>
                                <div className="flex items-center space-x-2">
                                  <span>{crypto.logo}</span>
                                  <span>{crypto.symbol}</span>
                                  <span className="text-muted-foreground">{crypto.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Amount */}
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="pr-16"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            {selectedCurrency}
                          </div>
                        </div>
                        {paymentAmount && (
                          <div className="text-sm text-muted-foreground">
                            ≈ ${(parseFloat(paymentAmount) * currency.price).toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Recipient Address */}
                      <div className="space-y-2">
                        <Label>Recipient Address</Label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="0x..."
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            className="font-mono"
                          />
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => setShowQRCode(true)}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Gas Fee Estimation */}
                      {paymentAmount && (
                        <div className="bg-muted/10 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Estimated Network Fee</span>
                            <span className="text-sm font-semibold">
                              ~{(parseFloat(paymentAmount) * 0.001).toFixed(6)} {selectedCurrency}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Processing time: 5-15 minutes
                          </div>
                        </div>
                      )}

                      {/* Send Button */}
                      <Button 
                        onClick={sendPayment}
                        disabled={!paymentAmount || !recipientAddress}
                        className="w-full cyberpunk-button"
                      >
                        <span className="mr-2">Send Payment</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="cyberpunk-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment Methods</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {paymentMethods.map((method) => (
                      <Card key={method.id} className="cursor-pointer hover:border-accent/40 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{method.icon}</div>
                              <div>
                                <div className="font-semibold">{method.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {method.fees}% fees • {method.processingTime}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2">
                              <Badge variant={method.available ? "default" : "secondary"}>
                                {method.available ? "Available" : "Coming Soon"}
                              </Badge>
                              <div className="flex flex-wrap gap-1">
                                {method.features.slice(0, 2).map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DeFi Tab */}
            <TabsContent value="defi" className="space-y-6 max-h-[70vh] overflow-y-auto">
              <Card className="cyberpunk-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>DeFi Protocols</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {defiProtocols.map((protocol) => (
                      <Card key={protocol.id} className="cyberpunk-card">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{protocol.icon}</div>
                              <div>
                                <div className="font-semibold">{protocol.name}</div>
                                <div className="text-sm text-muted-foreground capitalize">
                                  {protocol.type}
                                </div>
                              </div>
                            </div>
                            
                            <Badge variant={protocol.supported ? "default" : "secondary"}>
                              {protocol.supported ? "Available" : "Coming Soon"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-400">
                                {protocol.apy.toFixed(2)}%
                              </div>
                              <div className="text-xs text-muted-foreground">APY</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-lg font-bold">
                                ${(protocol.tvl / 1000000000).toFixed(1)}B
                              </div>
                              <div className="text-xs text-muted-foreground">TVL</div>
                            </div>
                            
                            <div className="text-center">
                              <Badge 
                                variant="outline"
                                className={cn(
                                  protocol.risk === 'low' && "border-green-500/30 text-green-400",
                                  protocol.risk === 'medium' && "border-yellow-500/30 text-yellow-400",
                                  protocol.risk === 'high' && "border-red-500/30 text-red-400"
                                )}
                              >
                                {protocol.risk} risk
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span>Min: {protocol.minAmount} {protocol.type === 'staking' ? 'ETH' : 'USD'}</span>
                            {protocol.lockPeriod && (
                              <span>Lock: {protocol.lockPeriod} days</span>
                            )}
                            <Button 
                              size="sm" 
                              disabled={!protocol.supported}
                              className="cyberpunk-button"
                            >
                              {protocol.type === 'staking' ? 'Stake' : 'Deposit'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NFT Tab */}
            <TabsContent value="nft" className="space-y-6 max-h-[70vh] overflow-y-auto">
              <Card className="cyberpunk-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-xl">🎨</span>
                    <span>NFT Payment Integration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="text-6xl mb-4">🚧</div>
                  <div className="text-lg font-semibold mb-2">NFT Payments Coming Soon</div>
                  <div className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Pay with NFTs, accept NFT collections as payment, and integrate with major NFT marketplaces.
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-muted/10 rounded-lg p-3">
                      <div className="text-sm font-medium">Features</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        • NFT as payment<br/>
                        • Collection verification<br/>
                        • Rarity-based pricing
                      </div>
                    </div>
                    
                    <div className="bg-muted/10 rounded-lg p-3">
                      <div className="text-sm font-medium">Marketplaces</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        • OpenSea integration<br/>
                        • Blur marketplace<br/>
                        • Custom collections
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6 max-h-[70vh] overflow-y-auto">
              <Card className="cyberpunk-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="h-5 w-5" />
                    <span>Transaction History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <Card key={tx.id} className="cyberpunk-card">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                tx.status === 'completed' && "bg-green-500/20 text-green-400",
                                tx.status === 'pending' && "bg-yellow-500/20 text-yellow-400",
                                tx.status === 'failed' && "bg-red-500/20 text-red-400"
                              )}>
                                {tx.status === 'completed' && <CheckCircle className="h-4 w-4" />}
                                {tx.status === 'pending' && <Clock className="h-4 w-4" />}
                                {tx.status === 'failed' && <AlertTriangle className="h-4 w-4" />}
                              </div>
                              
                              <div>
                                <div className="font-semibold">{tx.description}</div>
                                <div className="text-sm text-muted-foreground">
                                  {tx.type} • {tx.timestamp.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold">
                                {tx.amount} {tx.currency}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Fee: {tx.fee} {tx.currency}
                              </div>
                            </div>
                          </div>

                          {tx.status === 'pending' && (
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Confirmations</span>
                                <span>{tx.confirmations}/{tx.requiredConfirmations}</span>
                              </div>
                              <Progress 
                                value={(tx.confirmations / tx.requiredConfirmations) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}

                          {tx.hash && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Hash: {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                                </span>
                                <Button variant="ghost" size="sm">
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                {/* Portfolio Overview */}
                <Card className="cyberpunk-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5" />
                      <span>Portfolio Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">$4,567.89</div>
                        <div className="text-sm text-muted-foreground">Total Balance</div>
                      </div>
                      
                      <div className="space-y-3">
                        {selectedWallet && Object.entries(selectedWallet.balance).map(([currency, balance]) => {
                          const crypto = getCurrency(currency);
                          const value = balance * crypto.price;
                          return (
                            <div key={currency} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span>{crypto.logo}</span>
                                <span>{currency}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">${value.toLocaleString()}</div>
                                <div className="text-sm text-muted-foreground">{balance} {currency}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction Stats */}
                <Card className="cyberpunk-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Transaction Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-400">12</div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold text-yellow-400">3</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold">$2,345</div>
                        <div className="text-sm text-muted-foreground">Total Sent</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold">$1,234</div>
                        <div className="text-sm text-muted-foreground">Total Received</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* DeFi Yields */}
              <Card className="cyberpunk-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5" />
                    <span>DeFi Yields & Staking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <div className="text-lg font-semibold mb-2">Yield Analytics Coming Soon</div>
                    <div className="text-muted-foreground">
                      Track your DeFi positions, yields, and staking rewards across protocols.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mx-auto">
              <QrCode className="h-24 w-24 text-muted-foreground" />
            </div>
            <div className="text-sm text-muted-foreground">
              Scan this QR code with your mobile wallet
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}