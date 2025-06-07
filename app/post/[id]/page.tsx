import { notFound } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import PostDetail from "@/components/post/post-detail";
import CommentSection from "@/components/comment/comment-section";
import { getPosts } from "@/lib/data";
import { type Metadata } from "next";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Post | unify",
  description: "View post and comments",
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const posts = await getPosts(); // ✅ FIXED
  const post = posts.find((post) => post.id === id);

  if (!post) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PostDetail post={post} />
        <CommentSection postId={id} />
      </div>
    </MainLayout>
  );
}
