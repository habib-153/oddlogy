// Update: src/hooks/modules.hook.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllModules,
  getModulesByCourse,
  getModuleById,
  addModule,
  updateModule,
  deleteModule,
} from "@/utils/modules";
import { TModule } from "@/types";

export function useModules(courseId?: string) {
  return useQuery({
    queryKey: courseId ? ["modules", courseId] : ["modules"],
    queryFn: () => (courseId ? getModulesByCourse(courseId) : getAllModules()),
    enabled: true,
  });
}

export function useModule(moduleId: string) {
  return useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => getModuleById(moduleId),
    enabled: !!moduleId,
  });
}

export function useAddModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moduleData: Omit<TModule, "_id">) => addModule(moduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<TModule, "_id">>;
    }) => updateModule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["module"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moduleId: string) => deleteModule(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}