
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
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
import type { Course } from "@/lib/types";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  thumbnailUrl: z.string().optional(),
});

interface CourseFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  course?: Course;
  onClose?: () => void;
}

export function CourseForm({ isOpen, setIsOpen, course, onClose }: CourseFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnailUrl: "",
    },
  });

  useEffect(() => {
    if (isOpen && course) {
      form.reset({
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
      });
    } else {
       form.reset({
        title: "",
        description: "",
        thumbnailUrl: "",
      });
    }
  }, [isOpen, course, form]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (course) {
        // Update existing course
        const courseRef = doc(db, "courses", course.id);
        await setDoc(courseRef, values, { merge: true });
        toast({ title: "Success", description: "Course updated successfully." });
      } else {
        // Add new course
        await addDoc(collection(db, "courses"), {
          ...values,
          lessonIds: [],
          createdAt: new Date(),
        });
        toast({ title: "Success", description: "Course created successfully." });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {course ? "Update the details of your course." : "Fill in the details for the new course."}
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
                    <Input placeholder="e.g., Beginner's English Grammar" {...field} />
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
             <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Filename</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., course-image (without .png extension)" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Course"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
