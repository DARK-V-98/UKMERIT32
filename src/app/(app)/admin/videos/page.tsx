
"use client"

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonForm } from "@/components/admin/lesson-form";
import type { Lesson } from "@/lib/types";
import { PlusCircle, Trash2, Edit, Eye, EyeOff } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function ManageVideosPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "lessons"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lessonsData: Lesson[] = [];
      querySnapshot.forEach((doc) => {
        lessonsData.push({ id: doc.id, ...doc.data() } as Lesson);
      });
      setLessons(lessonsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNew = () => {
    setEditingLesson(null);
    setIsFormOpen(true);
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsFormOpen(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!lessonId) return;

    try {
      // Also need to remove from course if it exists
      const lessonRef = doc(db, "lessons", lessonId);
      await deleteDoc(lessonRef);

      // We might need to remove this lessonId from any courses it belongs to
      // For now, we just delete the lesson and its quiz.
      const quizRef = doc(db, "quizzes", lessonId);
      const quizSnap = await getDoc(quizRef);
      if(quizSnap.exists()) {
        await deleteDoc(quizRef);
      }
      
      toast({
        title: "Success",
        description: "Video has been deleted.",
      });

    } catch (error: any) {
      toast({
        title: "Error Deleting Video",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Videos</h1>
          <p className="text-muted-foreground">
            Add, edit, and organize all videos on the platform.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Video
        </Button>
      </div>

      <LessonForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        lesson={editingLesson || undefined}
        onClose={() => setEditingLesson(null)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Existing Videos</CardTitle>
          <CardDescription>A list of all videos on the platform.</CardDescription>
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
                       <Button variant="outline" size="icon" onClick={() => handleEdit(lesson)}>
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
                                <span className="font-bold"> {lesson.title} </span> 
                                video and its associated quiz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteLesson(lesson.id)}>
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
