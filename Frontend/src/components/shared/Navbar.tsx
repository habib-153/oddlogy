"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Phone,
  User,
  LogOut,
  Settings,
  BookOpen,
  GraduationCap,
  Monitor,
} from "lucide-react";

const navigationItems = [
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Skills", href: "/skills", icon: GraduationCap },
  { name: "Admission", href: "/admission", icon: User },
  { name: "Academic", href: "/academic", icon: Monitor },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user: authUser, logout } = useAuth();

  const user = session?.user || authUser;
  const isAuthenticated = status === "authenticated" || !!authUser;

  const handleLogout = async () => {
    if (session) {
      await signOut({
        redirect: false,
        callbackUrl: "/",
      });
    }

    if (authUser) {
      logout();
    }

    router.push("/");
    router.refresh();
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#D2DD27] to-[#A8B823] flex items-center justify-center">
                <span className="text-sm font-bold text-black">O</span>
              </div>
              <span className="text-xl font-bold text-foreground">Oddlogy</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Phone number - desktop only */}
            <Link
              href="tel:01818221949"
              className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>01818221949</span>
            </Link>

            {/* User actions */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || ""}
                      />
                      <AvatarFallback className="bg-[#D2DD27] text-black">
                        {user?.name ? getUserInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:bg-gray-300 hover:cursor-pointer"
                    onClick={() => router.push(`/${user?.role?.toLowerCase() || "user"}`)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-gray-300 hover:cursor-pointer"
                    onClick={() => router.push("/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:bg-gray-300 hover:cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className="bg-[#D2DD27] text-black hover:bg-[#A8B823] font-medium"
              >
                Login
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden"
                  size="icon"
                  onClick={() => setIsOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-2 pb-4">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#D2DD27] to-[#A8B823] flex items-center justify-center">
                      <span className="text-sm font-bold text-black">O</span>
                    </div>
                    <span className="text-xl font-bold">Oddlogy</span>
                  </div>

                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                  <div className="pt-4 border-t">
                    <Link
                      href="tel:01818221949"
                      className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>01818221949</span>
                    </Link>
                  </div>

                  {!isAuthenticated && (
                    <div className="pt-4">
                      <Button
                        onClick={() => {
                          router.push("/login");
                          setIsOpen(false);
                        }}
                        className="w-full bg-[#D2DD27] text-black hover:bg-[#A8B823] font-medium"
                      >
                        Login
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}