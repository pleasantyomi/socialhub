import type { Metadata } from "next";
import MainLayout from "@/components/layout/main-layout";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileTabs from "@/components/profile/profile-tabs";

export const metadata: Metadata = {
  title: "Profile | unify",
  description: "Your profile",
};

// export default function ProfilePage() {
//   return (
//     <MainLayout>
//       <div className="max-w-4xl mx-auto px-4 py-6">
//         <ProfileHeader />
//         <ProfileTabs />
//       </div>
//     </MainLayout>
//   );
// }
// All profile routes are disabled in production except auth and feed.
