import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MessageCircle, Clock, Settings, X, ChevronLeft } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";

import { useUserChats } from "@/hooks/useUserChats"
import { useDeleteChat } from "@/hooks/useDeleteChat"
import { useCreateChat } from "@/hooks/useCreateChat"
import { Skeleton } from "../ui/skeleton";

import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface ChatPreview {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isUnread?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const APP_LANG = import.meta.env.VITE_APP_LANG;

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  const [deletedChatId, setDeletedChatId] = useState(null);
  const currentChatId = useParams()?.id || null;
  const navigate = useNavigate();

  const { userId, isLoaded } = useAuth();
  const { user } = useUser();

  const { data:userChats, isLoading: isLoadingUserChats, error } = useUserChats(user?.id);
  const { mutate: deleteChat, isPending: isDeleting } = useDeleteChat();
  const { mutate: createChat, isPending: isCreatingChat } = useCreateChat();

  const handleCreateNewChat = (e) => {
    e.preventDefault();
    createChat({ userId: user.id, title: `${APP_LANG === 'en' ?  "New Chat" : "محادثة جيدة"}${userChats ? " #" + (userChats.length + 1) : ''}` });
  }

  const handleNavigateToDashboard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/dashboard");
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    e.preventDefault();
    deleteChat({ chatId, userId: user.id });
    if (currentChatId === chatId) navigate("/dashboard");
    setDeletedChatId(chatId);
  };
  

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
        className={`fixed top-0 left-0 z-50 h-[calc(100vh-4rem)] mt-16 w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
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
              onClick={(e) => handleNavigateToDashboard(e)}
              className="hidden md:flex"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div> */}
          
          <div className="p-4">
              <Button className="w-full justify-start gap-2" onClick={(e) => handleCreateNewChat(e)}>
                {isCreatingChat ? <div className="text-center flex justify-center w-full"><LoadingSpinner /></div> : <>
                <PlusCircle className="h-4 w-4" />
                New Chat
                </>}
              </Button>
          </div>
          
          <nav className="flex-1 overflow-hidden">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-sidebar-foreground/70">
                Recent Chats
              </h2>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-1 p-2">
                  
                  {isLoadingUserChats || !isLoaded && Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
                  {isLoaded && userId &&  userChats && userChats.map((chat) => (
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
                          {new Date(chat.created_at).toDateString()}
                        </span>
                      </div>
                      {/* <p className="text-xs text-sidebar-foreground/60 truncate">
                        {chat.lastMessage}
                      </p> */}
                      {/* {chat.isUnread && (
                        <span className="block w-2 h-2 bg-primary rounded-full ml-auto mt-1" />
                      )} */}
                    </Link>
                  ))}

{isLoaded && userId && !userChats?.length && <div className="flex justify-center text-md md:text-lg text-primary-900 mt-3">No Recent Chats</div> }

                </div>
              </ScrollArea>
            </div>
          </nav>
          
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex justify-between">
              <Button variant="ghost" size="icon" aria-label="Recent chats" onClick={(e) => handleNavigateToDashboard(e)}>
                <Clock className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="All conversations" onClick={(e) => handleNavigateToDashboard(e)}>
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Settings" onClick={(e) => handleNavigateToDashboard(e)}>
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
