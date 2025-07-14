import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <MainNav isAuthenticated />
      <main className="flex-1">
        <div className="container py-8">
            {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
