import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import {
  createApiResponse,
  getPaginationParams,
  validateUser,
  withErrorHandling,
  ApiError,
} from '@/lib/api-utils';

const postSchema = z.object({
  content: z.string().min(1).max(500),
  image: z.string().url().optional(),
});

// GET posts feed
export async function GET(request: Request) {
  return withErrorHandling(async () => {
    const session = await validateUser();
    const { searchParams } = new URL(request.url);
    const { skip, take } = getPaginationParams(searchParams);

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        include: {
          author: true,
          comments: {
            include: {
              author: true,
            },
            take: 3,
            orderBy: {
              createdAt: 'desc',
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
          likes: {
            where: {
              userId: session.user.id,
            },
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      prisma.post.count(),
    ]);

    return {
      posts: posts.map(post => ({
        ...post,
        isLiked: post.likes.length > 0,
        likes: undefined, // Remove the likes array from the response
      })),
      pagination: {
        total,
        pages: Math.ceil(total / take),
        current: Math.floor(skip / take) + 1,
        size: take,
      },
    };
  });
}

// CREATE a new post
export async function POST(request: Request) {
  return withErrorHandling(async () => {
    const session = await validateUser();
    const json = await request.json();
    
    if (!session.user?.id) {
      throw new ApiError(401, 'User ID not found in session');
    }

    const validatedData = postSchema.parse(json);

    const post = await prisma.post.create({
      data: {
        content: validatedData.content,
        image: validatedData.image,
        authorId: session.user.id,
      },
      include: {
        author: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    return {
      ...post,
      isLiked: false,
    };
  });
}
