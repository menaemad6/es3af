
import { useState } from "react";
import { Copy, Check, MessageCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

const ChatMessage = ({ content, isUser, timestamp }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className="flex items-start max-w-[80%] group">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
            <Bot size={16} className="text-primary" />
          </div>
        )}
        
        <div>
          <div
            className={cn(
              "p-4 rounded-2xl",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-secondary text-secondary-foreground rounded-tl-sm"
            )}
          >
            <p className="whitespace-pre-wrap break-words">{content}</p>
          </div>
          
          <div className="flex items-center mt-1 px-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timestamp}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={copyToClipboard}
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 text-gray-500" />
              )}
            </Button>
          </div>
        </div>
        
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-2 mt-1 flex-shrink-0">
            <MessageCircle size={16} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
