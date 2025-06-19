import { toast } from "sonner";

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: HeadersInit;
  cache?: RequestCache;
};

export type ApiError = {
  message: string;
  status: number;
};

async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    const error: ApiError = {
      message: data.message || 'An error occurred',
      status: response.status
    };
    throw error;
  }
  
  return data;
}

export async function api<T = any>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  try {
    const {
      method = 'GET',
      body,
      headers = {},
      cache
    } = options;

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      cache
    });

    return handleResponse(response);
  } catch (error) {
    const apiError = error as ApiError;
    toast.error(apiError.message || 'An error occurred');
    throw error;
  }
}

// Posts API
export async function fetchPosts(page = 1, limit = 10) {
  return api('/posts', {
    cache: 'no-store',
  });
}

export async function createPost(content: string, image?: string) {
  return api('/posts', {
    method: 'POST',
    body: { content, image }
  });
}

export async function likePost(postId: string) {
  return api(`/posts/${postId}/like`, {
    method: 'POST'
  });
}

export async function unlikePost(postId: string) {
  return api(`/posts/${postId}/like`, {
    method: 'DELETE'
  });
}

// Comments API
export async function createComment(postId: string, content: string) {
  return api(`/comments`, {
    method: 'POST',
    body: { postId, content }
  });
}

export async function fetchComments(postId: string) {
  return api(`/comments?postId=${postId}`);
}

// Profile API
export async function fetchProfile(userId: string) {
  return api(`/profile/${userId}`);
}

export async function updateProfile(profile: any) {
  return api('/profile', {
    method: 'PUT',
    body: profile
  });
}

// Marketplace API
export async function fetchMarketplaceItems(filters?: any) {
  const params = new URLSearchParams(filters);
  return api(`/marketplace?${params.toString()}`);
}

export async function createMarketplaceItem(item: any) {
  return api('/marketplace', {
    method: 'POST',
    body: item
  });
}

// Messages API
export async function fetchConversations() {
  return api('/messages');
}

export async function fetchMessages(conversationId: string) {
  return api(`/messages?conversationId=${conversationId}`);
}

export async function sendMessage(conversationId: string, content: string) {
  return api('/messages', {
    method: 'POST',
    body: { conversationId, content }
  });
}

// Notifications API
export async function fetchNotifications() {
  return api('/notifications');
}

export async function markNotificationAsRead(notificationId: string) {
  return api(`/notifications/${notificationId}/read`, {
    method: 'POST'
  });
}

// Follow API
export async function followUser(userId: string) {
  return api(`/profile/${userId}/follow`, {
    method: 'POST'
  });
}

export async function unfollowUser(userId: string) {
  return api(`/profile/${userId}/follow`, {
    method: 'DELETE'
  });
}
