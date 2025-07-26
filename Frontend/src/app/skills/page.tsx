"use client";

import CourseList from "@/components/courses/CourseList";

export default function SkillsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Skill Development Courses</h1>
        <p className="text-muted-foreground">
          Enhance your professional skills with our industry-relevant courses
        </p>
      </div>
      <CourseList category="Skill Development" showHeader={false} />
    </div>
  );
}