import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCourses, getCourseById,  deleteCourse, addCourseWithFiles, updateCourseWithFiles, enrollCourse, getAllEnrollments, updateEnrollmentStatus } from "@/utils/courses";
import { TCourse } from "@/types/course";
import { TEnrollment } from "@/types";

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
    mutationFn: addCourseWithFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      courseData,
    }: {
      id: string;
      courseData: Partial<TCourse> & { banner?: File; thumbnail?: File };
    }) => updateCourseWithFiles(id, courseData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", id] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", id] });
    },
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentData: any) => enrollCourse(enrollmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useEnrollments(status?: string) {
  return useQuery<TEnrollment[], Error>({
    queryKey: ["enrollments", status],
    queryFn: () => getAllEnrollments(status),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateEnrollment(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      enrollmentId,
      status,
      rejectionReason,
    }: {
      enrollmentId: string;
      status: "pending" | "approved" | "rejected";
      rejectionReason?: string;
    }) => updateEnrollmentStatus(enrollmentId, status, rejectionReason),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", status] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}