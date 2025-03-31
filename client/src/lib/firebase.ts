import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from "firebase/auth";

// Check if Firebase config is available
const hasFirebaseConfig = 
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID && 
  import.meta.env.VITE_FIREBASE_APP_ID;

// Define types for our mock auth
interface MockAuth {
  currentUser: null;
  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => () => void;
}

// Variables to hold our auth instances
let authInstance: Auth | MockAuth;
let googleProviderInstance: GoogleAuthProvider | null = null;

// Create a mock implementation when Firebase is not available
function createMockAuth(): MockAuth {
  console.warn("Using mock authentication - Firebase is not configured.");
  return {
    currentUser: null,
    onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
      setTimeout(() => callback(null), 0);
      return () => {}; // Return a no-op unsubscribe function
    }
  };
}

// Initialize Firebase if possible, otherwise use mock
function initializeFirebase() {
  if (hasFirebaseConfig) {
    try {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };
      
      const app = initializeApp(firebaseConfig);
      authInstance = getAuth(app);
      googleProviderInstance = new GoogleAuthProvider();
      console.log("Firebase initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      authInstance = createMockAuth();
      return false;
    }
  } else {
    authInstance = createMockAuth();
    return false;
  }
}

// Initialize Firebase or mock
const isFirebaseInitialized = initializeFirebase();

// Authentication functions with fallbacks
export const signInWithEmail = (email: string, password: string) => {
  if (!isFirebaseInitialized) {
    return Promise.reject(new Error("Firebase is not configured. Please add API keys."));
  }
  return signInWithEmailAndPassword(authInstance as Auth, email, password);
};

export const signUpWithEmail = (email: string, password: string) => {
  if (!isFirebaseInitialized) {
    return Promise.reject(new Error("Firebase is not configured. Please add API keys."));
  }
  return createUserWithEmailAndPassword(authInstance as Auth, email, password);
};

export const signInWithGoogle = () => {
  if (!isFirebaseInitialized || !googleProviderInstance) {
    return Promise.reject(new Error("Firebase is not configured. Please add API keys."));
  }
  return signInWithPopup(authInstance as Auth, googleProviderInstance);
};

export const signOut = () => {
  if (!isFirebaseInitialized) {
    return Promise.resolve();
  }
  return firebaseSignOut(authInstance as Auth);
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return authInstance.onAuthStateChanged(callback);
};

// Export the auth instance
export { authInstance as auth };
