
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BookCheck, Clock, Star, Target } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { lessons } from "@/lib/mock-data";
import Image from "next/image";
import { Badge } from "../ui/badge";

const chartData = [
  { lesson: "Tenses", score: 85 },
  { lesson: "Nouns", score: 92 },
  { lesson: "Verbs", score: 78 },
  { lesson: "Adjectives", score: 88 },
  { lesson: "Adverbs", score: 95 },
  { lesson: "Reported Speech", score: 72 },
  { lesson: "Conditionals", score: 81 },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function UserDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, let's continue your voyage!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <BookCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 / 50</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-muted-foreground">Up from 85% last month</p>
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
              {lessons.slice(0,2).map(lesson => (
                 <Link href={`/lessons/${lesson.id}`} key={lesson.id} className="flex items-start gap-4 group">
                    <Image 
                      src={lesson.thumbnailUrl}
                      alt={lesson.title}
                      width={120}
                      height={67}
                      className="rounded-lg aspect-video object-cover"
                      data-ai-hint={lesson.imageHint}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                    </div>
                  </Link>
              ))}
               <Button asChild className="w-full mt-2">
                  <Link href="/lessons">View All Lessons</Link>
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
