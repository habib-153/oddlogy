import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCourses, getCourseById, addCourse, updateCourse } from "@/utils/courses";
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

export function useAddCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TCourse) => updateCourse(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
}
