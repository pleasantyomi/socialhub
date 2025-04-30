import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getNotifications } from "@/lib/data";

export default function NotificationList() {
  const notifications = getNotifications();

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className="p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage
                src={notification.user.avatar || "/placeholder-user.svg"}
                alt={notification.user.name}
              />
              <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p>
                    <span className="font-medium">
                      {notification.user.name}
                    </span>{" "}
                    <span>{notification.action}</span>
                    {notification.target && (
                      <span className="font-medium">
                        {" "}
                        {notification.target}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                )}
              </div>
              {notification.content && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {notification.content}
                </p>
              )}
              {notification.type === "follow" && (
                <div className="mt-3">
                  <Button size="sm" variant="outline">
                    Follow back
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
