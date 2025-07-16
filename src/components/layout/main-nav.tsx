
"use client"
import Link from "next/link"
import Image from "next/image"
import { LogOut, Menu, Settings, User as UserIcon, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/(app)/layout"

export function MainNav() {
  const { user: isAuthenticated } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/videos", label: "Videos" },
    { href: "/forums", label: "Forums" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/uk.png" alt="UK MERIT ACADEMY (PVT) LTD Logo" width={160} height={40} className="object-contain"/>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
             {isAuthenticated && (
              <Link
                href="/dashboard"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                 <Link
                  href="/"
                  className="flex items-center space-x-2"
                >
                  <Image src="/uk.png" alt="UK MERIT ACADEMY (PVT) LTD Logo" width={160} height={40} className="object-contain"/>
                </Link>
                <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                  <div className="flex flex-col space-y-3">
                     {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    ))}
                    {isAuthenticated && (
                      <Link href="/dashboard">
                        Dashboard
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
        </div>

        <Link href="/" className="flex items-center space-x-2 md:hidden flex-1 justify-center">
          <Image src="/uk.png" alt="UK MERIT ACADEMY (PVT) LTD Logo" width={160} height={40} className="object-contain"/>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}


function UserMenu() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

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
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || "User"} />
            <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
         <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
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
