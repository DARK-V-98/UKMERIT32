
"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, Timestamp, where, getCountFromServer, collectionGroup } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, BookOpen, MessageSquare, CheckCircle, Video, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { subMonths, startOfMonth, format, subDays } from "date-fns";
import type { User } from "@/lib/types";

interface MonthlyData {
    month: string;
    signups: number;
    active: number; 
}

interface SiteStats {
    totalUsers: { count: number; increase: number };
    activeCourses: { count: number; increase: number };
    completedLessons: { count: number; increase: number };
    forumThreads: { count: number; increase: number };
}

export default function AdminDashboard() {
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [stats, setStats] = useState<SiteStats>({
    totalUsers: { count: 0, increase: 0 },
    activeCourses: { count: 0, increase: 0 },
    completedLessons: { count: 0, increase: 0 },
    forumThreads: { count: 489, increase: 25 }, // Mock data for now
  });

  useEffect(() => {
    // Fetch Recent Users
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"), limit(5));

    const unsubscribeUsers = onSnapshot(q, (querySnapshot) => {
        const usersData: User[] = [];
        querySnapshot.forEach((doc) => {
            usersData.push({ id: doc.id, ...doc.data() } as User);
        });
        setRecentUsers(usersData);
        setLoading(false);
    });
    
    // Fetch aggregated stats
    const fetchStats = async () => {
        setStatsLoading(true);

        const sevenDaysAgo = Timestamp.fromDate(subDays(new Date(), 7));
        const thirtyDaysAgo = Timestamp.fromDate(subDays(new Date(), 30));

        // Users
        const usersCollection = collection(db, "users");
        const totalUsersQuery = await getCountFromServer(usersCollection);
        const newUsersQuery = await getCountFromServer(query(usersCollection, where("createdAt", ">=", sevenDaysAgo)));

        // Courses
        const coursesCollection = collection(db, "courses");
        const totalCoursesQuery = await getCountFromServer(coursesCollection);
        const newCoursesQuery = await getCountFromServer(query(coursesCollection, where("createdAt", ">=", thirtyDaysAgo)));

        // Completed Lessons
        const progressCollection = collectionGroup(db, 'progress');
        const totalCompletedQuery = await getCountFromServer(query(progressCollection, where("completed", "==", true)));
        const newCompletedQuery = await getCountFromServer(query(progressCollection, where("completedAt", ">=", sevenDaysAgo)));

        setStats(prev => ({
            ...prev,
            totalUsers: { count: totalUsersQuery.data().count, increase: newUsersQuery.data().count },
            activeCourses: { count: totalCoursesQuery.data().count, increase: newCoursesQuery.data().count },
            completedLessons: { count: totalCompletedQuery.data().count, increase: newCompletedQuery.data().count },
        }));

        setStatsLoading(false);
    };

    fetchStats();


    // Fetch User Growth Data for chart
    const fetchUserGrowth = async () => {
        setChartLoading(true);
        const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
        const usersGrowthQuery = query(collection(db, "users"), where("createdAt", ">=", Timestamp.fromDate(sixMonthsAgo)));
        
        const unsubscribeGrowth = onSnapshot(usersGrowthQuery, (snapshot) => {
            const signupsByMonth: {[key: string]: number} = {};

            // Initialize last 6 months
            for (let i = 0; i < 6; i++) {
                const month = format(subMonths(new Date(), i), 'MMM');
                signupsByMonth[month] = 0;
            }

            snapshot.forEach(doc => {
                const user = doc.data() as User;
                if (user.createdAt) {
                    const month = format(user.createdAt.toDate(), 'MMM');
                    if(signupsByMonth.hasOwnProperty(month)) {
                        signupsByMonth[month]++;
                    }
                }
            });

            const staticActiveUsers = [80, 100, 160, 140, 200, 180]; // Placeholder
            
            const data: MonthlyData[] = Object.keys(signupsByMonth).reverse().map((month, index) => ({
                month,
                signups: signupsByMonth[month],
                active: staticActiveUsers[index] || staticActiveUsers[staticActiveUsers.length - 1] // fallback for safety
            }));

            setMonthlyData(data);
            setChartLoading(false);
        });
        return unsubscribeGrowth;
    };

    const unsubscribeGrowthPromise = fetchUserGrowth();
    
    return () => {
        unsubscribeUsers();
        unsubscribeGrowthPromise.then(unsub => unsub());
    };
  }, []);

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
  }
  
  const StatCard = ({ title, value, increase, timePeriod, icon, loading }: { title: string, value: number, increase: number, timePeriod: string, icon: React.ReactNode, loading: boolean}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {loading ? (
                <>
                    <Skeleton className="h-8 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                </>
            ) : (
                <>
                    <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+{increase.toLocaleString()} this {timePeriod}</p>
                </>
            )}
        </CardContent>
    </Card>
  )


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the platform's activity and users.</p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Users"
                value={stats.totalUsers.count}
                increase={stats.totalUsers.increase}
                timePeriod="week"
                icon={<Users className="h-4 w-4 text-primary" />}
                loading={statsLoading}
            />
            <StatCard
                title="Active Courses"
                value={stats.activeCourses.count}
                increase={stats.activeCourses.increase}
                timePeriod="month"
                icon={<BookOpen className="h-4 w-4 text-primary" />}
                loading={statsLoading}
            />
            <StatCard
                title="Forum Threads"
                value={stats.forumThreads.count}
                increase={stats.forumThreads.increase}
                timePeriod="week"
                icon={<MessageSquare className="h-4 w-4 text-primary" />}
                loading={false} // Mock data for now
            />
            <StatCard
                title="Completed Lessons"
                value={stats.completedLessons.count}
                increase={stats.completedLessons.increase}
                timePeriod="week"
                icon={<CheckCircle className="h-4 w-4 text-primary" />}
                loading={statsLoading}
            />
        </div>
      
       <Card>
        <CardHeader>
            <CardTitle>Admin Tools</CardTitle>
            <CardDescription>Quick links to manage your platform.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <Link href="/admin/videos">
                    <div className="flex items-start gap-4">
                        <Video className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <p className="font-semibold">Manage Videos</p>
                            <p className="text-sm text-muted-foreground">Add, edit, and organize all videos.</p>
                        </div>
                    </div>
                </Link>
            </Button>
             <Button asChild variant="outline" className="justify-start text-left h-auto py-4">
                <Link href="/admin/reviews">
                    <div className="flex items-start gap-4">
                        <Star className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <p className="font-semibold">Manage Reviews</p>
                            <p className="text-sm text-muted-foreground">Add and edit user reviews.</p>
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
                 <Link href="/forums">
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
            {chartLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                    <Skeleton className="h-full w-full" />
                </div>
            ) : (
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
            )}
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
                            <AvatarImage src={user.photoURL} alt={user.fullName} />
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
