"use client";

import { useCourses } from "@/hooks/courses.hook";
import { TCourseCategory } from "@/types/course";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
} from "../ui/card";
import Link from "next/link";
import CourseCard from "./CourseCard";

interface CourseListProps {
  category?: TCourseCategory;
  limit?: number;
  showHeader?: boolean;
}

export default function CourseList({
  category,
  limit,
  showHeader = true,
}: CourseListProps) {
  const { data: courses = [], isLoading } = useCourses(category);

  const filteredCourses = category
    ? courses.filter((course) => course.courseCategory === category)
    : courses;

  const displayCourses = limit
    ? filteredCourses.slice(0, limit)
    : filteredCourses;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!filteredCourses.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No courses found</h3>
        <p className="text-muted-foreground">
          Check back later for new courses in this category
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showHeader && category && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{category} Courses</h2>
          <Link href={`/courses?category=${category}`}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayCourses.map((course) => (
          <Link href={`/courses/${course._id}`} key={course._id}>
            <CourseCard course={course} />
          </Link>
        ))}
      </div>
    </div>
  );
}
