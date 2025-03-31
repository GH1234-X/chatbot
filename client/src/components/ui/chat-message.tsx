import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  timestamp?: Date;
}

export function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  const isUser = role === "user";
  
  return (
    <div className={cn("flex", isUser ? "justify-end" : "items-start")}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <Avatar>
            <AvatarImage src="" alt="EduAssistAI" />
            <AvatarFallback className="bg-gradient-to-r from-primary-600 to-purple-500 text-white">
              AI
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div 
        className={cn(
          "max-w-[80%] p-3 rounded-2xl",
          isUser 
            ? "bg-primary-600 text-white rounded-br-none" 
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        )}
      >
        {content.split('\n').map((paragraph, index) => {
          if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
            return <div key={index} className="mb-2 ml-4">• {paragraph.trim().substring(1)}</div>;
          }
          
          if (paragraph.trim().length === 0) {
            return <div key={index} className="h-2"></div>;
          }
          
          return <p key={index} className="mb-2">{paragraph}</p>;
        })}
      </div>
    </div>
  );
}
