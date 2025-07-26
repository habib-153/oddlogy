import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserData } from "@/types/auth";
import { getMyProfile, updateMyProfile, ProfileUpdateData } from "@/utils/profile";

export function useMyProfile() {
  return useQuery<UserData | null, Error>({
    queryKey: ["my-profile"],
    queryFn: () => getMyProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProfileUpdateData) => updateMyProfile(data),
    onSuccess: (data) => {
      // Update the cached profile data
      queryClient.setQueryData(["my-profile"], data);
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });
}
