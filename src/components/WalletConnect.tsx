import React, { useState } from 'react';
import { Wallet, Zap, Shield, Loader2, Check, X } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

interface WalletConnectProps {
  onClose?: () => void;
  showModal?: boolean;
}

export function WalletConnect({ onClose, showModal = false }: WalletConnectProps) {
  const { state, actions } = useWeb3();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using browser extension',
      isAvailable: typeof window !== 'undefined' && !!(window as any).ethereum,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect using mobile wallet',
      isAvailable: true,
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Connect using Coinbase',
      isAvailable: false, // Coming soon
    },
  ];

  const handleConnect = async (walletType: string) => {
    setSelectedWallet(walletType);
    try {
      await actions.connectWallet(walletType);
      if (onClose) {
        setTimeout(onClose, 1000); // Close modal after successful connection
      }
    } catch (error) {
      setSelectedWallet(null);
    }
  };

  const handleDisconnect = () => {
    actions.disconnectWallet();
    setSelectedWallet(null);
  };

  if (!showModal && state.isConnected) {
    // Compact connected state
    return (
      <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg px-4 py-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium">
            {state.wallet?.address?.slice(0, 6)}...{state.wallet?.address?.slice(-4)}
          </span>
          <span className="text-green-400 text-xs">{state.wallet?.walletType}</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="text-gray-400 hover:text-red-400 transition-colors"
          title="Disconnect"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (!showModal && !state.isConnected) {
    // Compact connect button
    return (
      <button
        onClick={() => handleConnect('metamask')}
        disabled={state.isConnecting}
        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {state.isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        <span className="text-sm">
          {state.isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </span>
      </button>
    );
  }

  // Full modal view
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 border border-cyan-500/30 rounded-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-400 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
              <p className="text-gray-400 text-sm">Choose your preferred wallet</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Connected State */}
        {state.isConnected && state.wallet && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Wallet Connected</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Wallet:</span>
                <span className="text-white">{state.wallet.walletType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Address:</span>
                <span className="text-white font-mono">
                  {state.wallet.address.slice(0, 8)}...{state.wallet.address.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Network:</span>
                <span className="text-white">{state.wallet.chainName}</span>
              </div>
              {state.wallet.balance && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Balance:</span>
                  <span className="text-cyan-400 font-medium">{state.wallet.balance}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleDisconnect}
              className="w-full mt-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 py-2 rounded-lg transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm">{state.error}</span>
            </div>
          </div>
        )}

        {/* Wallet Options */}
        {!state.isConnected && (
          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleConnect(wallet.id)}
                disabled={!wallet.isAvailable || state.isConnecting}
                className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                  wallet.isAvailable
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-600 hover:border-cyan-500/50'
                    : 'bg-gray-800/20 border-gray-700 opacity-50 cursor-not-allowed'
                } ${
                  selectedWallet === wallet.id && state.isConnecting
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{wallet.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{wallet.name}</span>
                      {!wallet.isAvailable && (
                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{wallet.description}</p>
                  </div>
                  {selectedWallet === wallet.id && state.isConnecting ? (
                    <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                  ) : state.isConnected ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-purple-400 mt-0.5" />
            <div>
              <h4 className="text-purple-400 font-medium text-sm">Quantum-Secured Connection</h4>
              <p className="text-gray-400 text-xs mt-1">
                Your wallet connection is protected by neural-encrypted protocols. No private keys are stored or transmitted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}