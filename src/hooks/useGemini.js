import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "../supabase"; 

import {useSendMessage} from "./useSendMessage";
import { fetchGeminiResponse } from "../services/supabaseFunctions";


// const sendMessageToSupabase = async ({ chatId, userId, role, text, img }) => {

//   const {data:geminiData , geminiRespone} = await fetchGeminiResponse(text);
//   if(geminiData.error) throw new Error(geminiData.error.message);

//   const { data, error } = await supabase.from("chat_messages").insert([
//     {
//       chat_id: chatId,
//       user_id: userId,
//       role,
//       text,
//       img: img || null,
//     },
//   ]);

//   if (error) throw new Error(error.message);

//   await fetchGeminiResponse(text);

//   return data;
// };




const useGemini = () => {

  const queryClient = useQueryClient();
  const {mutate:sendMessage , isPending:isSendingMessage} = useSendMessage();


  return useMutation({
    mutationFn: ({prompt , imageBase64 , chatId  }) => fetchGeminiResponse(prompt , chatId , imageBase64 ),
    onSuccess: (dataFromFetch, variables) => {
        queryClient.invalidateQueries(["geminiResponse" , Math.random()]);

        // Save Response to Database
        sendMessage({
            chatId : variables.chatId,
            userId : 1,
            role: "model",
            text: dataFromFetch.responseMsg,
            img: null, // or an image URL
        });

        
      },
      onError: (err) => {
        console.error("Error sending message:", err.message);
      },
  });
  
//   useQuery({
//     queryKey: ["geminiResponse", prompt],
//     queryFn: () => fetchGeminiResponse(prompt),
//     enabled: false,
//     onSuccess: (_, variables) => {
//         queryClient.invalidateQueries(["geminiResponse", variables.prompt]);
//       },
//       onError: (err) => {
//         console.error("Error sending message:", err.message);
//       },
//   });
};

export {useGemini};
