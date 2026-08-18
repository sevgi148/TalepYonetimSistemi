import React, { createContext, useState, useCallback, useMemo } from 'react';
import type { IdentityResponseDto } from '../types';

interface AuthContextType {
  user: IdentityResponseDto | null;
  login: (data: IdentityResponseDto) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IdentityResponseDto | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? (JSON.parse(savedUser) as IdentityResponseDto) : null;
    } catch (error) {
      console.error('Error reading user session data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const login = useCallback((data: IdentityResponseDto) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};