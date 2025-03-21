import { useState } from "react";
import { Copy, Check, MessageCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
  imageSrc?: string;
}

const ChatMessage = ({ content, isUser, timestamp, imageSrc }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // This function renders the markdown content for AI messages
  // or plain text for user messages
  const renderContent = () => {
    if (isUser) {
      return <p className="whitespace-pre-wrap break-words">{content}</p>;
    } else {
      return (
        <div className="markdown-content w-full max-w-full overflow-hidden">
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <p className="whitespace-pre-wrap break-words mb-4 last:mb-0" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
              table: ({ node, ...props }) => <div className="overflow-x-auto w-full my-4"><table className="w-full border-collapse" {...props} /></div>,
              thead: ({ node, ...props }) => <thead className="bg-primary/5" {...props} />,
              tbody: ({ node, ...props }) => <tbody {...props} />,
              tr: ({ node, ...props }) => <tr className="border-b border-gray-200 dark:border-gray-700" {...props} />,
              th: ({ node, ...props }) => <th className="py-2 px-4 text-left font-medium" {...props} />,
              td: ({ node, ...props }) => <td className="py-2 px-4" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              a: ({ node, href, ...props }) => <a href={href} className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-1 my-4 italic" {...props} />,
              code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-primary-300 px-1 py-0.5 rounded text-sm" {...props} />,
              pre: ({ node, ...props }) => <pre className="bg-gray-100 dark:bg-primary-300 p-4 rounded-lg overflow-x-auto my-4 w-full max-w-full" {...props} />,
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-2" {...props} />,
              h4: ({ node, ...props }) => <h4 className="text-base font-bold my-2" {...props} />,
              img: ({ node, ...props }) => <img className="max-w-full h-auto rounded-lg my-4" {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }
  };
  
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex items-start group",
        isUser ? "max-w-[80%]" : "max-w-[85%] md:max-w-[80%]"
      )}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
            <Bot size={16} className="text-primary" />
          </div>
        )}
        
        <div className="w-full max-w-full overflow-hidden">
          <div
            className={cn(
              "p-4 rounded-2xl",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-secondary text-secondary-foreground rounded-tl-sm"
            )}
          >
            {imageSrc && (
              <div className="mb-3">
                <img 
                  src={imageSrc} 
                  alt="Message attachment" 
                  className="w-full h-auto rounded-lg object-cover max-h-64"
                />
              </div>
            )}
            {renderContent()}
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