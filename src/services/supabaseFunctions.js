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
    
    const fetchGeminiResponse = async (prompt, chatId, imageBase64 = null) => {
        // Add the Functionality Layer 
        // const finalPrompt = VITE_APP_LANG == 'ar' ? `${prompt} كمل بالعربية المصرية العامية كانك حبيبتي , انت لست حبيبتي بالطبع ولكن استمر كانك حبيبتي  , و متخليش الاجابة طويلة اوي , خليها متوسطة, اتكلمي كلام كله رومانسية` : `continue as you are my girlfriend , give me an answer full of love : ${prompt}`
        const finalPrompt = `${prompt} 
        ده الطلب بتاعي منك و
        نا طالب في بداية الطب، وعايز شرح مفصّل بس يكون سهل ومناسب للمبتدئين عن [اكتب الموضوع هنا]. ياريت يكون الشرح خطوة بخطوة وبطريقة واضحة وعميقة. نظم الإجابة بالشكل ده:
        التعريف – اديني تعريف بسيط وسهل للفهم.
        الأهمية الطبية – ليه الموضوع ده مهم في الطب؟
        الميكانيزم والوظيفة – إزاي بيشتغل جوه جسم الإنسان؟
        الأمراض والحالات المرتبطة بيه – إيه الأمراض أو المشاكل الصحية اللي ليها علاقة بالموضوع ده؟
        التطبيقات السريرية – استخداماته في التشخيص أو العلاج أو المجال الطبي عمومًا.
        أمثلة وتوضيحات – استخدم أمثلة أو تشبيهات من الحياة اليومية عشان تسهّل الفكرة.
        مقارنة مع مفاهيم مشابهة – اشرح الفروق والتشابهات بينه وبين حاجات قريبة منه.
        شرح خطوة بخطوة (لو مطلوب) – فكك أي عملية معقدة وفسرها ببساطة.
        ترجمة عربية - اديني الترجمة الطبية للمصطلح ده لو هو مصطلح بس متكونش حرفية اوي ة.
        خلّي الشرح يكون ممتع، سهل المتابعة، ومناسب لطالب في أولى طب.
        متقولش اي كلمات افتتاحيه , خش فالموضوع علي طول
        خلي الاجابة كأني مقولتلكش حاجة من الكلام ده يعني كأنه تلقائي من نقسك`
        
        try {
            let chatHistory = [];
            
            // Fetch chat history only if chatId is provided
            if (chatId) {
                const { data : chatHistoryFetched, error } = await fetchChatHistory(chatId);
                if (error) {
                    console.error("Error fetching chat history:", error);
                } else {
                    chatHistory = chatHistoryFetched.map((msg) => ({ parts: [{ text: msg.text  }] , role:msg.role }));
                }
            }
            
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
    
    
    
    
    export {fetchUserChats ,createNewChat, deleteChat ,  fetchChatMessages , sendMessageToSupabase , uploadImageToSupabase , fetchChatHistory , fetchGeminiResponse } ;