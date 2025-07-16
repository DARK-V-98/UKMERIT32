
"use client"

import { useState, useEffect } from 'react';
import Link from "next/link"
import Image from "next/image"
import { doc, getDoc, collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, BookOpen } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Course, Lesson } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseData = async () => {
      setLoading(true);
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) {
        notFound();
        return;
      }
      
      const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
      setCourse(courseData);
      
      if (courseData.lessonIds && courseData.lessonIds.length > 0) {
        const lessonsRef = collection(db, "lessons");
        const q = query(lessonsRef, where(documentId(), "in", courseData.lessonIds), where("status", "==", "active"));
        const lessonSnaps = await getDocs(q);
        const lessonsData = lessonSnaps.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
        setLessons(lessonsData);
      }
      
      setLoading(false);
    };

    fetchCourseData();
  }, [courseId]);

  const lessonsByCategory = lessons.reduce((acc, lesson) => {
    const category = lesson.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const getImageUrl = (thumbnailUrl?: string) => {
    if (!thumbnailUrl) return "https://placehold.co/854x480.png";
    if (thumbnailUrl.startsWith('http')) return thumbnailUrl;
    return `/${thumbnailUrl}.png`;
  }

  if (loading) {
    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="aspect-video w-full" />
            <div className="flex justify-center">
                <Skeleton className="h-12 w-48" />
            </div>
             <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  if (!course) {
    return notFound();
  }

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
                src={getImageUrl(course.thumbnailUrl)}
                alt={course.title}
                layout="fill"
                objectFit="cover"
                data-ai-hint={course.imageHint || 'course thumbnail'}
              />
            </div>
          </CardContent>
        </Card>
        
        {lessons.length > 0 && (
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href={`/lessons/${lessons[0].id}`}>
                Start Learning
              </Link>
            </Button>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen />
              Course Content
            </CardTitle>
            <CardDescription>All the lessons included in the "{course.title}" course.</CardDescription>
          </CardHeader>
          <CardContent>
             {lessons.length > 0 ? (
                <Accordion type="multiple" defaultValue={Object.keys(lessonsByCategory)} className="w-full">
                {Object.entries(lessonsByCategory).map(([category, categoryLessons]) => (
                    <AccordionItem value={category} key={category}>
                    <AccordionTrigger className="text-lg font-semibold">{category}</AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-4 pt-2">
                        {categoryLessons.map((lesson, index) => (
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
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>No lessons have been added to this course yet.</p>
                </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
