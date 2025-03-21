import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updateChatFavourite } from "../services/supabaseFunctions";
import { toast } from "sonner";





const useAddChatFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({chatId ,userId , isFavourite }) => updateChatFavourite(chatId , isFavourite ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["user_chats", variables.userId]);

      

      toast.success(`Chat ${variables.isFavourite ? "added to" : "removed from"} favourites successfully.`, {
        duration: 4000, // Duration in milliseconds (optional)
        position: "top-center", // Position of the toast (optional)
      });
    },
    onError: (err) => {
      console.error("Error adding chat to favourites:", err.message);
    },
  });
};

export {useAddChatFavourite};
