import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import PostDetail from "@/components/post/post-detail";
import CommentSection from "@/components/comment/comment-section";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Post | SocialHub",
  description: "View post and comments",
};

export default function PostPage({ params }: { params: { id: string } }) {
  const posts = getPosts();
  const post = posts.find((post) => post.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PostDetail post={post} />
        <CommentSection postId={params.id} />
      </div>
    </MainLayout>
  );
}
