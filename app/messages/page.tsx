import type { Metadata } from "next";
import MainLayout from "@/components/layout/main-layout";
import MessageSidebar from "@/components/messages/message-sidebar";
import MessageThread from "@/components/messages/message-thread";

export const metadata: Metadata = {
  title: "Messages | SocialHub",
  description: "Your conversations",
};

export default function MessagesPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-3.5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-4 h-full">
          <div className="md:col-span-1 border-r">
            <MessageSidebar />
          </div>
          <div className="md:col-span-3">
            <MessageThread />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
