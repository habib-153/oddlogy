import axiosInstance from "@/lib/AxiosInstance";
import { TCourse } from "@/types/course";

export async function getAllCourses(category?: string): Promise<TCourse[]> {
  const url = category
    ? `/courses?courseCategory=${encodeURIComponent(category)}`:
     "/courses";
  const res = await axiosInstance.get(url);
  console.log(res)
  return res.data.data?.result || res.data.data || [];
}

export async function getCourseById(id: string): Promise<TCourse | null> {
  const url = `/courses/${id}`;
  const res = await axiosInstance.get(url);
  return res.data.data || null;
}
