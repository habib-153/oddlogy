"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TCourseCategory } from "@/types/course";
import CourseList from "@/components/courses/CourseList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories: TCourseCategory[] = [
  "HSC",
  "Admission",
  "Skill Development",
  "Others",
];

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as TCourseCategory;
  const [selectedCategory, setSelectedCategory] = useState<
    TCourseCategory | "all"
  >(initialCategory || "all");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Our Courses</h1>
        <p className="text-muted-foreground">
          Find the perfect course to enhance your skills and knowledge
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as any)}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-2 md:flex md:flex-row gap-2">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <CourseList
        category={selectedCategory === "all" ? undefined : selectedCategory}
        showHeader={false}
      />
    </div>
  );
}