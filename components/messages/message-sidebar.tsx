"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, MoreHorizontal } from "lucide-react";
import { getConversations } from "@/lib/data";

export default function MessageSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const conversations = getConversations();
  const [activeConversation, setActiveConversation] = useState(
    conversations[0]?.id || ""
  );

  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredConversations.map((conversation) => (
          <button
            key={conversation.id}
            className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
              activeConversation === conversation.id ? "bg-muted/50" : ""
            }`}
            onClick={() => setActiveConversation(conversation.id)}
          >
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage
                  src={conversation.user.avatar || "/placeholder-user.svg"}
                  alt={conversation.user.name}
                  className="w-full h-full object-center object-cover"
                />
                <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium truncate">
                    {conversation.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {conversation.lastMessageTime}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
