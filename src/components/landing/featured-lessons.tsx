
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Lesson } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function FeaturedLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessonsCollection = collection(db, 'lessons');
        const q = query(lessonsCollection, where("status", "==", "active"), limit(3));
        const lessonSnapshot = await getDocs(q);
        const lessonsList = lessonSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
        setLessons(lessonsList);
      } catch (error) {
        console.error("Error fetching featured lessons: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

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
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden">
               <Skeleton className="aspect-video w-full" />
              <CardContent className="flex-1 p-4 space-y-2">
                 <Skeleton className="h-4 w-1/4" />
                 <Skeleton className="h-6 w-3/4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                 <Skeleton className="h-4 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="p-0">
                <Link href={`/lessons/${lesson.id}`} className="block">
                  <Image
                    alt={lesson.title}
                    className="aspect-video w-full object-cover"
                    height="225"
                    src={lesson.thumbnailUrl || "https://placehold.co/400x225.png"}
                    width="400"
                    data-ai-hint={lesson.imageHint || "lesson placeholder"}
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
      )}
      <div className="text-center mt-12">
        <Button asChild size="lg" variant="outline">
            <Link href="/lessons">View All Lessons</Link>
        </Button>
      </div>
    </section>
  )
}
