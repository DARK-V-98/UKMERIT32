import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block text-primary">Achieve Your</span>
            <span className="block text-secondary">Full Potential.</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-lg text-muted-foreground sm:text-xl md:mt-5 md:max-w-3xl">
            Join UK MERIT ACADEMY for engaging video lessons, interactive quizzes, and a supportive community of learners.
          </p>
          <div className="mt-8 flex justify-center lg:justify-start gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/lessons">Explore Lessons</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
           <Image 
            src="/ln.webp"
            alt="An illustration of people learning"
            layout="fill"
            objectFit="cover"
            data-ai-hint="language learning class"
          />
        </div>
      </div>
    </section>
  )
}
