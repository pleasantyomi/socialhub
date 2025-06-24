import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
type NextApiResponseServerIO = import('next').NextApiResponse & {
  socket: any;
};
import { validateUser } from '@/lib/api-utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    io.on('connection', async (socket) => {
      try {
        const session = await validateUser();
        socket.join(`user:${session.user.id}`);

        socket.on('send-message', async (data) => {
          const { conversationId, content } = data;
          
          try {
            const message = await prisma.message.create({
              data: {
                content,
                conversationId,
                senderId: session.user.id,
              },
              include: {
                sender: true,
              },
            });

            // Emit to all users in the conversation
            const conversation = await prisma.conversation.findUnique({
              where: { id: conversationId },
            });

            if (conversation) {
              io.to(`user:${conversation.user1Id}`).to(`user:${conversation.user2Id}`).emit('new-message', message);
            }
          } catch (error) {
            console.error('Message error:', error);
            socket.emit('error', 'Failed to send message');
          }
        });

        socket.on('typing', async (data) => {
          const { conversationId } = data;
          const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
          });

          if (conversation) {
            socket.to(`user:${conversation.user1Id}`).to(`user:${conversation.user2Id}`).emit('user-typing', {
              userId: session.user.id,
              conversationId,
            });
          }
        });

      } catch (error) {
        console.error('Socket connection error:', error);
        socket.disconnect();
      }
    });

    res.socket.server.io = io;
  }

  res.end();
};

// Remove all exports except config, and add a dummy handler to satisfy Next.js
export const GET = () => new Response('Socket route placeholder', { status: 200 });
export const POST = GET;
