
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export function FeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, 'courses');
        const q = query(coursesCollection, orderBy("createdAt", "desc"), limit(3));
        const courseSnapshot = await getDocs(q);
        const coursesList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(coursesList);
      } catch (error) {
        console.error("Error fetching featured courses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const getImageUrl = (thumbnailUrl?: string) => {
    if (!thumbnailUrl || thumbnailUrl.startsWith('http') || thumbnailUrl.startsWith('https://placehold.co')) {
      return thumbnailUrl || "https://placehold.co/400x225.png";
    }
    return `/${thumbnailUrl}.png`;
  }


  return (
    <section id="featured-courses" className="container mx-auto px-4 py-16 sm:py-24 bg-muted/50 rounded-lg">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Featured Courses
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Enroll in a structured course and accelerate your learning journey.
        </p>
      </div>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden">
               <Skeleton className="aspect-video w-full" />
              <CardContent className="flex-1 p-4 space-y-2">
                 <Skeleton className="h-6 w-3/4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                 <Skeleton className="h-4 w-16" />
                 <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className={courses.length < 3 ? "flex justify-center gap-6 flex-wrap" : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"}>
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl w-full max-w-sm md:max-w-none">
                <CardHeader className="p-0">
                  <Link href={`/courses/${course.id}`} className="block">
                    <Image
                      alt={course.title}
                      className="aspect-video w-full object-cover"
                      height="225"
                      src={getImageUrl(course.thumbnailUrl)}
                      width="400"
                      data-ai-hint={course.imageHint || "course placeholder"}
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
                  <p className="text-xs text-muted-foreground">{course.lessonIds?.length || 0} Lessons</p>
                  <Button asChild size="sm">
                      <Link href={`/courses/${course.id}`}>Start Course</Link>
                  </Button>
                </CardFooter>
            </Card>
          ))}
        </div>
      )}
       {courses.length > 0 && (
        <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
                <Link href="/courses">View All Courses</Link>
            </Button>
        </div>
      )}
    </section>
  )
}
