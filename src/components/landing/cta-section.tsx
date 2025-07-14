import Link from "next/link"
import { Button } from "../ui/button"

export function CtaSection() {
  return (
    <section className="bg-card">
      <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Create your free account today and take the first step towards mastering new skills.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/signup">Start Learning Now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
