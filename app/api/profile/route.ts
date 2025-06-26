import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createApiResponse, handleApiError, validateUser } from '@/lib/api-utils';

// GET user profile
export async function GET(request: Request) {
  try {
    const session = await validateUser();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;

    // For now, return a basic profile based on session data
    // In a real app, you'd fetch from your database
    const profile = {
      id: session.user.id,
      username: session.user.name || session.user.email?.split('@')[0] || 'User',
      full_name: session.user.name || '',
      avatar_url: session.user.image || null,
      bio: null,
      website: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return createApiResponse({
      data: profile,
      status: 200,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update profile
export async function PUT(request: Request) {
  try {
    const session = await validateUser();
    const json = await request.json();
    
    // For now, just return the updated profile
    // In a real app, you'd update the database
    const updatedProfile = {
      id: session.user.id,
      username: json.username || session.user.name || 'User',
      full_name: json.full_name || session.user.name || '',
      avatar_url: json.avatar_url || session.user.image || null,
      bio: json.bio || null,
      website: json.website || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return createApiResponse({
      data: updatedProfile,
      status: 200,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// All profile API routes are disabled in production except auth and feed.
