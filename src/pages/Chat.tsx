
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ui-custom/ChatMessage";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

// Sample conversation data
const sampleConversation = [
  {
    id: "1",
    content: "Hello! I'm Es3af, your AI medical assistant. How can I help you today?",
    isUser: false,
    timestamp: "12:01 PM",
  },
  {
    id: "2",
    content: "Can you explain the pathophysiology of myocardial infarction?",
    isUser: true,
    timestamp: "12:02 PM",
  },
  {
    id: "3",
    content: 
      "Myocardial infarction (MI), commonly known as a heart attack, occurs when blood flow to a part of the heart is blocked, causing damage to the heart muscle.\n\nPathophysiology:\n1. Atherosclerosis: The process usually begins with atherosclerosis, where plaques (fatty deposits) build up in the coronary arteries.\n\n2. Plaque Rupture: The atherosclerotic plaque can rupture, exposing thrombogenic material to the bloodstream.\n\n3. Thrombus Formation: This triggers the clotting cascade, leading to the formation of a thrombus (blood clot) that obstructs blood flow in the coronary artery.\n\n4. Ischemia: The blockage prevents oxygen-rich blood from reaching a portion of the heart muscle, causing ischemia (oxygen deprivation).\n\n5. Injury and Necrosis: If blood flow is not restored quickly, the affected cardiac tissue begins to die (necrosis). This typically starts from the subendocardium and progresses outward.\n\n6. Inflammatory Response: The body initiates an inflammatory response to the damaged area, which can contribute to further injury.\n\n7. Remodeling: Over time, the heart undergoes remodeling, where the damaged area is replaced by scar tissue, which can affect cardiac function.\n\nThe severity and consequences of an MI depend on factors such as the location and extent of the blockage, the duration of ischemia, and the presence of collateral circulation.",
    isUser: false,
    timestamp: "12:03 PM",
  },
  {
    id: "4",
    content: "What are the clinical manifestations of a heart attack?",
    isUser: true,
    timestamp: "12:05 PM",
  },
  {
    id: "5",
    content: 
      "Clinical manifestations of a heart attack (myocardial infarction) can vary widely between individuals, but typically include:\n\nClassic Symptoms:\n- Chest pain/discomfort: Often described as pressure, squeezing, fullness, or pain in the center or left side of the chest. It may last for several minutes or come and go.\n- Radiation of pain: Pain may radiate to the left arm, both arms, shoulders, neck, jaw, or back.\n- Shortness of breath: May occur with or without chest discomfort.\n\nAdditional Common Symptoms:\n- Cold sweat\n- Nausea or vomiting\n- Lightheadedness or dizziness\n- Fatigue\n- Anxiety or feeling of impending doom\n\nAtypical Presentations:\n- Women, elderly patients, and those with diabetes may present with atypical symptoms.\n- These may include primarily shortness of breath, extreme fatigue, or abdominal discomfort rather than chest pain.\n\nSilent MI:\n- Some heart attacks occur without noticeable symptoms, particularly in patients with diabetes or the elderly.\n- These are often discovered later through ECG changes or imaging studies.\n\nVital Sign Changes:\n- Tachycardia (increased heart rate)\n- Hypertension or hypotension (depending on the severity and stage)\n- Irregular pulse (if arrhythmias develop)\n\nPhysical Examination Findings:\n- Diaphoresis (sweating)\n- Pallor\n- Signs of heart failure (if significant damage occurs): jugular venous distension, pulmonary rales, S3 or S4 heart sounds\n\nIt's important to note that early recognition of these symptoms is crucial for prompt treatment, as \"time is muscle\" in the context of heart attacks.",
    isUser: false,
    timestamp: "12:06 PM",
  },
];

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
  const [messages, setMessages] = useState(sampleConversation);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isQuickTermsOpen, setIsQuickTermsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: "I'll respond to your question in a detailed and medically accurate way. This is a placeholder for a real AI response that would provide information about " + newMessage,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };
  
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
  
  const handleClearChat = () => {
    // In a real application, add a confirmation dialog
    setMessages([
      {
        id: Date.now().toString(),
        content: "Hello! I'm Es3af, your AI medical assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 flex flex-col ${isMobile ? "w-full" : "md:ml-72"}`}>
          {/* Chat header */}
          <div className="border-b border-border px-4 py-3 flex items-center justify-between bg-background">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <div>
              <h2 className="font-medium">Cardiovascular System</h2>
              <p className="text-xs text-gray-500">Started: Today at 12:01 PM</p>
            </div>
            
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add to favorites</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleClearChat}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear chat</TooltipContent>
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
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary max-w-[80%] animate-pulse">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span>Es3af is thinking...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Quick terms floating button */}
          <div className="relative">
            <div className="absolute bottom-20 right-4">
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
          </div>
          
          {/* Message input */}
          <div className="p-4 border-t border-border bg-background">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                
                <div className="relative flex-1">
                  <Input
                    id="message-input"
                    placeholder="Type your medical question..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="pl-4 pr-12 py-6 rounded-xl"
                    disabled={isLoading}
                  />
                  
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || isLoading}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Es3af provides information for educational purposes only. Always consult with a healthcare professional for medical advice.
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
