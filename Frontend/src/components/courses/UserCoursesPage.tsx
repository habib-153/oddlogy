"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCourses } from "@/hooks/user.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Play,
  User,
  Clock,
  CheckCircle,
  Calendar,
  Eye,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import { TUserCourse } from "@/types/course";
import UserCourseDetailsPage from "./UserCourseDetailsPage";

const CourseSkeleton = () => (
  <Card className="overflow-hidden animate-pulse">
    <div className="aspect-video relative bg-gray-200">
      <Skeleton className="w-full h-full" />
    </div>
    <CardHeader>
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-2 w-full" />
      </div>
    </CardContent>
  </Card>
);

const CourseCard = ({
  course,
  onViewDetails,
}: {
  course: TUserCourse;
  onViewDetails: (course: TUserCourse) => void;
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      onClick={() => onViewDetails(course)}
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02]"
    >
      <div className="aspect-video relative bg-gradient-to-br from-blue-50 to-purple-100 overflow-hidden">
        {course.media?.thumbnail && !imageError ? (
          <Image
            src={course.media.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <BookOpen className="w-16 h-16 text-blue-400" />
          </div>
        )}

        {/* Progress Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium">Progress</span>
              <span className="font-bold">
                {Math.round(course.progressPercentage)}%
              </span>
            </div>
            <Progress value={course.progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-3">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {course.description}
        </p>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-500" />
              <span className="text-muted-foreground">
                {course.moduleCount} modules
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">
                {course.completedModules} completed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="text-muted-foreground">
              Enrolled{" "}
              {new Date(
                course.enrollmentInfo?.enrollmentDate
              ).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">
                {Math.round(course.progressPercentage)}%
              </span>
            </div>
            <span className="text-sm text-muted-foreground">Complete</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function UserCoursesPage() {
  const { user } = useAuth();
  const {
    data: coursesData,
    isLoading,
    error,
  } = useUserCourses(user?.id || "");
  const [selectedCourse, setSelectedCourse] = useState<TUserCourse | null>(
    null
  );

  const handleViewDetails = (course: TUserCourse) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  // If a course is selected, show the details page
  if (selectedCourse) {
    return (
      <UserCourseDetailsPage
        course={selectedCourse}
        onBack={handleBackToCourses}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-32" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Error loading courses
        </h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Could not load your enrolled courses. Please try again later.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const courses = coursesData?.courses || [];
  const completedCourses = courses.filter(
    (course) => course.progressPercentage === 100
  );
  const inProgressCourses = courses.filter(
    (course) => course.progressPercentage > 0 && course.progressPercentage < 100
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Learning
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and continue learning
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="flex flex-wrap gap-4 lg:flex-nowrap">
          <Card className="flex-1 min-w-[140px]">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">
                  {coursesData?.total || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Total Courses</p>
            </CardContent>
          </Card>

          <Card className="flex-1 min-w-[140px]">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-2xl font-bold text-orange-600">
                  {inProgressCourses.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="w-16 h-16 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No courses enrolled yet
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Start your learning journey by enrolling in courses that interest
            you.
          </p>
          <Button>Browse Courses</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}