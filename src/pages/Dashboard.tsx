
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Clock, 
  Heart, 
  BookOpen,
  Brain,
  BarChart3, 
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

import { useUserChats } from "@/hooks/useUserChats"
import { useDeleteChat } from "@/hooks/useDeleteChat"
import { useCreateChat } from "@/hooks/useCreateChat"

const APP_LANG = import.meta.env.VITE_APP_LANG;

interface RecentChat {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  category: string;
}

const recentChats: RecentChat[] = [
  {
    id: "1",
    title: "Cardiovascular System",
    preview: "What are the symptoms of acute myocardial infarction?",
    timestamp: "2 hours ago",
    category: "Cardiology",
  },
  {
    id: "2",
    title: "Neurological Disorders",
    preview: "Can you explain the pathophysiology of Parkinson's disease?",
    timestamp: "Yesterday",
    category: "Neurology",
  },
  {
    id: "3",
    title: "Respiratory Conditions",
    preview: "What's the difference between COPD and asthma?",
    timestamp: "2 days ago",
    category: "Pulmonology",
  },
];

interface SuggestedTopic {
  title: string;
  description: string;
  icon: React.ElementType;
}

const suggestedTopics: SuggestedTopic[] = [
  {
    title: "Endocrine System",
    description: "Explore hormones, glands, and metabolic disorders",
    icon: Brain,
  },
  {
    title: "Pharmacology",
    description: "Learn about drug mechanisms, interactions, and therapeutics",
    icon: BookOpen,
  },
  {
    title: "Clinical Diagnosis",
    description: "Practice diagnostic reasoning and differentials",
    icon: Stethoscope,
  },
  {
    title: "Medical Statistics",
    description: "Understand key concepts in biostatistics and research",
    icon: BarChart3,
  },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  

  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId){
      navigate("/login" , {replace : true})
      toast.error("You must be logged in to access this page.", {
        duration: 4000, // Duration in milliseconds (optional)
        position: "top-center", // Position of the toast (optional)
      });
    }
  } , [userId , isLoaded , navigate])


  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const { data:userChats, isLoading: isLoadingUserChats, error } = useUserChats(userId);
  const { mutate: createChat, isPending: isCreatingChat } = useCreateChat();


  const handleCreateChat = (e) => {
    e.preventDefault();
    createChat({ userId, title: `${APP_LANG === 'en' ?  "New Chat" : "محادثة جيدة"}${userChats ? " #" + (userChats.length + 1) : ''}` });

  }

  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isMobile ? "w-full" : "md:ml-72"}`}>
          <div className="container mx-auto px-4 py-8">
            {/* Mobile sidebar toggle */}
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mb-4 md:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            )}
            
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome to Es3af</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your AI-powered medical assistant. Ask any medical question to get started.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search medical topics, questions, or previous conversations..."
                className="pl-10 pr-4 py-6 text-base rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link onClick={(e) => handleCreateChat(e) } to="/" >
                <Card className="hover:shadow-md transition-shadow hover:border-primary/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">New Chat</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Start a fresh conversation with Es3af
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/chat/history">
                <Card className="hover:shadow-md transition-shadow hover:border-primary/20">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Chat History</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        View your previous conversations
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
            
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="recent">Recent Chats</TabsTrigger>
                <TabsTrigger value="topics">Suggested Topics</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-4">
                {recentChats.length > 0 ? (
                  recentChats.map((chat) => (
                    <Link to={`/chat/${chat.id}`} key={chat.id}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{chat.title}</h3>
                              <Badge variant="outline" className="mt-1">
                                {chat.category}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">{chat.timestamp}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                            {chat.preview}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No recent chats yet</p>
                    <Link to="/chat/new">
                      <Button className="mt-4">Start a New Chat</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="topics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedTopics.map((topic, index) => (
                    <Link to={`/chat/topic/${topic.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                      <Card className="hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-6 flex items-start gap-4 h-full">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <topic.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">{topic.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {topic.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="favorites">
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Favorite Chats Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Mark conversations as favorites by clicking the heart icon in a chat.
                  </p>
                  <Link to="/chat/new">
                    <Button>Start a New Chat</Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
