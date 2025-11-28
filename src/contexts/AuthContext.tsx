import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'user' | 'company' | 'admin';
  disabilityType?: string;
  location?: string;
  cvUrl?: string;
}

interface Company {
  id: string;
  name: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  token: string | null;
  loading: boolean;
  login: (phone?: string, email?: string, password?: string) => Promise<void>;
  logout: () => void;
  registerUser: (data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    disabilityType: string;
    location: string;
    cvUrl: string;
  }) => Promise<void>;
  registerCompany: (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    crNumber: string;
    crDocUrl: string;
    mapsUrl: string;
    mowaamaDocUrl?: string;
    location: string;
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT token
const decodeToken = (token: string): { userId: string; exp: number } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  // Check if token expires in less than 1 minute (buffer time)
  return decoded.exp * 1000 < Date.now() + 60000;
};

// Load user data from localStorage
const loadStoredAuth = (): { token: string | null; user: User | null; company: Company | null } => {
  try {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedCompany = localStorage.getItem('company');
    
    return {
      token: token && !isTokenExpired(token) ? token : null,
      user: storedUser ? JSON.parse(storedUser) : null,
      company: storedCompany ? JSON.parse(storedCompany) : null,
    };
  } catch (error) {
    console.error('Error loading stored auth:', error);
    return { token: null, user: null, company: null };
  }
};

// Save auth data to localStorage
const saveAuthData = (token: string, user: User, company?: Company | null) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  if (company) {
    localStorage.setItem('company', JSON.stringify(company));
  }
};

// Clear auth data from localStorage
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('company');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Load from localStorage on mount
  const storedAuth = loadStoredAuth();
  const [user, setUser] = useState<User | null>(storedAuth.user);
  const [company, setCompany] = useState<Company | null>(storedAuth.company);
  const [token, setToken] = useState<string | null>(storedAuth.token);
  const [loading, setLoading] = useState(true);

  // Define logout function first (used in useEffect)
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setCompany(null);
    clearAuthData();
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken || isTokenExpired(currentToken)) {
      throw new Error('Token expired or invalid');
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      setCompany(data.company || null);
      setToken(currentToken);
      
      // Update stored data
      saveAuthData(currentToken, data.user, data.company);
      
      return data;
    } catch (error: any) {
      // If 401, token is invalid
      if (error.message?.includes('401') || error.message?.includes('Authentication')) {
        logout();
      }
      throw error;
    }
  }, [logout]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const currentToken = localStorage.getItem('token');
      
      if (currentToken && !isTokenExpired(currentToken)) {
        // Token is valid, verify with server
        try {
          const data = await api.getMe();
          setUser(data.user);
          setCompany(data.company || null);
          setToken(currentToken);
          saveAuthData(currentToken, data.user, data.company);
        } catch (error) {
          // Token might be invalid on server, clear everything
          logout();
        }
      } else if (currentToken && isTokenExpired(currentToken)) {
        // Token expired, clear it
        logout();
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for logout events from API client (when 401 occurs)
    const handleLogout = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [logout]); // Include logout in dependencies

  const login = async (phone?: string, email?: string, password?: string) => {
    const data = await api.login(phone, email, password);
    
    // Save to state and localStorage
    setToken(data.token);
    setUser(data.user);
    setCompany(data.company || null);
    saveAuthData(data.token, data.user, data.company);
    
    return data;
  };

  const registerUser = async (userData: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    disabilityType: string;
    location: string;
    cvUrl: string;
  }) => {
    const data = await api.registerUser(userData);
    setToken(data.token);
    setUser(data.user);
    saveAuthData(data.token, data.user);
  };

  const registerCompany = async (companyData: {
    name: string;
    phone: string;
    email: string;
    password: string;
    crNumber: string;
    crDocUrl: string;
    mapsUrl: string;
    mowaamaDocUrl?: string;
    location: string;
  }) => {
    const data = await api.registerCompany(companyData);
    setToken(data.token);
    setUser(data.user);
    setCompany(data.company);
    saveAuthData(data.token, data.user, data.company);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        token,
        loading,
        login,
        logout,
        registerUser,
        registerCompany,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

