
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import { usePathname, useRouter } from 'next/navigation';
import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  profileComplete: boolean | undefined;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  profileComplete: undefined,
});

const ADMIN_EMAIL = "admin@example.com";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileComplete, setProfileComplete] = useState<boolean | undefined>(undefined);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsAdmin(user?.email === ADMIN_EMAIL);

      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfileComplete(userDoc.data().profileComplete);
        } else {
          setProfileComplete(false);
        }
      } else {
        setProfileComplete(undefined);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const value = { user, loading, isAdmin, profileComplete };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function ProtectedRoutes({ children }: { children: React.ReactNode }) {
  const { user, loading, profileComplete } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // If not logged in, redirect to login page unless they are already there or on an allowed public page.
    if (!user) {
      if (!['/login', '/signup', '/'].includes(pathname) && !pathname.startsWith('/lessons/')) {
        router.push('/login');
      }
      return;
    }

    // If logged in but profile is not complete, redirect to complete-profile page.
    if (user && !profileComplete && pathname !== '/complete-profile') {
        router.push('/complete-profile');
    }

  }, [user, loading, profileComplete, router, pathname]);

  if (loading || (!user && !['/login', '/signup', '/'].includes(pathname) && !pathname.startsWith('/lessons/')) ) {
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
