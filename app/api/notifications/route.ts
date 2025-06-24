import prisma from '@/lib/prisma';
import { createApiResponse, handleApiError, validateUser } from '@/lib/api-utils';

// GET notifications
// export async function GET(request: Request) {
//   try {
//     const session = await validateUser();
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '20');
//     const type = searchParams.get('type') as string | null;

//     const where = {
//       userId: session!.user!.id,
//       ...(type ? { type } : {}),
//     };

//     const [notifications, total] = await Promise.all([
//       prisma.notification.findMany({
//         where,
//         include: {
//           user: true,
//         },
//         orderBy: {
//           createdAt: 'desc',
//         },
//         skip: (page - 1) * limit,
//         take: limit,
//       }),
//       prisma.notification.count({ where }),
//     ]);

//     const unreadCount = await prisma.notification.count({
//       where: {
//         userId: session!.user!.id,
//         read: false,
//       },
//     });

//     return createApiResponse({
//       data: {
//         notifications,
//         pagination: {
//           total,
//           pages: Math.ceil(total / limit),
//           current: page,
//           limit,
//         },
//         unreadCount,
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

    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: session!.user!.id,
      },
      data: {
        read: true,
      },
    });

    return createApiResponse({
      data: { success: true },
      status: 200,
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}

// Create a notification
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

//     const notification = await prisma.notification.create({
//       data: {
//         userId,
//         type: type || undefined,
//         targetId,
//         content,
//         read: false,
//       },
//       include: {
//         user: true,
//       },
//     });

//     return createApiResponse({
//       data: notification,
//       status: 201,
//     });
//   } catch (error: any) {
//     return handleApiError(error);
//   }
// }

// All notifications API routes are disabled in production except auth and feed.

