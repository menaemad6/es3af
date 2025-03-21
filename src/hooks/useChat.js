import { useQuery } from "@tanstack/react-query";
import { fetchChatMessages } from "../services/supabaseFunctions";





const useChat = (chatId) => {
  return useQuery({
    queryKey: ["chat_messages", chatId], // Pass chatId as part of queryKey
    queryFn: fetchChatMessages,
    enabled: !!chatId, // Prevents running when chatId is null/undefined
    staleTime: 1000 * 60, // Cache for 1 min
  });
};

export  {useChat};