"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BookmarkIcon, Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { likePost, unlikePost, getPost } from "@/lib/data";
import { toast } from "sonner";
import CommentSection from "@/components/comment/comment-section";

type PostDetailProps = {
  postId: string;
  initialPost?: Post;
};

export default function PostDetail({ postId, initialPost }: PostDetailProps) {
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!initialPost) {
      loadPost();
    } else {
      updateLikeState(initialPost);
    }
  }, [postId, session?.user?.id, initialPost]);

  useEffect(() => {
    if (post) {
      updateLikeState(post);
    }
  }, [post, session?.user?.id]);

  async function loadPost() {
    try {
      const fetchedPost = await getPost(postId);
      setPost(fetchedPost);
    } catch (error) {
      console.error('Failed to load post:', error);
      toast.error("Failed to load post.");
    } finally {
      setLoading(false);
    }
  }

  function updateLikeState(currentPost: Post) {
    const liked = currentPost.likes.some((like) => like.profile_id === session?.user?.id);
    setIsLiked(liked);
    setLikesCount(currentPost.likes.length);
  }

  async function handleLike() {
    if (!session?.user?.id || !post) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(post.id, session.user.id);
        setLikesCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        await likePost(post.id, session.user.id);
        setLikesCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error("Failed to update like. Please try again.");
    }
  }

  async function handleShare() {
    if (!post) return;
    
    try {
      await navigator.share({
        title: `Post by ${post.profiles.full_name}`,
        text: post.content,
        url: `${window.location.origin}/post/${post.id}`,
      });
    } catch (error) {
      // Fall back to copying to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      toast.success("Post link copied to clipboard");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Post not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <Avatar>
            <AvatarImage
              src={post.profiles.avatar_url || "/placeholder.svg"}
              alt={post.profiles.full_name || post.profiles.username}
              className="w-full h-full object-cover object-center"
            />
            <AvatarFallback>
              {post.profiles.full_name?.[0] || post.profiles.username[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">
              {post.profiles.full_name || post.profiles.username}
            </p>
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
      
      <div id="comments">
        <CommentSection postId={postId} />
      </div>
    </div>
  );
}
