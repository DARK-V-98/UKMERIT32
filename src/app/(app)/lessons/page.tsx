
"use client"

import React, { useState, useEffect, useMemo } from 'react';
import Link from "next/link"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Lesson } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function LessonsPage() {
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessonsCollection = collection(db, 'lessons');
        const q = query(lessonsCollection, where("status", "==", "active"));
        const lessonSnapshot = await getDocs(q);
        const lessonsList = lessonSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
        setAllLessons(lessonsList);
      } catch (error) {
        console.error("Error fetching lessons: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const categories = useMemo(() => [...new Set(allLessons.map(l => l.category))], [allLessons]);

  const filteredLessons = useMemo(() => {
    return allLessons
      .filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(lesson => (category ? lesson.category === category : true))
      .filter(lesson => (difficulty ? lesson.difficulty === difficulty : true));
  }, [allLessons, searchTerm, category, difficulty]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lesson Library</h1>
        <p className="text-muted-foreground">
          Explore our collection of video lessons to master English.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Search lessons..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Difficulties</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden">
               <Skeleton className="aspect-video w-full" />
              <CardContent className="flex-1 p-4 space-y-2">
                 <Skeleton className="h-4 w-1/4" />
                 <Skeleton className="h-6 w-3/4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                 <Skeleton className="h-4 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="p-0">
                <Link href={`/lessons/${lesson.id}`} className="block">
                  <Image
                    alt={lesson.title}
                    className="aspect-video w-full object-cover"
                    height="225"
                    src={lesson.thumbnailUrl || "https://placehold.co/400x225.png"}
                    width="400"
                    data-ai-hint={lesson.imageHint || "lesson placeholder"}
                  />
                </Link>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <Badge variant="outline" className="mb-2">{lesson.category}</Badge>
                <CardTitle className="text-lg">
                  <Link href={`/lessons/${lesson.id}`} className="hover:text-primary transition-colors">
                    {lesson.title}
                  </Link>
                </CardTitle>
                <CardDescription className="mt-2 text-sm">{lesson.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">{lesson.duration} · {lesson.difficulty}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
       {!loading && filteredLessons.length === 0 && (
          <div className="text-center text-muted-foreground py-16 col-span-full">
            <h3 className="text-lg font-semibold">No lessons found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
    </div>
  )
}
