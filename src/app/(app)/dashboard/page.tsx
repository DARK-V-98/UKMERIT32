
"use client"

import { useAuth } from "@/app/(app)/layout";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import UserDashboard from "@/components/dashboard/user-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
       <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <Tabs defaultValue="admin">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Switch between admin and user views.</p>
            </div>
            <TabsList>
                <TabsTrigger value="admin">Admin View</TabsTrigger>
                <TabsTrigger value="user">User View</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="admin" className="mt-6">
          <AdminDashboard />
        </TabsContent>
        <TabsContent value="user" className="mt-6">
          <UserDashboard />
        </TabsContent>
      </Tabs>
    );
  }

  return <UserDashboard />;
}
