import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/AxiosInstance";
import { TCourse } from "@/types/course";

export type Instructor = {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
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
  return useQuery<{ courses: TCourse[], total?:number }, Error>({
    queryKey: ["instructor-courses"],
    queryFn: async () => {
      try {
        console.log("Fetching instructor courses...");
        const res = await axiosInstance.get("/instructors/my-courses");

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
