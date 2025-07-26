
import axiosInstance from "@/lib/AxiosInstance";
import { TUserStats, UserData } from "@/types/auth";
import { TCourse } from "@/types/course";

export async function getUserInfo(userId: string): Promise<UserData | null> {
  try {
    const res = await axiosInstance.get(`/users/${userId}`);
    console.log("User info response:", res.data);
    return res.data.data || null;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export async function updateUserInfo(userId: string, data: Partial<UserData>): Promise<UserData> {
  try {
    console.log("Updating user with ID:", userId);
    console.log("Update data:", data);
    
    // Use PUT method to match the backend route
    const res = await axiosInstance.put(`/users/${userId}`, data);
    console.log("Update response:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function getUserCourses(userId: string): Promise<TCourse[]> {
  const res = await axiosInstance.get(`/users/${userId}/courses`);
  return res.data.data || [];
}

export async function getAllUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<{ users: UserData[]; meta: any }> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.search) searchParams.append("searchTerm", params.search);
  if (params?.role && params.role !== "all")
    searchParams.append("role", params.role);

  const response = await axiosInstance.get(`/users?${searchParams.toString()}`);
  return {
    users: response.data.data || [],
    meta: response.data.meta || {},
  };
}

export async function getUserById(id: string): Promise<UserData> {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data.data;
}

export async function updateUser(
  id: string,
  userData: Partial<UserData>
): Promise<UserData> {
  const response = await axiosInstance.put(`/users/${id}`, userData);
  return response.data.data;
}

export async function deleteUser(id: string): Promise<void> {
  await axiosInstance.delete(`/users/${id}`);
}

export async function getUserStats(): Promise<TUserStats> {
  const { users } = await getAllUsers();

  return {
    totalUsers: users.length,
    activeUsers: users.filter((u) => !u.isDeleted).length,
    instructors: users.filter((u) => u.role === "INSTRUCTOR").length,
    students: users.filter((u) => u.role === "USER").length,
  };
}