import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { SidebarClient } from "@/components/shared/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
