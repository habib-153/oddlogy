import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function InstructorDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["instructor"]}>
            <DashboardLayout role="instructor">
                {children}
            </DashboardLayout>
        </ProtectedRoute>
    );
}
