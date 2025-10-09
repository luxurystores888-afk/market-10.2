import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Web3ContextType, Web3State, Web3Actions, Web3WalletInfo, CryptocurrencyInfo, SmartContractCall, IPFSFile, NFTMetadata } from '@/lib/types';

// Initial state
const initialState: Web3State = {
  isConnected: false,
  isConnecting: false,
  wallet: undefined,
  supportedChains: [1, 137, 56, 42161], // Ethereum, Polygon, BSC, Arbitrum
  supportedCryptocurrencies: [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      chainId: 1,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
    },
    {
      symbol: 'MATIC',
      name: 'Polygon',
      decimals: 18,
      chainId: 137,
      logoUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.svg'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      contractAddress: '0xA0b86a33E6417b5b1d4c0c5b3D1b3B0c5b3d1b3B',
      chainId: 1,
      logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg'
    }
  ],
  userProfile: undefined,
  loyaltyBalance: undefined,
  error: undefined
};

// Action types
type Web3Action =
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_WALLET'; payload: Web3WalletInfo | undefined }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_USER_PROFILE'; payload: any }
  | { type: 'SET_LOYALTY_BALANCE'; payload: any }
  | { type: 'DISCONNECT_WALLET' };

// Reducer
function web3Reducer(state: Web3State, action: Web3Action): Web3State {
  switch (action.type) {
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    case 'SET_WALLET':
      return {
        ...state,
        wallet: action.payload,
        isConnected: !!action.payload,
        isConnecting: false,
        error: undefined
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isConnecting: false };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'SET_LOYALTY_BALANCE':
      return { ...state, loyaltyBalance: action.payload };
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        wallet: undefined,
        isConnected: false,
        userProfile: undefined,
        loyaltyBalance: undefined,
        error: undefined
      };
    default:
      return state;
  }
}

// Create context
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Mock Web3 functions (will be replaced with actual Web3 libraries)
const mockWeb3 = {
  connectMetaMask: async (): Promise<Web3WalletInfo> => {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock wallet connection
    return {
      id: 'metamask-' + Date.now(),
      address: '0x' + Math.random().toString(16).substr(2, 40),
      walletType: 'MetaMask' as const,
      chainId: 1,
      chainName: 'Ethereum Mainnet',
      isConnected: true,
      balance: (Math.random() * 10).toFixed(4) + ' ETH'
    };
  },

  connectWalletConnect: async (): Promise<Web3WalletInfo> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      id: 'walletconnect-' + Date.now(),
      address: '0x' + Math.random().toString(16).substr(2, 40),
      walletType: 'WalletConnect' as const,
      chainId: 1,
      chainName: 'Ethereum Mainnet',
      isConnected: true,
      balance: (Math.random() * 5).toFixed(4) + ' ETH'
    };
  },

  signMessage: async (message: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return '0x' + Math.random().toString(16).repeat(32);
  },

  uploadToIPFS: async (file: File): Promise<IPFSFile> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hash = 'Qm' + Math.random().toString(36).substring(2, 15);
    return {
      hash,
      url: `https://ipfs.io/ipfs/${hash}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    };
  }
};

// Web3 Provider Component
export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  // Connect wallet function
  const connectWallet = useCallback(async (walletType: string) => {
    dispatch({ type: 'SET_CONNECTING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: undefined });

    try {
      let walletInfo: Web3WalletInfo;

      switch (walletType.toLowerCase()) {
        case 'metamask':
          walletInfo = await mockWeb3.connectMetaMask();
          break;
        case 'walletconnect':
          walletInfo = await mockWeb3.connectWalletConnect();
          break;
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }

      dispatch({ type: 'SET_WALLET', payload: walletInfo });
      
      // Store wallet info in localStorage
      localStorage.setItem('web3-wallet', JSON.stringify(walletInfo));
      
      // Track wallet connection
      console.log('🔗 Wallet connected:', walletInfo);
      
    } catch (error: any) {
      console.error('❌ Wallet connection failed:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    dispatch({ type: 'DISCONNECT_WALLET' });
    localStorage.removeItem('web3-wallet');
    console.log('🔌 Wallet disconnected');
  }, []);

  // Switch chain function
  const switchChain = useCallback(async (chainId: number) => {
    if (!state.wallet) {
      throw new Error('No wallet connected');
    }
    
    // Mock chain switching
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const chainNames: Record<number, string> = {
      1: 'Ethereum Mainnet',
      137: 'Polygon Mainnet',
      56: 'BNB Smart Chain',
      42161: 'Arbitrum One'
    };

    const updatedWallet = {
      ...state.wallet,
      chainId,
      chainName: chainNames[chainId] || `Chain ${chainId}`
    };

    dispatch({ type: 'SET_WALLET', payload: updatedWallet });
    localStorage.setItem('web3-wallet', JSON.stringify(updatedWallet));
  }, [state.wallet]);

  // Sign message function
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!state.wallet) {
      throw new Error('No wallet connected');
    }
    return await mockWeb3.signMessage(message);
  }, [state.wallet]);

  // Send transaction function
  const sendTransaction = useCallback(async (transaction: SmartContractCall): Promise<string> => {
    if (!state.wallet) {
      throw new Error('No wallet connected');
    }
    
    // Mock transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    return '0x' + Math.random().toString(16).repeat(32);
  }, [state.wallet]);

  // Get balance function
  const getBalance = useCallback(async (address?: string, tokenAddress?: string): Promise<string> => {
    if (!state.wallet && !address) {
      throw new Error('No wallet connected and no address provided');
    }
    
    // Mock balance retrieval
    await new Promise(resolve => setTimeout(resolve, 500));
    return (Math.random() * 10).toFixed(4);
  }, [state.wallet]);

  // Upload to IPFS function
  const uploadToIPFS = useCallback(async (file: File): Promise<IPFSFile> => {
    return await mockWeb3.uploadToIPFS(file);
  }, []);

  // Mint NFT function
  const mintNFT = useCallback(async (productId: string, metadata: NFTMetadata): Promise<string> => {
    if (!state.wallet) {
      throw new Error('No wallet connected');
    }
    
    // Mock NFT minting
    await new Promise(resolve => setTimeout(resolve, 5000));
    return '0x' + Math.random().toString(16).repeat(32);
  }, [state.wallet]);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('web3-wallet');
    if (savedWallet) {
      try {
        const walletInfo = JSON.parse(savedWallet);
        dispatch({ type: 'SET_WALLET', payload: walletInfo });
      } catch (error) {
        console.error('Error loading wallet from localStorage:', error);
        localStorage.removeItem('web3-wallet');
      }
    }
  }, []);

  // Actions object
  const actions: Web3Actions = {
    connectWallet,
    disconnectWallet,
    switchChain,
    signMessage,
    sendTransaction,
    getBalance,
    uploadToIPFS,
    mintNFT
  };

  const contextValue: Web3ContextType = {
    state,
    actions
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

// Hook to use Web3 context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

// Export context for testing
export { Web3Context };