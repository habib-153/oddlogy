import axiosInstance from "@/lib/AxiosInstance";
import { TModule } from "@/types";

export async function getAllModules(): Promise<TModule[]> {
  const res = await axiosInstance.get("/modules");
  return res.data.data?.result || res.data.data || [];
}

export async function getModulesByCourse(courseId: string): Promise<TModule[]> {
  const res = await axiosInstance.get(`/modules/course/${courseId}`);
  return res.data.data?.result || res.data.data || [];
}

export async function getModuleById(id: string): Promise<TModule | null> {
  const res = await axiosInstance.get(`/modules/${id}`);
  return res.data.data || null;
}

export async function addModule(
  moduleData: Omit<TModule, "_id">
): Promise<TModule> {
  const res = await axiosInstance.post("/modules", moduleData);
  return res.data.data;
}

export async function updateModule(
  id: string,
  moduleData: Partial<Omit<TModule, "_id">>
): Promise<TModule> {
  const res = await axiosInstance.patch(`/modules/${id}`, moduleData);
  return res.data.data;
}

export async function deleteModule(id: string): Promise<void> {
  const res = await axiosInstance.delete(`/modules/${id}`);
  return res.data.data;
}