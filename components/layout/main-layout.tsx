"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Home,
  LogOut,
  Menu,
  Search,
  MessageSquare,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex justify-between items-center px-4 md:px-6"></div>
        <div className="flex justify-between h-14 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[240px] sm:w-[300px] pl-4 pt-8 relative"
              >
                <SheetTitle className="sr-only">Side bar</SheetTitle>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/feed"
                    className="flex items-center gap-2 text-md font-semibold"
                  >
                    <Home
                      className={`h-4 w-4 ${
                        isActive("/feed") ? "text-primary" : ""
                      }`}
                    />
                    Feed
                  </Link>
                  <Link
                    href="/marketplace"
                    className="flex items-center gap-2 text-md font-semibold"
                  >
                    <ShoppingBag
                      className={`h-4 w-4 ${
                        isActive("/marketplace") ? "text-primary" : ""
                      }`}
                    />
                    Marketplace
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-md font-semibold"
                  >
                    <User
                      className={`h-4 w-4 ${
                        isActive("/profile") ? "text-primary" : ""
                      }`}
                    />
                    Profile
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-md font-semibold"
                  >
                    <MessageSquare
                      className={`h-4 w-4 ${
                        isActive("/") ? "text-primary" : ""
                      }`}
                    />
                    Messages
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-md font-semibold"
                  >
                    <Bell
                      className={`h-4 w-4 ${
                        isActive("/") ? "text-primary" : ""
                      }`}
                    />
                    Notifications
                  </Link>
                </nav>
                <div className="absolute bottom-6 left-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex items-center"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="">Log out</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/feed" className="font-bold text-xl">
              SocialHub
            </Link>

            <div className="relative w-full max-w-sm hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-auto pl-8"
              />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-4 md:gap-6">
            <Link
              href="/feed"
              className={`flex items-center gap-2 ${
                isActive("/feed") ? "text-primary" : ""
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden lg:inline">Feed</span>
            </Link>
            <Link
              href="/marketplace"
              className={`flex items-center gap-2 ${
                isActive("/marketplace") ? "text-primary" : ""
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden lg:inline">Marketplace</span>
            </Link>
            <Link
              href="/"
              className={`flex items-center gap-2 ${
                isActive("/") ? "text-primary" : ""
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden lg:inline">Messages</span>
            </Link>
            <Link
              href="/"
              className={`flex items-center gap-2 ${
                isActive("/") ? "text-primary" : ""
              }`}
            >
              <Bell className="h-4 w-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Avatar>
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="User"
                  className="w-full h-full object-cover object-center"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
