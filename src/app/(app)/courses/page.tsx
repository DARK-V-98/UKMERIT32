
"use client"

import { useState, useEffect } from 'react';
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
import { Button } from "@/components/ui/button"
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { Course } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, 'courses'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coursesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      setCourses(coursesList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (thumbnailUrl?: string) => {
    if (!thumbnailUrl) return "https://placehold.co/400x225.png";
    if (thumbnailUrl.startsWith('http')) return thumbnailUrl;
    return `/${thumbnailUrl}.png`;
  }

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
          <Input 
            placeholder="Search courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
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
           {filteredCourses.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-16 col-span-full">
              <h3 className="text-lg font-semibold">No courses found</h3>
              <p>Try adjusting your search criteria or create a new course in the admin dashboard.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
