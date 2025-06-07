import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { createApiResponse, handleApiError, validateUser } from '@/lib/api-utils';

// GET messages for a conversation
export async function GET(request: Request) {
  return validateUser(async () => {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      // Get all conversations for the user
      const conversations = await prisma.conversation.findMany({
        where: {
          OR: [
            { user1Id: session!.user!.id },
            { user2Id: session!.user!.id },
          ],
        },
        include: {
          user1: true,
          user2: true,
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            include: {
              sender: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return createApiResponse({
        data: conversations,
        status: 200,
      });
    } else {
      // Get messages for a specific conversation
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          user1: true,
          user2: true,
        },
      });

      if (!conversation) {
        return createApiResponse({
          error: 'Conversation not found',
          status: 404,
        });
      }

      // Check if user is part of the conversation
      if (conversation.user1Id !== session!.user!.id && conversation.user2Id !== session!.user!.id) {
        return createApiResponse({
          error: 'Unauthorized',
          status: 403,
        });
      }

      const messages = await prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return createApiResponse({
        data: {
          conversation,
          messages,
        },
        status: 200,
      });
    }
  });
}

// SEND a new message
export async function POST(request: Request) {
  return validateUser(async () => {
    const session = await getServerSession(authOptions);
    const json = await request.json();
    const { recipientId, content } = json;

    if (!content?.trim()) {
      return createApiResponse({
        error: 'Message content is required',
        status: 400,
      });
    }

    if (!recipientId) {
      return createApiResponse({
        error: 'Recipient ID is required',
        status: 400,
      });
    }

    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return createApiResponse({
        error: 'Recipient not found',
        status: 404,
      });
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            AND: [
              { user1Id: session!.user!.id },
              { user2Id: recipientId },
            ],
          },
          {
            AND: [
              { user1Id: recipientId },
              { user2Id: session!.user!.id },
            ],
          },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: session!.user!.id,
          user2Id: recipientId,
        },
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session!.user!.id,
        conversationId: conversation.id,
      },
      include: {
        sender: true,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return createApiResponse({
      data: message,
      status: 201,
    });
  });
}
