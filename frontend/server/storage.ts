import { 
  users,
  analyses, 
  type User,
  type InsertUser,
  type Analysis, 
  type InsertAnalysis 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Analysis methods
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysis(id: number): Promise<Analysis | undefined>;
  getRecentAnalyses(limit?: number): Promise<Analysis[]>;
}

// PostgreSQL Database Storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    // Ensure technologies is not undefined
    const analysisData = {
      ...insertAnalysis,
      technologies: insertAnalysis.technologies || null
    };
    
    const [analysis] = await db.insert(analyses).values(analysisData).returning();
    return analysis;
  }

  async getAnalysis(id: number): Promise<Analysis | undefined> {
    const [analysis] = await db.select().from(analyses).where(eq(analyses.id, id));
    return analysis;
  }

  async getRecentAnalyses(limit: number = 10): Promise<Analysis[]> {
    const results = await db
      .select()
      .from(analyses)
      .orderBy(desc(analyses.createdAt))
      .limit(limit);
    
    return results;
  }
}

// Export an instance of DatabaseStorage
export const storage = new DatabaseStorage();
