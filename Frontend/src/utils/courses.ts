import axiosInstance from "@/lib/AxiosInstance";
import { TEnrollment } from "@/types";
import { TCourse } from "@/types/course";

export async function getAllCourses(category?: string): Promise<TCourse[]> {
  const url = category
    ? `/courses?courseCategory=${encodeURIComponent(category)}`
    : "/courses";
  const res = await axiosInstance.get(url);
  return res.data.data?.result || res.data.data || [];
}

export async function getCourseById(id: string): Promise<TCourse | null> {
  const url = `/courses/${id}`;
  const res = await axiosInstance.get(url);
  return res.data.data || null;
}

export async function addCourseWithFiles(
  courseData: TCourse & { banner?: File; thumbnail?: File }
): Promise<TCourse> {
  const formData = new FormData();

  // Append all course data
  Object.entries(courseData).forEach(([key, value]) => {
    if (key === "banner" || key === "thumbnail") {
      if (value instanceof File) {
        formData.append(key, value);
      }
    } else if (key === "media") {
      // Handle media object (for intro_video URL)
      if (value && typeof value === "object") {
        Object.entries(value).forEach(([mediaKey, mediaValue]) => {
          if (mediaKey !== "banner" && mediaKey !== "thumbnail" && mediaValue) {
            formData.append(`media.${mediaKey}`, mediaValue as string);
          }
        });
      }
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  const response = await axiosInstance.post("/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function updateCourseWithFiles(
  id: string,
  courseData: Partial<TCourse> & { banner?: File; thumbnail?: File }
): Promise<TCourse> {
  const formData = new FormData();

  // Append all course data
  Object.entries(courseData).forEach(([key, value]) => {
    if (key === "banner" || key === "thumbnail") {
      if (value instanceof File) {
        formData.append(key, value);
      }
    } else if (key === "media") {
      // Handle media object (for intro_video URL)
      if (value && typeof value === "object") {
        Object.entries(value).forEach(([mediaKey, mediaValue]) => {
          if (mediaKey !== "banner" && mediaKey !== "thumbnail" && mediaValue) {
            formData.append(`media.${mediaKey}`, mediaValue as string);
          }
        });
      }
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  const response = await axiosInstance.patch(`/courses/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function deleteCourse(id: string): Promise<void> {
  const res = await axiosInstance.delete(`/courses/${id}`);
  return res.data.data;
}

export async function enrollCourse(enrollmentData: any): Promise<void> {
  const response = await axiosInstance.post("/enrollments", enrollmentData);
  return response.data;
}

export async function getAllEnrollments(status?: string): Promise<TEnrollment[]> {
  const url = status
    ? `/enrollments?status=${encodeURIComponent(status)}`
    : "/enrollments";
  const res = await axiosInstance.get(url);
  return res.data.data?.result || res.data.data || [];
}

export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: "pending" | "approved" | "rejected",
  rejectionReason?: string
): Promise<TEnrollment> {
  const response = await axiosInstance.patch(`/enrollments/${enrollmentId}/status`, {
    status,
    rejectionReason,
  });
  return response.data.data;
}
