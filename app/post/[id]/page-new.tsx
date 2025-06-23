"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import PostDetail from "@/components/post/post-detail";
import { Loader2 } from "lucide-react";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const [postId, setPostId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);
      setLoading(false);
    }
    getParams();
  }, [params]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PostDetail postId={postId} />
      </div>
    </MainLayout>
  );
}
