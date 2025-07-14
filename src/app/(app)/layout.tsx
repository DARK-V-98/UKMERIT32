
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { Skeleton } from '@/components/ui/skeleton';

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
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAdmin(user?.email === ADMIN_EMAIL);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const value = { user, loading, isAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      if (!['/login', '/signup', '/'].includes(pathname) && !pathname.startsWith('/lessons/')) {
        router.push('/login');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
       <div className="container py-8">
         <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <MainNav />
      <main className="flex-1">
        <ProtectedRoutes>
          <div className="container py-8">
            {children}
          </div>
        </ProtectedRoutes>
      </main>
      <SiteFooter />
    </div>
  );
}
