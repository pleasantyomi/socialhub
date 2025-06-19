"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { getPosts, createPost, likePost, unlikePost } from "@/lib/data";
import { useSession } from "next-auth/react";
import { Post } from "@/lib/types";
import { toast } from "sonner";

// Demo data as fallback
const demoData: Post[] = [
  {
    id: "1",
    content: "This is a demo post! The real posts will load from the database.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profile_id: "demo",
    profiles: {
      id: "demo",
      username: "demo_user",
      full_name: "Demo User",
      avatar_url: "/placeholder.svg",
      website: null,
      bio: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes: [],
    comments: []
  }
];

export default function PostFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>(demoData);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error("Failed to load posts. Using demo data instead.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePost() {
    if (!session?.user?.id || !newPostContent.trim()) return;
    
    setIsPosting(true);
    try {
      const newPost = await createPost(session.user.id, newPostContent.trim());
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      toast.success("Post created successfully!");
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }

  async function handleLike(postId: string) {
    if (!session?.user?.id) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      const userId = session.user.id;
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const isLiked = post.likes.some(like => like.profile_id === userId);
      
      if (isLiked) {
        await unlikePost(postId, userId);
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likes: p.likes.filter(like => like.profile_id !== userId)
            };
          }
          return p;
        }));
      } else {
        const newLike = await likePost(postId, userId);
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likes: [...p.likes, newLike]
            };
          }
          return p;
        }));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error("Failed to like post. Please try again.");
    }
  }

  return (
    <div className="space-y-6 pt-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar>
            <AvatarImage 
              src={session?.user?.image || "/placeholder.svg"} 
              alt={session?.user?.name || "User"} 
              className="h-full w-full object-cover object-center"
            />
            <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="resize-none"
              disabled={!session}
            />
          </div>
        </CardHeader>
        <CardFooter className="flex justify-between p-4">
          <Button
            variant="default"
            onClick={handleCreatePost}
            disabled={isPosting || !session || !newPostContent.trim()}
          >
            {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post
          </Button>
        </CardFooter>
      </Card>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        posts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Avatar>
                <AvatarImage
                  src={post.profiles.avatar_url || "/placeholder.svg"}
                  alt={post.profiles.full_name || post.profiles.username}
                  className="h-full w-full object-cover object-center"
                />
                <AvatarFallback>
                  {post.profiles.full_name?.[0] || post.profiles.username[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <Link href={`/profile/${post.profiles.id}`} className="font-semibold hover:underline">
                      {post.profiles.full_name || post.profiles.username}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p>{post.content}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4">
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLike(post.id)}
                  className={
                    session?.user?.id && post.likes.some(like => like.profile_id === session.user.id)
                      ? "text-red-500"
                      : ""
                  }
                >
                  <Heart className="h-4 w-4" />
                  <span className="ml-2">{post.likes.length}</span>
                </Button>
                <Link href={`/post/${post.id}`}>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-4 w-4" />
                    <span className="ml-2">{post.comments.length}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <BookmarkIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
