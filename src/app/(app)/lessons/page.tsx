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
import { Badge } from "@/components/ui/badge"
import { lessons } from "@/lib/mock-data"

export default function LessonsPage() {
  const categories = [...new Set(lessons.map(l => l.category))];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lesson Library</h1>
        <p className="text-muted-foreground">
          Explore our collection of video lessons to master English.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input placeholder="Search lessons..." />
        </div>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
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
    </div>
  )
}
