import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Send, 
  Paperclip, 
  Share, 
  Trash2, 
  DownloadCloud,
  Info,
  PlusCircle,
  Heart,
  Loader2,
  X,
  Menu,
  HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatMessage from "@/components/ui-custom/ChatMessage";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header"

import { useAuth, useUser } from "@clerk/clerk-react";

import { useChat } from "@/hooks/useChat"
import { useUserChats } from "@/hooks/useUserChats"
import { useDeleteChat } from "@/hooks/useDeleteChat"
import { useSendMessage } from "@/hooks/useSendMessage"
import { useGemini } from "@/hooks/useGemini"
import { useAddChatFavourite } from "@/hooks/useAddChatFavourite"



import {uploadImageToSupabase } from "@/services/supabaseFunctions.js"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { toast } from "sonner";

import ImageUpload from "@/components/ui-custom/imageUpload"

// Sample conversation data
// const sampleConversation = [
//   {
//     id: "1",
//     content: "Hello! I'm Es3af, your AI medical assistant. How can I help you today?",
//     isUser: false,
//     timestamp: "12:01 PM",
//   },
//   {
//     id: "2",
//     content: "Can you explain the pathophysiology of myocardial infarction?",
//     isUser: true,
//     timestamp: "12:02 PM",
//   },
//   {
//     id: "3",
//     content: 
//       "Myocardial infarction (MI), commonly known as a heart attack, occurs when blood flow to a part of the heart is blocked, causing damage to the heart muscle.\n\nPathophysiology:\n1. Atherosclerosis: The process usually begins with atherosclerosis, where plaques (fatty deposits) build up in the coronary arteries.\n\n2. Plaque Rupture: The atherosclerotic plaque can rupture, exposing thrombogenic material to the bloodstream.\n\n3. Thrombus Formation: This triggers the clotting cascade, leading to the formation of a thrombus (blood clot) that obstructs blood flow in the coronary artery.\n\n4. Ischemia: The blockage prevents oxygen-rich blood from reaching a portion of the heart muscle, causing ischemia (oxygen deprivation).\n\n5. Injury and Necrosis: If blood flow is not restored quickly, the affected cardiac tissue begins to die (necrosis). This typically starts from the subendocardium and progresses outward.\n\n6. Inflammatory Response: The body initiates an inflammatory response to the damaged area, which can contribute to further injury.\n\n7. Remodeling: Over time, the heart undergoes remodeling, where the damaged area is replaced by scar tissue, which can affect cardiac function.\n\nThe severity and consequences of an MI depend on factors such as the location and extent of the blockage, the duration of ischemia, and the presence of collateral circulation.",
//     isUser: false,
//     timestamp: "12:03 PM",
//   },
//   {
//     id: "4",
//     content: "What are the clinical manifestations of a heart attack?",
//     isUser: true,
//     timestamp: "12:05 PM",
//   },
//   {
//     id: "5",
//     content: 
//       "Clinical manifestations of a heart attack (myocardial infarction) can vary widely between individuals, but typically include:\n\nClassic Symptoms:\n- Chest pain/discomfort: Often described as pressure, squeezing, fullness, or pain in the center or left side of the chest. It may last for several minutes or come and go.\n- Radiation of pain: Pain may radiate to the left arm, both arms, shoulders, neck, jaw, or back.\n- Shortness of breath: May occur with or without chest discomfort.\n\nAdditional Common Symptoms:\n- Cold sweat\n- Nausea or vomiting\n- Lightheadedness or dizziness\n- Fatigue\n- Anxiety or feeling of impending doom\n\nAtypical Presentations:\n- Women, elderly patients, and those with diabetes may present with atypical symptoms.\n- These may include primarily shortness of breath, extreme fatigue, or abdominal discomfort rather than chest pain.\n\nSilent MI:\n- Some heart attacks occur without noticeable symptoms, particularly in patients with diabetes or the elderly.\n- These are often discovered later through ECG changes or imaging studies.\n\nVital Sign Changes:\n- Tachycardia (increased heart rate)\n- Hypertension or hypotension (depending on the severity and stage)\n- Irregular pulse (if arrhythmias develop)\n\nPhysical Examination Findings:\n- Diaphoresis (sweating)\n- Pallor\n- Signs of heart failure (if significant damage occurs): jugular venous distension, pulmonary rales, S3 or S4 heart sounds\n\nIt's important to note that early recognition of these symptoms is crucial for prompt treatment, as \"time is muscle\" in the context of heart attacks.",
//     isUser: false,
//     timestamp: "12:06 PM",
//   },
// ];

// Medical terms for quick access
const quickMedicalTerms = [
  "Diagnosis",
  "Etiology",
  "Pathophysiology",
  "Clinical Manifestations",
  "Treatment",
  "Prognosis",
  "Complications",
  "Differential Diagnosis",
];



const Chat = () => {
  const { chatId } = useParams();
  const [chatDetails, setChatDetails] = useState(null);
  const [favorite, setFavorite] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isQuickTermsOpen, setIsQuickTermsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef(null);
  const isMobile = useIsMobile();
  // Add ref to track previous message count and last message sender
  const prevChatRef = useRef({ count: 0, lastSender: null, chatId: null });

  const [newMessage, setNewMessage] = useState("");
  // Image States 
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);


  const navigate = useNavigate();
  const { isLoading: isLoadingChat, error:chatError, data:chat } = useChat(chatId);


  const { user } = useUser();
  const { data:userChats, isLoading:isLoadingUserChats, error:errorLoadingUserChats } = useUserChats(user?.id);
  const { mutate: deleteChat, isPending: isDeletingChat } = useDeleteChat();

  const { userId:authUserId, isLoaded:isLoadedAuth } = useAuth();
  useEffect(() => {
    if (isLoadedAuth && !authUserId){
      navigate("/login" , {replace : true})
      toast.error("You must be logged in to access this page.", {
        duration: 4000, // Duration in milliseconds (optional)
        position: "top-center", // Position of the toast (optional)
      });
    }
  } , [authUserId , isLoadedAuth , navigate])


    // Check If the chat is for another user 
    useEffect(() => {
      if (!isLoadingUserChats && userChats) {
        const chatExists = userChats.some(chat => chat.id === chatId);
        if (!chatExists) {
          navigate("/dashboard"); // Redirect if chatId not found
          toast.error("You dont have acccess to this chat.", {
            duration: 4000, // Duration in milliseconds (optional)
            position: "top-center", // Position of the toast (optional)
          });
        } else{
          setChatDetails(userChats.filter(chat => chat.id === chatId))
        }
      }
    }, [chatId, userChats, isLoadingUserChats  , navigate]);

    

    const { mutate: sendMessage, isPending: isSendingMessage } = useSendMessage();
    const { mutate: fetchGemini, isPending: isFetchingGemini } = useGemini({ chatId });


  // Scroll to bottom when messages change, but only in specific cases
  useEffect(() => {
    // Reset tracking if chatId changes
    if (chatId !== prevChatRef.current.chatId) {
      prevChatRef.current = { count: 0, lastSender: null, chatId };
    }

    if (!chat || chat.length === 0) {
      // Always scroll on initial render with no messages
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const lastMessage = chat[chat.length - 1];
    const prevCount = prevChatRef.current.count;
    const isChatSwitch = chatId !== prevChatRef.current.chatId;
    
    // Determine if we should scroll based on several conditions
    const shouldScroll = 
      // First load (chat count changed from 0)
      (prevCount === 0 && chat.length > 0) ||
      // User sent a new message (last message is from user)
      (lastMessage.role === "user") ||
      // Initial load after data fetch 
      (!isLoadingChat && prevCount === 0 && chat.length > 0) ||
      // When switching to a different chat
      isChatSwitch;
    
    // Update our ref with current values
    prevChatRef.current = { 
      count: chat.length, 
      lastSender: lastMessage.role,
      chatId
    };
    
    if (shouldScroll) {
      // Use a small timeout to ensure the DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [chat, isLoadingChat, chatId]);

  const resetPrompt = () => {
    setNewMessage("");
    // Reset textarea height
    const textarea = document.getElementById("message-input");
    if (textarea) {
      textarea.style.height = "36px";
    }
  };
  
  const resetImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImage(null);
    setImageBase64("");
    setImagePreview("");
  }


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Force scroll to bottom when user sends a message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    let uploadedImageUrl = null;
    try {
      
      
      
      if (image) {
        setIsLoadingImage(true);
        uploadedImageUrl = await uploadImageToSupabase(image);
      }
      
        sendMessage({
          chatId,
          userId:user?.id,
          role: "user",
          text: newMessage,
          img: uploadedImageUrl,
        });
    
        fetchGemini({
          prompt: newMessage,
          imageBase64,
          chatId
        });

        




  } catch (error) {

    toast.error("Error sending message.", {
      duration: 4000, // Duration in milliseconds (optional)
      position: "top-center", // Position of the toast (optional)
    });;
    throw new Error(error.message);

  } finally{
    // Reset Everything 

    // setIsLoading(false)
    setIsLoadingImage(false);

    // Reset Image Input And States 
    resetImage()
  
    resetPrompt();
    scrollToBottom();
  }
    
  };
  

  // const handleSendMessage = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!newMessage.trim()) return;
  
  //   // Add user message
  //   const userMessage = {
  //     id: Date.now().toString(),
  //     content: newMessage,
  //     isUser: true,
  //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //   };
    
  //   setMessages((prev) => [...prev, userMessage]);
  //   setNewMessage("");
  //   setIsLoading(true);
    
  //   // Simulate AI response (in a real app, this would be an API call)
  //   setTimeout(() => {
  //     const aiResponse = {
  //       id: (Date.now() + 1).toString(),
  //       content: "I'll respond to your question in a detailed and medically accurate way. This is a placeholder for a real AI response that would provide information about " + newMessage,
  //       isUser: false,
  //       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     };
      
  //     setMessages((prev) => [...prev, aiResponse]);
  //     setIsLoading(false);
  //   }, 1500);
  // };
  





  const handleQuickTermClick = (term: string) => {
    setNewMessage((prev) => {
      const newText = prev ? `${prev} ${term}` : term;
      return newText;
    });
    setIsQuickTermsOpen(false);
    
    // Focus on input after adding term
    const inputElement = document.getElementById("message-input");
    if (inputElement) {
      inputElement.focus();
    }
  };
  
  // const handleClearChat = () => {
  //   setMessages([
  //     {
  //       id: Date.now().toString(),
  //       content: "Hello! I'm Es3af, your AI medical assistant. How can I help you today?",
  //       isUser: false,
  //       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     },
  //   ]);
  // };
  
  const { mutate: addChatFavourite, isPending: isAddingChatFavourite } = useAddChatFavourite();

  const handleAddToFavorites = async () => {
    addChatFavourite({chatId , userId:user?.id , isFavourite:!(chatDetails?.at(0)?.favourite)})
  }


  const handleDeleteChat = () => {
    deleteChat({ chatId, userId: user.id });
    navigate("/dashboard");
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex pt-16">
      {/* <div className="flex-1 flex"> */}
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 flex flex-col ${isMobile ? "w-full" : "md:ml-72"}`}>
          {/* Chat header */}
          <div className="border-b border-border px-4 py-3 flex items-center justify-between bg-background">



            {/* SidebaR Toogler For Mobile  */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mr-2"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <div>
              <h2 className="font-medium">{chatDetails?.at(0)?.title}</h2>
              <p className="text-xs text-gray-500">Started: {new Date(chatDetails?.at(0)?.created_at).toDateString()}</p>
            </div>
            
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleAddToFavorites} disabled={isLoadingChat || isAddingChatFavourite}>
                      { isLoadingChat || isAddingChatFavourite ? <LoadingSpinner width={15} height={15} /> : chatDetails?.at(0)?.favourite ? <Heart className="h-5 w-5" fill="white" stroke="white" /> : <Heart className="h-5 w-5"  />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add to favorites</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleDeleteChat} disabled={isDeletingChat}>
                      {isDeletingChat ?
                       <LoadingSpinner width={15} height={15} /> : 
                      <Trash2 className="h-5 w-5" />
                      }
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete chat</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <DownloadCloud className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export conversation</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Share className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share conversation</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chat information</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          


          {/* Chat messages */}
          <ScrollArea className="flex-1 p-4 pb-36">

            {isLoadingChat ? <div className="max-w-3xl h-full mx-auto flex justify-center items-center"><LoadingSpinner width={50} height={50} /></div>  : 
            <div className="max-w-3xl mx-auto">


              {chat?.map((message) => (
                <ChatMessage
                  key={message.id}
                  id={message.id}
                  content={message.text}
                  isUser={message.role === "user"}
                  userId = {user?.id || "1"}
                  timestamp={new Date(message.created_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  imageSrc={message?.img}
                  generatedImageSrcs={message?.generated_images}
                />
              ))}
              
              {isSendingMessage ||  isFetchingGemini  && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary max-w-[80%] animate-pulse">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span>Es3af is thinking...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            }
          </ScrollArea>



          
          {/* Quick terms floating button */}
          <div className="fixed bottom-[8rem] right-4 z-10">
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => setIsQuickTermsOpen(!isQuickTermsOpen)}
              >
                {isQuickTermsOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <PlusCircle className="h-5 w-5" />
                )}
              </Button>
              
              {isQuickTermsOpen && (
                <div className="absolute bottom-14 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-border animate-fade-up">
                  <h4 className="text-sm font-medium px-2 py-1 text-gray-500">Quick Terms</h4>
                  <div className="flex flex-wrap gap-2 p-2">
                    {quickMedicalTerms.map((term) => (
                      <Button
                        key={term}
                        variant="outline"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs"
                        onClick={() => handleQuickTermClick(term)}
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          



          {/* Message input - Fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border bg-background shadow-lg z-10">
            <div className={`transition-all duration-300 ${isMobile ? "w-full" : "md:ml-72"}`}>
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSendMessage} className="w-full">
                  <div className="relative">
                    {/* Image Preview - Floating above input */}
                    {imagePreview && (
                      <div className="absolute bottom-full mb-2 left-0">
                        <div className="relative rounded-md overflow-hidden bg-background border border-border shadow-md">
                          <div className="flex items-center">
                            <div className="h-10 w-16 relative overflow-hidden">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="px-2 text-xs text-muted-foreground truncate max-w-[120px]">
                              Image attached
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 mr-0.5"
                              onClick={resetImage}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  
                    <div className="flex items-center gap-2">
                      {/* Upload Image  */}
                      <ImageUpload image={image} imageBase64={imageBase64} imagePreview={imagePreview} isLoadingImage={isLoadingImage} setImage={setImage} setImageBase64={setImageBase64} setImagePreview={setImagePreview} setIsLoadingImage={setIsLoadingImage} fileInputRef={fileInputRef} />
                      
                      <div className="relative flex-1">
                        <div className="relative w-full rounded-xl border bg-background focus-within:ring-1 focus-within:ring-ring">
                          <textarea
                            id="message-input"
                            placeholder="Type your medical question..."
                            value={newMessage}
                            onChange={(e) => {
                              setNewMessage(e.target.value);
                              // Auto-resize
                              e.target.style.height = '36px';
                              e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (newMessage.trim()) {
                                  handleSendMessage(e);
                                }
                              }
                            }}
                            className="border-0 bg-transparent px-3 py-2 text-sm w-full resize-none outline-none focus-visible:ring-0 max-h-[160px]"
                            style={{ height: '36px', minHeight: '36px', overflow: 'hidden', lineHeight: '1.5' }}
                            rows={1}
                            disabled={isSendingMessage || isFetchingGemini}
                          />
                          <div className="absolute right-2 bottom-1.5">
                            <Button
                              type="submit"
                              size="icon"
                              disabled={!newMessage.trim() || isSendingMessage || isFetchingGemini}
                              className="h-7 w-7 rounded-md"
                            >
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Es3af provides information for educational purposes only. Always consult with a healthcare professional for medical advice.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
