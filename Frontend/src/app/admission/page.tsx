"use client";

import CourseList from "@/components/courses/CourseList";

export default function AdmissionPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admission Courses</h1>
        <p className="text-muted-foreground">
          Prepare for your next academic journey with our specialized admission
          courses
        </p>
      </div>
      <CourseList category="Admission" showHeader={false} />
    </div>
  );
}