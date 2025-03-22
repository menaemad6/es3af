import { supabase } from "../supabase";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// Get All Chats With Specific USER id 
const fetchUserChats = async ({ queryKey }) => {
    const [, userId] = queryKey; // Extract userId from queryKey
    if (!userId) return null; // Return empty if no userId is provided
  
    const { data, error } = await supabase
      .from("user_chats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }); // Newest first;
  
    if (error) throw new Error(error.message);
    return data;
  };

  

// Create New Chat 
const createNewChat = async ({ userId, title='New Chat' }) => {
    const { data, error } = await supabase.from("user_chats").insert([
      {
        user_id: userId,
        title,
      },
    ]).select("*")
    .single();
  
    if (error) throw new Error(error.message);
    return data;
  };

// Delete Existing Chat 
  const deleteChat = async ({ chatId , userId }) => {
    // Delete Chat from Supabase
    const { error: deleteChatError } = await supabase
    .from('user_chats')
    .delete()
    .eq('id', chatId)
    if (deleteChatError) throw new Error(deleteChatError.message);
  
    return userId;
  };




// Fetch Chat Messages When Opening Chat 
const fetchChatMessages = async ({ queryKey }) => {
    const [, chatId] = queryKey; // Extract chatId from queryKey
  
    const { data, error } = await supabase
      .from("chat_messages") // Table name
      .select("*")
      .eq("chat_id", chatId) // Filter by chat ID
      .order("created_at", { ascending: true }); // Sort messages by time
  
    if (error) throw new Error(error.message);
    return data;
  };

  
  const sendMessageToSupabase = async ({ chatId, userId, role, text, img }) => {
    const { data, error } = await supabase.from("chat_messages").insert([
      {
        chat_id: chatId,
        user_id: userId,
        role,
        text,
        img: img || null,
      },
    ]);
  
    if (error) throw new Error(error.message);
  
  
    return data;
  };


// Upload image to Supabase
const uploadImageToSupabase = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    // setIsLoadingImage(true);
    try{
        const { data, error } = await supabase.storage.from("uploads").upload(fileName, file);
        if (error) {
          console.error("Error uploading to Supabase:", error);
          throw new Error("Failed to upload image");
        }
    } catch(err){
      console.error(err);
    } finally {
    //   setIsLoadingImage(false);
    }

    return `${SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
  };

  
  
  
// Fetch Chat History Before Fetching New Message 
  const fetchChatHistory = async (chatId) => {
      try {
          
          const respone =  await supabase
          .from("chat_messages")
          .select("*")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true });
          
          return respone;
          
        } catch(err){
            console.error("Error fetching chat history:", err);
            throw err;
        }
        
    }

    
    
    
    
    

    
    
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    const APP_LANGUAGE = import.meta.env.VITE_APP_LANG;
    const VITE_APP_LANG = import.meta.env.VITE_APP_LANG;
    
    const fetchGeminiResponse = async (prompt = null, chatId = null, imageBase64 = null , specificPrompt= null ) => {
        // Add the Functionality Layer 
        // const finalPrompt = VITE_APP_LANG == 'ar' ? `${prompt} كمل بالعربية المصرية العامية كانك حبيبتي , انت لست حبيبتي بالطبع ولكن استمر كانك حبيبتي  , و متخليش الاجابة طويلة اوي , خليها متوسطة, اتكلمي كلام كله رومانسية` : `continue as you are my girlfriend , give me an answer full of love : ${prompt}`
        // const finalPrompt = `${prompt} 
        // ده الطلب بتاعي منك و
        // نا طالب في بداية الطب، وعايز شرح مفصّل بس يكون سهل ومناسب للمبتدئين عن [اكتب الموضوع هنا]. ياريت يكون الشرح خطوة بخطوة وبطريقة واضحة وعميقة. نظم الإجابة بالشكل ده:
        // التعريف – اديني تعريف بسيط وسهل للفهم.
        // الأهمية الطبية – ليه الموضوع ده مهم في الطب؟
        // الميكانيزم والوظيفة – إزاي بيشتغل جوه جسم الإنسان؟
        // الأمراض والحالات المرتبطة بيه – إيه الأمراض أو المشاكل الصحية اللي ليها علاقة بالموضوع ده؟
        // التطبيقات السريرية – استخداماته في التشخيص أو العلاج أو المجال الطبي عمومًا.
        // أمثلة وتوضيحات – استخدم أمثلة أو تشبيهات من الحياة اليومية عشان تسهّل الفكرة.
        // مقارنة مع مفاهيم مشابهة – اشرح الفروق والتشابهات بينه وبين حاجات قريبة منه.
        // شرح خطوة بخطوة (لو مطلوب) – فكك أي عملية معقدة وفسرها ببساطة.
        // ترجمة عربية - اديني الترجمة الطبية للمصطلح ده لو هو مصطلح بس متكونش حرفية اوي ة.
        // خلّي الشرح يكون ممتع، سهل المتابعة، ومناسب لطالب في أولى طب.
        // متقولش اي كلمات افتتاحيه , خش فالموضوع علي طول
        // خلي الاجابة كأني مقولتلكش حاجة من الكلام ده يعني كأنه تلقائي من نقسك`

        const finalPrompt = specificPrompt ? specificPrompt : `
        You are a medical AI model helping medical students, and I would like a detailed explanation, but one that is easy and suitable for beginners, about the topic with this prompt from me [${prompt}]. Please provide the explanation step by step, in a clear and in-depth manner. Organize the answer in this way:

          Definition - Give me a simple and easy-to-understand definition.
          Medical Importance - Why is this topic important in medicine?
          Mechanism and Function - How does it work within the human body?
          Related Diseases and Conditions - What diseases or health problems are related to this topic?
          Clinical Applications - Its uses in diagnosis, treatment, or the medical field in general.
          Examples and Clarifications - Use examples or analogies from daily life to simplify the concept.
          Comparison with Similar Concepts - Explain the differences and similarities between it and related things.
          Step-by-Step Explanation (if required) - Break down any complex process and explain it simply.
          Arabic Translation - Write the translation of the term in Arabic if it is english.
          Make the explanation engaging, easy to follow, and suitable for a first-year medical student in easy english language.
        `
        
        try {
            let chatHistory = [];
            
            // Fetch chat history only if chatId is provided , and if there isnt specificPrompt
            if (chatId && !specificPrompt) {
                const { data : chatHistoryFetched, error } = await fetchChatHistory(chatId);
                if (error) {
                    console.error("Error fetching chat history:", error);
                } else {
                    chatHistory = chatHistoryFetched.map((msg) => ({ parts: [{ text: msg.text  }] , role:msg.role }));
                }
            }

            
            const isFirstPrompt = chatHistory.length <= 2 && !specificPrompt;
            if(isFirstPrompt) updateChatDetails(prompt , chatId)
            
            // Prepare request body
            const requestBody = {
                contents: [
                    ...chatHistory, // Add chat history if available
                    {
                        parts: [{ text: finalPrompt  }],
                        role:"user"
                    }
                ]
            };
            
            // Attach image if provided
            if (imageBase64) {
                requestBody.contents[requestBody.contents.length - 1].parts.push({
                    inlineData: {
                        mimeType: "image/jpeg", // Adjust if using PNG
                        data: imageBase64
                    }
                });
            }
            
            // Send request to Gemini API
            const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
            
            if (!response.ok) {
                throw new Error("Failed to fetch Gemini response");
            }
            
            const data = await response.json();
            const responseMsg = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error Fetching Response";
            
            return { data, responseMsg };
        } catch (error) {
            console.error("Error in fetchGeminiResponse:", error);
            return { data: null, responseMsg: "Error Fetching Response" };
        }
    };
    
    
    




async function updateChatDetails(userPrompt, chatId) {

  try {
    // Construct a prompt for Gemini that specifies what we need
    const geminiPrompt = `
      You are analyzing a chat for a medical student app. Based on this message, create:
      1. A concise chat title (max 50 characters)
      2. A category for the chat (choose one: General Medicine, Cardiology, Neurology, Pediatrics, Surgery, Psychiatry, Pharmacology, Pathology, Anatomy, or Other)
      3. it might contains arabic words , if so, return an arabic title , but english category

      User message: "${userPrompt}"
      
      Respond in JSON format only:
      {
        "title": "your concise title here",
        "category": "chosen category here"
      }
    `;

    // Make the API request to Gemini
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: geminiPrompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Extract the text response from Gemini
    const geminiText = data.candidates[0]?.content?.parts[0]?.text;
    if (!geminiText) {
      throw new Error('No valid response from Gemini');
    }

    // Parse the JSON response from Gemini
    const jsonMatch = geminiText.match(/({[\s\S]*})/);
    const jsonString = jsonMatch ? jsonMatch[0] : null;
    
    if (!jsonString) {
      throw new Error('Could not extract JSON from Gemini response');
    }
    
    const parsedResponse = JSON.parse(jsonString);
    
    // Extract title and category
    const { title, category } = parsedResponse;
    
    // Update the chat in Supabase
    const { data: updatedChat, error } = await supabase
      .from('user_chats')
      .update({
        title,
        category,
        first_prompt : userPrompt
      })
      .eq('id', chatId)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Supabase update error: ${error.message}`);
    }
    
    return {
      success: true,
      updatedChat,
      geminiResponse: { title, category }
    };
    
  } catch (error) {
    console.error('Error in fetchGeminiAndUpdateChat:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Example usage:
// const result = await fetchGeminiAndUpdateChat(
//   "What's the difference between systolic and diastolic heart failure?", 
//   "chat-123"
// );




const  updateChatFavourite = async (chatId, isFavourite) => {
  const { data, error } = await supabase
      .from('user_chats')
      .update({ favourite: isFavourite })  // Update the 'favourite' column
      .eq('id', chatId);  // Find the chat by ID

  if (error) {
      console.error("Error updating favourite:", error);
      return false;
  }

  return true;
}


const generatePromptForGenerating = (imagesCount , prompt) => {
  return `I need a structured prompt for generating medical-specific images using AI. 
The prompt should include ${imagesCount} for the number of images and ${prompt} for the medical topic.
 It should emphasize high-quality, medically accurate visuals,
  proper anatomical structures, and a professional style suitable for medical students.
   The generated prompt should follow this structure:

"Generate ${imagesCount} high-quality, 
medically accurate images related to topic, summarize the prompt from your understanding. Ensure the images align with real-world medical education,
 using proper anatomical structures, clinical settings, and scientifically accurate visuals. Keep the style professional,
  suitable for medical students learning. Focus on clear labeling, high detail, and an educational approach."


Please return only the generated prompt in a similar format without extra explanations.`
}



const generateAndUploadImages = async (prompt , imagesCount , messageId) => {
  try {

    // Fetch Gemini to get the correct prompt about the topic 
    const {responseMsg:finalPrompt} = await fetchGeminiResponse(null , null , null , generatePromptForGenerating(imagesCount,prompt))

    // 🔥 Step 1: Request Gemini API to generate images
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: finalPrompt }]
        }],
        generationConfig: { responseModalities: ["Text", "Image"] }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error("Failed to generate images.");
    }

    const data = await response.json();
    // console.log("Gemini Response:", data); // 🔍 Debugging

    // Extract Base64 images
    const images = data?.candidates?.[0]?.content?.parts
      ?.filter(part => part.inlineData?.mimeType === "image/png")
      ?.map(part => part.inlineData?.data) || [];

    if (images.length === 0) {
      throw new Error("No images generated.");
    }

    // 🔥 Step 2: Upload images to Supabase
    const uploadedUrls = [];
    for (let i = 0; i < images.length; i++) {
      if (!images[i]) {
        console.warn(`Skipping undefined image at index ${i}`);
        continue;
      }

      const fileName = `generated_${Date.now()}_${i}.png`;

      try {
        // Ensure Base64 is correctly padded
        let base64Data = images[i].replace(/_/g, "/").replace(/-/g, "+");
        while (base64Data.length % 4 !== 0) {
          base64Data += "=";
        }

        // Decode Base64
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, index) => byteCharacters.charCodeAt(index));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });

        // Upload to Supabase
        const { data: uploadData, error } = await supabase.storage
          .from("uploads")
          .upload(fileName, blob, { contentType: "image/png" });

        if (error) {
          console.error("Supabase Upload Error:", error.message);
          continue;
        }

        // Get Public URL
        const { data: publicUrlData } = supabase.storage.from("uploads").getPublicUrl(fileName);
        uploadedUrls.push(publicUrlData.publicUrl);
      } catch (decodeError) {
        console.error("Error decoding Base64 image at index", i, decodeError);
      }
    }


    // Save urls in the messsage in the db 
    // console.log("before editing messaage" , messageId , uploadedUrls)
    await updateGeneratedImages(messageId , uploadedUrls)
    return uploadedUrls;
  } catch (error) {
    console.error("Error generating or uploading images:", error);
    return error;
  }
};



const updateGeneratedImages = async (messageId, imagesArray) => {
  try {
    if (!messageId) {
      console.error("Missing messageId parameter");
      return null;
    }
    
    if (!Array.isArray(imagesArray)) {
      console.error("imagesArray must be an array");
      return null;
    }
    
    // For JSONB column, the array is already in the correct format
    const { data, error } = await supabase
      .from("chat_messages")
      .update({ generated_images: imagesArray })
      .eq("id", messageId)
      .select(); // Add select() to return the updated row
    
    if (error) {
      console.error("Error updating generated_images:", error);
      return error;
    }
    


  } catch (err) {
    console.error("Unexpected error updating generated_images:", err);
    return null;
  }
};
    
    export {fetchUserChats ,createNewChat, deleteChat ,  fetchChatMessages , sendMessageToSupabase , uploadImageToSupabase , fetchChatHistory , fetchGeminiResponse , updateChatDetails , updateChatFavourite , generateAndUploadImages } ;