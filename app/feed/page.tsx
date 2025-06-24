"use client";

import MainLayout from "@/components/layout/main-layout";
import PostFeed from "@/components/post/post-feed";
import SidebarLeft from "@/components/layout/sidebar-left";
import SidebarRight from "@/components/layout/sidebar-right";

export default function FeedPage() {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-4">
        <div className="hidden md:block md:col-span-1">
          <SidebarLeft />
        </div>
        <div className="col-span-1 md:col-span-2">
          <PostFeed />
        </div>
        <div className="hidden md:block md:col-span-1">
          <SidebarRight />
        </div>
      </div>




      
    </MainLayout>
  );
}
