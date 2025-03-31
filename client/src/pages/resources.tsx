import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ResourcesPage = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Resources</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Academic Information Hub
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Access the latest information on college cutoffs and scholarship opportunities to help you plan your academic journey.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-primary/10 flex items-center justify-center">
              <i className="fas fa-cogs text-6xl text-primary"></i>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Engineering Cutoffs</h3>
              <p className="text-gray-600 mb-4">
                Detailed cutoff ranks for engineering programs in Gujarat colleges, organized by category and course.
              </p>
              <Link href="/engineering-cutoffs">
                <Button>
                  View Engineering Cutoffs <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-primary/10 flex items-center justify-center">
              <i className="fas fa-graduation-cap text-6xl text-primary"></i>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Scholarships</h3>
              <p className="text-gray-600 mb-4">
                Discover scholarship opportunities based on your field of study, eligibility criteria, and application deadlines.
              </p>
              <Link href="/resources/scholarships">
                <Button>
                  Browse Scholarships <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-primary/10 flex items-center justify-center">
              <i className="fas fa-map-marker-alt text-6xl text-primary"></i>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Colleges by Location</h3>
              <p className="text-gray-600 mb-4">
                Find colleges in Gujarat based on district, location and program type to discover educational opportunities near you.
              </p>
              <Link href="/colleges-by-location">
                <Button>
                  Find Colleges <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Need personalized advice?</h3>
              <p className="text-gray-600">
                Try our AI chatbot for instant answers to your specific questions about colleges, scholarships, and more.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Link href="/chat">
                <Button size="lg" className="px-8">
                  Start Chatting <i className="fas fa-comments ml-2"></i>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
