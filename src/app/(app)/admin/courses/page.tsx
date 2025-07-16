
"use client"

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, doc, writeBatch, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseForm } from "@/components/admin/course-form";
import type { Course } from "@/lib/types";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "courses"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coursesData: Course[] = [];
      querySnapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() } as Course);
      });
      setCourses(coursesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNew = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!courseId) return;

    try {
        const batch = writeBatch(db);

        // 1. Get all lessons for the course
        const lessonsRef = collection(db, "lessons");
        const lessonsQuery = query(lessonsRef, where("courseId", "==", courseId));
        const lessonsSnapshot = await getDocs(lessonsQuery);

        const lessonIds = lessonsSnapshot.docs.map(doc => doc.id);

        // 2. Delete all quizzes associated with those lessons
        if (lessonIds.length > 0) {
            lessonIds.forEach(lessonId => {
                const quizRef = doc(db, "quizzes", lessonId);
                batch.delete(quizRef);
            });
        }
        
        // 3. Delete all lessons
        lessonsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        
        // 4. Delete the course itself
        const courseRef = doc(db, "courses", courseId);
        batch.delete(courseRef);
        
        await batch.commit();

        toast({
            title: "Success",
            description: "Course and all its associated content have been deleted.",
        });

    } catch (error: any) {
        toast({
            title: "Error Deleting Course",
            description: `An error occurred: ${error.message}`,
            variant: "destructive",
        });
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Courses</h1>
          <p className="text-muted-foreground">
            Add, edit, and organize your courses.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Course
        </Button>
      </div>

      <CourseForm 
        isOpen={isFormOpen} 
        setIsOpen={setIsFormOpen} 
        course={editingCourse || undefined}
        onClose={() => setEditingCourse(null)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Existing Courses</CardTitle>
          <CardDescription>A list of all courses on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell text-center">Lessons</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-sm truncate">{course.description}</TableCell>
                    <TableCell className="hidden md:table-cell text-center">{course.lessonIds?.length || 0}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/courses/${course.id}`}>Manage</Link>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEdit(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                <span className="font-bold"> {course.title} </span> 
                                course, along with all its lessons and quizzes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
