import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import AuthModal from "@/components/AuthModal";

const HomePage = () => {
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Your AI-powered</span>{" "}
                  <span className="block text-primary xl:inline">study companion</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Get instant answers to your academic questions, explore scholarship opportunities, and access college cutoff information - all in one place.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {currentUser ? (
                    <div className="rounded-md shadow">
                      <Link href="/chat">
                        <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10">
                          Start Chatting
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <Button 
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10"
                          onClick={() => {
                            setIsLogin(false);
                            setAuthModalOpen(true);
                          }}
                        >
                          Get Started
                        </Button>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Button 
                          variant="outline"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10"
                          onClick={() => {
                            setIsLogin(true);
                            setAuthModalOpen(true);
                          }}
                        >
                          Learn More
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
            alt="Students collaborating"
          />
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for academic success
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              StudyAI combines AI-powered assistance with comprehensive academic resources to help you excel.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="fas fa-robot"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">AI-Powered Conversations</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Get instant answers to academic questions through our advanced AI chatbot that understands your educational needs.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Scholarship Database</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Access a comprehensive database of scholarships filtered by eligibility criteria, deadline, and value.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="fas fa-university"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">College Cutoffs</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Stay informed with the latest cutoff data for colleges and universities across various programs and specializations.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Access Anywhere</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Our responsive design works flawlessly across desktop, tablet, and mobile devices, giving you access wherever you are.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-gray-50 pt-16 lg:py-24">
        <div className="pb-16 bg-primary lg:pb-0 lg:z-10 lg:relative">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="relative lg:-my-8">
              <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:p-0 lg:h-full">
                <div className="aspect-w-10 aspect-h-6 rounded-xl shadow-xl overflow-hidden sm:aspect-w-16 sm:aspect-h-7 lg:aspect-none lg:h-full">
                  <img
                    className="object-cover lg:h-full lg:w-full"
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="Student using laptop"
                  />
                </div>
              </div>
            </div>
            <div className="mt-12 lg:m-0 lg:col-span-2 lg:pl-8">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:px-0 lg:py-20 lg:max-w-none">
                <blockquote>
                  <div>
                    <svg
                      className="h-12 w-12 text-white opacity-25"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="mt-6 text-2xl font-medium text-white">
                      StudyAI has completely transformed my college application process. I found scholarships I didn't even know existed and got accurate information about college cutoffs that helped me make better decisions.
                    </p>
                  </div>
                  <footer className="mt-6">
                    <p className="text-base font-medium text-white">Aisha Johnson</p>
                    <p className="text-base font-medium text-primary-100">Computer Science Student, MIT</p>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary">Create your free account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white"
                onClick={() => {
                  setIsLogin(false);
                  setAuthModalOpen(true);
                }}
              >
                Sign up for free
              </Button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Button
                variant="outline"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md"
                onClick={() => {
                  setIsLogin(true);
                  setAuthModalOpen(true);
                }}
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
    </div>
  );
};

export default HomePage;
