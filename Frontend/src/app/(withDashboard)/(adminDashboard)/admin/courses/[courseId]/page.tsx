"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useCourse } from "@/hooks/courses.hook";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  PlayCircle,
  DollarSign,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Image from "next/image";
import AddModuleModal from "@/components/modules/AddModuleModal";
import EditModuleModal from "@/components/modules/EditModuleModal";
import { useDeleteModule, useModules } from "@/hooks/modules.hook";

interface CourseDetailsPageProps {
  params: Promise<{ courseId: string }>;
}

export default function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const router = useRouter();
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showEditModuleModal, setShowEditModuleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const { courseId } = use(params);

  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: modules = [], isLoading: modulesLoading } = useModules(
    courseId
  );
  const { mutate: deleteModule } = useDeleteModule();

  const handleEditModule = (module: any) => {
    setSelectedModule(module);
    setShowEditModuleModal(true);
  };

  const handleDeleteModule = (moduleId: string) => {
    if (confirm("Are you sure you want to delete this module?")) {
      deleteModule(moduleId);
    }
  };

  if (courseLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout role="admin">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold">Course not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Course Details</h1>
            <p className="text-muted-foreground">
              Manage course information and modules
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
                  <p className="text-sm text-muted-foreground">
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
                  <Badge variant="outline">{course.courseStatus}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Instructor</p>
                  <p className="text-sm">
                    {course.instructor?.name || "Unknown"}
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
                    {course.moduleCount || 0}
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
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">
                    {modules.length}
                  </p>
                  <p className="text-sm text-orange-600">Active Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                Course Modules ({modules.length})
              </CardTitle>
              <Button
                onClick={() => setShowAddModuleModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Module
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {modulesLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : modules.length === 0 ? (
              <div className="text-center py-8">
                <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No modules yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start building your course by adding the first module
                </p>
                <Button onClick={() => setShowAddModuleModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Module
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module No</TableHead>
                      <TableHead>Module Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules
                      .sort((a, b) => a.module_number - b.module_number)
                      .map((module) => (
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
                                Video: {module.video_url ? "✓" : "✗"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm max-w-xs truncate">
                              {module.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditModule(module)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteModule(module._id as string)
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
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

      {/* Add Module Modal */}
      <Dialog open={showAddModuleModal} onOpenChange={setShowAddModuleModal}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              Add New Module
            </DialogTitle>
          </DialogHeader>
          <AddModuleModal
            courseId={courseId}
            onSuccess={() => setShowAddModuleModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Module Modal */}
      <Dialog open={showEditModuleModal} onOpenChange={setShowEditModuleModal}>
        <DialogContent className="max-w-2xl  overflow-y-auto max-h-[90vh]">
          {selectedModule && (
            <EditModuleModal
              module={selectedModule}
              onSuccess={() => {
                setShowEditModuleModal(false);
                setSelectedModule(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}