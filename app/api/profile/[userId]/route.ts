import { NextRequest, NextResponse } from 'next/server';
import { createApiResponse, handleApiError, validateUser } from '@/lib/api-utils';

// GET user profile by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await validateUser();
    const { userId } = await params;

    // Handle 'me' as current user
    const targetUserId = userId === 'me' ? session.user.id : userId;

    // For now, return a basic profile based on session data
    // In a real app, you'd fetch from your database
    const profile = {
      id: targetUserId,
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
