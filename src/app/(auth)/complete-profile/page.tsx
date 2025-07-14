
"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { User } from "firebase/auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/app/(app)/layout"

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  whatsapp: z.string().min(10, { message: "Please enter a valid WhatsApp number." }),
});

export default function CompleteProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, profileComplete } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      whatsapp: "",
    }
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (profileComplete) {
        router.push("/dashboard");
      }
    }
  }, [user, authLoading, profileComplete, router]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        username: values.username,
        whatsapp: values.whatsapp,
        profileComplete: true,
      }, { merge: true });

      toast({ title: "Success", description: "Your profile has been updated." });
      // Manually push to dashboard, the context will take a moment to update
      router.push("/dashboard");
      // Force a reload to ensure the AuthProvider picks up the new profile state
      router.refresh(); 

    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading || profileComplete === undefined) {
    return (
       <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
           <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-2" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl">Complete Your Profile</CardTitle>
        <CardDescription>
          Welcome, {user?.displayName}! Please add a few more details to finish setting up your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Create a username" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input placeholder="070 123 4567" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save and Continue"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
