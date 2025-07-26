"use client";

import { use } from "react";
import { useCourse } from "@/hooks/courses.hook";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen } from "lucide-react";
import Image from "next/image";
import CourseList from "@/components/courses/CourseList";

interface CourseDetailPageProps {
  params: Promise<{ courseId: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseId } = use(params);
  const { data: course, isLoading } = useCourse(courseId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg mb-8" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-8" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold">Course not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Course Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <Image
            src={
              course.media?.banner ||
              course.media?.thumbnail ||
              "/placeholder.jpg"
            }
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {course.courseCategory}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 mb-2" />
              <div className="text-xl font-bold text-blue-600">
                {course.studentEnrolled || 0}
              </div>
              <div className="text-sm text-blue-600">Students</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600 mb-2" />
              <div className="text-xl font-bold text-green-600">
                {course.moduleCount || 0}
              </div>
              <div className="text-sm text-green-600">Modules</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground">Course Type</span>
              <Badge
                variant={course.courseType === "free" ? "secondary" : "default"}
              >
                {course.courseType}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground">Price</span>
              <span className="font-semibold">
                {course.courseType === "free"
                  ? "Free"
                  : `$${course.salePrice || course.price || 0}`}
              </span>
            </div>
          </div>

          <Button className="w-full" size="lg">
            Enroll Now
          </Button>
        </div>
      </div>

      {/* Related Courses */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
        <CourseList
          category={course.courseCategory}
          limit={4}
          showHeader={false}
        />
      </div>
    </div>
  );
}