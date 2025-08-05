import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, upsertUserProfile } from "@/services/supabaseFunctions";

export const useUserProfile = (userId) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => upsertUserProfile(userData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({
        queryKey: ["userProfile", variables.user_id],
      });
    },
    onError: (error) => {
      console.error("Error updating user profile:", error);
    },
  });
}; 