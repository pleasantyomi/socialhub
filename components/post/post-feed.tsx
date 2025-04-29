"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  BookmarkIcon,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { getPosts } from "@/lib/data";

export default function PostFeed() {
  const [newPostContent, setNewPostContent] = useState("");
  const posts = getPosts();

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    // In a real app, you would send this to your API
    alert("Post created: " + newPostContent);
    setNewPostContent("");
  };

  return (
    <div className="space-y-6 pt-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" className="h-full w-full object-cover object-center"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="resize-none"
            />
          </div>
        </CardHeader>
        <CardFooter className="flex justify-end p-4 pt-0">
          <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
            Post
          </Button>
        </CardFooter>
      </Card>

      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="flex flex-row items-center gap-4 p-4">
            <Avatar>
              <AvatarImage
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                className="w-full h-full object-center object-cover"
              />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.timestamp}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="mb-4">{post.content}</p>
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
          <CardFooter className="border-t p-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="flex gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Link href={`/post/${post.id}`}>
                  <Button variant="ghost" size="sm" className="flex gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments.length}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <BookmarkIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
