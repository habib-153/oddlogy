"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/hooks/profile.hook";
import { useInstructorCourses } from "@/hooks/instructor.hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BookOpen,
    Users,
    GraduationCap,
    TrendingUp,
    Calendar,
    Star,
    Eye,
    Edit,
    BarChart3,
    User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DashboardStats {
    totalCourses: number;
    activeCourses: number;
    totalStudents: number;
    avgRating: number;
}

const StatsCard = ({
    title,
    value,
    icon: Icon,
    description,
    trend
}: {
    title: string;
    value: string | number;
    icon: any;
    description: string;
    trend?: string;
}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">
                {description}
            </p>
            {trend && (
                <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">{trend}</span>
                </div>
            )}
        </CardContent>
    </Card>
);

const RecentCourseCard = ({ course }: { course: any }) => (
    <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
            <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {course.thumbnail ? (
                        <Image
                            src={course.thumbnail}
                            alt={course.title}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <BookOpen className="w-8 h-8 text-gray-400" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {course.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge
                            variant={course.isActive ? "default" : "secondary"}
                            className="text-xs"
                        >
                            {course.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {course.studentsEnrolled || 0} students
                        </span>
                    </div>
                </div>
                <Button size="sm" variant="ghost" asChild>
                    <Link href={`/instructor/courses`}>
                        <Eye className="w-4 h-4" />
                    </Link>
                </Button>
            </div>
        </CardContent>
    </Card>
);

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Recent Courses Skeleton */}
        <div className="grid gap-4 md:grid-cols-2">
            <div>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <div className="flex items-start space-x-4">
                                    <Skeleton className="w-16 h-16 rounded-lg" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-32 mb-1" />
                                        <Skeleton className="h-3 w-24 mb-2" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <Skeleton className="h-6 w-32 mb-4" />
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

export default function InstructorDashboardPage() {
    const { data: session } = useSession();
    const { user: authUser } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalCourses: 0,
        activeCourses: 0,
        totalStudents: 0,
        avgRating: 0
    });

    // Debug authentication state
    useEffect(() => {
        console.log("Instructor Dashboard - Auth Debug:", {
            session: session?.user,
            authUser: authUser,
            hasSession: !!session,
            hasAuthUser: !!authUser,
            sessionRole: session?.user?.role,
            authUserRole: authUser?.role
        });
    }, [session, authUser]);

    // Fetch profile and courses data
    const { data: profileData, isLoading: profileLoading, error: profileError } = useMyProfile();
    const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useInstructorCourses();

    const isLoading = profileLoading || coursesLoading;
    const courses = useMemo(() => coursesData?.courses || [], [coursesData?.courses]);

    // Check if user is properly authenticated
    const user = session?.user || authUser;
    const isAuthenticated = !!user;
    const isInstructor = user?.role?.toLowerCase() === 'instructor';

    // Log any errors for debugging
    useEffect(() => {
        if (profileError) {
            console.warn("Profile fetch error:", profileError);
        }
        if (coursesError) {
            console.warn("Courses fetch error:", coursesError);
        }
    }, [profileError, coursesError]);

    // Calculate dashboard statistics
    useEffect(() => {
        if (courses.length > 0) {
            const activeCourses = courses.filter((course: any) => course.isActive);
            const totalStudents = courses.reduce((sum: number, course: any) =>
                sum + (course.studentsEnrolled || 0), 0);

            setStats({
                totalCourses: courses.length,
                activeCourses: activeCourses.length,
                totalStudents,
                avgRating: 4.5 // This should be calculated from actual ratings
            });
        }
    }, [courses]);

    // Show authentication message if not properly authenticated
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-4">Please log in as an instructor to access this dashboard.</p>
                    <Button asChild>
                        <Link href="/login">Go to Login</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Show role verification message if not instructor
    if (!isInstructor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You need instructor privileges to access this dashboard.</p>
                    <p className="text-sm text-gray-500 mb-4">Current role: {user?.role || 'Unknown'}</p>
                    <Button asChild>
                        <Link href={`/${user?.role?.toLowerCase() || 'user'}`}>Go to Your Dashboard</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    const recentCourses = courses.slice(0, 3);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">
                    Welcome back, {profileData?.name || authUser?.name || 'Instructor'}!
                </h1>
                <p className="text-muted-foreground">
                    Here&apos;s an overview of your instructor dashboard
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    icon={BookOpen}
                    description="Courses you're teaching"
                    trend={stats.totalCourses > 0 ? "+2 this month" : undefined}
                />
                <StatsCard
                    title="Active Courses"
                    value={stats.activeCourses}
                    icon={GraduationCap}
                    description="Currently active courses"
                />
                <StatsCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={Users}
                    description="Students across all courses"
                    trend={stats.totalStudents > 0 ? "+12 this week" : undefined}
                />
                <StatsCard
                    title="Average Rating"
                    value={stats.avgRating}
                    icon={Star}
                    description="Student feedback rating"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Courses */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Recent Courses</h2>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/instructor/courses">
                                View All
                            </Link>
                        </Button>
                    </div>

                    {recentCourses.length > 0 ? (
                        <div className="space-y-3">
                            {recentCourses.map((course: any) => (
                                <RecentCourseCard key={course._id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-6 text-center">
                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <h3 className="font-medium mb-1">No courses yet</h3>
                                <p className="text-sm text-muted-foreground">
                                    You haven&apos;t been assigned to any courses yet
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Quick Actions & Profile Summary */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

                    {/* Profile Summary Card */}
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle className="text-lg">Profile Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                    {profileData?.profilePhoto ? (
                                        <Image
                                            src={profileData.profilePhoto}
                                            alt="Profile"
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <User className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">{profileData?.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {profileData?.designation || 'Instructor'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {profileData?.specialization || 'Subject Matter Expert'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Button className="w-full" variant="outline" asChild>
                                    <Link href="/instructor/profile">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Update Profile
                                    </Link>
                                </Button>
                                <Button className="w-full" variant="outline" asChild>
                                    <Link href="/instructor/courses">
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        Manage Courses
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">This Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">New Students</span>
                                    <Badge variant="outline">+12</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Course Completions</span>
                                    <Badge variant="outline">8</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Average Rating</span>
                                    <Badge variant="outline">4.2/5</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
