import { notFound } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import PostDetail from "@/components/post/post-detail";
import CommentSection from "@/components/comment/comment-section";
import { getPosts } from "@/lib/data";
import { type Metadata } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createApiResponse, validateUser } from "@/lib/api-utils";
import { Server } from "socket.io";
import { GoogleProvider } from "next-auth/providers";
import { NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Post | unify",
  description: "View post and comments",
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      likes: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PostDetail post={post} />
        <CommentSection postId={id} comments={post.comments} />
      </div>
    </MainLayout>
  );
}

export async function POST(request: Request) {
  try {
    await validateUser();
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return createApiResponse({
        error: "No file provided",
        status: 400,
      });
    }

    const s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const buffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${Date.now()}-${file.name}`,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    });

    await s3Client.send(command);

    return createApiResponse({
      data: {
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${command.input.Key}`,
      },
      status: 200,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Add additional providers
  ],
  // Add error handling
  // Add session strategy
};

export const handleApiError = (error: unknown) => {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return createApiResponse({
      error: error.message,
      status: error.status,
    });
  }

  if (error instanceof z.ZodError) {
    return createApiResponse({
      error: "Validation failed",
      data: error.errors,
      status: 400,
    });
  }

  // Handle Prisma errors
  if (isPrismaError(error)) {
    return handlePrismaError(error);
  }

  return createApiResponse({
    error: "Internal server error",
    status: 500,
  });
};
