
"use client"

import { useState, useEffect } from 'react';
import Link from "next/link"
import Image from "next/image"
import { doc, getDoc, collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
              <Link href={`/videos/${lessons[0].id}`}>
                Start Learning
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
