
"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, BookOpen, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { siteStats } from "@/lib/mock-data";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface RecentUser {
    id: string;
    fullName: string;
    email: string;
    createdAt: Timestamp;
    avatar?: string;
}


const monthlyData = [
  { month: 'Jan', signups: 120, active: 80 },
  { month: 'Feb', signups: 150, active: 100 },
  { month: 'Mar', signups: 200, active: 160 },
  { month: 'Apr', signups: 180, active: 140 },
  { month: 'May', signups: 250, active: 200 },
  { month: 'Jun', signups: 220, active: 180 },
];

export default function AdminDashboard() {
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"), limit(5));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const usersData: RecentUser[] = [];
        querySnapshot.forEach((doc) => {
            usersData.push({ id: doc.id, ...doc.data() } as RecentUser);
        });
        setRecentUsers(usersData);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the platform's activity and users.</p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+50 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteStats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">+1 new course this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forum Threads</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteStats.forumThreads}</div>
            <p className="text-xs text-muted-foreground">+25 threads this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteStats.completedLessons.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+150 this week</p>
          </CardContent>
        </Card>
      </div>
      
       <Card>
        <CardHeader>
            <CardTitle>Admin Tools</CardTitle>
            <CardDescription>Quick links to manage your platform.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="justify-start text-left h-auto py-4">
                <Link href="/admin/courses">
                    <div className="flex items-start gap-4">
                        <BookOpen className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <p className="font-semibold">Manage Courses</p>
                            <p className="text-sm text-muted-foreground">Add, edit, and structure courses.</p>
                        </div>
                    </div>
                </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start text-left h-auto py-4">
                 <Link href="/admin/users">
                     <div className="flex items-start gap-4">
                        <Users className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <p className="font-semibold">Manage Users</p>
                            <p className="text-sm text-muted-foreground">View users and manage roles.</p>
                        </div>
                    </div>
                </Link>
            </Button>
             <Button asChild variant="outline" className="justify-start text-left h-auto py-4">
                 <Link href="/admin/settings">
                     <div className="flex items-start gap-4">
                        <MessageSquare className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <p className="font-semibold">Manage Forums</p>
                            <p className="text-sm text-muted-foreground">Moderate discussions.</p>
                        </div>
                    </div>
                </Link>
            </Button>
        </CardContent>
       </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly new user signups and active users.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="signups" fill="hsl(var(--primary))" name="New Signups" />
                <Bar dataKey="active" fill="hsl(var(--secondary))" name="Active Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>A list of the newest users on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-right">Enrolled</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentUsers.map(user => (
                    <TableRow key={user.id}>
                        <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                            <AvatarImage src={user.avatar} alt={user.fullName} />
                            <AvatarFallback>{user.fullName?.[0] || user.email?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.fullName}</span>
                        </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                        <TableCell className="text-right">{formatDate(user.createdAt)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
