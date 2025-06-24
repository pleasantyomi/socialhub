import { validateUser } from '@/lib/api-utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Socket.IO logic is not supported on Vercel serverless. This is a placeholder route to prevent build errors.
export const GET = () => new Response('Socket route placeholder', { status: 200 });
export const POST = GET;
