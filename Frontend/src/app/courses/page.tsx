"use client"
import React from "react";
import { useCourses } from "@/hooks/useCourses";
import { TCourse, TCourseCategory } from "@/types/course";
import ProductGrid from "@/components/sections/ProductGrid";

const categories: TCourseCategory[] = [
    "HSC",
    "Admission",
    "Skill Development",
    "Others",
];

const CoursesPage = () => {
    const { data: courses = [], isLoading, error } = useCourses();

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error.message}</div>;
    console.log("Courses data:", courses);
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">All Courses</h1>
            {categories.map((cat) => {
                const filtered = courses.filter((c) => c.courseCategory === cat);
                if (!filtered.length) return null;
                // Adapt course data for ProductGrid
                const products = filtered.map((course) => ({
                    id: course._id || "",
                    imageUrl: course.media?.thumbnail || "",
                    title: course.title,
                    price: course.price ? `$${course.price}` : "Free",
                    rating: 5, // Placeholder
                }));
                return (
                    <ProductGrid
                        key={cat}
                        title={cat + " Courses"}
                        products={products}
                        viewAllLink={"/courses"}
                    />
                );
            })}
        </div>
    );
};

export default CoursesPage;