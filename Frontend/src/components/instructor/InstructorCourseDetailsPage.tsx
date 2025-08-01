"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Users,
  BookOpen,
  PlayCircle,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { TCourse } from "@/types/course";

interface InstructorCourseDetailsPageProps {
  course: TCourse;
  onBack: () => void;
}

export default function InstructorCourseDetailsPage({
  course,
  onBack,
}: InstructorCourseDetailsPageProps) {
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

  // Get modules from course data (if populated)
  const modules = course.modules || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Courses
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-brand-secondary">
            Course Details
          </h1>
          <p className="text-muted-foreground">
            Manage your course information and track progress
          </p>
        </div>
      </div>

      {/* Course Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Course Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                {course.media?.thumbnail ? (
                  <Image
                    src={course.media.thumbnail}
                    alt={course.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-medium">Category</p>
                <Badge variant="outline">{course.courseCategory}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Type</p>
                <Badge variant="secondary">{course.courseType}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                {getStatusBadge(course)}
              </div>
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm">
                  {course.createdAt
                    ? new Date(course.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Course Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {course.studentEnrolled || 0}
                </p>
                <p className="text-sm text-blue-600">Students Enrolled</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <PlayCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {course.moduleCount || modules.length || 0}
                </p>
                <p className="text-sm text-green-600">Total Modules</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {course.courseType === "free"
                    ? "Free"
                    : `৳${course.salePrice || course.price || 0}`}
                </p>
                <p className="text-sm text-purple-600">Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Course Modules ({modules.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modules.length === 0 ? (
            <div className="text-center py-8">
              <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No modules yet
              </h3>
              <p className="text-gray-500 mb-4">
                This course doesn&apos;t have any modules yet. Contact your
                administrator to add modules.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module No</TableHead>
                    <TableHead>Module Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Video</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules
                    .sort((a: any, b: any) => a.module_number - b.module_number)
                    .map((module: any) => (
                      <TableRow key={module._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {module.module_number}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{module.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Created{" "}
                              {module.createdAt
                                ? new Date(
                                    module.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm max-w-xs line-clamp-2">
                            {module.description}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={module.isCompleted ? "default" : "outline"}
                          >
                            {module.isCompleted ? "Completed" : "In Progress"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={module.video_url ? "default" : "secondary"}
                          >
                            {module.video_url ? "Available" : "Not Added"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Enrolled Students ({course.studentEnrolled || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {course.students && course.students.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.students.map((student: any) => (
                    <TableRow key={student._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            {student.profilePhoto ? (
                              <Image
                                src={student.profilePhoto}
                                alt={student.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                            ) : (
                              <span className="text-sm font-medium text-blue-600">
                                {student.name?.charAt(0) || "U"}
                              </span>
                            )}
                          </div>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {student.enrollmentDate
                          ? new Date(
                              student.enrollmentDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">In Progress</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No students enrolled yet
              </h3>
              <p className="text-gray-500">
                Students will appear here once they enroll in your course.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}