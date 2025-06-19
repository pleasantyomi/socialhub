import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createApiResponse, getPaginationParams, validateUser } from '@/lib/api-utils';
import { getPosts, createPost } from '@/lib/supabase';

const postSchema = z.object({
  content: z.string().min(1).max(500),
  image: z.string().url().optional(),
});

// GET posts feed
export async function GET(request: Request) {
  try {
    const session = await validateUser();
    const { searchParams } = new URL(request.url);
    const { page, limit } = getPaginationParams(searchParams);

    const posts = await getPosts({ page, limit });

    return createApiResponse({
      data: posts,
      status: 200,
    });
  } catch (error) {
    return createApiResponse({
      error: 'Failed to fetch posts',
      status: 500,
    });
  }
}

// CREATE new post
export async function POST(request: Request) {
  try {
    const session = await validateUser();
    const json = await request.json();
    
    const validatedData = postSchema.parse(json);
    
    const post = await createPost({
      ...validatedData,
      author_id: session.user.id,
    });

    return createApiResponse({
      data: post,
      status: 201,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createApiResponse({
        error: 'Invalid post data',
        data: error.errors,
        status: 400,
      });
    }

    return createApiResponse({
      error: 'Failed to create post',
      status: 500,
    });
  }
}
