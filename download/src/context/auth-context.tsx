'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User } from '@/lib/types';
import { MOCK_USERS } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('course-companion-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('course-companion-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userToLogin: User) => {
    setUser(userToLogin);
    localStorage.setItem('course-companion-user', JSON.stringify(userToLogin));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('course-companion-user');
    router.push('/');
  }, [router]);
  
  useEffect(() => {
    if (!loading && !user && pathname !== '/') {
        router.push('/');
    }
  }, [user, loading, pathname, router]);


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
