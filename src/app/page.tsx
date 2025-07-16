import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturedLessons } from '@/components/landing/featured-lessons';
import { CtaSection } from '@/components/landing/cta-section';
import { FeaturedCourses } from '@/components/landing/featured-courses';

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <MainNav />
      <main className="flex-1">
        <HeroSection />
        <FeaturedLessons />
        <FeaturedCourses />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
