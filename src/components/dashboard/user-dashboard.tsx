
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BookCheck, Clock, Star, Target } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { useAuth } from "@/app/(app)/layout";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Lesson, Quiz, UserProgress, Course } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function UserDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ lessonsCompleted: 0, totalLessons: 0, averageScore: 0 });
  const [chartData, setChartData] = useState<{ lesson: string, score: number }[]>([]);
  const [continueLearning, setContinueLearning] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      
      // Fetch User Progress
      const progressRef = collection(db, `users/${user.uid}/progress`);
      const progressQuery = query(progressRef, orderBy("completedAt", "desc"));
      const progressSnap = await getDocs(progressQuery);
      const userProgress: UserProgress[] = progressSnap.docs.map(d => ({ lessonId: d.id, ...d.data() } as UserProgress));
      
      const totalLessonsQuery = await getDocs(collection(db, "lessons"));
      const totalLessons = totalLessonsQuery.size;

      // Calculate Stats
      const lessonsCompleted = userProgress.length;
      const totalScore = userProgress.reduce((acc, p) => acc + p.score, 0);
      const averageScore = lessonsCompleted > 0 ? Math.round((totalScore / lessonsCompleted)) : 0;
      
      setStats({
        lessonsCompleted,
        totalLessons,
        averageScore
      });

      // Prepare Chart Data
      const recentProgress = userProgress.slice(0, 7);
      const chartPromises = recentProgress.map(async (p) => {
        const lessonDoc = await getDoc(doc(db, "lessons", p.lessonId));
        return {
          lesson: lessonDoc.exists() ? (lessonDoc.data() as Lesson).title : "Unknown",
          score: p.score
        };
      });
      const chartResults = await Promise.all(chartPromises);
      setChartData(chartResults.reverse());
      
      // Find "Continue Learning" lesson
      if (userProgress.length > 0) {
        const lastCompletedLessonId = userProgress[0].lessonId;
        const lessonDoc = await getDoc(doc(db, "lessons", lastCompletedLessonId));
        if(lessonDoc.exists()){
            const lastLessonData = lessonDoc.data() as Lesson;
            if(lastLessonData.courseId){
                const courseDoc = await getDoc(doc(db, "courses", lastLessonData.courseId));
                if(courseDoc.exists()){
                    const courseData = courseDoc.data() as Course;
                    const completedIds = new Set(userProgress.map(p => p.lessonId));
                    const nextLessonId = courseData.lessonIds.find(id => !completedIds.has(id));
                    
                    if(nextLessonId){
                        const nextLessonDoc = await getDoc(doc(db, "lessons", nextLessonId));
                        if(nextLessonDoc.exists()){
                            setContinueLearning({id: nextLessonDoc.id, ...nextLessonDoc.data()} as Lesson);
                        }
                    }
                }
            }
        }
      } else {
        // If no progress, suggest the first lesson of the first course
         const coursesQuery = await getDocs(query(collection(db, "courses"), limit(1)));
         if(!coursesQuery.empty){
            const firstCourse = coursesQuery.docs[0].data() as Course;
            if(firstCourse.lessonIds && firstCourse.lessonIds.length > 0){
                const firstLessonDoc = await getDoc(doc(db, "lessons", firstCourse.lessonIds[0]));
                if(firstLessonDoc.exists()){
                    setContinueLearning({id: firstLessonDoc.id, ...firstLessonDoc.data()} as Lesson);
                }
            }
         }
      }

      setLoading(false);
    }

    fetchData();

  }, [user]);

   const getImageUrl = (thumbnailUrl?: string) => {
    if (!thumbnailUrl) return "https://placehold.co/120x67.png";
    if (thumbnailUrl.startsWith('http')) return thumbnailUrl;
    return `/${thumbnailUrl}.png`;
  }

  if (loading) {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Skeleton className="h-80" />
                </div>
                <div className="md:col-span-1">
                    <Skeleton className="h-64" />
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, let's continue your voyage!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos Watched</CardTitle>
            <BookCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lessonsCompleted} / {stats.totalLessons}</div>
            <p className="text-xs text-muted-foreground">Keep up the great work!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Your average across all quizzes.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skill</CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Vocabulary</div>
            <p className="text-xs text-muted-foreground">Consistent high scores</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent (Weekly)</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4h 32m</div>
            <p className="text-xs text-muted-foreground">+15% from last week</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quiz Performance</CardTitle>
              <CardDescription>Here's how you've performed on your recent quizzes.</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                 <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="lesson"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 8)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    <p>No quiz data yet. Complete a quiz to see your performance!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
           <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {continueLearning ? (
                 <Link href={`/videos/${continueLearning.id}`} className="flex items-start gap-4 group">
                    <Image 
                      src={getImageUrl(continueLearning.thumbnailUrl)}
                      alt={continueLearning.title}
                      width={120}
                      height={67}
                      className="rounded-lg aspect-video object-cover"
                      data-ai-hint={continueLearning.imageHint || "lesson thumbnail"}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{continueLearning.title}</p>
                      <p className="text-xs text-muted-foreground">{continueLearning.duration}</p>
                    </div>
                  </Link>
              ) : (
                <p className="text-sm text-muted-foreground">You've completed all available videos. Great job!</p>
              )}
               <Button asChild className="w-full mt-2">
                  <Link href="/videos">View All Videos</Link>
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
