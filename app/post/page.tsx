"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PenTool } from "lucide-react";
import { toast } from "sonner";

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth");
      return;
    }
    
    setLoading(false);
  }, [session, status, router]);

  async function handleCreatePost() {
    if (!content.trim()) {
      toast.error("Please write something!");
      return;
    }

    setIsPosting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Post created successfully!");
      router.push("/feed");
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }

  if (loading || status === "loading") {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!session) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card className="p-8 text-center">
            <PenTool className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">Please sign in to create posts</p>
            <Button onClick={() => router.push('/auth')}>
              Sign In
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Create New Post
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's happening at your university?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-none"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {content.length}/500 characters
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isPosting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePost}
                  disabled={isPosting || !content.trim()}
                >
                  {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
