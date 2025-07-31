"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { useInstructorCourses } from "@/hooks/instructor.hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Users, Clock, Calendar, Eye } from "lucide-react";
import Image from "next/image";

interface Course {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
    price: number;
    level: string;
    duration: number;
    studentsEnrolled?: number;
    category: {
        _id: string;
        name: string;
    };
    instructor: {
        _id: string;
        name: string;
        email: string;
    };
    isActive: boolean;
    createdAt: string;
}

const CourseSkeleton = () => (
    <Card className="overflow-hidden">
        <div className="aspect-video relative">
            <Skeleton className="w-full h-full" />
        </div>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
            </div>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
            </div>
        </CardContent>
    </Card>
);

const CourseCard = ({ course }: { course: Course }) => {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative bg-gray-100">
                {course.thumbnail ? (
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                )}
                {!course.isActive && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary">Inactive</Badge>
                    </div>
                )}
            </div>

            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                        <Badge variant="outline" className="mt-2">
                            {course.category.name}
                        </Badge>
                    </div>
                    <Badge variant={course.isActive ? "default" : "secondary"}>
                        {course.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {course.description}
                </p>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{course.studentsEnrolled || 0} students enrolled</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{course.duration} hours</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{course.level}</Badge>
                        <span className="font-semibold">${course.price}</span>
                    </div>
                    <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default function InstructorCoursesPage() {
    const { data: session } = useSession();
    const { user: authUser } = useAuth();

    // Use the instructor courses hook
    const { data: coursesData, isLoading, error } = useInstructorCourses();

    console.log("Instructor courses data:", {
        coursesData,
        isLoading,
        error,
        session: session?.user ? true : false,
        authUser: authUser ? true : false
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <CourseSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        console.error("Error fetching instructor courses:", error);
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-red-600">Error loading courses</h2>
                <p className="text-muted-foreground mt-2">
                    {error?.message || "Could not load your assigned courses"}
                </p>
                <div className="mt-4 p-4 border rounded bg-gray-50 max-w-lg mx-auto text-left">
                    <h3 className="font-medium">Debug information:</h3>
                    <pre className="text-xs mt-2 overflow-auto">
                        Error: {error?.message || "No error message"}<br />
                        Error Details: {JSON.stringify(error, null, 2)}<br />
                        Session: {session?.user ? "Available" : "Not available"}<br />
                        Auth User: {authUser ? "Available" : "Not available"}
                    </pre>
                </div>
            </div>
        );
    }

    const courses = coursesData?.courses || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Courses</h1>
                    <p className="text-muted-foreground">
                        Courses you are assigned as an instructor
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-sm">
                        Total: {courses.length}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                        Active: {courses.filter((course: Course) => course.isActive).length}
                    </Badge>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No courses assigned yet</h3>
                    <p className="text-muted-foreground">
                        You haven&apos;t been assigned to any courses as an instructor yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course: Course) => (
                        <CourseCard key={course._id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
}
