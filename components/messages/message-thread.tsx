"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { getCurrentConversation } from "@/lib/data";

export default function MessageThread() {
  const [newMessage, setNewMessage] = useState("");
  const conversation = getCurrentConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // In a real app, you would send this to your API
    alert("Message sent: " + newMessage);
    setNewMessage("");
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a conversation to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={conversation.user.avatar || "/placeholder-user.svg"}
              alt={conversation.user.name}
              className="w-full h-full object-cover object-center"
            />
            <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{conversation.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {conversation.user.isOnline
                ? "Online"
                : "Last seen " + conversation.user.lastSeen}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {conversation.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
          >
            <div className="flex gap-2 max-w-[80%]">
              {!message.isMe && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={conversation.user.avatar || "/placeholder-user.svg"}
                    alt={conversation.user.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                </Avatar>
              )}
              <div>
                <div
                  className={`rounded-lg p-3 ${
                    message.isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.time}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
