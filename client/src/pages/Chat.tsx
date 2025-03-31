import { useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatInterface from "@/components/ChatInterface";
import { useAuth } from "@/contexts/AuthContext";

export default function Chat() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Your AI Assistant
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Ask questions about educational topics and get instant answers
            </p>
          </div>
          
          <ChatInterface />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
