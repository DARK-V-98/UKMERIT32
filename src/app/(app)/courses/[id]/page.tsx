import Link from "next/link"
import Image from "next/image"
import { courses, lessons as allLessons } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, CheckCircle } from "lucide-react"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = courses.find(c => c.id === params.id)

  if (!course) {
    notFound()
  }

  const courseLessons = allLessons.filter(lesson => course.lessonIds.includes(lesson.id));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{course.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{course.description}</p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-muted flex items-center justify-center relative">
              <Image 
                src={course.thumbnailUrl} 
                alt={course.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={course.imageHint}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href={`/lessons/${course.lessonIds[0]}`}>
              Start Learning
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Lessons</CardTitle>
            <CardDescription>All the lessons included in the "{course.title}" course.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {courseLessons.map((lesson, index) => (
                <li key={lesson.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold">{lesson.title}</h4>
                    <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                  </div>
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/lessons/${lesson.id}`}>
                      <PlayCircle className="h-6 w-6" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
