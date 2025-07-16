
"use client"

import { useState, useEffect } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound, useParams } from "next/navigation";
import type { Course, Lesson } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LessonForm } from "@/components/admin/lesson-form";

export default function ManageCourseDetailPage() {
  const { id } = useParams();
  const courseId = Array.isArray(id) ? id[0] : id;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    const courseRef = doc(db, "courses", courseId);
    const unsubscribe = onSnapshot(courseRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const courseData = { id: docSnapshot.id, ...docSnapshot.data() } as Course;
        setCourse(courseData);

        if (courseData.lessonIds && courseData.lessonIds.length > 0) {
          const lessonPromises = courseData.lessonIds.map(lessonId => getDoc(doc(db, "lessons", lessonId)));
          const lessonDocs = await Promise.all(lessonPromises);
          const lessonsData = lessonDocs
            .filter(doc => doc.exists())
            .map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
          setLessons(lessonsData);
        } else {
          setLessons([]);
        }
      } else {
        setCourse(null);
        setLessons([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [courseId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!course) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
         <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href="/admin/courses">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
            </Link>
        </Button>
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manage: {course.title}</h1>
                <p className="text-muted-foreground">
                    Add, edit, and organize lessons for this course.
                </p>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Lesson
            </Button>
        </div>
      </div>
      
      <LessonForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} courseId={courseId} />

      <Card>
        <CardHeader>
          <CardTitle>Lessons in this Course</CardTitle>
          <CardDescription>A list of all lessons in "{course.title}".</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{lesson.category}</TableCell>
                    <TableCell className="hidden md:table-cell">{lesson.duration}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {lessons.length === 0 && !loading && (
                <div className="text-center text-muted-foreground py-8">
                    No lessons have been added to this course yet.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
