
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Disc3, LayoutDashboard, LogOut, Search, Settings, User as UserIcon, Users, Library, BarChart2 } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import { useAuth } from "@/app/(app)/layout";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === path;
    return pathname.startsWith(path);
  }

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Dashboard';
    const segment = segments[0];

    if (segment === 'lessons' && segments.length > 2) return 'Lesson Details';
    if (segment === 'courses' && segments.length > 2) return 'Course Details';
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  }

  const navLinks = isAdmin ? 
    [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/users", label: "Users", icon: Users },
      { href: "/courses", label: "Courses", icon: Library },
      { href: "/lessons", label: "Lessons", icon: BookOpen },
      { href: "/analytics", label: "Analytics", icon: BarChart2 },
      { href: "/forums", label: "Forums", icon: Disc3 },
    ] : 
    [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/courses", label: "Courses", icon: Library },
      { href: "/lessons", label: "Lessons", icon: BookOpen },
      { href: "/forums", label: "Forums", icon: Disc3 },
    ];


  return (
    <SidebarProvider>
      <div className="min-h-dvh">
        <Sidebar>
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold tracking-tighter text-foreground">UK MERIT</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navLinks.map(link => (
                 <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton href={link.href} isActive={isActive(link.href)} asChild tooltip={link.label}>
                    <Link href={link.href}>
                      <link.icon />
                      {link.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative hidden md:block">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input type="search" placeholder="Search..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-card" />
               </div>
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
       toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      })
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt={user?.displayName || "User"} data-ai-hint="person face" />
            <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || "Student"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
