import DashboardLayout from "@/components/layouts/DashboardLayout";
import NewProfilePage from "@/components/profile/NewProfilePage";

export default function UserProfilePage() {
    return (
        <DashboardLayout role="user">
            <NewProfilePage isAdmin={false} />
        </DashboardLayout>
    )
}
