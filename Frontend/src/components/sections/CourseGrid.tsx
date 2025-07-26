"use client";

import { useCourses } from "@/hooks/courses.hook";
import ProductGrid from "./ProductGrid";
import { TCourse } from "@/types/course";

interface CourseGridProps {
  title: string;
  category?: string;
  limit?: number;
  courseType?: "free" | "paid";
  viewAllLink?: string;
}

export default function CourseGrid({
  title,
  category,
  limit = 4,
  courseType,
  viewAllLink,
}: CourseGridProps) {
  const { data: courses = [], isLoading } = useCourses();

  // Filter courses based on props
  const filteredCourses = courses
    .filter((course: TCourse) => {
      const matchesCategory = !category || course.courseCategory === category;
      const matchesType = !courseType || course.courseType === courseType;
      return matchesCategory && matchesType;
    })
    .slice(0, limit);

  // Map courses to product format
  const products = filteredCourses.map((course: TCourse) => ({
    id: course._id || "",
    imageUrl: course.media?.thumbnail || "",
    title: course.title,
    price: course.courseType === "free" ? "Free" : `$${course.price}`,
    description: course.description,
    category: course.courseCategory,
    status: course.courseStatus,
    studentsEnrolled: course.studentEnrolled,
    moduleCount: course.moduleCount,
  }));

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no courses match the filters
  if (filteredCourses.length === 0) {
    return null;
  }

  return (
    <ProductGrid
      title={title}
      products={products}
      viewAllLink={
        viewAllLink || `/courses${category ? `?category=${category}` : ""}`
      }
    />
  );
}
