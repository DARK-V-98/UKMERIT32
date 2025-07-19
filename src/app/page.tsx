import { MainNav } from '@/components/layout/main-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { HeroSection } from '@/components/landing/hero-section';
import { CtaSection } from '@/components/landing/cta-section';
import { FeaturedCourses } from '@/components/landing/featured-courses';
import { AboutSection } from '@/components/landing/about-section';
import { ReviewsSection } from '@/components/landing/reviews-section';

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <MainNav />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCourses />
        <AboutSection />
        <ReviewsSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
