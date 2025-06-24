import { NextResponse } from 'next/server';
import { validateUser } from '@/lib/api-utils';
import { getMessages, getConversations, sendMessage } from '@/lib/supabase';
import { z } from 'zod';

const messageSchema = z.object({
  content: z.string().min(1).max(1000),
  conversation_id: z.string().uuid(),
});

// GET messages for a conversation
// export async function GET(request: Request) {
//   try {
//     const session = await validateUser();
//     const { searchParams } = new URL(request.url);
//     const conversationId = searchParams.get('conversationId');

//     if (!conversationId) {
//       // Get all conversations for the user
//       const conversations = await getConversations(session.user.id);
//       return NextResponse.json(conversations);
//     }

//     // Get messages for specific conversation
//     const messages = await getMessages(conversationId);
//     return NextResponse.json(messages);
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch messages' },
//       { status: 500 }
//     );
//   }
// }

// SEND a new message
// export async function POST(request: Request) {
//   try {
//     const session = await validateUser();
//     const json = await request.json();
    
//     const validatedData = messageSchema.parse(json);
    
//     const message = await sendMessage({
//       ...validatedData,
//       sender_id: session.user.id,
//     });

//     return NextResponse.json(message, { status: 201 });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: 'Invalid message data', details: error.errors },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to send message' },
//       { status: 500 }
//     );
//   }
// }
// All messages API routes are disabled in production except auth and feed.
