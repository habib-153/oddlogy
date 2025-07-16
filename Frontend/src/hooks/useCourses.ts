import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "@/utils/courses";
import { TCourse } from "@/types/course";

export function useCourses(category?: string) {
  return useQuery<TCourse[], Error>({
    queryKey: ["courses", category],
    queryFn: () => getAllCourses(category),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
