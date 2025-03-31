import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { apiRequest } from "./queryClient";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Register user with email and password
export const registerWithEmailAndPassword = async (
  username: string,
  email: string, 
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user in our backend
    await apiRequest("POST", "/api/users", {
      username,
      email,
      password: "firebase-auth", // We don't store the actual password
      firebaseId: user.uid
    });
    
    return user;
  } catch (error: any) {
    console.error("Error registering with email and password:", error);
    throw error;
  }
};

// Login with email and password
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error logging in with email and password:", error);
    throw error;
  }
};

// Login with Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create user in our backend if they don't exist
    try {
      await apiRequest("POST", "/api/users", {
        username: user.displayName || user.email?.split('@')[0] || 'user',
        email: user.email || '',
        password: "firebase-auth", // We don't store the actual password
        firebaseId: user.uid
      });
    } catch (error) {
      // User might already exist, which is fine
      console.log("User might already exist in the backend", error);
    }
    
    return user;
  } catch (error: any) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };
