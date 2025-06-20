import { NextResponse } from 'next/server';
import { createApiResponse, validateUser } from '@/lib/api-utils';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await validateUser(request);
    const { userId } = params;

    // Check if the current user is following the target user
    const { data: followData, error: followError } = await supabase
      .from('follows')
      .select('user_id')
      .eq('user_id', userId)
      .eq('follower_id', user.id)
      .single();

    if (followError && followError.code !== 'PGRST116') throw followError;

    // Get follower count
    const { count, error: countError } = await supabase
      .from('follows')
      .select('user_id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw countError;

    return createApiResponse({
      data: {
        isFollowing: !!followData,
        followerCount: count
      }
    });
  } catch (error) {
    return createApiResponse({ error });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await validateUser(request);
    const { userId } = params;

    if (userId === user.id) {
      throw new Error('Cannot follow yourself');
    }

    const { data, error } = await supabase
      .from('follows')
      .insert({
        user_id: userId,
        follower_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    return createApiResponse({ data });
  } catch (error) {
    return createApiResponse({ error });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await validateUser(request);
    const { userId } = params;

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('user_id', userId)
      .eq('follower_id', user.id);

    if (error) throw error;

    return createApiResponse({ data: { success: true } });
  } catch (error) {
    return createApiResponse({ error });
  }
}
