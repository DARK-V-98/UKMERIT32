
"use client"

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams, useRouter, notFound } from 'next/navigation';
import type { Lesson, Quiz, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash, PlusCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const questionSchema = z.object({
  question: z.string().min(1, 'Question text is required.'),
  options: z.array(z.string().min(1, 'Option text is required.')).min(2, 'At least two options are required.'),
  correctAnswer: z.string().min(1, 'Please select a correct answer.'),
});

const quizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required.'),
  questions: z.array(questionSchema),
});

export default function ManageQuizPage() {
  const { id } = useParams();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { toast } = useToast();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  useEffect(() => {
    if (!lessonId) return;

    const fetchQuizData = async () => {
      setLoading(true);
      const lessonRef = doc(db, 'lessons', lessonId);
      const lessonSnap = await getDoc(lessonRef);

      if (!lessonSnap.exists()) {
        notFound();
        return;
      }
      
      const lessonData = { id: lessonSnap.id, ...lessonSnap.data() } as Lesson;
      setLesson(lessonData);

      const quizRef = doc(db, 'quizzes', lessonId);
      const quizSnap = await getDoc(quizRef);

      if (quizSnap.exists()) {
        form.reset(quizSnap.data() as Quiz);
      } else {
        form.reset({
          title: `${lessonData.title} Quiz`,
          questions: [],
        });
      }
      setLoading(false);
    };

    fetchQuizData();
  }, [lessonId, form]);

  const onSubmit = async (data: z.infer<typeof quizSchema>) => {
    if (!lessonId) return;
    try {
      const quizRef = doc(db, 'quizzes', lessonId);
      await setDoc(quizRef, data, { merge: true });
      toast({
        title: 'Success!',
        description: 'Quiz has been saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error saving quiz',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <Skeleton className="w-full h-96" />;
  }
  
  if (!lesson) {
     return notFound();
  }

  return (
    <div className="flex flex-col gap-8">
        <div>
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link href={`/admin/courses/${lesson.courseId}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Course
                </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Manage Quiz for: {lesson.title}</h1>
            <p className="text-muted-foreground">Add, edit, or remove questions for this lesson's quiz.</p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
                </CardHeader>
                <CardContent>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Quiz Title</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </CardContent>
            </Card>

            {fields.map((field, index) => (
                <Card key={field.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Question {index + 1}</CardTitle>
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                    <Trash className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                    control={form.control}
                    name={`questions.${index}.question`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Question Text</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <FormField
                    control={form.control}
                    name={`questions.${index}.options`}
                    render={({ field: { value, onChange } }) => (
                        <FormItem>
                            <FormLabel>Options</FormLabel>
                            {value?.map((opt, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                    <Input value={opt} onChange={(e) => {
                                        const newOptions = [...value];
                                        newOptions[optIndex] = e.target.value;
                                        onChange(newOptions);
                                    }} />
                                     <Button type="button" variant="ghost" size="icon" onClick={() => {
                                        const newOptions = value.filter((_, i) => i !== optIndex);
                                        onChange(newOptions);
                                     }}>
                                        <Trash className="h-4 w-4" />
                                     </Button>
                                </div>
                            ))}
                            <Button type="button" size="sm" variant="outline" onClick={() => onChange([...value, ''])}>
                                Add Option
                            </Button>
                            <FormMessage />
                        </FormItem>
                    )}
                     />

                    <FormField
                    control={form.control}
                    name={`questions.${index}.correctAnswer`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Correct Answer</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select the correct answer" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {form.getValues(`questions.${index}.options`).map((option, optIndex) => (
                                <SelectItem key={optIndex} value={option}>
                                {option || `Option ${optIndex + 1}`}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                </Card>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={() => append({ question: '', options: ['', ''], correctAnswer: '' })}
            >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Question
            </Button>

            <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Quiz'}
                </Button>
            </div>
            </form>
        </Form>
    </div>
  );
}
