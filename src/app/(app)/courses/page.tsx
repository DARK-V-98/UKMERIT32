import Link from "next/link"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { courses } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

export default function CoursesPage() {

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">
          Enroll in a course to start your structured learning journey.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input placeholder="Search courses..." />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="p-0">
               <Link href={`/courses/${course.id}`} className="block">
                <Image
                  alt={course.title}
                  className="aspect-video w-full object-cover"
                  height="225"
                  src={course.thumbnailUrl}
                  width="400"
                  data-ai-hint={course.imageHint}
                />
              </Link>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <CardTitle className="text-lg">
                <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
                  {course.title}
                </Link>
              </CardTitle>
              <CardDescription className="mt-2 text-sm">{course.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
               <p className="text-xs text-muted-foreground">{course.lessonIds.length} Lessons</p>
               <Button asChild size="sm">
                  <Link href={`/courses/${course.id}`}>Start Course</Link>
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
