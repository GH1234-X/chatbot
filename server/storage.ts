import { 
  users, 
  type User, 
  type InsertUser, 
  chatMessages, 
  type ChatMessage, 
  collegeCutoffs, 
  type CollegeCutoff, 
  scholarships, 
  type Scholarship,
  type InsertChatMessage,
  type InsertCollegeCutoff,
  type InsertScholarship
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat message operations
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // College cutoffs operations
  getCollegeCutoffs(filters?: Partial<CollegeCutoff>): Promise<CollegeCutoff[]>;
  createCollegeCutoff(cutoff: InsertCollegeCutoff): Promise<CollegeCutoff>;
  getUniqueCollegeCutoffPrograms(): Promise<string[]>;
  getUniqueCollegeCutoffUniversities(): Promise<string[]>;
  getUniqueCollegeCutoffCountries(): Promise<string[]>;
  
  // Scholarship operations
  getScholarships(filters?: Partial<Scholarship>): Promise<Scholarship[]>;
  createScholarship(scholarship: InsertScholarship): Promise<Scholarship>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, ChatMessage>;
  private cutoffs: Map<number, CollegeCutoff>;
  private scholarships: Map<number, Scholarship>;
  private userId: number;
  private messageId: number;
  private cutoffId: number;
  private scholarshipId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.cutoffs = new Map();
    this.scholarships = new Map();
    this.userId = 1;
    this.messageId = 1;
    this.cutoffId = 1;
    this.scholarshipId = 1;
    
    // Seed college cutoffs with sample data
    this.seedCollegeCutoffs();
  }
  
  private seedCollegeCutoffs() {
    const sampleCutoffs: InsertCollegeCutoff[] = [
      {
        university: "Harvard University",
        program: "Computer Science",
        country: "United States",
        gpa: "3.9+",
        testScores: "SAT: 1550+",
        acceptanceRate: "5%",
        academicYear: "2023-2024"
      },
      {
        university: "Stanford University",
        program: "Computer Science",
        country: "United States",
        gpa: "3.9+",
        testScores: "SAT: 1500+",
        acceptanceRate: "4%",
        academicYear: "2023-2024"
      },
      {
        university: "MIT",
        program: "Computer Science",
        country: "United States",
        gpa: "3.9+",
        testScores: "SAT: 1540+",
        acceptanceRate: "7%",
        academicYear: "2023-2024"
      },
      {
        university: "Oxford University",
        program: "Computer Science",
        country: "United Kingdom",
        gpa: "3.8+",
        testScores: "A* A* A",
        acceptanceRate: "15%",
        academicYear: "2023-2024"
      },
      {
        university: "University of Toronto",
        program: "Computer Science",
        country: "Canada",
        gpa: "3.7+",
        testScores: "90%+",
        acceptanceRate: "25%",
        academicYear: "2023-2024"
      },
      {
        university: "Stanford University",
        program: "Medicine",
        country: "United States",
        gpa: "3.9+",
        testScores: "MCAT: 518+",
        acceptanceRate: "2%",
        academicYear: "2023-2024"
      },
      {
        university: "Harvard University",
        program: "Business",
        country: "United States",
        gpa: "3.8+",
        testScores: "GMAT: 730+",
        acceptanceRate: "10%",
        academicYear: "2023-2024"
      },
      {
        university: "University of Melbourne",
        program: "Engineering",
        country: "Australia",
        gpa: "3.5+",
        testScores: "ATAR: 95+",
        acceptanceRate: "30%",
        academicYear: "2023-2024"
      },
      {
        university: "University of British Columbia",
        program: "Computer Science",
        country: "Canada",
        gpa: "3.6+",
        testScores: "85%+",
        acceptanceRate: "20%",
        academicYear: "2023-2024"
      },
      {
        university: "Imperial College London",
        program: "Engineering",
        country: "United Kingdom",
        gpa: "3.7+",
        testScores: "A* A A",
        acceptanceRate: "12%",
        academicYear: "2023-2024"
      }
    ];
    
    // Add each sample cutoff to the storage
    sampleCutoffs.forEach(cutoff => {
      this.createCollegeCutoff(cutoff);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseId === firebaseId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Chat message operations
  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.userId === userId || message.userId === undefined
    );
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.messageId++;
    const timestamp = new Date();
    const chatMessage: ChatMessage = { ...message, id, timestamp };
    this.messages.set(id, chatMessage);
    return chatMessage;
  }

  // College cutoffs operations
  async getCollegeCutoffs(filters?: Partial<CollegeCutoff>): Promise<CollegeCutoff[]> {
    if (!filters) {
      return Array.from(this.cutoffs.values());
    }

    return Array.from(this.cutoffs.values()).filter(cutoff => {
      for (const [key, value] of Object.entries(filters)) {
        if (cutoff[key as keyof CollegeCutoff] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async createCollegeCutoff(cutoff: InsertCollegeCutoff): Promise<CollegeCutoff> {
    const id = this.cutoffId++;
    const collegeCutoff: CollegeCutoff = { ...cutoff, id };
    this.cutoffs.set(id, collegeCutoff);
    return collegeCutoff;
  }
  
  async getUniqueCollegeCutoffPrograms(): Promise<string[]> {
    const allCutoffs = Array.from(this.cutoffs.values());
    const uniquePrograms = new Set<string>();
    
    // Add "All" as the first option
    uniquePrograms.add("All");
    
    // Add all unique programs from the cutoffs
    allCutoffs.forEach(cutoff => {
      if (cutoff.program) {
        uniquePrograms.add(cutoff.program);
      }
    });
    
    return Array.from(uniquePrograms);
  }
  
  async getUniqueCollegeCutoffUniversities(): Promise<string[]> {
    const allCutoffs = Array.from(this.cutoffs.values());
    const uniqueUniversities = new Set<string>();
    
    // Add "All" as the first option
    uniqueUniversities.add("All");
    
    // Add all unique universities from the cutoffs
    allCutoffs.forEach(cutoff => {
      if (cutoff.university) {
        uniqueUniversities.add(cutoff.university);
      }
    });
    
    return Array.from(uniqueUniversities);
  }
  
  async getUniqueCollegeCutoffCountries(): Promise<string[]> {
    const allCutoffs = Array.from(this.cutoffs.values());
    const uniqueCountries = new Set<string>();
    
    // Add "All" as the first option
    uniqueCountries.add("All");
    
    // Add all unique countries from the cutoffs
    allCutoffs.forEach(cutoff => {
      if (cutoff.country) {
        uniqueCountries.add(cutoff.country);
      }
    });
    
    return Array.from(uniqueCountries);
  }

  // Scholarship operations
  async getScholarships(filters?: Partial<Scholarship>): Promise<Scholarship[]> {
    if (!filters) {
      return Array.from(this.scholarships.values());
    }

    return Array.from(this.scholarships.values()).filter(scholarship => {
      for (const [key, value] of Object.entries(filters)) {
        if (scholarship[key as keyof Scholarship] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async createScholarship(scholarship: InsertScholarship): Promise<Scholarship> {
    const id = this.scholarshipId++;
    const newScholarship: Scholarship = { ...scholarship, id };
    this.scholarships.set(id, newScholarship);
    return newScholarship;
  }
}

export const storage = new MemStorage();
