import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DynamicSidebar } from "@/components/shared/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Oddology User Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allowedRoles={["user"]}>{children}</ProtectedRoute>;
}
