import type { Post, User, Comment, Prisma, MarketplaceListing, Message, Conversation } from '@prisma/client';

export type PostWithAuthor = Prisma.PostGetPayload<{
  include: {
    author: true;
    comments: {
      include: {
        author: true;
      };
    };
    likes: true;
  };
}>;

export type CommentWithAuthor = Prisma.CommentGetPayload<{
  include: {
    author: true;
  };
}>;

export type Like = {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;
};

export type MarketplaceListingWithSeller = Prisma.MarketplaceListingGetPayload<{
  include: {
    seller: true;
  };
}>;

export type ExtendedUserProfile = Prisma.UserGetPayload<{
  include: {
    posts: {
      include: {
        author: true;
        comments: {
          include: {
            author: true;
          };
        };
        likes: true;
      };
    };
    followers: true;
    following: true;
    listings: {
      include: {
        seller: true;
      };
    };
  };
}>;

export type MessageWithSender = Prisma.MessageGetPayload<{
  include: {
    sender: true;
  };
}>;

export type ConversationWithUsers = Prisma.ConversationGetPayload<{
  include: {
    user1: true;
    user2: true;
    messages: {
      include: {
        sender: true;
      };
    };
  };
}>;

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'share';

export type Notification = Prisma.NotificationGetPayload<{
  include: {
    user: true;
  };
}>;

export type PostWithAuthorAndCounts = Prisma.PostGetPayload<{
  include: {
    author: true;
    comments: {
      include: {
        author: true;
      };
    };
    _count: {
      select: {
        comments: true;
        likes: true;
      };
    };
    likes: {
      select: {
        userId: true;
      };
    };
  };
}>;

export type PostResponse = Omit<PostWithAuthorAndCounts, 'likes'> & {
  isLiked: boolean;
};
