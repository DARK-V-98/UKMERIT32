
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
import type { Review } from "@/lib/types";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Reviewer name must be at least 2 characters."),
  review: z.string().min(10, "Review must be at least 10 characters."),
  imageFilename: z.string().min(1, "Image filename is required."),
});

interface ReviewFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  review?: Review;
  onClose?: () => void;
}

export function ReviewForm({ isOpen, setIsOpen, review, onClose }: ReviewFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      review: "",
      imageFilename: "",
    },
  });

  useEffect(() => {
    if (isOpen && review) {
      form.reset({
        name: review.name,
        review: review.review,
        imageFilename: review.imageFilename,
      });
    } else {
       form.reset({
        name: "",
        review: "",
        imageFilename: "",
      });
    }
  }, [isOpen, review, form]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (review) {
        const reviewRef = doc(db, "reviews", review.id);
        await setDoc(reviewRef, values, { merge: true });
        toast({ title: "Success", description: "Review updated successfully." });
      } else {
        await addDoc(collection(db, "reviews"), {
          ...values,
          createdAt: new Date(),
        });
        toast({ title: "Success", description: "Review created successfully." });
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{review ? "Edit Review" : "Add New Review"}</DialogTitle>
          <DialogDescription>
            {review ? "Update this review." : "Fill in the details for the new review."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Text</FormLabel>
                  <FormControl>
                    <Textarea placeholder="This is the best platform I have ever used..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="imageFilename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer Image Filename</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., john-doe (without .png extension)" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Review"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
