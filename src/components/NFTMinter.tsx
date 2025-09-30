import React, { useState } from 'react';
import { Upload, Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { ipfsService } from '../services/ipfsService';
import { NFTMetadata, IPFSFile } from '../../lib/types';

interface NFTMinterProps {
  productId: string;
  productName: string;
  productDescription: string;
  onMintComplete?: (tokenId: string, tokenURI: string) => void;
}

export function NFTMinter({ productId, productName, productDescription, onMintComplete }: NFTMinterProps) {
  const { state: web3State, actions: web3Actions } = useWeb3();
  const [step, setStep] = useState<'upload' | 'metadata' | 'minting' | 'completed' | 'error'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<IPFSFile | null>(null);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const uploadToIPFS = async () => {
    if (!selectedFile) return;
    
    setStep('metadata');
    
    try {
      // Upload image to IPFS
      const imageFile = await ipfsService.uploadFile(selectedFile, {
        fileName: `${productId}-nft-image`,
        description: `NFT image for ${productName}`,
        isPublic: true
      });
      
      setUploadedImage(imageFile);
      
      // Create NFT metadata
      const metadata: NFTMetadata = {
        name: `${productName} NFT`,
        description: `Digital collectible NFT for ${productName}. ${productDescription}`,
        image: imageFile.url,
        external_url: `${window.location.origin}/products/${productId}`,
        attributes: [
          {
            trait_type: 'Product',
            value: productName
          },
          {
            trait_type: 'Type',
            value: 'Digital Product NFT'
          },
          {
            trait_type: 'Rarity',
            value: 'Limited Edition'
          },
          {
            trait_type: 'Chain',
            value: 'Cyberpunk Omniplex'
          }
        ],
        animation_url: undefined,
        youtube_url: undefined,
        background_color: '1a1a2e'
      };
      
      // Upload metadata to IPFS
      const metadataFile = await ipfsService.uploadJSON(metadata, `${productId}-nft-metadata.json`);
      
      setNftMetadata({
        ...metadata,
        tokenURI: metadataFile.url
      });
      
      console.log('🌐 NFT metadata uploaded to IPFS:', metadataFile.url);
      
    } catch (error: any) {
      console.error('❌ Failed to upload to IPFS:', error);
      setError(error.message);
      setStep('error');
    }
  };

  const mintNFT = async () => {
    if (!nftMetadata || !web3State.wallet) return;
    
    setStep('minting');
    
    try {
      // Mint NFT using Web3 actions
      const transactionHash = await web3Actions.mintNFT(productId, nftMetadata);
      
      // Mock token ID generation (in production, this would come from the transaction receipt)
      const mockTokenId = Math.floor(Math.random() * 10000).toString();
      setTokenId(mockTokenId);
      setStep('completed');
      
      if (onMintComplete && nftMetadata.tokenURI) {
        onMintComplete(mockTokenId, nftMetadata.tokenURI);
      }
      
      console.log('🎉 NFT minted successfully!', {
        tokenId: mockTokenId,
        transactionHash,
        tokenURI: nftMetadata.tokenURI
      });
      
    } catch (error: any) {
      console.error('❌ NFT minting failed:', error);
      setError(error.message);
      setStep('error');
    }
  };

  const reset = () => {
    setStep('upload');
    setSelectedFile(null);
    setUploadedImage(null);
    setNftMetadata(null);
    setTokenId(null);
    setError(null);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/30 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-400 to-cyan-400 p-2 rounded-lg">
          <Zap className="h-6 w-6 text-black" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">NFT Minter</h3>
          <p className="text-gray-400 text-sm">Create unique digital collectibles</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {['upload', 'metadata', 'minting', 'completed'].map((stepName, index) => (
            <div
              key={stepName}
              className={`flex items-center space-x-2 ${
                step === stepName ? 'text-cyan-400' :
                ['upload', 'metadata', 'minting', 'completed'].indexOf(step) > index ? 'text-green-400' :
                'text-gray-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === stepName ? 'border-cyan-400 bg-cyan-400/10' :
                ['upload', 'metadata', 'minting', 'completed'].indexOf(step) > index ? 'border-green-400 bg-green-400/10' :
                'border-gray-600 bg-gray-800/50'
              }`}>
                {['upload', 'metadata', 'minting', 'completed'].indexOf(step) > index ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span className="text-sm capitalize">{stepName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Step */}
      {step === 'upload' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">Upload NFT Image</h4>
            <p className="text-gray-400 text-sm mb-4">
              Choose an image file to create your NFT collectible
            </p>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="nft-file-input"
            />
            <label
              htmlFor="nft-file-input"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all inline-block"
            >
              Select Image
            </label>
            
            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <p className="text-white text-sm">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={uploadToIPFS}
            disabled={!selectedFile}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 rounded-xl font-medium transition-all disabled:cursor-not-allowed"
          >
            Upload to IPFS
          </button>
        </div>
      )}

      {/* Metadata Step */}
      {step === 'metadata' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
              <span className="text-cyan-400 font-medium">Creating NFT metadata...</span>
            </div>
            <p className="text-gray-400 text-sm">
              Uploading image to IPFS and generating metadata for your NFT collectible.
            </p>
          </div>
        </div>
      )}

      {/* Minting Step */}
      {(step === 'minting' || (nftMetadata && step !== 'completed' && step !== 'error')) && (
        <div className="space-y-4">
          {uploadedImage && nftMetadata && (
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <h4 className="text-white font-medium mb-3">NFT Preview</h4>
              <div className="flex space-x-4">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🖼️</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-white font-medium">{nftMetadata.name}</h5>
                  <p className="text-gray-400 text-sm mb-2">{nftMetadata.description?.slice(0, 100)}...</p>
                  <div className="flex flex-wrap gap-2">
                    {nftMetadata.attributes?.slice(0, 3).map((attr, index) => (
                      <span key={index} className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                        {attr.trait_type}: {attr.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 'minting' ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Loader2 className="h-5 w-5 text-yellow-400 animate-spin" />
                <span className="text-yellow-400 font-medium">Minting NFT...</span>
              </div>
              <p className="text-gray-400 text-sm">
                Creating your unique NFT on the blockchain. This may take a few moments.
              </p>
            </div>
          ) : (
            <button
              onClick={mintNFT}
              disabled={!web3State.isConnected}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 rounded-xl font-medium transition-all disabled:cursor-not-allowed"
            >
              {web3State.isConnected ? 'Mint NFT' : 'Connect Wallet to Mint'}
            </button>
          )}
        </div>
      )}

      {/* Completed Step */}
      {step === 'completed' && tokenId && (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">NFT Minted Successfully!</span>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              Your unique NFT has been created and is now available on the blockchain.
            </p>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Token ID:</span>
                  <span className="text-white font-mono">#{tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Collection:</span>
                  <span className="text-cyan-400">Cyberpunk Omniplex</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={reset}
            className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 py-3 rounded-xl transition-colors"
          >
            Mint Another NFT
          </button>
        </div>
      )}

      {/* Error Step */}
      {step === 'error' && (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-400 font-medium">Minting Failed</span>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              {error || 'An error occurred while creating your NFT. Please try again.'}
            </p>
          </div>
          
          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white py-3 rounded-xl font-medium transition-all"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}