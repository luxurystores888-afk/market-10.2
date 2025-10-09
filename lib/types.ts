// Shared TypeScript interfaces for the AI Shopping Assistant

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  productRecommendations?: ProductRecommendation[];
}

export interface ProductRecommendation {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: string; // decimal from DB returns as string
    category: string | null;
    imageUrl: string | null;
    stock: number | null;
    tags: unknown;
    status: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  reason: string;
  confidence: number; // 0-1 scale
}

// Additional interface for frontend components that need simpler types
export interface SimpleProduct {
  id: string;
  name: string;
  description?: string;
  price: number; // for frontend display
  category?: string;
  imageUrl?: string;
  stock: number;
  tags?: string[];
}

export interface ChatResponse {
  message: string;
  productRecommendations: ProductRecommendation[];
  suggestedQuestions: string[];
  conversationId: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  userPreferences?: {
    priceRange?: { min: number; max: number };
    categories?: string[];
    previousPurchases?: string[];
  };
  _fallbackAttempted?: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  action: 'search' | 'filter' | 'recommend';
  params?: Record<string, any>;
}

export interface ConversationContext {
  conversationId: string;
  userId?: string;
  sessionId?: string;
  messages: ChatMessage[];
  userPreferences?: {
    priceRange?: { min: number; max: number };
    categories?: string[];
    previousPurchases?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Web3 and Blockchain Types

export interface Web3WalletInfo {
  id: string;
  address: string;
  walletType: 'MetaMask' | 'WalletConnect' | 'Coinbase' | 'Other';
  chainId: number;
  chainName: string;
  isConnected: boolean;
  balance?: string;
}

export interface CryptocurrencyInfo {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress?: string;
  chainId: number;
  logoUrl?: string;
  currentPrice?: number;
}

export interface CryptoPayment {
  id: string;
  orderId: string;
  cryptocurrency: string;
  amount: string;
  amountUsd: number;
  fromAddress: string;
  toAddress: string;
  transactionHash?: string;
  status: 'pending' | 'confirming' | 'confirmed' | 'failed';
  confirmations: number;
  requiredConfirmations: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URI
  external_url?: string;
  animation_url?: string;
  youtube_url?: string;
  tokenURI?: string;
  background_color?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  properties?: Record<string, any>;
}

export interface NFTProduct {
  id: string;
  productId: string;
  contractAddress?: string;
  tokenId?: string;
  tokenStandard: 'ERC721' | 'ERC1155';
  chainId: number;
  metadataUri?: string;
  ipfsHash?: string;
  royaltyPercentage: number;
  totalSupply: number;
  currentSupply: number;
  mintPrice?: string;
  status: 'draft' | 'minted' | 'transferred';
  metadata?: NFTMetadata;
}

export interface IPFSFile {
  hash: string;
  url: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
}

export interface Web3Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
  status: 'pending' | 'success' | 'failed';
  confirmations: number;
}

export interface SmartContractCall {
  contractAddress: string;
  methodName: string;
  parameters: any[];
  gasLimit?: string;
  gasPrice?: string;
  value?: string;
}

export interface CryptoLoyaltyBalance {
  tokenSymbol: string;
  balance: string;
  earnedFromPurchases: string;
  earnedFromReferrals: string;
  spentAmount: string;
  usdValue?: number;
}

export interface Web3AuthData {
  walletAddress: string;
  chainId: number;
  signature?: string;
  message?: string;
  nonce?: string;
  timestamp?: number;
}

export interface DecentralizedProfile {
  walletAddress: string;
  ensName?: string;
  avatar?: IPFSFile;
  bio?: string;
  website?: string;
  twitter?: string;
  discord?: string;
  ownedNFTs: NFTProduct[];
  loyaltyTokens: CryptoLoyaltyBalance[];
}

// Web3 Context State
export interface Web3State {
  isConnected: boolean;
  isConnecting: boolean;
  wallet?: Web3WalletInfo;
  supportedChains: number[];
  supportedCryptocurrencies: CryptocurrencyInfo[];
  userProfile?: DecentralizedProfile;
  loyaltyBalance?: CryptoLoyaltyBalance;
  error?: string;
}

// Web3 Actions
export interface Web3Actions {
  connectWallet: (walletType: string) => Promise<void>;
  disconnectWallet: () => void;
  switchChain: (chainId: number) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (transaction: SmartContractCall) => Promise<string>;
  getBalance: (address?: string, tokenAddress?: string) => Promise<string>;
  uploadToIPFS: (file: File) => Promise<IPFSFile>;
  mintNFT: (productId: string, metadata: NFTMetadata) => Promise<string>;
}

// Checkout with Crypto
export interface CryptoCheckoutData {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    isNFT?: boolean;
  }>;
  selectedCryptocurrency: string;
  totalAmount: string;
  totalUsd: number;
  recipientAddress: string;
  estimatedGas?: string;
  networkFee?: string;
}

export interface Web3ContextType {
  state: Web3State;
  actions: Web3Actions;
}