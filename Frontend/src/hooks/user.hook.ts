
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { UserData } from "@/types/auth";
import { deleteUser, getAllUsers, getUserInfo, getUserStats, updateUser, updateUserInfo } from "@/utils/user";

export function useUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getAllUsers(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useUser(userId: string) {
  return useQuery<UserData | null, Error>({
    queryKey: ["user", userId],
    queryFn: () => getUserInfo(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}


export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserData>) => updateUserInfo(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
}

export function useUpdateUserOnAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<UserData> }) =>
      updateUser(id, userData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ["user-stats"],
    queryFn: getUserStats,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}