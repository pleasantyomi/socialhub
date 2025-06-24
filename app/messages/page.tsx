import type { Metadata } from "next";
import MainLayout from "@/components/layout/main-layout";
import MessageSidebar from "@/components/messages/message-sidebar";
import MessageThread from "@/components/messages/message-thread";

export const metadata: Metadata = {
  title: "Messages | unify",
  description: "Your conversations",
};

// export default function MessagesPage() {
//   // Dummy props to prevent build errors
//   const dummyConversationId = "demo-convo-id";
//   const dummyOtherUser = {
//     id: "demo-user-id",
//     full_name: "Demo User",
//     avatar_url: "/placeholder.svg",
//   };
//   return (
//     <MainLayout>
//       <div className="max-w-7xl mx-auto h-[calc(100vh-3.5rem)]">
//         <div className="grid grid-cols-1 md:grid-cols-4 h-full">
//           <div className="md:col-span-1 border-r">
//             <MessageSidebar />
//           </div>
//           <div className="md:col-span-3">
//             <MessageThread
//               conversationId={dummyConversationId}
//               otherUser={dummyOtherUser}
//             />
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }
// All messages routes are disabled in production except auth and feed.
