import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { generateAndUploadImages } from "../services/supabaseFunctions";
import { toast } from "sonner";





const useGenerateImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({userId , content , imagesCount , id }) =>  generateAndUploadImages(content , imagesCount , id),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["user_chats", variables.userId]);
      toast.success(`${data.length} Images generated successfully.`, {
        duration: 4000, // Duration in milliseconds (optional)
        position: "top-center", // Position of the toast (optional)
      });
    },
    onError: (err) => {
      toast.error("Error generating images.", {
        duration: 4000, // Duration in milliseconds (optional)
        position: "top-center", // Position of the toast (optional)
      });
      console.error("Error generating images:", err.message);
    },
  });
};

export {useGenerateImages};
