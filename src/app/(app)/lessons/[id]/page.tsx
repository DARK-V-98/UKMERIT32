import Link from "next/link"
import Image from "next/image"
import { lessons } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlayCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LessonDetailPage({ params }: { params: { id: string } }) {
  const lesson = lessons.find(l => l.id === params.id)

  if (!lesson) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-8">
        <div>
          <Badge variant="secondary" className="mb-2">{lesson.category}</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{lesson.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{lesson.description}</p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-muted flex items-center justify-center relative">
              <Image 
                src={lesson.thumbnailUrl} 
                alt={lesson.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={lesson.imageHint}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <PlayCircle className="h-20 w-20 text-white/80 hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href={`/lessons/${lesson.id}/quiz`}>
              Take Quiz & Test Your Knowledge
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5"/>
              Transcript
            </CardTitle>
            <CardDescription>Read the full transcript of the lesson below.</CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>View Full Transcript</AccordionTrigger>
                <AccordionContent>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {lesson.transcript}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
