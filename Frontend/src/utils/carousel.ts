import axiosInstance from "@/lib/AxiosInstance";
import { TCarouselImage } from "@/types";

export async function getAllCarouselImages(): Promise<TCarouselImage[]> {
  const response = await axiosInstance.get("/feature-image");
  return response.data.data || [];
}

export async function createCarouselImage(imageData: {
  name: string;
  image: File;
}): Promise<TCarouselImage> {
  const formData = new FormData();
  formData.append("name", imageData.name);
  formData.append("image", imageData.image);

  const response = await axiosInstance.post("/feature-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function deleteCarouselImage(id: string): Promise<void> {
  await axiosInstance.delete(`/feature-image/${id}`);
}