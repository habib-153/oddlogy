import UserCoursesPage from "@/components/courses/UserCoursesPage";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function UserCourses() {
  return (
    <DashboardLayout role="user">
      <UserCoursesPage />
    </DashboardLayout>
  );
}
