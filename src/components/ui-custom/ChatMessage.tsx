import { useEffect, useState } from "react";
import { Copy, Check, MessageCircle, Bot, Play, Pause, Image, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

import {useMultiLangTTS} from "@/hooks/useMultiLangTTs"
import {useTranslateMessage} from "@/hooks/useTranslateMessage"


import {generateAndUploadImages} from "@/services/supabaseFunctions.js"

import {useGenerateImages} from "@/hooks/useGenerateImages"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { Link } from "react-router-dom";

import {useTTS} from "@/services/fetchTTS.js"



interface ChatMessageProps {
  id:string;
  userId:string;
  content: string;
  isUser: boolean;
  timestamp: string;
  imageSrc?: string;
  generatedImageSrcs?: string[];
}

// Add a helper function to detect if text contains Arabic
const containsArabic = (text: string) => {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
};

// Add a function to determine if text is predominantly Arabic (>40%)
const isPredominantlyArabic = (text: string) => {
  if (!text) return false;
  
  // Count Arabic characters
  const arabicChars = text.match(/[\u0600-\u06FF]/g) || [];
  const arabicCount = arabicChars.length;
  
  // Count total relevant characters (excluding spaces, punctuation, etc.)
  const totalRelevantChars = text.match(/[\p{L}\p{N}]/gu)?.length || 1; // Unicode letters and numbers
  
  // Calculate percentage
  const arabicPercentage = arabicCount / totalRelevantChars;
  
  // Return true if more than 40% of relevant characters are Arabic
  return arabicPercentage > 0.4;
};

const ChatMessage = ({ id ,userId, content, isUser, timestamp, imageSrc , generatedImageSrcs }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);

  
  // Detect if the content contains Arabic text
  const isArabicText = isPredominantlyArabic(content);

  const synth = window.speechSynthesis;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };


  
  
// Eleven Labs 
  const { mutate: playTTS, isLoading:isLoadingSound } = useTTS();



  // Text To Speech 
  const { toggleSpeech } = useMultiLangTTS(isPlaying , setIsPlaying )
  const playSound = () => {
    // Get the currently displayed text based on the showTranslated state
    const currentText = showTranslated && translatedText ? translatedText : content;
    toggleSpeech(currentText);

    // ELeven Labs 
    // playTTS({text:content , speed: 1.0})
};


  // Translate Messge
  //  disable automatic fetching and control it manually
const { data: translatedText, isLoading:isTranslatingMessage, error:errorTranslatingMessage, refetch:translate } = useTranslateMessage(content, { 
  enabled: false // Don't run immediately
});
  const  translateMessageHandler =  () => {
    if (!translatedText) {
      // If not translated yet, fetch translation
      translate();
    }
    // Toggle between showing original and translated text
    setShowTranslated(prev => !prev);
  };


const { mutate: generateImages, isPending: isGeneratingImages } = useGenerateImages();


const handleGenerateImages = async () => {
  generateImages({userId , content , imagesCount:3 , id})
  // const images = await generateAndUploadImages(content , 4 , id)
  // console.log(images)
};


  useEffect(() => {
    return () => {
      synth.cancel();
      setIsPlaying(false);
    };
  }, []);

  // Determine if current text is Arabic (either original or translated)
  const currentTextIsArabic = showTranslated && translatedText 
    ? isPredominantlyArabic(translatedText) 
    : isArabicText;



  // This function renders the markdown content for AI messages
  // or plain text for user messages
  const renderContent = () => {
    const textToDisplay = showTranslated && translatedText ? translatedText : content;
    const isArabic = isPredominantlyArabic(textToDisplay);
    
    if (isUser) {
      return (
        <p 
          className={cn(
            "whitespace-pre-wrap break-words",
            isArabic && "font-arabic text-right" // Apply Arabic font and right alignment
          )}
          dir={isArabic ? "rtl" : "ltr"} // Set text direction based on content
        >
          {textToDisplay}
        </p>
      );
    } else {
      return (
        <div 
          className={cn(
            "markdown-content w-full max-w-full overflow-hidden",
            isArabic && "font-arabic" // Apply Arabic font
          )}
          dir={isArabic ? "rtl" : "ltr"} // Set text direction based on content
        >
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => (
                <p 
                  className={cn(
                    "whitespace-pre-wrap break-words mb-4 last:mb-0",
                    isArabic && "text-right" // Right-align paragraphs for Arabic
                  )} 
                  dir={isArabic ? "rtl" : "ltr"}
                  {...props} 
                />
              ),
              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
              table: ({ node, ...props }) => <div className="overflow-x-auto w-full my-4"><table className="w-full border-collapse" {...props} /></div>,
              thead: ({ node, ...props }) => <thead className="bg-primary/5" {...props} />,
              tbody: ({ node, ...props }) => <tbody {...props} />,
              tr: ({ node, ...props }) => <tr className="border-b border-gray-200 dark:border-gray-700" {...props} />,
              th: ({ node, ...props }) => <th className="py-2 px-4 text-left font-medium" {...props} />,
              td: ({ node, ...props }) => <td className="py-2 px-4" {...props} />,
              ul: ({ node, ...props }) => (
                <ul 
                  className={cn(
                    "mb-4",
                    isArabic ? "pr-6" : "pl-6", // Adjust list padding based on direction
                    isArabic ? "list-disc-rtl" : "list-disc" // Use RTL-friendly list style
                  )} 
                  {...props} 
                />
              ),
              ol: ({ node, ...props }) => (
                <ol 
                  className={cn(
                    "mb-4",
                    isArabic ? "pr-6" : "pl-6", // Adjust list padding based on direction
                    isArabic ? "list-decimal-rtl" : "list-decimal" // Use RTL-friendly list style
                  )} 
                  {...props} 
                />
              ),
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              a: ({ node, href, ...props }) => <a href={href} className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote 
                  className={cn(
                    "py-1 my-4 italic",
                    isArabic 
                      ? "border-r-4 border-gray-300 dark:border-gray-600 pr-4" 
                      : "border-l-4 border-gray-300 dark:border-gray-600 pl-4"
                  )} 
                  {...props} 
                />
              ),
              code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-primary-300 px-1 py-0.5 rounded text-sm" {...props} />,
              pre: ({ node, ...props }) => <pre className="bg-gray-100 dark:bg-primary-300 p-4 rounded-lg overflow-x-auto my-4 w-full max-w-full" {...props} />,
              h1: ({ node, ...props }) => <h1 className={cn("text-2xl font-bold my-4", isArabic && "text-right")} {...props} />,
              h2: ({ node, ...props }) => <h2 className={cn("text-xl font-bold my-3", isArabic && "text-right")} {...props} />,
              h3: ({ node, ...props }) => <h3 className={cn("text-lg font-bold my-2", isArabic && "text-right")} {...props} />,
              h4: ({ node, ...props }) => <h4 className={cn("text-base font-bold my-2", isArabic && "text-right")} {...props} />,
              img: ({ node, ...props }) => <img className="max-w-full h-auto rounded-lg my-4" {...props} />
            }}
          >
            {textToDisplay}
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
        isUser ? "max-w-[80%]" : "max-w-[85%] md:max-w-[80%]",
        // Flip order of items for Arabic user messages to maintain chat bubble style
        isUser && currentTextIsArabic && "flex-row-reverse"
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
        : "bg-secondary text-secondary-foreground rounded-tl-sm",
      // Adjust bubble corners for RTL messages
      isUser && currentTextIsArabic && "rounded-tr-2xl rounded-tl-sm",
      !isUser && currentTextIsArabic && "rounded-tr-sm rounded-tl-2xl"
    )}
  >
    {/* Handle single image case */}
    {imageSrc && (
      <div className="mb-3">
        <img 
          src={imageSrc} 
          alt="Message attachment" 
          className="w-full h-auto rounded-lg object-cover max-h-64"
        />
      </div>
    )}
    
    {/* Handle images array case */}
    {generatedImageSrcs && generatedImageSrcs.length > 0 && (
      <div className="mb-3 grid grid-cols-1  gap-2">
        {generatedImageSrcs.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg">
            <Link to={image} target="_blank" rel="noopener noreferrer" >
            <img 
              src={image} 
              alt={`Message attachment ${index + 1}`} 
              className="w-full h-auto object-cover max-h-64"
              />
              </Link>
          </div>
        ))}
      </div>
    )}
    
    {renderContent()}
  </div>


          
          
          <div className={cn(
            "flex items-center mt-1 px-1",
            currentTextIsArabic && "flex-row-reverse" // Reverse controls for Arabic text
          )}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timestamp}
            </span>
            
            {/* Copy Button  */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 ${currentTextIsArabic ? 'mr-1' : 'ml-1'} ${isUser && "opacity-0"} group-hover:opacity-100 transition-opacity`}
              onClick={copyToClipboard}
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 text-gray-500" />
              )}
            </Button>


              {/* Image Generation Button  */}
              <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 ${currentTextIsArabic ? 'mr-1' : 'ml-1'} ${isUser && "opacity-0"} group-hover:opacity-100 transition-opacity`}
              onClick={handleGenerateImages}
              aria-label="Generate images"
            >
              {isGeneratingImages ? (
                <LoadingSpinner width={15} height={15} />
              ) : (
                <Image className="h-3 w-3 text-gray-500" />
              )}
            </Button>






              {/* Text To Speech Button  */}
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 ${currentTextIsArabic ? 'mr-1' : 'ml-1'} ${isUser && "opacity-0"} group-hover:opacity-100 transition-opacity`}
              onClick={playSound}
              aria-label="Play text to speech"
            >
              {isPlaying ? (
                <Pause className="h-3 w-3 text-green-500" fill="rgb(34 197 94)" stroke="rgb(34 197 94)" />
              ) : (
                <Play className="h-3 w-3 text-gray-500" />
              )}
            </Button>


             {/* Translate To English Button  */}
              <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 ${currentTextIsArabic ? 'mr-1' : 'ml-1'} ${isUser && "opacity-0"} group-hover:opacity-100 transition-opacity`}
              onClick={translateMessageHandler}
              aria-label="Translate message"
            >
              {isTranslatingMessage ? (
                <LoadingSpinner width={15} height={15} />
              ) : showTranslated && translatedText ? (
                <Globe className="h-3 w-3 text-green-500" stroke="rgb(34 197 94)" />
              ) : (
                <Globe className="h-3 w-3 text-gray-500"  />
              )}
            </Button>




          </div>
        </div>
        
        {isUser && (
          <div className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center ${currentTextIsArabic ? 'mr-2' : 'ml-2'} mt-1 flex-shrink-0`}>
            <MessageCircle size={16} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;