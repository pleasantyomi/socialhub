"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getNotifications, markNotificationAsRead } from "@/lib/data";
import { useSession } from "next-auth/react";
import { Notification } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NotificationList() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadNotifications();
  }, [session?.user?.id]);

  async function loadNotifications() {
    if (!session?.user?.id) return;
    
    try {
      const fetchedNotifications = await getNotifications(session.user.id);
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId: string) {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error("Failed to update notification.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className="p-4 hover:bg-muted/50 transition-colors"
          onClick={() => !notification.read && handleMarkAsRead(notification.id)}
        >
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage
                src={notification.profiles?.avatar_url || "/placeholder-user.svg"}
                alt={notification.profiles?.full_name || notification.profiles?.username || "User"}
              />
              <AvatarFallback>
                {notification.profiles?.full_name?.[0] || notification.profiles?.username?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p>
                    <span className="font-medium">
                      {notification.profiles?.full_name || notification.profiles?.username || "Unknown User"}
                    </span>{" "}
                    <span>{notification.content}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                )}
              </div>
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
