
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { UserData } from "@/types/auth";
import { getUserInfo, updateUserInfo } from "@/utils/user";


export function useUser(email: string) {
  return useQuery<UserData | null, Error>({
    queryKey: ["user", email],
    queryFn: () => getUserInfo(email),
    enabled: !!email,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}


export function useUpdateUser(email: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserData>) => updateUserInfo(email, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", email] });
    },
  });
}
