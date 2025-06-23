"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Paperclip,
  ImageIcon,
  Smile,
  Send,
  Phone,
  Video,
  Info,
  Loader2,
} from "lucide-react";
import { getMessages, sendMessage } from "@/lib/data";
import { toast } from "sonner";
import type { Message } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface MessageThreadProps {
  conversationId: string;
  otherUser: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export default function MessageThread({
  conversationId,
  otherUser,
}: MessageThreadProps) {
  const { data: session } = useSession();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessagesData();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessagesData = async () => {
    try {
      const fetchedMessages = await getMessages(conversationId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !session?.user?.id) return;

    setSending(true);
    try {
      const message = await sendMessage(conversationId, session.user.id, newMessage.trim());
      setMessages([...messages, message]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={otherUser.avatar_url || "/placeholder-user.svg"}
                alt={otherUser.full_name}
              />
              <AvatarFallback>{otherUser.full_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{otherUser.full_name}</h3>
              <p className="text-sm text-muted-foreground">Active now</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === session?.user?.id;
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              {!isOwnMessage && (
                <Avatar className="flex-shrink-0">
                  <AvatarImage
                    src={message.profiles?.avatar_url || "/placeholder-user.svg"}
                    alt={message.profiles?.full_name || "User"}
                  />
                  <AvatarFallback>
                    {message.profiles?.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                  isOwnMessage ? "order-first" : ""
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              {isOwnMessage && (
                <Avatar className="flex-shrink-0">
                  <AvatarImage
                    src={session?.user?.image || "/placeholder-user.svg"}
                    alt={session?.user?.name || "You"}
                  />
                  <AvatarFallback>
                    {session?.user?.name?.[0] || "Y"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12"
              disabled={sending}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="flex-shrink-0"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
