
import axiosInstance from "@/lib/AxiosInstance";
import { UserData } from "@/types/auth";
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
