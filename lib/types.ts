export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Author {
  name: string;
  avatar: string;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
}

export interface TrendingTopic {
  category: string;
  title: string;
  posts: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  listedTime: string;
  category: string;
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  website?: string;
  joinDate: string;
  following: number;
  followers: number;
}

// New interfaces for messages and notifications

export interface ConversationUser {
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
}

export interface Message {
  content: string;
  time: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  user: ConversationUser;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Message[];
}

export interface NotificationUser {
  name: string;
  avatar: string;
}

export interface Notification {
  id: string;
  user: NotificationUser;
  type: "like" | "comment" | "follow" | "mention" | "share";
  action: string;
  target: string;
  content: string;
  time: string;
  read: boolean;
}
