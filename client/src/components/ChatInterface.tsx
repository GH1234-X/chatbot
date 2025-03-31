import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ChatMessage } from "@/components/ui/chat-message";
import { LoadingDots } from "@/components/ui/loading-dots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { generateChatResponse } from "@/lib/groq";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage as ChatMessageType } from "@shared/schema";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat history if user is logged in
  const { data: chatHistory } = useQuery({
    queryKey: ["/api/chat", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const response = await fetch(`/api/chat/${profile.id}`);
      if (!response.ok) throw new Error("Failed to fetch chat history");
      return response.json();
    },
    enabled: !!profile?.id
  });

  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 0,
      userId: 0,
      content: "Hello! I'm EduAssistAI, your educational assistant. How can I help you today? You can ask me about scholarships, college cutoffs, career advice, or any other educational questions.",
      role: "assistant",
      timestamp: new Date()
    }
  ]);

  // Update messages when chat history is loaded
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setMessages([
        {
          id: 0,
          userId: 0,
          content: "Hello! I'm EduAssistAI, your educational assistant. How can I help you today? You can ask me about scholarships, college cutoffs, career advice, or any other educational questions.",
          role: "assistant",
          timestamp: new Date()
        },
        ...chatHistory
      ]);
    }
  }, [chatHistory]);

  // Generate response mutation
  const generateMutation = useMutation({
    mutationFn: async ({ message, userId }: { message: string; userId?: number }) => {
      return generateChatResponse(message, userId);
    },
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          userId: profile?.id || 0,
          content: response,
          role: "assistant",
          timestamp: new Date()
        }
      ]);
      
      queryClient.invalidateQueries({ queryKey: ["/api/chat", profile?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error generating response",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to the chat
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        userId: profile?.id || 0,
        content: message,
        role: "user",
        timestamp: new Date()
      }
    ]);
    
    // Generate response
    generateMutation.mutate({ 
      message,
      userId: profile?.id
    });
    
    setMessage("");
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="chat-container flex flex-col space-y-4 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              content={msg.content}
              role={msg.role as "user" | "assistant"}
              timestamp={msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)}
            />
          ))}
          
          {generateMutation.isPending && (
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-purple-500 flex items-center justify-center text-white">
                  AI
                </div>
              </div>
              <div className="chat-message bot-message p-3 flex items-center">
                <LoadingDots />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="mt-4">
          <div className="flex rounded-md shadow-sm">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your question here..."
              className="rounded-r-none"
              disabled={generateMutation.isPending}
            />
            <Button 
              type="submit" 
              className="bg-primary-600 hover:bg-primary-700 rounded-l-none"
              disabled={generateMutation.isPending || !message.trim()}
            >
              <Send className="h-5 w-5 mr-2" />
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
