import { Request, Response } from 'express';
import { db } from './db';
import { web3Wallets, cryptoTransactions, nftTokens, ipfsFiles } from '../lib/schema';
import { eq, and } from 'drizzle-orm';

// Mock Web3 service (in production, replace with actual Web3 libraries)
class Web3Service {
  // Mock smart contract addresses
  private contracts = {
    nftCollection: '0x742F5C8E4e2ADb4E5D16C86CdF3Ba2C1d42F39E2',
    marketplace: '0x8F3b2C5e4A1b2E5D16C86CdF3Ba2C1d42F39E7A8',
    escrow: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B'
  };

  async connectWallet(walletAddress: string, walletType: string, chainId: number) {
    try {
      // Check if wallet already exists
      const existingWallet = await db
        .select()
        .from(web3Wallets)
        .where(eq(web3Wallets.walletAddress, walletAddress))
        .limit(1);

      if (existingWallet.length === 0) {
        // Create new wallet record
        await db.insert(web3Wallets).values({
          walletAddress: walletAddress,
          walletType: walletType,
          chainId,
          isActive: true,
          lastConnected: new Date()
        });
      } else {
        // Update existing wallet
        await db
          .update(web3Wallets)
          .set({
            isActive: true,
            chainId,
            lastConnected: new Date()
          })
          .where(eq(web3Wallets.walletAddress, walletAddress));
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(walletAddress: string) {
    try {
      await db
        .update(web3Wallets)
        .set({
          isActive: false,
          lastConnected: new Date()
        })
        .where(eq(web3Wallets.walletAddress, walletAddress));

      return { success: true };
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }

  async recordTransaction(transactionData: {
    hash: string;
    walletAddress: string;
    amount: string;
    currency: string;
    recipientAddress: string;
    productIds: string[];
    status: 'pending' | 'confirmed' | 'failed';
  }) {
    try {
      const result = await db.insert(cryptoTransactions).values({
        transactionHash: transactionData.hash,
        fromAddress: transactionData.walletAddress,
        toAddress: transactionData.recipientAddress,
        cryptocurrency: transactionData.currency,
        amount: transactionData.amount,
        chainId: 1,
        status: transactionData.status
      }).returning();

      return result[0];
    } catch (error) {
      console.error('Failed to record transaction:', error);
      throw error;
    }
  }

  async mintNFT(nftData: {
    productId: string;
    walletAddress: string;
    tokenURI: string;
    metadata: any;
  }) {
    try {
      // Mock NFT minting - in production, interact with actual smart contracts
      const mockTokenId = Math.floor(Math.random() * 10000).toString();
      const mockTransactionHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const result = await db.insert(nftTokens).values({
        tokenId: mockTokenId,
        productId: nftData.productId,
        contractAddress: this.contracts.nftCollection,
        tokenStandard: 'ERC721',
        chainId: 1,
        metadataUri: nftData.tokenURI,
        status: 'minted'
      }).returning();

      return {
        tokenId: mockTokenId,
        transactionHash: mockTransactionHash,
        contractAddress: this.contracts.nftCollection,
        nft: result[0]
      };
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }

  async getWalletNFTs(walletAddress: string) {
    try {
      const nfts = await db
        .select()
        .from(nftTokens)
        .where(eq(nftTokens.contractAddress, this.contracts.nftCollection))
        .orderBy(nftTokens.createdAt);

      return nfts;
    } catch (error) {
      console.error('Failed to get wallet NFTs:', error);
      throw error;
    }
  }

  async getTransactionHistory(walletAddress: string) {
    try {
      const transactions = await db
        .select()
        .from(cryptoTransactions)
        .where(eq(cryptoTransactions.fromAddress, walletAddress))
        .orderBy(cryptoTransactions.createdAt);

      return transactions;
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      throw error;
    }
  }

  async storeIPFSFile(fileData: {
    hash: string;
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    uploadedBy?: string;
  }) {
    try {
      const result = await db.insert(ipfsFiles).values({
        entityType: 'nft',
        entityId: fileData.hash,
        ipfsHash: fileData.hash,
        fileName: fileData.fileName,
        fileSize: fileData.fileSize,
        mimeType: fileData.mimeType
      }).returning();

      return result[0];
    } catch (error) {
      console.error('Failed to store IPFS file record:', error);
      throw error;
    }
  }
}

const web3Service = new Web3Service();

// API Routes
export const web3Routes = {
  // Connect wallet
  connectWallet: async (req: Request, res: Response) => {
    try {
      const { walletAddress, walletType, chainId } = req.body;
      
      if (!walletAddress || !walletType || !chainId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await web3Service.connectWallet(walletAddress, walletType, chainId);
      res.json(result);
    } catch (error) {
      console.error('Connect wallet error:', error);
      res.status(500).json({ error: 'Failed to connect wallet' });
    }
  },

  // Disconnect wallet
  disconnectWallet: async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const result = await web3Service.disconnectWallet(walletAddress);
      res.json(result);
    } catch (error) {
      console.error('Disconnect wallet error:', error);
      res.status(500).json({ error: 'Failed to disconnect wallet' });
    }
  },

  // Record crypto transaction
  recordTransaction: async (req: Request, res: Response) => {
    try {
      const transactionData = req.body;
      
      const result = await web3Service.recordTransaction(transactionData);
      res.json(result);
    } catch (error) {
      console.error('Record transaction error:', error);
      res.status(500).json({ error: 'Failed to record transaction' });
    }
  },

  // Mint NFT
  mintNFT: async (req: Request, res: Response) => {
    try {
      const nftData = req.body;
      
      const result = await web3Service.mintNFT(nftData);
      res.json(result);
    } catch (error) {
      console.error('Mint NFT error:', error);
      res.status(500).json({ error: 'Failed to mint NFT' });
    }
  },

  // Get wallet NFTs
  getWalletNFTs: async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const nfts = await web3Service.getWalletNFTs(walletAddress);
      res.json(nfts);
    } catch (error) {
      console.error('Get wallet NFTs error:', error);
      res.status(500).json({ error: 'Failed to get wallet NFTs' });
    }
  },

  // Get transaction history
  getTransactionHistory: async (req: Request, res: Response) => {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }

      const transactions = await web3Service.getTransactionHistory(walletAddress);
      res.json(transactions);
    } catch (error) {
      console.error('Get transaction history error:', error);
      res.status(500).json({ error: 'Failed to get transaction history' });
    }
  },

  // Store IPFS file record
  storeIPFSFile: async (req: Request, res: Response) => {
    try {
      const fileData = req.body;
      
      const result = await web3Service.storeIPFSFile(fileData);
      res.json(result);
    } catch (error) {
      console.error('Store IPFS file error:', error);
      res.status(500).json({ error: 'Failed to store IPFS file record' });
    }
  },

  // Get Web3 status
  getStatus: async (req: Request, res: Response) => {
    try {
      res.json({
        status: 'active',
        features: {
          walletConnection: true,
          nftMinting: true,
          cryptoPayments: true,
          ipfsStorage: true,
          smartContracts: true
        },
        contracts: {
          nftCollection: '0x742F5C8E4e2ADb4E5D16C86CdF3Ba2C1d42F39E2',
          marketplace: '0x8F3b2C5e4A1b2E5D16C86CdF3Ba2C1d42F39E7A8',
          escrow: '0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B'
        },
        supportedChains: [1, 137, 56, 42161], // Ethereum, Polygon, BSC, Arbitrum
        supportedCryptocurrencies: [
          { symbol: 'ETH', name: 'Ethereum', chainId: 1 },
          { symbol: 'MATIC', name: 'Polygon', chainId: 137 },
          { symbol: 'USDC', name: 'USD Coin', chainId: 1 }
        ]
      });
    } catch (error) {
      console.error('Get Web3 status error:', error);
      res.status(500).json({ error: 'Failed to get Web3 status' });
    }
  }
};

export default web3Service;