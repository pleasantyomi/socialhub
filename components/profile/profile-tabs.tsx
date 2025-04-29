/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { getUserPosts, getUserLikedPosts } from "@/lib/data";

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("posts");
  const userPosts = getUserPosts();
  const likedPosts = getUserLikedPosts();

  return (
    <Tabs defaultValue="posts" className="mt-6" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="likes">Likes</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        <div className="space-y-4">
          {userPosts.map((post) => (
            <Card key={post.id} className="p-4">
              <p className="mb-2">{post.content}</p>
              {post.image && (
                <div className="relative aspect-video overflow-hidden rounded-md">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt="Post image"
                    fill
                    className="object-cover w-full h-full object-center"
                  />
                </div>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {post.timestamp}
              </p>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="media" className="mt-6">
        <div className="grid grid-cols-3 gap-2">
          {userPosts
            .filter((post) => post.image)
            .map((post) => (
              <div
                key={post.id}
                className="relative aspect-square overflow-hidden rounded-md"
              >
                <Image
                  src={post.image! || "/placeholder.svg"}
                  alt="Media"
                  fill
                  className="object-cover object-center w-full h-full"
                />
              </div>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="likes" className="mt-6">
        <div className="space-y-4">
          {likedPosts.map((post) => (
            <Card key={post.id} className="p-4">
              <p className="font-semibold">{post.author.name}</p>
              <p className="mb-2">{post.content}</p>
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
              <p className="mt-2 text-xs text-muted-foreground">
                {post.timestamp}
              </p>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
