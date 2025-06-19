import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
};

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
};

// User and profile functions
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (userId: string) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return profile;
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  if (error) throw error;
  return data;
};

export const getPosts = async ({ page = 1, limit = 10 } = {}) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        avatar_url,
        full_name
      ),
      comments (
        id,
        content,
        created_at,
        profiles:author_id (
          id,
          username,
          avatar_url
        )
      ),
      likes (
        id,
        profile_id
      )
    `)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return posts;
};

export const getPost = async (postId: string) => {
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        avatar_url,
        full_name
      ),
      comments (
        id,
        content,
        created_at,
        profiles:author_id (
          id,
          username,
          avatar_url
        )
      ),
      likes (
        id,
        profile_id
      )
    `)
    .eq('id', postId)
    .single();

  if (error) throw error;
  return post;
};

export const createPost = async (data: any) => {
  const { data: post, error } = await supabase
    .from('posts')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return post;
};

export const updatePost = async (postId: string, updates: any) => {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePost = async (postId: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
};

export const getConversations = async (userId: string) => {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      profiles!conversations_user1_id_fkey (
        id,
        username,
        avatar_url,
        full_name
      ),
      profiles!conversations_user2_id_fkey (
        id,
        username,
        avatar_url,
        full_name
      ),
      messages (
        id,
        content,
        created_at,
        sender_id
      )
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) throw error;
  return conversations;
};

export const getMessages = async (conversationId: string) => {
  const { data: messages, error } = await supabase
    .from('messages')
    .select(`
      *,
      profiles:sender_id (
        id,
        username,
        avatar_url
      )
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return messages;
};

export const sendMessage = async (data: any) => {
  const { data: message, error } = await supabase
    .from('messages')
    .insert([data])
    .select(`
      *,
      profiles:sender_id (
        id,
        username,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  return message;
};

export const getNotifications = async (userId: string) => {
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select(`
      *,
      profiles:actor_id (
        id,
        username,
        avatar_url
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return notifications;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

export const getMarketplaceItems = async ({ 
  page = 1, 
  limit = 10,
  category = null,
  minPrice = null,
  maxPrice = null,
  condition = null,
  location = null
} = {}) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('marketplace_items')
    .select(`
      *,
      profiles:seller_id (
        id,
        username,
        avatar_url,
        full_name
      )
    `)
    .range(from, to);

  if (category) {
    query = query.eq('category', category);
  }
  if (minPrice) {
    query = query.gte('price', minPrice);
  }
  if (maxPrice) {
    query = query.lte('price', maxPrice);
  }
  if (condition) {
    query = query.eq('condition', condition);
  }
  if (location) {
    query = query.textSearch('location', location);
  }

  const { data: items, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return items;
};
