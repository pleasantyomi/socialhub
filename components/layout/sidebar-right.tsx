"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrendingTopics, getSuggestedUsers } from "@/lib/data";
import { Loader2 } from "lucide-react";
import type { TrendingTopic, SuggestedUser } from "@/lib/data";
import { toast } from "sonner";

export default function SidebarRight() {
  const { data: session } = useSession();
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [topics, users] = await Promise.all([
          getTrendingTopics(),
          getSuggestedUsers(session?.user?.id),
        ]);
        setTrendingTopics(topics);
        setSuggestedUsers(users);
      } catch (error) {
        console.error("Error loading sidebar data:", error);
        toast.error("Failed to load some content");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="sticky top-20 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="sticky top-20 space-y-6">
      {trendingTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              {trendingTopics.map((topic) => (
                <div key={topic.id} className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {topic.category}
                  </p>
                  <p className="font-medium">{topic.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {topic.posts_count} posts
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {suggestedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Suggested Users</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              {suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={user.avatar_url || "/placeholder.svg"}
                        alt={user.full_name}
                      />
                      <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={user.is_following ? "outline" : "default"}
                    size="sm"
                  >
                    {user.is_following ? "Following" : "Follow"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
