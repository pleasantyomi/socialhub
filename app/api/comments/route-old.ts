import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createApiResponse, getPaginationParams, validateUser } from '@/lib/api-utils';
import { createComment as createCommentSupabase, getComments } from '@/lib/supabase';

const commentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(500),
});

// GET comments for a post
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return createApiResponse({
        error: 'Post ID is required',
        status: 400,
      });
    }

    const comments = await getComments(postId);

    return createApiResponse({
      data: comments,
      status: 200,
    });
  } catch (error) {
    return createApiResponse({
      error: 'Failed to fetch comments',
      status: 500,
    });
  }
}

// CREATE a new comment
export async function POST(request: Request) {
  try {
    const session = await validateUser();
    const json = await request.json();
    
    const validatedData = commentSchema.parse(json);
    
    const comment = await createCommentSupabase({
      ...validatedData,
      author_id: session.user.id,
    });

    return createApiResponse({
      data: comment,
      status: 201,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createApiResponse({
        error: 'Invalid comment data',
        data: error.errors,
        status: 400,
      });
    }

    return createApiResponse({
      error: 'Failed to create comment',
      status: 500,
    });
  }

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
