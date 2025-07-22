
import axiosInstance from "@/lib/AxiosInstance";
import { UserData } from "@/types/auth";
import { TCourse } from "@/types/course";

export async function getUserInfo(email: string): Promise<UserData | null> {
  const res = await axiosInstance.get(`/users/${encodeURIComponent(email)}`);
  return res.data.data || null;
}

export async function updateUserInfo(email: string, data: Partial<UserData>): Promise<UserData> {
  const res = await axiosInstance.patch(`/users/${encodeURIComponent(email)}`, data);
  return res.data.data;
}

export async function getUserCourses(email: string): Promise<TCourse[]> {
  const res = await axiosInstance.get(`/users/${encodeURIComponent(email)}/courses`);
  return res.data.data || [];
}
