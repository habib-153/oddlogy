import DashboardLayout from "@/components/layouts/DashboardLayout";
import ClientProfilePage from "@/components/profile/EnhancedClientProfilePage";

export default function AdminProfilePage() {
    return (
      <DashboardLayout role="admin">
        <ClientProfilePage isAdmin={true} />
      </DashboardLayout>
    );
}