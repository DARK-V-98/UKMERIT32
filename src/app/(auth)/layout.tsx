import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <MainNav />
      <main className="flex flex-1 items-center justify-center bg-background py-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
