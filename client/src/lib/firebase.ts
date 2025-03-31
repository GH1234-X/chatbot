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
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
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
const db = getFirestore(app);
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

// Firestore college cutoffs functions
export interface FirebaseCollegeCutoff {
  id?: string;
  university: string;
  program: string;
  country: string;
  gpa: string;
  testScores: string;
  acceptanceRate: string;
  academicYear: string;
}

// Fetch college cutoffs from Firestore
export const getCollegeCutoffs = async (filters?: Partial<FirebaseCollegeCutoff>): Promise<FirebaseCollegeCutoff[]> => {
  try {
    const cutoffsCollectionRef = collection(db, "collegeCutoffs");
    let queryRef = query(cutoffsCollectionRef);
    
    // Apply filters if they exist
    if (filters) {
      if (filters.university) {
        queryRef = query(queryRef, where("university", "==", filters.university));
      }
      if (filters.program) {
        queryRef = query(queryRef, where("program", "==", filters.program));
      }
      if (filters.country) {
        queryRef = query(queryRef, where("country", "==", filters.country));
      }
      if (filters.academicYear) {
        queryRef = query(queryRef, where("academicYear", "==", filters.academicYear));
      }
    }
    
    const querySnapshot = await getDocs(queryRef);
    const cutoffs: FirebaseCollegeCutoff[] = [];
    
    querySnapshot.forEach((doc) => {
      cutoffs.push({
        id: doc.id,
        ...doc.data() as Omit<FirebaseCollegeCutoff, 'id'>
      });
    });
    
    return cutoffs;
  } catch (error) {
    console.error("Error fetching college cutoffs from Firebase:", error);
    throw error;
  }
};

// Get unique programs from Firestore
export const getUniquePrograms = async (): Promise<string[]> => {
  try {
    const cutoffsCollectionRef = collection(db, "collegeCutoffs");
    const querySnapshot = await getDocs(cutoffsCollectionRef);
    const programs = new Set<string>();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.program) {
        programs.add(data.program);
      }
    });
    
    return Array.from(programs).sort();
  } catch (error) {
    console.error("Error fetching unique programs from Firebase:", error);
    throw error;
  }
};

// Get unique universities from Firestore
export const getUniqueUniversities = async (): Promise<string[]> => {
  try {
    const cutoffsCollectionRef = collection(db, "collegeCutoffs");
    const querySnapshot = await getDocs(cutoffsCollectionRef);
    const universities = new Set<string>();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.university) {
        universities.add(data.university);
      }
    });
    
    return Array.from(universities).sort();
  } catch (error) {
    console.error("Error fetching unique universities from Firebase:", error);
    throw error;
  }
};

// Get unique countries from Firestore
export const getUniqueCountries = async (): Promise<string[]> => {
  try {
    const cutoffsCollectionRef = collection(db, "collegeCutoffs");
    const querySnapshot = await getDocs(cutoffsCollectionRef);
    const countries = new Set<string>();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.country) {
        countries.add(data.country);
      }
    });
    
    return Array.from(countries).sort();
  } catch (error) {
    console.error("Error fetching unique countries from Firebase:", error);
    throw error;
  }
};

export { auth, db };
