import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Calendar,
  Home,
  MessageSquare,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";

export default function SidebarLeft() {
  return (
    <div className="sticky top-20 space-y-4">
      <nav className="flex flex-col space-y-1">
        <Link href="/feed">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Feed
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
        <Link href="/messages">
          <Button variant="ghost" className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Friends
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Bookmark className="mr-2 h-4 w-4" />
          Saved
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          Events
        </Button>
        <Link href="/marketplace">
          <Button variant="ghost" className="w-full justify-start">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Marketplace
          </Button>
        </Link>
      </nav>
    </div>
  );
}
