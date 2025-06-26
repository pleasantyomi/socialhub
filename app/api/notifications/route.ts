import { supabase } from '@/lib/supabase';
import { createApiResponse, handleApiError, validateUser } from '@/lib/api-utils';

// Note: Using Supabase instead of Prisma for consistency with the rest of the app

// GET notifications - disabled for now
// export async function GET(request: Request) {
//   try {
//     const session = await validateUser();
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '20');
//     const type = searchParams.get('type') as string | null;

//     const query = supabase
//       .from('notifications')
//       .select('*')
//       .eq('user_id', session.user.id)
//       .order('created_at', { ascending: false })
//       .range((page - 1) * limit, page * limit - 1);

//     if (type) {
//       query.eq('type', type);
//     }

//     const { data: notifications, error } = await query;

//     if (error) throw error;

//     const { count } = await supabase
//       .from('notifications')
//       .select('*', { count: 'exact', head: true })
//       .eq('user_id', session.user.id);

//     const { count: unreadCount } = await supabase
//       .from('notifications')
//       .select('*', { count: 'exact', head: true })
//       .eq('user_id', session.user.id)
//       .eq('read', false);

//     return createApiResponse({
//       data: {
//         notifications,
//         pagination: {
//           total: count || 0,
//           pages: Math.ceil((count || 0) / limit),
//           current: page,
//           limit,
//         },
//         unreadCount: unreadCount || 0,
//       },
//       status: 200,
//     });
//   } catch (error: any) {
//     return handleApiError(error);
//   }
// }

// Mark notifications as read
export async function PUT(request: Request) {
  try {
    const session = await validateUser();
    const json = await request.json();
    const { notificationIds } = json;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return createApiResponse({
        error: 'Notification IDs array is required',
        status: 400,
      });
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', notificationIds)
      .eq('user_id', session.user.id);

    if (error) throw error;

    return createApiResponse({
      data: { success: true },
      status: 200,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

// Create a notification - disabled for now
// export async function POST(request: Request) {
//   try {
//     const session = await validateUser();
//     const json = await request.json();
//     const { userId, type, targetId, content } = json;

//     if (!userId || !type || !targetId || !content) {
//       return createApiResponse({
//         error: 'Missing required fields',
//         status: 400,
//       });
//     }

//     const { data: notification, error } = await supabase
//       .from('notifications')
//       .insert({
//         user_id: userId,
//         type,
//         reference_id: targetId,
//         content,
//         read: false,
//       })
//       .select('*')
//       .single();

//     if (error) throw error;

//     return createApiResponse({
//       data: notification,
//       status: 201,
//     });
//   } catch (error: any) {
//     return handleApiError(error);
//   }
// }

// All notifications API routes are disabled in production except auth and feed.

