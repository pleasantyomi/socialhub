import type { Metadata } from "next";
import MainLayout from "@/components/layout/main-layout";
import NotificationList from "@/components/notifications/notification-list";
import NotificationFilters from "@/components/notifications/notification-filters";

export const metadata: Metadata = {
  title: "Notifications | unify",
  description: "Your notifications",
};

export default function NotificationsPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <NotificationFilters />
        </div>
        <NotificationList />
      </div>
    </MainLayout>
  );
}
