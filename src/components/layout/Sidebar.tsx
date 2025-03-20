
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MessageCircle, Clock, Settings, X, ChevronLeft } from "lucide-react";

interface ChatPreview {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isUnread?: boolean;
}

// Sample data for recent chats
const recentChats: ChatPreview[] = [
  {
    id: "1",
    title: "Cardiovascular System",
    lastMessage: "What are the symptoms of acute myocardial infarction?",
    timestamp: "2 hours ago",
    isUnread: true,
  },
  {
    id: "2",
    title: "Neurological Disorders",
    lastMessage: "Can you explain the pathophysiology of Parkinson's disease?",
    timestamp: "Yesterday",
  },
  {
    id: "3",
    title: "Respiratory Conditions",
    lastMessage: "What's the difference between COPD and asthma?",
    timestamp: "2 days ago",
  },
  {
    id: "4",
    title: "Endocrine System",
    lastMessage: "How does insulin resistance develop in Type 2 diabetes?",
    timestamp: "1 week ago",
  },
  {
    id: "5",
    title: "Pharmacology",
    lastMessage: "What are the main classes of antihypertensive medications?",
    timestamp: "2 weeks ago",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDesktop = window.innerWidth >= 768;

  return (
    <>
      {/* Mobile overlay */}
      {!isDesktop && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">
                E
              </div>
              <span className="text-sidebar-foreground">Es3af</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hidden md:flex"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4">
            <Link to="/chat/new">
              <Button className="w-full justify-start gap-2">
                <PlusCircle className="h-4 w-4" />
                New Chat
              </Button>
            </Link>
          </div>
          
          <nav className="flex-1 overflow-hidden">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-sidebar-foreground/70">
                Recent Chats
              </h2>
              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="space-y-1 p-2">
                  {recentChats.map((chat) => (
                    <Link 
                      key={chat.id}
                      to={`/chat/${chat.id}`}
                      className={`block p-3 rounded-lg text-sm transition-colors ${
                        location.pathname === `/chat/${chat.id}`
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium truncate">{chat.title}</span>
                        <span className="text-[10px] text-sidebar-foreground/60 whitespace-nowrap ml-1">
                          {chat.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-sidebar-foreground/60 truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.isUnread && (
                        <span className="block w-2 h-2 bg-primary rounded-full ml-auto mt-1" />
                      )}
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </nav>
          
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex justify-between">
              <Button variant="ghost" size="icon" aria-label="Recent chats">
                <Clock className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="All conversations">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
