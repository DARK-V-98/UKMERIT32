
"use client"

import { useAuth } from "@/app/(app)/layout";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import UserDashboard from "@/components/dashboard/user-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

// Hardcoded admin email for prototype purposes
const ADMIN_EMAIL = "admin@example.com";

export default function DashboardPage() {
  const { user, loading } = useAuth();

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

  const isAdmin = user?.email === ADMIN_EMAIL;

  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}
