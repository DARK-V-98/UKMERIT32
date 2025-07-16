
"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link"
import Image from "next/image"
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlayCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from '@/components/ui/skeleton';
import type { Lesson } from '@/lib/types';


export default function LessonDetailPage({ params }: { params: { id: string } }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      const lessonRef = doc(db, 'lessons', params.id);
      const lessonSnap = await getDoc(lessonRef);

      if (lessonSnap.exists() && lessonSnap.data().status === 'active') {
        setLesson({ id: lessonSnap.id, ...lessonSnap.data() } as Lesson);
      } else {
        notFound();
      }
      setLoading(false);
    };

    fetchLesson();
  }, [params.id]);


  const renderVideoPlayer = (videoUrl: string) => {
    if (!lesson) return null;
    // Check if it's a YouTube URL and format it for embedding
    if (videoUrl.includes("youtube.com")) {
      const videoIdMatch = videoUrl.match(/(?:v=|\/embed\/|\/)([\w-]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      if (!videoId) return <p>Invalid YouTube URL</p>;
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return (
        <iframe
          src={embedUrl}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      );
    }
    // Assume it's a MediaDelivery iframe URL or other direct embed
    return (
       <iframe
          src={videoUrl}
          loading="lazy"
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
    )
  }
  
  if (loading) {
    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="aspect-video w-full" />
             <div className="flex justify-center">
                <Skeleton className="h-12 w-64" />
            </div>
        </div>
    )
  }

  if (!lesson) {
    return notFound()
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-8">
        <div>
          <Badge variant="secondary" className="mb-2">{lesson.category}</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{lesson.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{lesson.description}</p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-muted flex items-center justify-center relative">
              {lesson.videoUrl ? (
                renderVideoPlayer(lesson.videoUrl)
              ) : (
                <>
                  <Image 
                    src={lesson.thumbnailUrl || "https://placehold.co/854x480.png"} 
                    alt={lesson.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={lesson.imageHint || 'lesson placeholder'}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <PlayCircle className="h-20 w-20 text-white/80 hover:text-white transition-colors cursor-pointer" />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href={`/lessons/${lesson.id}/quiz`}>
              Take Quiz & Test Your Knowledge
            </Link>
          </Button>
        </div>
        
        {lesson.transcript && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5"/>
                Transcript
              </CardTitle>
              <CardDescription>Read the full transcript of the lesson below.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>View Full Transcript</AccordionTrigger>
                  <AccordionContent>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {lesson.transcript}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
