import { Post, User, Comment, MarketplaceListing, Message, Conversation } from '@prisma/client';

export type PostWithAuthor = Post & {
  author: User;
  comments: CommentWithAuthor[];
  likes: Like[];
};

export type CommentWithAuthor = Comment & {
  author: User;
};

export type Like = {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
};

export interface TrendingTopic {
  category: string;
  title: string;
  posts: number;
}

export type MarketplaceListingWithSeller = MarketplaceListing & {
  seller: User;
};

export type ExtendedUserProfile = User & {
  posts: PostWithAuthor[];
  followers: User[];
  following: User[];
  listings: MarketplaceListingWithSeller[];
};

// New interfaces for messages and notifications

export type MessageWithSender = Message & {
  sender: User;
};

export type ConversationWithUsers = Conversation & {
  user1: User;
  user2: User;
  messages: MessageWithSender[];
};

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'share';

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  user: User;
  targetId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}
