import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { lessons } from "@/lib/mock-data"
import { Button } from "../ui/button"

export function FeaturedLessons() {
  const featured = lessons.slice(0, 3);

  return (
    <section id="featured-lessons" className="container mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Featured Lessons
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Get a glimpse of our high-quality content. Start learning with these popular lessons.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((lesson) => (
          <Card key={lesson.id} className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="p-0">
               <Link href={`/lessons/${lesson.id}`} className="block">
                <Image
                  alt={lesson.title}
                  className="aspect-video w-full object-cover"
                  height="225"
                  src={lesson.thumbnailUrl}
                  width="400"
                  data-ai-hint={lesson.imageHint}
                />
              </Link>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <Badge variant="outline" className="mb-2">{lesson.category}</Badge>
              <CardTitle className="text-lg">
                <Link href={`/lessons/${lesson.id}`} className="hover:text-primary transition-colors">
                  {lesson.title}
                </Link>
              </CardTitle>
              <CardDescription className="mt-2 text-sm">{lesson.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
               <p className="text-xs text-muted-foreground">{lesson.duration} · {lesson.difficulty}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button asChild size="lg" variant="outline">
            <Link href="/lessons">View All Lessons</Link>
        </Button>
      </div>
    </section>
  )
}
