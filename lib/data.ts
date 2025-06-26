import { supabase } from "./supabase";
import { withDatabaseFallback, isDemoMode } from "./db-utils";
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
  return withDatabaseFallback(
    async () => {
      // Try Supabase first
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            full_name,
            avatar_url,
            website,
            bio,
            created_at,
            updated_at
          ),
          comments (
            id,
            content,
            created_at,
            updated_at,
            profiles:author_id (
              id,
              username,
              full_name,
              avatar_url,
              bio,
              website,
              created_at,
              updated_at
            )
          ),
          likes (
            id,
            profile_id,
            created_at
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return posts || [];
    },
    // Nigerian university themed demo data
    [
      {
        id: "demo-1",
        author_id: "demo-user",
        content: "Welcome to the Nigerian University Social Platform! 🇳🇬 Connect with students and faculty from universities across Nigeria. #NigerianUniversities #StudentLife",
        image: null,
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        profiles: {
          id: "demo-user",
          username: "social_platform",
          full_name: "Nigerian University Social",
          avatar_url: "/placeholder.svg",
          website: null,
          bio: "Connecting Nigerian university students and faculty",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        likes: [],
        comments: []
      }
    ],
    'fetch posts'
  );
}

export async function getPost(id: string): Promise<Post> {
  return api.fetchPost(id);
}

export async function createPost(userId: string, content: string, image?: string): Promise<Post> {
  return withDatabaseFallback(
    async () => {
      // Try Supabase first
      const { data: post, error } = await supabase
        .from('posts')
        .insert({
          author_id: userId,
          content,
          image: image || null,
        })
        .select(`
          *,
          profiles:author_id (
            id,
            username,
            full_name,
            avatar_url,
            website,
            bio,
            created_at,
            updated_at
          )
        `)
        .single();

      if (error) throw error;

      return {
        ...post,
        likes: [],
        comments: []
      };
    },
    // Fallback demo post
    {
      id: `demo_post_${Date.now()}`,
      author_id: userId,
      content,
      image: image || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        id: userId,
        username: 'demo_user',
        full_name: 'Demo User',
        avatar_url: '/placeholder.svg',
        website: null,
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      likes: [],
      comments: []
    },
    'create post'
  );
}

export async function likePost(postId: string, userId: string): Promise<Like> {
  return withDatabaseFallback(
    async () => {
      const { data: like, error } = await supabase
        .from('likes')
        .insert({
          post_id: postId,
          profile_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return like;
    },
    {
      id: `demo_like_${Date.now()}`,
      post_id: postId,
      profile_id: userId,
      created_at: new Date().toISOString()
    },
    'like post'
  );
}

export async function unlikePost(postId: string, userId: string): Promise<void> {
  return withDatabaseFallback(
    async () => {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('profile_id', userId);

      if (error) throw error;
    },
    undefined,
    'unlike post'
  );
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
  return api.fetchProfile('me'); // Will use current session
}

// Trending and Suggestions
export async function getTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    // Return Nigerian university themed demo data
    return [
      { id: '1', name: '#UNILAG', posts_count: 1250, category: 'University' },
      { id: '2', name: '#TechInNigeria', posts_count: 980, category: 'Technology' },
      { id: '3', name: '#NigerianStudents', posts_count: 875, category: 'Education' },
      { id: '4', name: '#LagosUniversity', posts_count: 760, category: 'University' },
      { id: '5', name: '#FinalYear', posts_count: 650, category: 'Academic' },
      { id: '6', name: '#UI', posts_count: 590, category: 'University' },
      { id: '7', name: '#ABU', posts_count: 520, category: 'University' },
      { id: '8', name: '#NigerianTech', posts_count: 480, category: 'Technology' },
      { id: '9', name: '#CampusLife', posts_count: 420, category: 'Student Life' },
      { id: '10', name: '#NaijaStudents', posts_count: 380, category: 'Education' },
    ];
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return [];
  }
}

export async function getSuggestedUsers(userId?: string): Promise<SuggestedUser[]> {
  try {
    // Return Nigerian university themed demo data
    return [
      {
        id: 'user1',
        username: 'prof_adaora_unn',
        full_name: 'Prof. Adaora Okonkwo',
        avatar_url: '/placeholder.svg',
        website: 'https://unn.edu.ng',
        bio: 'Professor of Engineering at UNN | Renewable Energy Research',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        follower_count: 3200,
        is_following: false,
      },
      {
        id: 'user2',
        username: 'unilag_official',
        full_name: 'University of Lagos',
        avatar_url: '/placeholder.svg',
        website: 'https://unilag.edu.ng',
        bio: 'Official account of the University of Lagos | School of First Choice',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        follower_count: 15800,
        is_following: false,
      },
      {
        id: 'user3',
        username: 'kemi_student_leader',
        full_name: 'Kemi Adebayo',
        avatar_url: '/placeholder.svg',
        website: null,
        bio: 'Student Union President @UI | Political Science | Youth Advocate',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        follower_count: 2850,
        is_following: false,
      },
      {
        id: 'user4',
        username: 'futa_robotics',
        full_name: 'FUTA Robotics Club',
        avatar_url: '/placeholder.svg',
        website: 'https://futa.edu.ng',
        bio: 'Official Robotics Club @FUTA | Building the future with code and circuits',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        follower_count: 1920,
        is_following: false,
      },
      {
        id: 'user5',
        username: 'dr_hassan_abu',
        full_name: 'Dr. Hassan Muhammad',
        avatar_url: '/placeholder.svg',
        website: 'https://abu.edu.ng',
        bio: 'Agricultural Researcher @ABU | Climate Change Solutions | Food Security',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        follower_count: 1650,
        is_following: false,
      },
      {
        id: 'user6',
        username: 'covenant_entrepreneurs',
        full_name: 'Covenant Entrepreneurs',
        avatar_url: '/placeholder.svg',
        website: 'https://covenantuniversity.edu.ng',
        bio: 'Entrepreneurship Hub @Covenant University | Building Nigerian Startups',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        follower_count: 2100,
        is_following: false,
      }
    ];
  } catch (error) {
    console.error('Error fetching suggested users:', error);
    return [];
  }
}

// Follow
export async function followUser(currentUserId: string, targetUserId: string): Promise<void> {
  return api.followUser(targetUserId);
}

export async function unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
  return api.unfollowUser(targetUserId);
}

// Demo profile posts data
const demoUserPosts = [
  {
    id: "user_post_1",
    content: "Just finished my computer science project! Excited about the future of tech in Nigeria 🚀",
    image: null,
    timestamp: "2 hours ago",
    likes: 15,
    comments: 3
  },
  {
    id: "user_post_2", 
    content: "Beautiful sunset at the university campus today 🌅",
    image: "/placeholder.svg",
    timestamp: "1 day ago",
    likes: 28,
    comments: 7
  },
  {
    id: "user_post_3",
    content: "Study group session for algorithms was amazing! Love learning with friends 📚",
    image: null,
    timestamp: "3 days ago", 
    likes: 12,
    comments: 5
  }
];

const demoLikedPosts = [
  {
    id: "liked_post_1",
    author: { name: "Dr. Adaora Okonkwo", avatar: "/placeholder.svg" },
    content: "Excited to announce our new research collaboration on renewable energy! 🌱⚡",
    image: null,
    timestamp: "5 hours ago",
    likes: 45,
    comments: 12
  },
  {
    id: "liked_post_2",
    author: { name: "Emeka Nwosu", avatar: "/placeholder.svg" },
    content: "Amazing entrepreneurship lecture today! The future is bright 💡",
    image: "/placeholder.svg",
    timestamp: "1 day ago",
    likes: 32,
    comments: 8
  }
];

// User profile functions
export function getUserPosts() {
  return demoUserPosts;
}

export function getUserLikedPosts() {
  return demoLikedPosts;
}
