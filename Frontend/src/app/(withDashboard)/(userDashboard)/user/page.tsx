"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Users, Award, Edit, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getUserCourses } from "@/utils/user";
import { useEffect, useState } from "react";
const DashboardPage = () => {
  const { data: session, status } = useSession();
  const { user: authUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = session?.user || authUser;

  useEffect(() => {
    const fetchCourses = async () => {
      if (user?.email) {
        try {
          const courses = await getUserCourses(user.email as string);
          setEnrolledCourses(courses);
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourses();
  }, [user?.email]);

  if (status === "loading" || loading) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6 py-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={
                      (user as any)?.profilePhoto ||
                      user?.image ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }
                    alt={user?.name || ""}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Link href="/user/profile">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {user?.name || "Student"}
                </h2>
                <p className="text-muted-foreground mb-4">{user?.email}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-blue-600">
                      {enrolledCourses.length}
                    </div>
                    <div className="text-sm text-blue-600">
                      Enrolled Courses
                    </div>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-green-600">
                      {
                        enrolledCourses.filter(
                          (course) => course.progress === 100
                        ).length
                      }
                    </div>
                    <div className="text-sm text-green-600">Completed</div>
                  </div>

                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Courses Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Courses ({enrolledCourses.length})</CardTitle>
            <Link href="/courses">
              <Button variant="outline">Browse More Courses</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.slice(0,3).map((course) => (
                  <div
                    key={course.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-40">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            course.progress === 100 ? "default" : "secondary"
                          }
                        >
                          {course.progress}%
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {course.instructor}
                      </p>
                      <Badge variant="outline" className="mb-3">
                        {course.category}
                      </Badge>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/courses/${course.id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            {course.progress === 100 ? "Review" : "Continue"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No courses enrolled yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by enrolling in a course
                </p>
                <Link href="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/courses">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center p-6">
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Browse Courses</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/user/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center p-6">
                <Edit className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Edit Profile</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/user">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center p-6">
                <Award className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Certificates</span>
              </CardContent>
            </Card>
          </Link>

          {/* <Link href="/support">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center p-6">
                <Users className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Support</span>
              </CardContent>
            </Card>
          </Link> */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;