
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

const ADMIN_EMAIL = "admin@example.com";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAdmin(user?.email === ADMIN_EMAIL);
      setLoading(false);
      if (!user && !['/login', '/signup', '/'].includes(pathname) && !pathname.startsWith('/lessons/')) {
         router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);
  
  const value = { user, loading, isAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <AuthProvider>
       <div className="flex min-h-dvh flex-col">
          <MainNav isAuthenticated={!!user} />
          <main className="flex-1">
            <div className="container py-8">
              {children}
            </div>
          </main>
          <SiteFooter />
        </div>
    </AuthProvider>
  );
}
