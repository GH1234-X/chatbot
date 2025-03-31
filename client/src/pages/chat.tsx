import { useState, useEffect, useRef, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, prepareChatMessages, getChatCompletion } from "@/lib/groq";
import { Skeleton } from "@/components/ui/skeleton";
import AuthModal from "@/components/AuthModal";

interface Message {
  id: number;
  content: string;
  isUserMessage: boolean;
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Query for getting saved chat messages
  const { data: savedMessages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["/api/chat/messages", currentUser?.uid],
    enabled: !!currentUser,
    queryFn: async () => {
      const res = await fetch(`/api/chat/messages?userId=${currentUser?.uid}`);
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      return res.json();
    }
  });
  
  // Mutation for saving messages
  const saveMutation = useMutation({
    mutationFn: async (message: { content: string; isUserMessage: boolean; userId?: string }) => {
      return fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message.content,
          isUserMessage: message.isUserMessage,
          userId: currentUser?.uid ? parseInt(currentUser.uid) : undefined,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages", currentUser?.uid] });
    }
  });
  
  // Load saved messages when they're available
  useEffect(() => {
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
    } else if (!isLoadingMessages && messages.length === 0) {
      // Add welcome message if no messages
      const welcomeMessage = {
        id: 0,
        content: "Hi there! I'm StudyAI, your educational assistant. I can help with academic questions, scholarship information, and college cutoffs. What would you like to know today?",
        isUserMessage: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [savedMessages, isLoadingMessages]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Check if user is logged in
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    
    const userMessage = {
      id: messages.length,
      content: input.trim(),
      isUserMessage: true,
      timestamp: new Date(),
    };
    
    // Add user message to UI
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Save user message
      await saveMutation.mutateAsync({
        content: userMessage.content,
        isUserMessage: true,
        userId: currentUser?.uid,
      });
      
      // Prepare messages for AI
      const chatHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.isUserMessage ? "user" : "assistant",
        content: msg.content
      }));
      
      // Add the new user message
      chatHistory.push({
        role: "user",
        content: userMessage.content
      });
      
      // Get AI response
      const chatMessages = prepareChatMessages(chatHistory);
      const completion = await getChatCompletion(chatMessages);
      
      if (completion && completion.choices && completion.choices.length > 0) {
        const aiResponse = completion.choices[0].message.content;
        
        // Add AI response to UI
        const aiMessage = {
          id: messages.length + 1,
          content: aiResponse,
          isUserMessage: false,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        
        // Save AI message
        await saveMutation.mutateAsync({
          content: aiResponse,
          isUserMessage: false,
          userId: currentUser?.uid,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };
  
  const handleQuickQuery = (query: string) => {
    setInput(query);
    // Focus the textarea
    const textarea = document.getElementById("message-input") as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              StudyAI Chat
              <Button variant="ghost" size="icon" className="text-white hover:text-primary-200">
                <i className="fas fa-info-circle"></i>
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Chat messages container */}
            <div 
              ref={chatContainerRef} 
              className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {isLoadingMessages ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Skeleton className="h-10 w-10 rounded-full mr-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full ml-4" />
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex items-start ${message.isUserMessage ? "justify-end" : ""}`}>
                    {!message.isUserMessage && (
                      <div className="flex-shrink-0 mr-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-white">
                            <i className="fas fa-robot"></i>
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className={`p-3 rounded-lg shadow-sm max-w-xs md:max-w-md ${
                      message.isUserMessage 
                        ? "bg-primary-100 text-gray-800"
                        : "bg-white text-gray-800"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.isUserMessage && (
                      <div className="flex-shrink-0 ml-3">
                        <Avatar>
                          <AvatarImage src={currentUser?.photoURL || undefined} />
                          <AvatarFallback className="bg-gray-200 text-gray-500">
                            <i className="fas fa-user"></i>
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-center justify-center py-2">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="h-2 w-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="h-2 w-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat input area */}
            <div className="px-4 py-3 bg-white border-t">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <Textarea 
                  id="message-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleEnterKey}
                  placeholder="Type your message..."
                  className="flex-grow p-2 resize-none min-h-[40px] max-h-[120px]"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="bg-primary text-white p-2 rounded-lg" 
                  disabled={isLoading || !input.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent queries suggestions */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Quick Queries</h4>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1"
              onClick={() => handleQuickQuery("Scholarship deadlines this month")}
            >
              Scholarship deadlines this month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1"
              onClick={() => handleQuickQuery("MIT admission requirements")}
            >
              MIT admission requirements
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1"
              onClick={() => handleQuickQuery("Computer Science careers")}
            >
              Computer Science careers
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1"
              onClick={() => handleQuickQuery("How to write a personal statement")}
            >
              How to write a personal statement
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isLogin={true}
        setIsLogin={() => {}}
      />
    </div>
  );
};

export default ChatPage;
