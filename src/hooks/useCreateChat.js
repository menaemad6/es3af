import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {useSendMessage} from "./useSendMessage";
import {useGemini} from "./useGemini";
import { createNewChat } from "../services/supabaseFunctions";
import { toast } from "sonner";






const useCreateChat = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {mutate:sendMessage } = useSendMessage();
  const {mutate:fetchGemini , isPending:isFetchingGemini} = useGemini();
  
  
  return useMutation({
    mutationFn: createNewChat,
    onSuccess: ({id:chatId} , variables) => {
      queryClient.invalidateQueries(["user-chats", chatId]);
      
      const isNewChat = variables.title.split(" ")[0] === "New";

      if(isNewChat){
        // Send Default Message 
        sendMessage({
          chatId,
          userId: 1,
          role: "model", // or "model"
          text: "Welcome To Essaf, How Can I Help You ?",
          img: null, // or an image URL
        });
      } else{
        // After Creating The Chat Object , Send User Message 
        sendMessage({
          chatId,
          userId: variables.userId,
          role: "user", // or "model"
          text: variables.title,
          img: variables.img, // or an image URL
        });
        // Fetch Gemini Response 
        fetchGemini({prompt:variables.title , chatId , imageBase64:variables.imageBase64})
      }


      setTimeout(() => 
        {navigate(`/chat/${chatId}`);}
      , 500)

      toast.success("Chat created successfully.", {
        duration: 4000, // Duration in milliseconds (optional)
        position: "top-center", // Position of the toast (optional)
      });
    },
    onError: (err) => {
      console.error("Error creating new chat:", err.message);
    },
  });
};

export  {useCreateChat};
