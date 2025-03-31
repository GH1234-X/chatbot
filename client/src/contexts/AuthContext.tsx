import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth, onAuthChange } from "@/lib/firebase";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Try to get user profile from our API
          const response = await fetch(`/api/users/firebase/${firebaseUser.uid}`, {
            credentials: "include",
          });
          
          if (response.ok) {
            const userProfile = await response.json();
            setProfile(userProfile);
          } else {
            // Create new user profile if not found
            if (response.status === 404) {
              const newUser = {
                email: firebaseUser.email!,
                username: firebaseUser.email!.split('@')[0],
                firebaseUid: firebaseUser.uid,
                displayName: firebaseUser.displayName || null,
                photoURL: firebaseUser.photoURL || null,
              };
              
              const createResponse = await apiRequest("POST", "/api/users", newUser);
              if (createResponse.ok) {
                const createdProfile = await createResponse.json();
                setProfile(createdProfile);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
