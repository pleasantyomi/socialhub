"use client";

import { useState } from "react";
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
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/toast";

export default function PostDetail({ post }: { post: Post }) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(
    post.likes.some((like) => like.profile_id === session?.user?.id)
  );
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleLike = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .match({ post_id: post.id, profile_id: session.user.id });
        setLikesCount((prev) => prev - 1);
      } else {
        await supabase
          .from('likes')
          .insert([{ post_id: post.id, profile_id: session.user.id }]);
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Post by ${post.profiles.full_name}`,
        text: post.content,
        url: `${window.location.origin}/post/${post.id}`,
      });
    } catch (error) {
      // Fall back to copying to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      toast({
        title: "Link copied",
        description: "Post link copied to clipboard",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 p-6">
        <Avatar>
          <AvatarImage
            src={post.profiles.avatar_url || "/placeholder.svg"}
            alt={post.profiles.full_name}
            className="w-full h-full object-cover object-center"
          />
          <AvatarFallback>{post.profiles.full_name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{post.profiles.full_name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <div className="mt-4 relative aspect-video">
            <Image
              src={post.image}
              alt="Post image"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => {
              document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="gap-2">
          <BookmarkIcon className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
