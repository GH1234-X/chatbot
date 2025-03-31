import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function SignUpCTA() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="bg-primary-700">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Take your education journey to the next level</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-primary-100">
          Create a free account to save your conversations, get personalized recommendations, and access exclusive resources.
        </p>
        <Link href="/signup">
          <Button 
            variant="outline" 
            size="lg" 
            className="mt-8 bg-white text-primary-600 hover:bg-primary-50 font-medium"
          >
            Sign up for free
          </Button>
        </Link>
      </div>
    </div>
  );
}
