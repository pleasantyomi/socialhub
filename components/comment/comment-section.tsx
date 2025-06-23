"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Reply, Loader2 } from "lucide-react";
import { getComments, createComment } from "@/lib/data";
import { useSession } from "next-auth/react";
import { Comment } from "@/lib/types";
import { toast } from "sonner";

export default function CommentSection({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  useEffect(() => {
    loadComments();
  }, [postId]);

  async function loadComments() {
    try {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Failed to load comments:', error);
      toast.error("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim() || !session?.user?.id) return;
    
    setPosting(true);
    try {
      const comment = await createComment(postId, session.user.id, newComment.trim());
      setComments([...comments, comment]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error('Failed to create comment:', error);
      toast.error("Failed to add comment. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="User"
                className="w-full h-full object-cover object-center"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
        </CardContent>        <CardFooter className="flex justify-end p-6 pt-0">
          <Button 
            onClick={handleAddComment} 
            disabled={!newComment.trim() || !session || posting}
          >
            {posting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Comment
          </Button>
        </CardFooter>
      </Card>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage
                  src={comment.profiles?.avatar_url || "/placeholder.svg"}
                  alt={comment.profiles?.full_name || comment.profiles?.username || "User"}
                  className="w-full h-full object-cover object-center"
                />
                <AvatarFallback>
                  {comment.profiles?.full_name?.[0] || comment.profiles?.username?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {comment.profiles?.full_name || comment.profiles?.username || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2">{comment.content}</p>
                </div>
                <div className="flex gap-4 mt-2 ml-2">
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <Heart className="mr-1 h-4 w-4" />
                    <span className="text-xs">0</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <Reply className="mr-1 h-4 w-4" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
