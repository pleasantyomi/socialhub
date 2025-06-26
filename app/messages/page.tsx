"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import MessageSidebar from "@/components/messages/message-sidebar";
import MessageThread from "@/components/messages/message-thread";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Demo conversation data
  const demoConversationId = "demo-convo-1";
  const demoOtherUser = {
    id: "demo-user-1",
    full_name: "Chioma Okafor",
    username: "chioma_tech",
    avatar_url: "/placeholder.svg",
  };

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth");
      return;
    }
    
    setLoading(false);
  }, [session, status, router]);

  if (loading || status === "loading") {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!session) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">Please sign in to access messages</p>
            <Button onClick={() => router.push('/auth')}>
              Sign In
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-3.5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-4 h-full">
          <div className="md:col-span-1 border-r">
            <MessageSidebar />
          </div>
          <div className="md:col-span-3">
            <MessageThread
              conversationId={demoConversationId}
              otherUser={demoOtherUser}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }
// All messages routes are disabled in production except auth and feed.
//all messages are disabled in profuction except auth and feed.
