
"use client"

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, addDoc, doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
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
import type { Lesson } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.string().min(1, "Please select a category."),
  difficulty: z.string().min(1, "Please select a difficulty."),
  duration: z.string().min(1, "Please enter a duration."),
  videoUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  thumbnailUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  status: z.enum(['active', 'disabled'])
});

interface LessonFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  courseId: string;
  lesson?: Lesson;
  onClose?: () => void;
}

export function LessonForm({ isOpen, setIsOpen, courseId, lesson, onClose }: LessonFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: lesson || {
      title: "",
      description: "",
      category: "",
      difficulty: "",
      duration: "",
      videoUrl: "",
      thumbnailUrl: "",
      status: "active",
    },
  });

  // This effect updates the form with new `lesson` data when it changes.
  React.useEffect(() => {
    if (lesson) {
      form.reset(lesson);
    } else {
      form.reset({
        title: "",
        description: "",
        category: "",
        difficulty: "Beginner",
        duration: "",
        videoUrl: "",
        thumbnailUrl: "https://placehold.co/400x225.png",
        status: "active",
      });
    }
  }, [lesson, form]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (lesson) {
        // Update existing lesson
        const lessonRef = doc(db, "lessons", lesson.id);
        await setDoc(lessonRef, {...values, courseId}, { merge: true });
        toast({ title: "Success", description: "Lesson updated successfully." });
      } else {
        // Add new lesson
        const lessonRef = await addDoc(collection(db, "lessons"), {
          ...values,
          courseId,
          createdAt: new Date(),
        });
        
        // Add lesson ID to course
        const courseRef = doc(db, "courses", courseId);
        await updateDoc(courseRef, {
            lessonIds: arrayUnion(lessonRef.id)
        });

        toast({ title: "Success", description: "Lesson created successfully." });
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
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          onClose?.();
        }
    }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
          <DialogDescription>
            {lesson ? "Update the details of your lesson." : "Fill in the details for the new lesson."}
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A complete guide to the fundamental grammar rules..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Grammar">Grammar</SelectItem>
                          <SelectItem value="Speaking">Speaking</SelectItem>
                          <SelectItem value="Listening">Listening</SelectItem>
                          <SelectItem value="Reading">Reading</SelectItem>
                           <SelectItem value="Writing">Writing</SelectItem>
                          <SelectItem value="Vocabulary">Vocabulary</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  <FormLabel>YouTube or Video URL</FormLabel>
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
                  <FormLabel>Thumbnail Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://placehold.co/400x225.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Lesson"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
