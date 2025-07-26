"use client";

import { useState } from "react";
import { useCourses, useDeleteCourse } from "@/hooks/courses.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Eye, View } from "lucide-react";
import AddCourseModal from "@/components/courses/AddCourseModal";
import UpdateCourseModal from "@/components/courses/UpdateCourseModal";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { TCourse } from "@/types/course";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CourseManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<TCourse | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const router = useRouter();

  const { data: courses = [], isLoading, error } = useCourses();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course: TCourse) =>
      course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.courseCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (courseId: string) => {
    deleteCourse(courseId);
  };

  const handleEdit = (course: TCourse) => {
    setSelectedCourse(course);
    setShowUpdateModal(true);
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "not-started":
        return "outline";
      default:
        return "outline";
    }
  };

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">
            Error loading courses: {error.message}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Course Management</h1>
            <p className="text-muted-foreground">
              Manage all courses in your platform
            </p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Add New Course
                </DialogTitle>
              </DialogHeader>
              <AddCourseModal onSuccess={() => setShowAddModal(false)} />
            </DialogContent>
          </Dialog>
        </div>

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
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No courses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCourses.map((course: TCourse) => (
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
                                <div className="font-medium">
                                  {course.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {course.moduleCount} modules
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {typeof course.instructor === "object"
                                ? course?.instructor?.name
                                : "Unknown Instructor"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {course.courseCategory}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(course.courseType)}>
                              {course.courseType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(
                                course.courseStatus
                              )}
                            >
                              {course.courseStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{course.studentEnrolled || 0}</TableCell>
                          <TableCell>
                            {course.courseType === "paid" ? (
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
                            ) : (
                              <span className="text-green-600 font-medium">
                                Free
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(`/admin/courses/${course._id}`)
                                }
                                className="text-white bg-brand-secondary hover:bg-brand-secondary/90"
                              >
                                Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(course)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isDeleting}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Course
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete &quot;
                                      {course.title}&quot;? This action cannot
                                      be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(course._id!)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Course Modal */}
        <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Course</DialogTitle>
            </DialogHeader>
            {selectedCourse && (
              <UpdateCourseModal
                course={selectedCourse}
                onSuccess={() => {
                  setShowUpdateModal(false);
                  setSelectedCourse(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
