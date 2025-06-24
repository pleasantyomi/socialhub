import type { Metadata } from "next";
import MainLayout from "@/components/layout/main-layout";
import ProfileEditForm from "@/components/profile/profile-edit-form";

export const metadata: Metadata = {
  title: "Edit Profile | unify",
  description: "Edit your profile",
};

// export default function EditProfilePage() {
//   return (
//     <MainLayout>
//       <div className="max-w-3xl mx-auto px-4 py-6">
//         <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
//         <ProfileEditForm />
//       </div>
//     </MainLayout>
//   );
// }
// All profile edit routes are disabled in production except auth and feed.
