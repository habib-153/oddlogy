import axiosInstance from "@/lib/AxiosInstance";
import { TCourse } from "@/types/course";

export async function getAllCourses(category?: string): Promise<TCourse[]> {
  const url = category
    ? `/courses?courseCategory=${encodeURIComponent(category)}`:
     "/courses";
  const res = await axiosInstance.get(url);
  return res.data.data?.result || res.data.data || [];
}

export async function getCourseById(id: string): Promise<TCourse | null> {
  const url = `/courses/${id}`;
  const res = await axiosInstance.get(url);
  return res.data.data || null;
}

export async function addCourse(data: TCourse): Promise<TCourse> {
  const res = await axiosInstance.post('/courses', data);
  return res.data.data;
}

export async function updateCourse(id: string, data: TCourse): Promise<TCourse> {
  const res = await axiosInstance.patch(`/courses/${id}`, data);
  return res.data.data;
}

export async function deleteCourse(id: string): Promise<void> {
  const res = await axiosInstance.delete(`/courses/${id}`);
  return res.data.data;
}