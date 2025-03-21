
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Clock, 
  Heart, 
  BookOpen,
  Brain,
  BarChart3, 
  Stethoscope,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

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
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
      clearTimeout(timer);
    };
  }, []);
  
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
                className="mb-4 md:hidden rounded-full hover:bg-primary/5 border-gray-200"
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
            
            <div className="mb-8 animate-fade-up">
              <h1 className="text-3xl font-bold mb-2">Welcome to Es3af</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your AI-powered medical assistant. Ask any medical question to get started.
              </p>
            </div>
            
            {/* Search Bar with animated focus effect */}
            <div className="relative max-w-2xl mb-8 group animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="absolute inset-0 bg-primary/5 rounded-xl -m-1 opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search medical topics, questions, or previous conversations..."
                  className="pl-10 pr-4 py-6 text-base rounded-xl border-gray-200 focus:border-primary transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Quick Actions with hover effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/chat/new">
                <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 group overflow-hidden">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">New Chat</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Start a fresh conversation with Es3af
                      </p>
                    </div>
                    
                    <ArrowRight className="ml-auto h-5 w-5 text-gray-300 transform translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/chat/history">
                <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 group overflow-hidden">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">Chat History</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        View your previous conversations
                      </p>
                    </div>
                    
                    <ArrowRight className="ml-auto h-5 w-5 text-gray-300 transform translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  </CardContent>
                </Card>
              </Link>
            </div>
            
            <Tabs defaultValue="recent" className="w-full animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <TabsList className="mb-6 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-full">
                <TabsTrigger value="recent" className="rounded-full text-sm py-2 px-4">Recent Chats</TabsTrigger>
                <TabsTrigger value="topics" className="rounded-full text-sm py-2 px-4">Suggested Topics</TabsTrigger>
                <TabsTrigger value="favorites" className="rounded-full text-sm py-2 px-4">Favorites</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-4">
                {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="w-full">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/5 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                          </div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mt-2 animate-pulse"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  recentChats.length > 0 ? (
                    recentChats.map((chat, index) => (
                      <Link to={`/chat/${chat.id}`} key={chat.id}>
                        <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 group overflow-hidden animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                          <CardContent className="p-6 relative">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">{chat.title}</h3>
                                <Badge variant="outline" className="mt-1 group-hover:bg-primary/5 transition-colors duration-300">
                                  {chat.category}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-500">{chat.timestamp}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                              {chat.preview}
                            </p>
                            
                            <MessageSquare className="absolute bottom-4 right-4 h-6 w-6 text-gray-300 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                      <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No recent chats yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Start a new conversation with Es3af to get personalized medical information.
                      </p>
                      <Link to="/chat/new">
                        <Button className="rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">Start a New Chat</Button>
                      </Link>
                    </div>
                  )
                )}
              </TabsContent>
              
              <TabsContent value="topics" className="space-y-4">
                {isLoading ? (
                  // Skeleton loading for topics
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Card key={index} className="overflow-hidden h-full">
                        <CardContent className="p-6 flex items-start gap-4 h-full">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                          <div className="w-full">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/5 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-3 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mt-2 animate-pulse"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestedTopics.map((topic, index) => (
                      <Link to={`/chat/topic/${topic.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                        <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 group overflow-hidden h-full animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                          <CardContent className="p-6 flex items-start gap-4 h-full">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                              <topic.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-base group-hover:text-primary transition-colors duration-300">{topic.title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {topic.description}
                              </p>
                            </div>
                            
                            <ArrowRight className="ml-auto h-5 w-5 text-gray-300 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="favorites">
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                  <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Favorite Chats Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Mark conversations as favorites by clicking the heart icon in a chat.
                  </p>
                  <Link to="/chat/new">
                    <Button className="rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">Start a New Chat</Button>
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
