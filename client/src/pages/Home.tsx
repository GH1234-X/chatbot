import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import ChatInterface from "@/components/ChatInterface";
import ResourcesSection from "@/components/ResourcesSection";
import SignUpCTA from "@/components/SignUpCTA";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        
        <div id="chat-section" className="py-12 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Ask EduAssistAI
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Get instant answers about scholarships, cutoffs, career options, and more.
              </p>
            </div>
            
            <ChatInterface />
          </div>
        </div>
        
        <ResourcesSection />
        <SignUpCTA />
      </main>
      
      <Footer />
    </div>
  );
}
