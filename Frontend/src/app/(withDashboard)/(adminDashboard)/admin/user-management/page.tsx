"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Edit,
  Trash2,
  Users,
  UserCheck,
  GraduationCap,
  User,
  Filter,
} from "lucide-react";
import { useDeleteUser, useUsers, useUserStats } from "@/hooks/user.hook";
import { UserData } from "@/types/auth";
import EditUserModal from "@/components/auth/EditUserModal";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;

  const { toast } = useToast();

  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const {
    data: usersData,
    isLoading: usersLoading,
    error,
  } = useUsers({
    page: currentPage,
    limit: pageLimit,
    search: searchTerm,
    role: selectedRole,
  });

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const users = usersData?.users || [];
  const meta = usersData?.meta || {};

  const roleOptions = [
    { value: "all", label: "All Roles", icon: Users, color: "text-gray-600" },
    { value: "USER", label: "Students", icon: User, color: "text-green-600" },
    {
      value: "INSTRUCTOR",
      label: "Instructors",
      icon: GraduationCap,
      color: "text-blue-600",
    },
    { value: "ADMIN", label: "Admins", icon: Filter, color: "text-red-600" },
  ];

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
      deleteUser(userId, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "User deleted successfully!",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Failed to delete user",
            variant: "destructive",
          });
        },
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      ADMIN:
        "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
      INSTRUCTOR:
        "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
      USER: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
    };

    const labels = {
      ADMIN: "Admin",
      INSTRUCTOR: "Instructor",
      USER: "Student",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${
          badges[role as keyof typeof badges]
        }`}
      >
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error loading users
            </h3>
            <p className="text-gray-500">
              {error.message || "Something went wrong"}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-blue-100">
            Manage all users, instructors, and administrators in your platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {statsLoading ? (
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  userStats?.totalUsers || 0
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">All registered users</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Users
              </CardTitle>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {statsLoading ? (
                  <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  userStats?.activeUsers || 0
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Instructors
              </CardTitle>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {statsLoading ? (
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  userStats?.instructors || 0
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Teaching staff</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Students
              </CardTitle>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {statsLoading ? (
                  <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  userStats?.students || 0
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Learning community</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white"
                />
              </div>

              {/* Modern Role Filter */}
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[180px] h-11 border-gray-200 rounded-xl bg-white hover:bg-gray-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 shadow-lg">
                    {roleOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 rounded-lg m-1"
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent
                              className={`w-4 h-4 ${option.color}`}
                            />
                            <span className="font-medium">{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-md">
          <CardHeader className="border-b border-gray-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">
                All Users ({meta.total || 0})
              </CardTitle>
              {searchTerm && (
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Filtered results
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {usersLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading users...</p>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm || selectedRole !== "all"
                    ? "Try adjusting your search criteria or filter settings to find what you're looking for."
                    : "No users have been registered yet. Users will appear here once they start signing up."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-gray-100">
                      <TableHead className="font-semibold text-gray-700">
                        User
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Email
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Role
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Joined
                      </TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-white shadow-sm">
                              <Image
                                src={
                                  user?.profilePhoto || user?.image ||
                                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                }
                                alt={user.name}
                                className="w-full h-full object-cover"
                                width={40}
                                height={40}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {user.name}
                              </p>
                              {user.isGoogleUser && (
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">
                                      G
                                    </span>
                                  </div>
                                  <span className="text-xs text-blue-600 font-medium">
                                    Google User
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-700 font-medium">
                            {user.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role as string)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${
                              user.isDeleted
                                ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
                                : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
                            }`}
                          >
                            {user.isDeleted ? "Inactive" : "Active"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 font-medium">
                            {user.createdAt
                              ? formatDate(user.createdAt)
                              : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(user._id!, user.name)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {meta.totalPage > 1 && (
              <div className="flex justify-between items-center p-6 border-t border-gray-100 bg-gray-50/50">
                <p className="text-sm text-gray-600 font-medium">
                  Showing {(currentPage - 1) * pageLimit + 1} to{" "}
                  {Math.min(currentPage * pageLimit, meta.total)} of{" "}
                  {meta.total} users
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(meta.totalPage, prev + 1)
                      )
                    }
                    disabled={currentPage === meta.totalPage}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg border-0 shadow-2xl">
          <DialogHeader className="border-b border-gray-100 pb-4">
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              Edit User Profile
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <EditUserModal
              user={selectedUser}
              onSuccess={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}