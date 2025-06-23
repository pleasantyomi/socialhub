import { supabase } from "./supabase";
import type {
  Post,
  Comment,
  MarketplaceItem,
  Profile,
  Like,
  Conversation,
  Message,
  Notification
} from "./types";
import * as api from "./api";

export type TrendingTopic = {
  id: string;
  name: string;
  posts_count: number;
  category: string;
};

export type SuggestedUser = Profile & {
  follower_count: number;
  is_following: boolean;
};

// Posts
export async function getPosts(): Promise<Post[]> {
  return api.fetchPosts();
}

export async function getPost(id: string): Promise<Post> {
  return api.fetchPost(id);
}

export async function createPost(userId: string, content: string, image?: string): Promise<Post> {
  return api.createPost(content, image);
}

export async function likePost(postId: string, userId: string): Promise<Like> {
  return api.likePost(postId);
}

export async function unlikePost(postId: string, userId: string): Promise<void> {
  return api.unlikePost(postId);
}

// Comments
export async function createComment(postId: string, userId: string, content: string): Promise<Comment> {
  return api.createComment(postId, content);
}

export async function getComments(postId: string): Promise<Comment[]> {
  return api.fetchComments(postId);
}

// Marketplace
export async function getMarketplaceItems(filters?: any): Promise<MarketplaceItem[]> {
  return api.fetchMarketplaceItems(filters);
}

export async function createMarketplaceItem(item: any): Promise<MarketplaceItem> {
  return api.createMarketplaceItem(item);
}

// Messages
export async function getConversations(userId: string): Promise<Conversation[]> {
  return api.fetchConversations();
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  return api.fetchMessages(conversationId);
}

export async function sendMessage(conversationId: string, userId: string, content: string): Promise<Message> {
  return api.sendMessage(conversationId, content);
}

// Notifications
export async function getNotifications(userId: string): Promise<Notification[]> {
  return api.fetchNotifications();
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  return api.markNotificationAsRead(notificationId);
}

// Profile
export async function getProfile(userId: string): Promise<Profile> {
  return api.fetchProfile(userId);
}

export async function updateProfile(userId: string, profile: Partial<Profile>): Promise<Profile> {
  return api.updateProfile(profile);
}

export async function getUserProfile(): Promise<Profile> {
  // This function returns the current user's profile
  // You might want to get the current user ID from session or context
  throw new Error('User ID is required to get profile');
}

// Trending and Suggestions
export async function getTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_trending_topics')
      .limit(5);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    // Return demo data as fallback
    return [
      { id: '1', name: '#university', posts_count: 125, category: 'Education' },
      { id: '2', name: '#research', posts_count: 98, category: 'Academic' },
      { id: '3', name: '#campus', posts_count: 87, category: 'General' },
      { id: '4', name: '#events', posts_count: 76, category: 'Social' },
      { id: '5', name: '#study', posts_count: 65, category: 'Education' },
    ];
  }
}

export async function getSuggestedUsers(userId?: string): Promise<SuggestedUser[]> {
  try {
    if (!userId) throw new Error('No user ID provided');

    const { data, error } = await supabase
      .rpc('get_suggested_users', { current_user_id: userId })
      .limit(5);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching suggested users:', error);
    // Return demo data as fallback
    return [
      {
        id: 'demo1',
        username: 'academic_pro',
        full_name: 'Academic Professional',
        avatar_url: '/placeholder.svg',
        website: null,
        bio: 'Professor of Computer Science',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        follower_count: 1200,
        is_following: false,
      },
      {
        id: 'demo2',
        username: 'student_leader',
        full_name: 'Student Leader',
        avatar_url: '/placeholder.svg',
        website: null,
        bio: 'Student Body President',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        follower_count: 850,
        is_following: false,
      },
      {
        id: 'demo3',
        username: 'campus_news',
        full_name: 'Campus News',
        avatar_url: '/placeholder.svg',
        website: 'https://campus.news',
        bio: 'Your source for campus updates',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        follower_count: 3200,
        is_following: false,
      }
    ];
  }
}

// Follow
export async function followUser(currentUserId: string, targetUserId: string): Promise<void> {
  return api.followUser(targetUserId);
}

export async function unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
  return api.unfollowUser(targetUserId);
}
