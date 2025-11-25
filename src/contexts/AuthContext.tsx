import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'user' | 'company' | 'admin';
  disabilityType?: string;
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
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
      setCompany(data.company || null);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone?: string, email?: string, password?: string) => {
    const data = await api.login(phone, email, password);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setCompany(data.company || null);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCompany(null);
    localStorage.removeItem('token');
  };

  const registerUser = async (userData: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    disabilityType: string;
  }) => {
    const data = await api.registerUser(userData);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
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
  }) => {
    const data = await api.registerCompany(companyData);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setCompany(data.company);
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

