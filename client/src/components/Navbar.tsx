import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary-600 text-xl font-bold cursor-pointer">
                  EduAssistAI
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                {({ isActive }) => (
                  <span className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive ? "border-primary-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}>
                    Home
                  </span>
                )}
              </Link>
              <Link href="/chat">
                {({ isActive }) => (
                  <span className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive ? "border-primary-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}>
                    Chat
                  </span>
                )}
              </Link>
              <Link href="/cutoffs">
                {({ isActive }) => (
                  <span className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive ? "border-primary-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}>
                    Cutoffs
                  </span>
                )}
              </Link>
              <Link href="/scholarships">
                {({ isActive }) => (
                  <span className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive ? "border-primary-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}>
                    Scholarships
                  </span>
                )}
              </Link>
              <Link href="/about">
                {({ isActive }) => (
                  <span className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive ? "border-primary-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}>
                    About
                  </span>
                )}
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!user ? (
              <div className="flex space-x-4">
                <Link href="/login">
                  <Button variant="outline" className="text-sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary-600 hover:bg-primary-700 text-sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src={profile?.photoURL || ""} alt={profile?.displayName || user.email || ""} />
                      <AvatarFallback>
                        {(profile?.displayName || user.email || "").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {profile?.displayName || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              {({ isActive }) => (
                <span className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive ? "bg-primary-50 border-primary-500 text-primary-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Home
                </span>
              )}
            </Link>
            <Link href="/chat">
              {({ isActive }) => (
                <span className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive ? "bg-primary-50 border-primary-500 text-primary-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Chat
                </span>
              )}
            </Link>
            <Link href="/cutoffs">
              {({ isActive }) => (
                <span className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive ? "bg-primary-50 border-primary-500 text-primary-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Cutoffs
                </span>
              )}
            </Link>
            <Link href="/scholarships">
              {({ isActive }) => (
                <span className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive ? "bg-primary-50 border-primary-500 text-primary-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  Scholarships
                </span>
              )}
            </Link>
            <Link href="/about">
              {({ isActive }) => (
                <span className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive ? "bg-primary-50 border-primary-500 text-primary-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}>
                  About
                </span>
              )}
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {!user ? (
              <div className="space-y-2 px-4">
                <Link href="/signup">
                  <Button className="w-full bg-primary-600 hover:bg-primary-700">
                    Sign up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarImage src={profile?.photoURL || ""} alt={profile?.displayName || user.email || ""} />
                      <AvatarFallback>
                        {(profile?.displayName || user.email || "").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {profile?.displayName || "User"}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign out
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
