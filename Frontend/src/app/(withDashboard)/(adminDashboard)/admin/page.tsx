"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, BookOpen, DollarSign } from "lucide-react";
import { useCourses } from "@/hooks/courses.hook";
import Link from "next/link";
import { useUserStats } from "@/hooks/user.hook";

export default function AdminDashboard() {
  const { data: userStats, isLoading: userStatsLoading } = useUserStats();
  const { data: courses = [], isLoading: coursesLoading } = useCourses();

  const statsCards = [
    {
      title: "Total Users",
      value: userStatsLoading
        ? "..."
        : userStats?.totalUsers?.toString() || "0",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      href: "/admin/user-management",
    },
    {
      title: "Total Courses",
      value: coursesLoading ? "..." : courses.length.toString(),
      change: "+8%",
      icon: BookOpen,
      color: "text-green-600",
      href: "/admin/courses",
    },
    {
      title: "Instructors",
      value: userStatsLoading
        ? "..."
        : userStats?.instructors?.toString() || "0",
      change: "+5%",
      icon: BarChart3,
      color: "text-purple-600",
      href: "/admin/user-management",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your platform.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> from
                      last month
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Additional Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-muted-foreground">
                      2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Course published</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/admin/courses">
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded-md">
                    Add New Course
                  </button>
                </Link>
                <Link href="/admin/user-management">
                  <button className="w-full text-left p-2 hover:bg-gray-100 rounded-md">
                    Manage Users
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}