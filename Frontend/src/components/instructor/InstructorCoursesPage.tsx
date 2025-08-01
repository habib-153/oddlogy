"use client";

import { useState } from "react";
import { useInstructorCourses } from "@/hooks/instructor.hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  Users,
  Eye,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import { TCourse } from "@/types/course";
import InstructorCourseDetailsPage from "./InstructorCourseDetailsPage";

const TableSkeleton = () => (
  <TableRow>
    {Array.from({ length: 7 }).map((_, i) => (
      <TableCell key={i}>
        <Skeleton className="h-8 w-full" />
      </TableCell>
    ))}
  </TableRow>
);

export default function InstructorCoursesPage() {
  const { data: coursesData, isLoading, error } = useInstructorCourses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<TCourse | null>(null);

  const courses = coursesData?.courses || [];

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course: TCourse) =>
      course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.courseCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = filteredCourses.reduce(
    (sum: number, course: TCourse) => sum + (course.studentEnrolled || 0),
    0
  );

  const getStatusBadge = (course: TCourse) => {
    if (course.isDeleted) {
      return (
        <Badge variant="destructive" className="text-xs">
          <XCircle className="w-3 h-3 mr-1" />
          Deleted
        </Badge>
      );
    }

    switch (course.courseStatus) {
      case "completed":
        return (
          <Badge variant="default" className="text-xs bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="secondary" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "not-started":
        return (
          <Badge variant="outline" className="text-xs">
            <PlayCircle className="w-3 h-3 mr-1" />
            Not Started
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Unknown
          </Badge>
        );
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "free":
        return "secondary";
      case "paid":
        return "default";
      default:
        return "outline";
    }
  };

  const handleViewDetails = (course: TCourse) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  // If a course is selected, show the details page
  if (selectedCourse) {
    return (
      <InstructorCourseDetailsPage
        course={selectedCourse}
        onBack={handleBackToCourses}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-32" />
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableSkeleton key={index} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching instructor courses:", error);
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Error loading courses
        </h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {error?.message ||
            "Could not load your assigned courses. Please try again later."}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-4">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-brand-secondary">
            My Courses
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage and track your assigned courses as an instructor
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
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-2xl font-bold text-purple-600">
                  {totalStudents}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Courses ({filteredCourses.length})</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-16 h-16 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm ? "No courses found" : "No courses assigned yet"}
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "You haven't been assigned to any courses as an instructor yet. Contact your administrator to get started."}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course: TCourse) => (
                    <TableRow key={course._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            {course.media?.thumbnail ? (
                              <Image
                                src={course.media.thumbnail}
                                alt={course.title}
                                className="size-10 rounded-lg object-cover"
                                width={40}
                                height={40}
                              />
                            ) : (
                              <span className="text-xs font-medium">
                                {course.title.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {course.moduleCount ||
                                course.modules?.length ||
                                0}{" "}
                              modules
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.courseCategory}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(course.courseType)}>
                          {course.courseType}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(course)}</TableCell>
                      <TableCell>{course.studentEnrolled || 0}</TableCell>
                      <TableCell>
                        {course.courseType === "free" ? (
                          <span className="text-green-600 font-medium">
                            Free
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-medium">
                              ৳{course.salePrice || course.price || 0}
                            </span>
                            {course.salePrice &&
                              course.price &&
                              course.salePrice !== course.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ৳{course.price}
                                </span>
                              )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(course)}
                          className="text-white bg-brand-secondary hover:bg-brand-secondary/90"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}