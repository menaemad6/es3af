import { useQuery } from "@tanstack/react-query";
import { fetchUserChats } from "../services/supabaseFunctions";







export const useUserChats = (userId) => {
  return useQuery({
    queryKey: ["user_chats", userId], // Pass userId dynamically
    queryFn: fetchUserChats,
    enabled: !!userId, // Prevents query from running if userId is null/undefined
  });
};