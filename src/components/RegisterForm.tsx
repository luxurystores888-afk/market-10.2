import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../context/AuthContext';

interface RegisterFormProps {
  onClose?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onClose, onSwitchToLogin }: RegisterFormProps) {
  const { state, actions } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return; // Error will be shown in validation
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      return; // Error will be shown in validation
    }

    try {
      await actions.register(formData.email, formData.password, formData.name);
      if (onClose) onClose();
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const strengthColors = {
    0: 'bg-red-500',
    1: 'bg-red-400',
    2: 'bg-yellow-500',
    3: 'bg-yellow-400',
    4: 'bg-green-400',
    5: 'bg-green-500',
  };

  const strengthLabels = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
    5: 'Very Strong',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto bg-gray-900/95 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Join the Future
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Create your cyberpunk account
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400"
                required
                disabled={state.isLoading}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400"
                required
                disabled={state.isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 pr-10"
                  required
                  disabled={state.isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          i < passwordStrength 
                            ? strengthColors[passwordStrength as keyof typeof strengthColors]
                            : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength >= 4 ? 'text-green-400' : 
                    passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {strengthLabels[passwordStrength as keyof typeof strengthLabels]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                Confirm Password
                {passwordMatch && <Check className="w-4 h-4 text-green-400" />}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 pr-10 ${
                    formData.confirmPassword && !passwordMatch ? 'border-red-500' : ''
                  }`}
                  required
                  disabled={state.isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.confirmPassword && !passwordMatch && (
                <p className="text-red-400 text-xs">Passwords do not match</p>
              )}
            </div>

            {/* Terms and Privacy */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-gray-600 text-cyan-400 focus:ring-cyan-400 bg-gray-800"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                    Terms of Service
                  </a>
                </span>
              </label>
              
              <label className="flex items-start space-x-3 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  className="mt-0.5 rounded border-gray-600 text-cyan-400 focus:ring-cyan-400 bg-gray-800"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Error Message */}
            {state.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-900/30 border border-red-500/30 rounded-md"
              >
                <p className="text-red-400 text-sm">{state.error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                state.isLoading ||
                !passwordMatch ||
                passwordStrength < 3 ||
                !acceptedTerms ||
                !acceptedPrivacy
              }
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}