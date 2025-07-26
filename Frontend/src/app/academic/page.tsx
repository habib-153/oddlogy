"use client";

import CourseList from "@/components/courses/CourseList";

export default function AcademicPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">HSC Courses</h1>
        <p className="text-muted-foreground">
          Excel in your HSC exams with our comprehensive course offerings
        </p>
      </div>
      <CourseList category="HSC" showHeader={false} />
    </div>
  );
}