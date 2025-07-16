
"use client"

import { useState, useEffect } from "react";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound, useParams } from "next/navigation";
import type { Course, Lesson } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, ArrowLeft, Eye, EyeOff, ClipboardList } from "lucide-react";
import Link from "next/link";
import { LessonForm } from "@/components/admin/lesson-form";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function ManageCourseDetailPage() {
  const { id } = useParams();
  const courseId = Array.isArray(id) ? id[0] : id;
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

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
  
  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsFormOpen(true);
  }

  const handleAddNewLesson = () => {
    setEditingLesson(null);
    setIsFormOpen(true);
  }

  const handleToggleStatus = async (lesson: Lesson) => {
    const lessonRef = doc(db, "lessons", lesson.id);
    const newStatus = lesson.status === 'active' ? 'disabled' : 'active';
    try {
        await updateDoc(lessonRef, { status: newStatus });
        toast({
            title: "Success",
            description: `Video has been ${newStatus}.`,
        });
    } catch (error: any) {
        toast({
            title: "Error",
            description: `Failed to update video status: ${error.message}`,
            variant: "destructive"
        });
    }
  }


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
                    Add, edit, and organize videos for this course.
                </p>
            </div>
            <Button onClick={handleAddNewLesson}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Video
            </Button>
        </div>
      </div>
      
      <LessonForm 
        isOpen={isFormOpen} 
        setIsOpen={setIsFormOpen} 
        courseId={courseId}
        lesson={editingLesson || undefined}
        onClose={() => setEditingLesson(null)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Videos in this Course</CardTitle>
          <CardDescription>A list of all videos in "{course.title}".</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{lesson.category}</TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge variant={lesson.status === 'active' ? 'default' : 'secondary'}>
                          {lesson.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(lesson)}>
                        {lesson.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </Button>
                       <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/quizzes/${lesson.id}`}>
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Quiz
                            </Link>
                       </Button>
                       <Button variant="outline" size="sm" onClick={() => handleEditLesson(lesson)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {lessons.length === 0 && !loading && (
                <div className="text-center text-muted-foreground py-8">
                    No videos have been added to this course yet.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
