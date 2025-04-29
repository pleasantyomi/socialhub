import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrendingTopics, getSuggestedUsers } from "@/lib/data";

export default function SidebarRight() {
  const trendingTopics = getTrendingTopics();
  const suggestedUsers = getSuggestedUsers();

  return (
    <div className="sticky top-20 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  {topic.category}
                </p>
                <p className="font-medium">{topic.title}</p>
                <p className="text-xs text-muted-foreground">
                  {topic.posts} posts
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-full h-full object-cover object-contain"
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
