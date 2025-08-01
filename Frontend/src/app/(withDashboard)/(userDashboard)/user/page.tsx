"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Award,
  Edit,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  User,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUserCourses } from "@/hooks/user.hook";
import { TUserCourse } from "@/types/course";
import { useState } from "react";

const CourseCardSkeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <Skeleton className="h-40 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  </div>
);

const DashboardStats = ({ courses }: { courses: TUserCourse[] }) => {
  const completedCourses = courses.filter(
    (course) => course.progressPercentage === 100
  );
  const inProgressCourses = courses.filter(
    (course) => course.progressPercentage > 0 && course.progressPercentage < 100
  );
  const totalModules = courses.reduce(
    (sum, course) => sum + course.moduleCount,
    0
  );
  const completedModules = courses.reduce(
    (sum, course) => sum + course.completedModules,
    0
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
        <div className="text-sm text-blue-600">Total Courses</div>
      </div>

      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
        <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-green-600">
          {completedCourses.length}
        </div>
        <div className="text-sm text-green-600">Completed</div>
      </div>

      <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
        <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-orange-600">
          {inProgressCourses.length}
        </div>
        <div className="text-sm text-orange-600">In Progress</div>
      </div>

      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
        <PlayCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-purple-600">
          {completedModules}
        </div>
        <div className="text-sm text-purple-600">Modules Done</div>
      </div>
    </div>
  );
};

const CourseCard = ({ course }: { course: TUserCourse }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-40">
        {course.media?.thumbnail && !imageError ? (
          <Image
            src={course.media.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-blue-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant={
              course.progressPercentage === 100 ? "default" : "secondary"
            }
          >
            {Math.round(course.progressPercentage)}%
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          by {course.instructor?.name || "Unknown Instructor"}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {course.courseCategory}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {course.courseType}
          </Badge>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span className="font-medium">
              {Math.round(course.progressPercentage)}%
            </span>
          </div>
          <Progress value={course.progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {course.completedModules} of {course.moduleCount} modules completed
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/user/courses/${course._id}`} className="flex-1">
            <Button size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              {course.progressPercentage === 100 ? "Review" : "Continue"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const { user: authUser } = useAuth();

  const user = session?.user || authUser;

  const {
    data: coursesData,
    isLoading,
    error,
  } = useUserCourses(user?.id || "");

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout role="user">
        <div className="space-y-6 py-6">
          {/* Profile Section Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64 mb-4" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses Section Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Error loading dashboard
            </h3>
            <p className="text-muted-foreground mb-4">
              Unable to load your dashboard data. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const courses = coursesData?.courses || [];

  return (
    <DashboardLayout role="user">
      <div className="space-y-6 py-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || "Student"}! 👋
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and track your progress.
          </p>
        </div>

        {/* Stats Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Learning Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardStats courses={courses} />
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              My Profile
            </CardTitle>
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

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined{" "}
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Courses Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              My Courses ({courses.length})
            </CardTitle>
            <div className="flex gap-2">
              <Link href="/user/courses">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="sm">Browse More</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.slice(0, 3).map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>

                {courses.length > 3 && (
                  <div className="text-center mt-6">
                    <Link href="/user/courses">
                      <Button variant="outline">
                        View All {courses.length} Courses
                      </Button>
                    </Link>
                  </div>
                )}
              </>
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
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;