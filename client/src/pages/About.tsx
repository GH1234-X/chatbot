import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              About EduAssistAI
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Helping students navigate their educational journey with AI-powered guidance
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                EduAssistAI was created with a simple yet powerful mission: to democratize access to educational guidance and information. We believe that every student deserves personalized support on their academic journey, regardless of their background or resources.
              </p>
              <p className="text-gray-700 mb-4">
                By leveraging advanced AI technology, specifically the Groq Cloud API, we provide instant, accurate answers to students' questions about college admissions, scholarships, career paths, and more. Our goal is to empower students with the information they need to make confident decisions about their education.
              </p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-700 mb-4">
                EduAssistAI combines cutting-edge AI technology with comprehensive educational databases to provide personalized assistance:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>AI-Powered Chat:</strong> Our chatbot utilizes the Groq Cloud API to understand and respond to your questions with relevant, accurate information.</li>
                <li><strong>Personalized Recommendations:</strong> Create an account to receive tailored suggestions based on your profile and interests.</li>
                <li><strong>Comprehensive Resources:</strong> Access our curated database of scholarships and college cutoffs.</li>
                <li><strong>Secure Experience:</strong> We use Firebase authentication to ensure your data remains protected and private.</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Our Team</h2>
              <p className="text-gray-700 mb-4">
                EduAssistAI was developed by a team of educators, technologists, and students who understand the challenges of navigating the educational landscape. We combine expertise in artificial intelligence, educational consulting, and user experience design to create a platform that truly serves students' needs.
              </p>
              <p className="text-gray-700">
                Our team is committed to continuously improving EduAssistAI by incorporating user feedback, updating our educational resources, and enhancing our AI capabilities to provide the most accurate and helpful guidance possible.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                Have questions, feedback, or suggestions? We'd love to hear from you! Reach out to our team at <a href="mailto:contact@eduassistai.com" className="text-primary-600 hover:text-primary-500">contact@eduassistai.com</a>.
              </p>
              <p className="text-gray-700">
                For technical support or account-related inquiries, please email <a href="mailto:support@eduassistai.com" className="text-primary-600 hover:text-primary-500">support@eduassistai.com</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
