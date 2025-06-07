import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';

export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  status: number;
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiResponse<T>(response: ApiResponse<T>) {
  return NextResponse.json(
    {
      data: response.data,
      error: response.error,
    },
    { status: response.status }
  );
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return createApiResponse({
      error: error.message,
      status: error.status,
    });
  }

  if (error instanceof z.ZodError) {
    return createApiResponse({
      error: 'Validation error',
      data: error.issues.map(issue => ({
        path: issue.path,
        message: issue.message,
      })),
      status: 400,
    });
  }

  // Handle Prisma errors
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    // Common Prisma error codes
    switch (error.code) {
      case 'P2002':
        return createApiResponse({
          error: 'A unique constraint would be violated.',
          status: 409,
        });
      case 'P2025':
        return createApiResponse({
          error: 'Record not found.',
          status: 404,
        });
      case 'P2001':
      case 'P2006':
        return createApiResponse({
          error: 'Invalid input data.',
          status: 400,
        });
    }
  }

  return createApiResponse({
    error: 'Internal Server Error',
    status: 500,
  });
}

export async function validateUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new ApiError(401, 'Unauthorized');
  }
  return session;
}

export async function withErrorHandling<T>(
  handler: () => Promise<T>,
  validateSchema?: z.ZodSchema
): Promise<NextResponse> {
  try {
    const result = await handler();
    return createApiResponse({
      data: result,
      status: 200,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 20));
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
  };
}

// Validation schemas
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

export const idSchema = z.object({
  id: z.string().min(1),
});
