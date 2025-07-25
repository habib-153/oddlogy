
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { UserData } from "@/types/auth";
import { getUserInfo, updateUserInfo } from "@/utils/user";


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
