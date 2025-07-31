import DashboardLayout from "@/components/layouts/DashboardLayout";
import ClientProfilePage from "@/components/profile/EnhancedClientProfilePage";

export default function UserProfilePage() {
    return (
        <DashboardLayout role="user">
            <ClientProfilePage isAdmin={false} />
        </DashboardLayout>
    )
}
