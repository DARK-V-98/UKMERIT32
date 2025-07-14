import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container flex items-center justify-center py-12">
            {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
