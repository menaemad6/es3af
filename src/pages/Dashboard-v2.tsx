
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
  ArrowRight,
  PlusCircle,
  History,
  Star,
  LightbulbIcon,
  HeartPulse,
  Microscope,
  PanelLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
    id: "6",
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
  const [activeTab, setActiveTab] = useState("recent");
  
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

  const QuickActionButton = ({ 
    icon: Icon, 
    title, 
    description, 
    to 
  }: { 
    icon: React.ElementType; 
    title: string; 
    description: string; 
    to: string; 
  }) => (
    <Link to={to}>
      <Card className="futuristic-card group overflow-hidden border-0">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/5 to-transparent opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-300 shadow-sm">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
          
          <ArrowRight className="ml-auto h-5 w-5 text-gray-300 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
        </CardContent>
      </Card>
    </Link>
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-gray-50/80 dark:from-background dark:to-gray-900/30">
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
                className="mb-4 md:hidden rounded-full hover:bg-primary/5 border-gray-200 shadow-sm"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            )}
            
            <div className="mb-8 animate-fade-up">
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 dark:from-primary-400 dark:to-primary-600">
                  Welcome to Es3af
                </span>
                <span className="inline-block ml-3 relative top-1">
                  <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                    AI-Powered
                  </Badge>
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your AI-powered medical assistant. Ask any medical question to get started.
              </p>
            </div>
            
            {/* Search Bar with animated focus effect */}
            <div className="relative max-w-2xl mb-8 group animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="absolute inset-0 bg-primary/5 rounded-xl -m-1 opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 rounded-xl opacity-0 group-focus-within:opacity-100 blur-xl transition-all duration-500"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors duration-300" />
                <Input
                  type="text"
                  placeholder="Search medical topics, questions, or previous conversations..."
                  className="pl-10 pr-4 py-6 text-base rounded-xl border border-gray-200 dark:border-gray-700 focus:border-primary transition-all duration-300 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Quick Actions with hover effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <QuickActionButton 
                icon={PlusCircle} 
                title="New Chat" 
                description="Start a fresh conversation with Es3af" 
                to="/chat/new" 
              />
              <QuickActionButton 
                icon={History} 
                title="Chat History" 
                description="View your previous conversations" 
                to="/chat/history" 
              />
            </div>
            
            <Tabs 
              defaultValue="recent" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full animate-fade-up" 
              style={{ animationDelay: "0.3s" }}
            >
              <TabsList className="mb-6 p-1 bg-white/50 dark:bg-gray-800/50 rounded-full shadow-sm backdrop-blur-sm">
                <TabsTrigger 
                  value="recent" 
                  className="rounded-full text-sm py-2 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Recent Chats
                </TabsTrigger>
                <TabsTrigger 
                  value="topics" 
                  className="rounded-full text-sm py-2 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Suggested Topics
                </TabsTrigger>
                <TabsTrigger 
                  value="favorites" 
                  className="rounded-full text-sm py-2 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  Favorites
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-4">
                {isLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="futuristic-card overflow-hidden border-0">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="w-full">
                            <Skeleton className="h-6 w-2/5 mb-2" />
                            <Skeleton className="h-4 w-1/4" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full mt-4" />
                        <Skeleton className="h-4 w-4/5 mt-2" />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  recentChats.length > 0 ? (
                    recentChats.map((chat, index) => (
                      <Link to={`/chat/${chat.id}`} key={chat.id}>
                        <Card className="futuristic-card group overflow-hidden border-0 animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/5 to-transparent opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                          <CardContent className="p-6 relative">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">{chat.title}</h3>
                                <Badge variant="outline" className="mt-1 border-primary/20 bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors duration-300">
                                  {chat.category}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-500">{chat.timestamp}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-2">
                              {chat.preview}
                            </p>
                            
                            <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log('Favorite clicked');
                                }}
                              >
                                <Star className="h-4 w-4 text-gray-400 hover:text-yellow-400 transition-colors" />
                              </Button>
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <MessageSquare className="h-4 w-4" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm shadow-sm">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No recent chats yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                        Start a new conversation with Es3af to get personalized medical information.
                      </p>
                      <Link to="/chat/new">
                        <Button className="rounded-full bg-gradient-to-r from-primary to-primary-600 hover:opacity-90 shadow-md hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
                          Start a New Chat
                          <PlusCircle className="ml-2 h-4 w-4" />
                        </Button>
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
                      <Card key={index} className="futuristic-card overflow-hidden border-0 h-full">
                        <CardContent className="p-6 flex items-start gap-4 h-full">
                          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                          <div className="w-full">
                            <Skeleton className="h-5 w-3/5 mb-2" />
                            <Skeleton className="h-4 w-full mt-3" />
                            <Skeleton className="h-4 w-4/5 mt-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestedTopics.map((topic, index) => (
                      <Link to={`/chat/topic/${topic.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                        <Card className="futuristic-card group overflow-hidden border-0 h-full animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary/5 to-transparent opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                          <CardContent className="p-6 flex items-start gap-4 h-full">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-300 shadow-sm">
                              <topic.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-base group-hover:text-primary transition-colors duration-300">{topic.title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {topic.description}
                              </p>
                            </div>
                            
                            <ArrowRight className="ml-auto h-5 w-5 text-gray-300 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="favorites">
                <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Favorite Chats Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                    Mark conversations as favorites by clicking the star icon in a chat.
                  </p>
                  <Link to="/chat/new">
                    <Button className="rounded-full bg-gradient-to-r from-primary to-primary-600 hover:opacity-90 shadow-md hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
                      Start a New Chat
                      <PlusCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
            

            
            {/* Floating Action Button - only visible on mobile */}
            <div className="fixed right-6 bottom-6 md:hidden">
              <Link to="/chat/new">
                <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary-600 hover:shadow-primary/20 transition-all duration-300">
                  <PlusCircle className="h-6 w-6" />
                </Button>
              </Link>
            </div>


          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
