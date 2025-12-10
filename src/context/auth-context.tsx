'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User } from '@/lib/types';
import { MOCK_USERS } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (user: Omit<User, 'id'> & { password: string }) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<(User & { password: string })[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('course-companion-user');
      const storedRegistered = localStorage.getItem('course-companion-registered-users');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      if (storedRegistered) {
        setRegisteredUsers(JSON.parse(storedRegistered));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      localStorage.removeItem('course-companion-user');
      localStorage.removeItem('course-companion-registered-users');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Check in registered users first
    const registeredUser = registeredUsers.find(u => u.email === email);
    if (registeredUser) {
      if (registeredUser.password === password) {
        const { password: _, ...userWithoutPassword } = registeredUser;
        setUser(userWithoutPassword);
        localStorage.setItem('course-companion-user', JSON.stringify(userWithoutPassword));
        return;
      } else {
        throw new Error('Invalid email or password');
      }
    }

    // Check in mock users
    const mockUser = MOCK_USERS.find(u => u.email === email);
    if (mockUser) {
      // For demo purposes, accept any password for mock users
      setUser(mockUser);
      localStorage.setItem('course-companion-user', JSON.stringify(mockUser));
      return;
    }

    throw new Error('Invalid email or password');
  }, [registeredUsers]);

  const register = useCallback((userData: Omit<User, 'id'> & { password: string }) => {
    const newUser: User & { password: string } = {
      ...userData,
      id: `user_${Date.now()}`,
    };

    const updatedRegisteredUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedRegisteredUsers);
    localStorage.setItem('course-companion-registered-users', JSON.stringify(updatedRegisteredUsers));

    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('course-companion-user', JSON.stringify(userWithoutPassword));
  }, [registeredUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('course-companion-user');
    router.push('/');
  }, [router]);
  
  useEffect(() => {
    if (!loading && !user && pathname !== '/' && pathname !== '/register') {
        router.push('/');
    }
  }, [user, loading, pathname, router]);


  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
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
