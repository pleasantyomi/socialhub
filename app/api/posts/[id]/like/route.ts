import { NextRequest, NextResponse } from 'next/server';
import { createApiResponse, validateUser } from '@/lib/api-utils';

// Simple in-memory storage for likes
let likes: { [postId: string]: { id: string; profile_id: string; post_id: string; created_at: string }[] } = {};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await validateUser();
    const { id: postId } = await params;

    if (!likes[postId]) {
      likes[postId] = [];
    }

    // Check if already liked
    const existingLike = likes[postId].find(like => like.profile_id === session.user.id);
    if (existingLike) {
      return createApiResponse({
        error: 'Already liked this post',
        status: 400,
      });
    }

    const newLike = {
      id: `like-${Date.now()}`,
      profile_id: session.user.id,
      post_id: postId,
      created_at: new Date().toISOString(),
    };

    likes[postId].push(newLike);

    return createApiResponse({
      data: newLike,
      status: 201,
    });
  } catch (error) {
    return createApiResponse({
      error: 'Failed to like post',
      status: 500,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await validateUser();
    const { id: postId } = await params;

    if (!likes[postId]) {
      return createApiResponse({
        error: 'Post not found',
        status: 404,
      });
    }

    // Remove like
    likes[postId] = likes[postId].filter(like => like.profile_id !== session.user.id);

    return createApiResponse({
      data: { success: true },
      status: 200,
    });
  } catch (error) {
    return createApiResponse({
      error: 'Failed to unlike post',
      status: 500,
    });
  }
}
