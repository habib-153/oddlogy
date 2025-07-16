import { useQuery } from "@tanstack/react-query";
import { getAllCourses, getCourseById } from "@/utils/courses";
import { TCourse } from "@/types/course";

export function useCourses(category?: string) {
  return useQuery<TCourse[], Error>({
    queryKey: ["courses", category],
    queryFn: () => getAllCourses(category),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useCourse(courseId: string) {
  return useQuery<TCourse | null, Error>({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
