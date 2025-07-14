
"use client"

import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
       if (!user && !['/login', '/signup'].includes(pathname)) {
        // Redirect to login if not authenticated and not on a public page
        // You might want to define more public pages
       }
    });

    return () => unsubscribe();
  }, [router, pathname]);
  
  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthWrapper>
        {children}
      </AuthWrapper>
    </AuthProvider>
  );
}


function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
     return (
        <div className="flex flex-col min-h-dvh">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
              <Skeleton className="h-8 w-32" />
              <div className="flex-1" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </header>
          <main className="flex-1">
            <div className="container py-8">
              <Skeleton className="h-96 w-full" />
            </div>
          </main>
        </div>
      )
  }

  return (
     <div className="flex min-h-dvh flex-col">
      <MainNav isAuthenticated={!!user} />
      <main className="flex-1">
        <div className="container py-8">
            {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
