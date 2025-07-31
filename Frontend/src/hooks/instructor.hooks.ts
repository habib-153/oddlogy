import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/AxiosInstance";

export type Instructor = {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
};

export type InstructorCourse = {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  level: string;
  duration: number;
  studentsEnrolled?: number;
  category: {
    _id: string;
    name: string;
  };
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
};

export function useInstructors() {
  return useQuery<Instructor[], Error>({
    queryKey: ["instructors"],
    queryFn: async () => {
      const res = await axiosInstance.get("/instructors");
      return res.data.data || [];
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

export function useInstructorCourses() {
  return useQuery<{ courses: InstructorCourse[] }, Error>({
    queryKey: ["instructor-courses"],
    queryFn: async () => {
      try {
        console.log("Fetching instructor courses...");
        const res = await axiosInstance.get("/instructors/my-courses");
        console.log("Instructor courses response:", res.data);
        return res.data.data || { courses: [] };
      } catch (error: any) {
        console.error("Error fetching instructor courses:", error.message);
        // Return empty state instead of throwing
        return { courses: [] };
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once
  });
}
