import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot-password';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [currentMode, setCurrentMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            {currentMode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm
                  onClose={onClose}
                  onSwitchToRegister={() => setCurrentMode('register')}
                  onSwitchToForgotPassword={() => setCurrentMode('forgot-password')}
                />
              </motion.div>
            )}
            
            {currentMode === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <RegisterForm
                  onClose={onClose}
                  onSwitchToLogin={() => setCurrentMode('login')}
                />
              </motion.div>
            )}
            
            {currentMode === 'forgot-password' && (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <ForgotPasswordForm
                  onClose={onClose}
                  onSwitchToLogin={() => setCurrentMode('login')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Simple forgot password form for completeness
function ForgotPasswordForm({ 
  onClose, 
  onSwitchToLogin 
}: { 
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-gray-900/95 border border-cyan-500/30 rounded-lg p-6 text-center backdrop-blur-sm">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="text-xl font-bold text-white mb-2">Email Sent!</h2>
        <p className="text-gray-400 mb-6">
          If an account with that email exists, we've sent a password reset link.
        </p>
        <button
          onClick={onSwitchToLogin}
          className="text-cyan-400 hover:text-cyan-300 font-medium"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900/95 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Reset Password
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Remember your password?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Back to login
          </button>
        </p>
      </div>
    </div>
  );
}