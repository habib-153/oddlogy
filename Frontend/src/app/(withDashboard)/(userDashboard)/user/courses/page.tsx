import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

import { getUserCourses } from "@/utils/user";
import { TCourse } from "@/types/course";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const UserCoursesPage = async () => {
  const session = await getServerSession(authOptions);
  let courses: TCourse[] = [];
  // Use role instead of type for user check
  const user = session?.user;
  if (
    user &&
    (user.role === "user" || user.role === "instructor") &&
    typeof user.email === "string"
  ) {
    courses = await getUserCourses(user.email);
  }
  return (
    <DashboardLayout role="user">
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">
          My Enrolled Courses
        </h2>
        {courses.length > 0 ? (
          <ul className="space-y-4">
            {courses.map((course) => (
              <li key={course._id} className="p-4 border rounded">
                <div className="font-semibold text-lg">{course.title}</div>
                <div className="text-gray-600">{course.description}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500">
            You have not enrolled in any courses yet.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserCoursesPage;
