import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { createApiResponse, handleApiError, validateUser } from '@/lib/api-utils';

// GET user profile
export async function GET(request: Request) {
  return validateUser(async () => {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session!.user!.id;

    const profile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          include: {
            author: true,
            comments: {
              include: {
                author: true,
              },
            },
            likes: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        listings: {
          include: {
            seller: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            listings: true,
          },
        },
      },
    });

    if (!profile) {
      return createApiResponse({
        error: 'Profile not found',
        status: 404,
      });
    }

    // Check if the current user follows this profile
    const isFollowing = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: session!.user!.id,
          followingId: userId,
        },
      },
    });

    return createApiResponse({
      data: {
        ...profile,
        isFollowing: !!isFollowing,
      },
      status: 200,
    });
  });
}

// UPDATE user profile
export async function PUT(request: Request) {
  return validateUser(async () => {
    const session = await getServerSession(authOptions);
    const json = await request.json();
    
    // Validate input
    if (json.name && json.name.length > 50) {
      return createApiResponse({
        error: 'Name is too long (max 50 characters)',
        status: 400,
      });
    }

    if (json.bio && json.bio.length > 160) {
      return createApiResponse({
        error: 'Bio is too long (max 160 characters)',
        status: 400,
      });
    }

    if (json.location && json.location.length > 100) {
      return createApiResponse({
        error: 'Location is too long (max 100 characters)',
        status: 400,
      });
    }

    if (json.website) {
      try {
        new URL(json.website);
      } catch {
        return createApiResponse({
          error: 'Invalid website URL',
          status: 400,
        });
      }
    }

    const updatedProfile = await prisma.user.update({
      where: { id: session!.user!.id },
      data: {
        name: json.name,
        bio: json.bio,
        image: json.image,
        location: json.location,
        website: json.website,
      },
    });

    return createApiResponse({
      data: updatedProfile,
      status: 200,
    });
  });
}

// Follow/Unfollow a user
export async function POST(request: Request) {
  return validateUser(async () => {
    const session = await getServerSession(authOptions);
    const json = await request.json();
    const { targetUserId, action } = json;

    if (!targetUserId) {
      return createApiResponse({
        error: 'Target user ID is required',
        status: 400,
      });
    }

    if (targetUserId === session!.user!.id) {
      return createApiResponse({
        error: 'Cannot follow/unfollow yourself',
        status: 400,
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return createApiResponse({
        error: 'Target user not found',
        status: 404,
      });
    }

    if (action === 'follow') {
      await prisma.follows.create({
        data: {
          followerId: session!.user!.id,
          followingId: targetUserId,
        },
      });
    } else if (action === 'unfollow') {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: session!.user!.id,
            followingId: targetUserId,
          },
        },
      });
    } else {
      return createApiResponse({
        error: 'Invalid action. Must be either "follow" or "unfollow"',
        status: 400,
      });
    }

    return createApiResponse({
      data: { success: true },
      status: 200,
    });
  });
}
