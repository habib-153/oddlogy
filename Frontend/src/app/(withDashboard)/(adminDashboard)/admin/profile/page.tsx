import DashboardLayout from "@/components/layouts/DashboardLayout";
import NewProfilePage from "@/components/profile/NewProfilePage";

export default function AdminProfilePage() {
    return (
      <DashboardLayout role="admin">
        <NewProfilePage isAdmin={true} />
      </DashboardLayout>
    );
}