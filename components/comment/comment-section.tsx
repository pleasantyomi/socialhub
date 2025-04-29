"use client";

import { useState } from "react";
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
import { Heart, Reply } from "lucide-react";
import { getComments } from "@/lib/data";

export default function CommentSection({ postId }: { postId: string }) {
  const [newComment, setNewComment] = useState("");
  const comments = getComments(postId);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // In a real app, you would send this to your API
    alert("Comment added: " + newComment);
    setNewComment("");
  };

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
        </CardContent>
        <CardFooter className="flex justify-end p-6 pt-0">
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            Comment
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage
                src={comment.author.avatar || "/placeholder.svg"}
                alt={comment.author.name}
                className="w-full h-full object-cover object-center"
              />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {comment.timestamp}
                    </p>
                  </div>
                </div>
                <p className="mt-2">{comment.content}</p>
              </div>
              <div className="flex gap-4 mt-2 ml-2">
                <Button variant="ghost" size="sm" className="h-auto p-0">
                  <Heart className="mr-1 h-4 w-4" />
                  <span className="text-xs">{comment.likes}</span>
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
    </div>
  );
}
