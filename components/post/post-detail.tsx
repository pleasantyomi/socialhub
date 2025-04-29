import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BookmarkIcon, Heart, MessageCircle, Share2 } from "lucide-react";
import type { Post } from "@/lib/types";

export default function PostDetail({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 p-6">
        <Avatar>
          <AvatarImage
            src={post.author.avatar || "/placeholder.svg"}
            alt={post.author.name}
            className="w-full h-full object-cover object-center"
          />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">{post.timestamp}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="mb-6 text-lg">{post.content}</p>
        {post.image && (
          <div className="relative aspect-video overflow-hidden rounded-md">
            <Image
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              fill
              className="object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-6">
            <Button variant="ghost" size="sm" className="flex gap-2">
              <Heart className="h-5 w-5" />
              <span>{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments.length}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex gap-2">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <BookmarkIcon className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
