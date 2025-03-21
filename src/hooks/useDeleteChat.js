import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteChat } from "../services/supabaseFunctions";
import { toast } from "sonner";





const useDeleteChat = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({chatId , userId }) => deleteChat({ chatId , userId }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["user_chats", variables.userId]);
      toast.success("Chat deleted successfully.", {
        duration: 4000, // Duration in milliseconds (optional)
        position: "top-center", // Position of the toast (optional)
      });
    },
    onError: (err) => {
      console.error("Error deleting chat:", err.message);
    },
  });
};

export {useDeleteChat};
