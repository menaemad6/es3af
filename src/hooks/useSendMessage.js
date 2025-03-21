import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessageToSupabase } from "../services/supabaseFunctions";







const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessageToSupabase,
    onSuccess: (_ , variables) => {
      queryClient.invalidateQueries(["chat_messages", variables.chatId]);
    },
    onError: (err) => {
      console.error("Error sending message:", err);
    },



  });
};

export {useSendMessage};
