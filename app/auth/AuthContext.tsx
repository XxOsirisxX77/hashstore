import React, { createContext, useContext, useEffect, useState } from 'react';
import { obtainInstagramToken, onInstagramSignOut } from '../../services/AuthService';
import { getProfileFromDatabaseAsync } from '../../services/UserService';

type UserType = 0 | 1 | 2; // 0: signed out, 1: signed in, 2: business user

interface AuthContextType {
  signedInType: UserType;
  isLoading: boolean;
  user: any;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedInType, setSignedInType] = useState<UserType>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await obtainInstagramToken();
      if (token) {
        const userProfile = await getProfileFromDatabaseAsync();
        setUser(userProfile);
        setSignedInType(userProfile.is_business ? 2 : 1);
      } else {
        setSignedInType(0);
        setUser(null);
      }
    } catch (error) {
      console.log('Auth check error:', error);
      setSignedInType(0);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token: string) => {
    try {
      const userProfile = await getProfileFromDatabaseAsync();
      setUser(userProfile);
      setSignedInType(userProfile.is_business ? 2 : 1);
    } catch (error) {
      console.log('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await onInstagramSignOut();
      setUser(null);
      setSignedInType(0);
    } catch (error) {
      console.log('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signedInType,
        isLoading,
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}