
"use client"

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, addDoc, doc, updateDoc, arrayUnion, setDoc, getDocs, query, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Lesson, Course } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "../ui/combobox";
import { PlusCircle } from "lucide-react";
import { CategoryForm } from "./category-form";


const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters.").optional().or(z.literal('')),
  category: z.string().min(1, "Please select or create a category."),
  difficulty: z.string().min(1, "Please select a difficulty."),
  duration: z.string().min(1, "Please enter a duration."),
  videoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  thumbnailUrl: z.string().optional(),
  status: z.enum(['active', 'disabled']),
  courseId: z.string().optional(),
});

interface LessonFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  lesson?: Lesson;
  courseId?: string; // This is now optional
  onClose?: () => void;
}

export function LessonForm({ isOpen, setIsOpen, courseId, lesson, onClose }: LessonFormProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [courses, setCourses] = useState<{ value: string; label: string }[]>([]);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      difficulty: "Beginner",
      duration: "",
      videoUrl: "",
      thumbnailUrl: "",
      status: "active",
      courseId: courseId || "",
    },
  });

  const fetchCategoriesAndCourses = async () => {
      const categoriesCollection = collection(db, 'categories');
      const catQuery = query(categoriesCollection);
      const catSnapshot = await getDocs(catQuery);
      const fetchedCategories = catSnapshot.docs.map(doc => ({ value: doc.data().name, label: doc.data().name }));
      setCategories(fetchedCategories);

      const coursesCollection = collection(db, 'courses');
      const courseQuery = query(coursesCollection);
      const courseSnapshot = await getDocs(courseQuery);
      const fetchedCourses = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Course })).map(c => ({ value: c.id, label: c.title }));
      setCourses(fetchedCourses);
  }

  useEffect(() => {
    if(isOpen) {
       fetchCategoriesAndCourses();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (lesson) {
      form.reset({
        ...lesson,
        description: lesson.description || "",
        videoUrl: lesson.videoUrl || "",
        thumbnailUrl: lesson.thumbnailUrl || "",
        courseId: lesson.courseId || courseId || ""
      });
    } else {
      form.reset({
        title: "",
        description: "",
        category: "",
        difficulty: "Beginner",
        duration: "",
        videoUrl: "",
        thumbnailUrl: "",
        status: "active",
        courseId: courseId || "",
      });
    }
  }, [lesson, form, isOpen, courseId]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const categoryExists = categories.some(c => c.value.toLowerCase() === values.category.toLowerCase());
      if (!categoryExists && values.category) {
          const batch = writeBatch(db);
          const categoryRef = doc(collection(db, 'categories'));
          batch.set(categoryRef, { name: values.category });
          await batch.commit();
      }

      const dataToSave = {
        ...values,
        courseId: values.courseId === 'none' ? '' : values.courseId,
        thumbnailUrl: values.thumbnailUrl || "https://placehold.co/400x225.png"
      }

      if (lesson) {
        const lessonRef = doc(db, "lessons", lesson.id);
        await setDoc(lessonRef, dataToSave, { merge: true });
        toast({ title: "Success", description: "Video updated successfully." });
      } else {
        const lessonRef = await addDoc(collection(db, "lessons"), {
          ...dataToSave,
          createdAt: new Date(),
        });
        
        if (dataToSave.courseId) {
            const courseRef = doc(db, "courses", dataToSave.courseId);
            await updateDoc(courseRef, {
                lessonIds: arrayUnion(lessonRef.id)
            });
        }
        toast({ title: "Success", description: "Video created successfully." });
      }
      form.reset();
      setIsOpen(false);
      onClose?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
    <CategoryForm 
        isOpen={isCategoryFormOpen} 
        setIsOpen={setIsCategoryFormOpen}
        onCategoryAdded={fetchCategoriesAndCourses}
    />
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          onClose?.();
        }
    }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Video" : "Add New Video"}</DialogTitle>
          <DialogDescription>
            {lesson ? "Update the details of this video." : "Fill in the details for the new video."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mastering Present Tenses" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short summary of the video..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <FormLabel>Category</FormLabel>
                        <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => setIsCategoryFormOpen(true)}>
                            <PlusCircle className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                       <Combobox 
                        options={categories}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select or create..."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''} defaultValue={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Assign to a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {courses.map(course => (
                              <SelectItem key={course.value} value={course.value}>{course.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 12 min" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube or Video URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image Filename (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., my-lesson-image (without extension)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Video"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}
