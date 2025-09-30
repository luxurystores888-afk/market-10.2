import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Types for user management
export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
  role: 'customer' | 'admin' | 'vendor';
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  preferences: {
    theme: 'cyberpunk' | 'dark' | 'light';
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  addresses: UserAddress[];
  paymentMethods: PaymentMethod[];
}

export interface UserAddress {
  id: string;
  type: 'shipping' | 'billing' | 'both';
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'crypto' | 'card' | 'bank';
  name: string;
  details: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface AuthContextType {
  state: AuthState;
  actions: {
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    addAddress: (address: Omit<UserAddress, 'id'>) => Promise<void>;
    updateAddress: (id: string, updates: Partial<UserAddress>) => Promise<void>;
    deleteAddress: (id: string) => Promise<void>;
    addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => Promise<void>;
    deletePaymentMethod: (id: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
  };
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  token: null,
};

// Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          profile: { ...state.user.profile, ...action.payload } as UserProfile
        } : null
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Base URL
const API_BASE = '/api';

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      dispatch({ type: 'SET_TOKEN', payload: token });
      // Validate token and load user
      validateTokenAndLoadUser(token);
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const validateTokenAndLoadUser = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        dispatch({ type: 'SET_USER', payload: userData.user });
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Failed to validate token:', error);
      localStorage.removeItem('auth_token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Actions
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        dispatch({ type: 'SET_TOKEN', payload: data.token });
        dispatch({ type: 'SET_USER', payload: data.user });
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error || 'Login failed' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error occurred' });
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        dispatch({ type: 'SET_TOKEN', payload: data.token });
        dispatch({ type: 'SET_USER', payload: data.user });
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error || 'Registration failed' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Network error occurred' });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.token) return;

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        dispatch({ type: 'SET_USER', payload: userData.user });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [state.token]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!state.token) return;

    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        dispatch({ type: 'UPDATE_PROFILE', payload: updates });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
    }
  }, [state.token]);

  const addAddress = useCallback(async (address: Omit<UserAddress, 'id'>) => {
    if (!state.token) return;

    try {
      const response = await fetch(`${API_BASE}/auth/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify(address),
      });

      if (response.ok) {
        await refreshUser(); // Reload user data
      } else {
        throw new Error('Failed to add address');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add address' });
    }
  }, [state.token, refreshUser]);

  const updateAddress = useCallback(async (id: string, updates: Partial<UserAddress>) => {
    if (!state.token) return;

    try {
      const response = await fetch(`${API_BASE}/auth/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await refreshUser(); // Reload user data
      } else {
        throw new Error('Failed to update address');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update address' });
    }
  }, [state.token, refreshUser]);

  const deleteAddress = useCallback(async (id: string) => {
    if (!state.token) return;

    try {
      const response = await fetch(`${API_BASE}/auth/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        await refreshUser(); // Reload user data
      } else {
        throw new Error('Failed to delete address');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete address' });
    }
  }, [state.token, refreshUser]);

  const addPaymentMethod = useCallback(async (method: Omit<PaymentMethod, 'id' | 'createdAt'>) => {
    if (!state.token) return;

    try {
      const response = await fetch(`${API_BASE}/auth/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify(method),
      });

      if (response.ok) {
        await refreshUser(); // Reload user data
      } else {
        throw new Error('Failed to add payment method');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add payment method' });
    }
  }, [state.token, refreshUser]);

  const deletePaymentMethod = useCallback(async (id: string) => {
    if (!state.token) return;

    try {
      const response = await fetch(`${API_BASE}/auth/payment-methods/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        await refreshUser(); // Reload user data
      } else {
        throw new Error('Failed to delete payment method');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete payment method' });
    }
  }, [state.token, refreshUser]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send reset email' });
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reset password');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to reset password' });
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        await refreshUser(); // Reload user data
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to verify email');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to verify email' });
    }
  }, [refreshUser]);

  const web3Login = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const message = 'Sign to login';
      const sig = await window.ethereum.request({ method: 'personal_sign', params: [message, accounts[0]] });
      const res = await fetch(`${API_BASE}/auth/web3-login`, { method: 'POST', body: JSON.stringify({ address: accounts[0], sig }) });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('auth_token', data.token);
        dispatch({ type: 'SET_TOKEN', payload: data.token });
        dispatch({ type: 'SET_USER', payload: data.user });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Web3 login failed');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initiate Web3 login' });
    }
  }, []);

  const contextValue: AuthContextType = {
    state,
    actions: {
      login,
      register,
      logout,
      refreshUser,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      addPaymentMethod,
      deletePaymentMethod,
      forgotPassword,
      resetPassword,
      verifyEmail,
      web3Login,
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}