import { useState, useEffect, useRef, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, prepareChatMessages, getChatCompletion } from "@/lib/groq";
import { saveChatMessage, getChatMessages, FirebaseChatMessage } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import AuthModal from "@/components/AuthModal";

interface Message {
  id: string | number;
  content: string;
  isUserMessage: boolean;
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages from Firebase when user logs in
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) {
        // Add default welcome message for non-logged in users
        const welcomeMessage = {
          id: 0,
          content: "Hi there! I'm GujaratEduBot, your Gujarat college admissions assistant. I can help with admission requirements, entrance exams, scholarship information, and cutoffs for colleges in Gujarat, India. What would you like to know about Gujarat college admissions today?",
          isUserMessage: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        return;
      }
      
      setIsLoadingMessages(true);
      try {
        const firebaseMessages = await getChatMessages(currentUser.uid);
        console.log("Firebase messages:", firebaseMessages);

        if (firebaseMessages && firebaseMessages.length > 0) {
          // Convert Firebase messages to our local format
          const formattedMessages: Message[] = firebaseMessages.map(msg => ({
            id: msg.id || Date.now().toString(),
            content: msg.content,
            isUserMessage: msg.isUserMessage,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
          }));
          
          setMessages(formattedMessages);
        } else {
          // Add welcome message if no messages
          const welcomeMessage = {
            id: Date.now().toString(),
            content: "Hi there! I'm GujaratEduBot, your Gujarat college admissions assistant. I can help with admission requirements, entrance exams, scholarship information, and cutoffs for colleges in Gujarat, India. What would you like to know about Gujarat college admissions today?",
            isUserMessage: false,
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
          
          // Save welcome message to Firebase
          await saveChatMessage({
            content: welcomeMessage.content,
            isUserMessage: welcomeMessage.isUserMessage,
            userId: currentUser.uid
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load chat history. Please try again.",
          variant: "destructive",
        });
        
        // Still show welcome message if error
        const welcomeMessage = {
          id: Date.now().toString(),
          content: "Hi there! I'm GujaratEduBot, your Gujarat college admissions assistant. I can help with admission requirements, entrance exams, scholarship information, and cutoffs for colleges in Gujarat, India. What would you like to know about Gujarat college admissions today?",
          isUserMessage: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [currentUser, toast]);
  
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
      id: Date.now(),
      content: input.trim(),
      isUserMessage: true,
      timestamp: new Date(),
    };
    
    // Add user message to UI
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Save user message to Firebase
      await saveChatMessage({
        content: userMessage.content,
        isUserMessage: true,
        userId: currentUser.uid
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
          id: Date.now() + 1,
          content: aiResponse,
          isUserMessage: false,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        
        // Save AI message to Firebase
        await saveChatMessage({
          content: aiResponse,
          isUserMessage: false,
          userId: currentUser.uid
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
              Gujarat College Admissions Assistant
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
              onClick={() => handleQuickQuery("Gujarat University admission requirements")}
            >
              Gujarat University admission requirements
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1"
              onClick={() => handleQuickQuery("GUJCET exam details and dates")}
            >
              GUJCET exam details and dates
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1"
              onClick={() => handleQuickQuery("Top engineering colleges in Gujarat")}
            >
              Top engineering colleges in Gujarat
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1"
              onClick={() => handleQuickQuery("Medical college cutoffs in Gujarat")}
            >
              Medical college cutoffs in Gujarat
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
