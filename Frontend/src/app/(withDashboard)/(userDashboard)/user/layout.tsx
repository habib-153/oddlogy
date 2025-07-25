import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { SidebarClient } from "@/components/shared/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Oddology User Dashboard",
};

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="flex min-h-screen">
        <SidebarClient role="user" />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
