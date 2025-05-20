import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original users table - keeping for reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Analysis Schema
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  inputType: text("input_type").notNull(), // 'story', 'requirements', 'code'
  experienceLevel: text("experience_level").notNull(),
  technologies: text("technologies"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

// Input and Output Types for API
export const inputSchema = z.object({
  inputType: z.enum(["text", "file", "mixed"]),
  content: z.string().min(1, "Content is required"),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  // No code language field - AI detects automatically
});

export type AnalysisInput = z.infer<typeof inputSchema>;

export type AnalysisOutput = {
  id: number;
  title: string;
  taskSummary: {
    description: string;
    steps: string[];
  };
  approach: {
    sections: {
      title: string;
      description: string;
      code?: string;
      isRecommended?: boolean;
    }[];
  };
  reusableCode: {
    description: string;
    code: string;
    language: string;
    similarIn?: string;
  };
  resources: {
    description: string;
    items: {
      type: string;
      title: string;
      description: string;
      duration?: string;
      icon: string;
    }[];
  };
  beginnerTips: {
    analogy: string;
    explanation: string;
    keyPoints: string[];
  };
  technologies: string[];
  createdAt: Date;
};
