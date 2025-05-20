import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { inputSchema, type AnalysisOutput } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Endpoints
  app.post("/api/analyze", async (req, res) => {
    try {
      const validatedInput = inputSchema.parse(req.body);
      
      // Generate title from content
      const title = generateTitle(validatedInput.content);
      
      // Generate mock analysis result
      const analysisResult = await generateAnalysisResult(validatedInput, title);
      
      // Store the analysis
      const savedAnalysis = await storage.createAnalysis({
        title: title,
        content: validatedInput.content,
        inputType: validatedInput.inputType,
        experienceLevel: validatedInput.experienceLevel,
        technologies: analysisResult.technologies.join(", "),
      });
      
      // Return combined result
      res.json({
        ...analysisResult,
        id: savedAnalysis.id,
        createdAt: savedAnalysis.createdAt
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Failed to analyze input" });
    }
  });

  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getRecentAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      res.status(500).json({ message: "Failed to fetch analyses" });
    }
  });

  app.get("/api/analyses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const analysis = await storage.getAnalysis(id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      // Generate a consistent analysis result based on the stored data
      const analysisResult = generateAnalysisResultFromStored(analysis);
      
      res.json(analysisResult);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for generating mock analysis results
function generateTitle(content: string): string {
  // Extract a title from the content (first sentence or truncated)
  const firstSentence = content.split(/[.?!]/)[0];
  return firstSentence.length > 50 
    ? firstSentence.substring(0, 50) + "..." 
    : firstSentence;
}

async function generateAnalysisResult(
  input: z.infer<typeof inputSchema>, 
  title: string
): Promise<Omit<AnalysisOutput, "id" | "createdAt">> {
  // Extract technologies from input
  const technologies = extractTechnologies(input.content);
  
  // Generate response based on input type
  let result: Omit<AnalysisOutput, "id" | "createdAt">;
  
  if (input.content.toLowerCase().includes("redis") || input.content.toLowerCase().includes("caching")) {
    // Redis caching example (pre-defined)
    result = getRedisCachingAnalysis(title, technologies);
  } else if (input.content.toLowerCase().includes("authentication") || input.content.toLowerCase().includes("auth")) {
    // Authentication example
    result = getAuthenticationAnalysis(title, technologies);
  } else {
    // Generic response
    result = getGenericAnalysis(title, input, technologies);
  }
  
  return result;
}

function generateAnalysisResultFromStored(analysis: any): AnalysisOutput {
  // Regenerate a full analysis result from the stored basic information
  const technologies = analysis.technologies ? analysis.technologies.split(", ") : [];
  
  if (analysis.content.toLowerCase().includes("redis") || analysis.content.toLowerCase().includes("caching")) {
    // Redis caching example
    return {
      ...getRedisCachingAnalysis(analysis.title, technologies),
      id: analysis.id,
      createdAt: analysis.createdAt,
    };
  } else if (analysis.content.toLowerCase().includes("authentication") || analysis.content.toLowerCase().includes("auth")) {
    // Authentication example
    return {
      ...getAuthenticationAnalysis(analysis.title, technologies),
      id: analysis.id,
      createdAt: analysis.createdAt,
    };
  } else {
    // Generic response
    return {
      ...getGenericAnalysis(
        analysis.title,
        {
          content: analysis.content,
          inputType: analysis.inputType,
          experienceLevel: analysis.experienceLevel,
          additionalContext: "",
        },
        technologies
      ),
      id: analysis.id,
      createdAt: analysis.createdAt,
    };
  }
}

function extractTechnologies(content: string): string[] {
  const techKeywords = [
    "React", "Node.js", "JavaScript", "TypeScript", "Python", "Java", "C#",
    "Redis", "MongoDB", "PostgreSQL", "MySQL", "Firebase", "AWS", "Azure",
    "Docker", "Kubernetes", "REST", "GraphQL", "Express", "Flask", "Django",
    "Angular", "Vue", "Svelte", "Next.js", "Gatsby"
  ];
  
  return techKeywords.filter(tech => 
    content.toLowerCase().includes(tech.toLowerCase())
  );
}

function getRedisCachingAnalysis(title: string, technologies: string[]): Omit<AnalysisOutput, "id" | "createdAt"> {
  return {
    title,
    taskSummary: {
      description: "You're building a fast-access layer using Redis to store frequently requested user profiles to improve application performance and reduce database load.",
      steps: [
        "Setting up Redis as a caching system",
        "Implementing cache-first retrieval logic",
        "Managing cache invalidation/expiration",
        "Handling fallback when cache misses"
      ]
    },
    approach: {
      sections: [
        {
          title: "Setup Redis Client",
          description: "First, install and configure the Redis client library for your backend.",
          code: "npm install redis"
        },
        {
          title: "Create Cache Strategy",
          description: "Implement the cache-aside pattern - check cache first, then database if needed.",
          isRecommended: true
        },
        {
          title: "Set Cache Expiration",
          description: "Use Time-To-Live (TTL) to ensure data freshness. For user profiles, consider 30-60 minutes."
        },
        {
          title: "Handle Cache Invalidation",
          description: "Invalidate cache when user data changes (after profile updates)."
        }
      ]
    },
    reusableCode: {
      description: "Your code shows a good caching implementation, but here's an improved version with error handling:",
      language: "javascript",
      code: `// Improved caching implementation with error handling
async function getUserProfileWithCache(userId) {
  try {
    // Try to get from cache first
    const cachedProfile = await redisClient.get(\`user:\${userId}\`);
    
    if (cachedProfile) {
      console.log('Cache hit for user profile');
      return JSON.parse(cachedProfile);
    }
    
    // Cache miss - get from database
    console.log('Cache miss for user profile');
    const userProfile = await getUserProfileFromDB(userId);
    
    // Store in cache if we got data
    if (userProfile) {
      await redisClient.set(
        \`user:\${userId}\`, 
        JSON.stringify(userProfile),
        'EX',
        3600 // 1 hour expiration
      );
    }
    
    return userProfile;
  } catch (error) {
    console.error('Error in profile cache:', error);
    // Fallback to database on cache error
    return getUserProfileFromDB(userId);
  }
}`,
      similarIn: "sessionController.js"
    },
    resources: {
      description: "These resources will help you implement and understand Redis caching:",
      items: [
        {
          type: "video",
          title: "Redis Caching in Node.js 101",
          description: "Learn the fundamentals of implementing Redis caching with practical examples",
          duration: "15min",
          icon: "video"
        },
        {
          type: "document",
          title: "Company Redis Integration Guide",
          description: "Caching best practices and patterns used throughout our codebase",
          icon: "file-alt"
        }
      ]
    },
    beginnerTips: {
      analogy: "Think of Redis like a whiteboard you use to jot down answers to common questions, so you don't have to search the entire textbook every time.",
      explanation: "When someone asks for user info, you first check your whiteboard (Redis). If it's there, you save time! If not, you look it up in the textbook (database) and then write it on the whiteboard for next time.",
      keyPoints: [
        "Redis stores data in memory (like RAM) which makes it super fast",
        "Always have a \"fallback plan\" if Redis fails or doesn't have the data",
        "Set expiration times so you don't work with outdated information"
      ]
    },
    technologies: technologies.length > 0 ? technologies : ["Redis", "Node.js"]
  };
}

function getAuthenticationAnalysis(title: string, technologies: string[]): Omit<AnalysisOutput, "id" | "createdAt"> {
  return {
    title,
    taskSummary: {
      description: "You're implementing a user authentication flow to securely verify user identities and manage access to protected resources in your application.",
      steps: [
        "Creating user registration endpoint/flow",
        "Implementing secure login functionality",
        "Setting up session management",
        "Protecting routes/resources with auth middleware"
      ]
    },
    approach: {
      sections: [
        {
          title: "User Registration",
          description: "Implement a secure user registration flow with proper validation and password hashing.",
          code: "npm install bcrypt"
        },
        {
          title: "Authentication Strategy",
          description: "Use JWT or session-based authentication depending on your application needs.",
          isRecommended: true
        },
        {
          title: "Secure Password Storage",
          description: "Never store plaintext passwords. Use bcrypt or Argon2 for password hashing."
        },
        {
          title: "Add Authentication Middleware",
          description: "Create middleware to verify authentication on protected routes."
        }
      ]
    },
    reusableCode: {
      description: "Here's a secure authentication middleware implementation:",
      language: "javascript",
      code: `// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from request header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid authentication' });
  }
};`,
      similarIn: "authController.js"
    },
    resources: {
      description: "These resources will help you implement secure authentication:",
      items: [
        {
          type: "article",
          title: "JWT Authentication Best Practices",
          description: "Learn how to properly implement JWT authentication in your application",
          icon: "book"
        },
        {
          type: "document",
          title: "OWASP Authentication Cheatsheet",
          description: "Security-focused guide to implementing proper authentication",
          icon: "shield-alt"
        }
      ]
    },
    beginnerTips: {
      analogy: "Think of authentication like a nightclub with a bouncer. The bouncer (your auth system) checks IDs (credentials) at the door, gives approved guests a wristband (token/session), and then other staff can quickly check for the wristband instead of re-checking ID.",
      explanation: "Your auth system first verifies who someone is (authentication), then gives them a secure token or session that proves they've been checked. This way, they don't have to re-enter passwords for every protected page or action.",
      keyPoints: [
        "Never store plain passwords - always hash them",
        "Use established libraries rather than writing your own auth code",
        "Consider security factors like token expiration and refresh strategies"
      ]
    },
    technologies: technologies.length > 0 ? technologies : ["Express.js", "JWT", "bcrypt"]
  };
}

function getGenericAnalysis(
  title: string, 
  input: {
    content: string;
    inputType: string;
    experienceLevel: string;
    additionalContext?: string;
  },
  technologies: string[]
): Omit<AnalysisOutput, "id" | "createdAt"> {
  // Create a generic analysis based on the input content
  const sentences = input.content.split(/[.!?]/).filter(s => s.trim().length > 0);
  const keywords = extractKeywords(input.content);
  
  return {
    title,
    taskSummary: {
      description: `You're working on ${title.toLowerCase()}. This involves analyzing the requirements, planning implementation steps, and following best practices for the technologies involved.`,
      steps: [
        "Understand the full requirements and scope",
        "Plan the implementation approach",
        "Set up the required technologies and environment",
        "Implement the core functionality"
      ]
    },
    approach: {
      sections: [
        {
          title: "Understand Requirements",
          description: "First, make sure you understand the complete scope of the task and any constraints."
        },
        {
          title: "Design System Architecture",
          description: "Map out how the components will interact and what technologies to use.",
          isRecommended: true
        },
        {
          title: "Implement Core Logic",
          description: "Focus on building the essential functionality first before adding additional features."
        },
        {
          title: "Test and Refine",
          description: "Create comprehensive tests and refine the implementation based on feedback."
        }
      ]
    },
    reusableCode: {
      description: "Here's a starting implementation for this task:",
      language: determineLanguageFromInput(input),
      code: generateGenericCode(input, technologies),
    },
    resources: {
      description: "These resources might help with your task:",
      items: [
        {
          type: "documentation",
          title: technologies.length > 0 ? `${technologies[0]} Documentation` : "Official Documentation",
          description: "Learn the fundamentals and best practices from the official docs",
          icon: "book"
        },
        {
          type: "tutorial",
          title: "Implementation Guide",
          description: "Step-by-step tutorial for implementing similar functionality",
          icon: "graduation-cap"
        }
      ]
    },
    beginnerTips: {
      analogy: generateAnalogy(input, keywords),
      explanation: "Break down the task into smaller components and tackle them one by one. This makes the overall task more manageable and helps you make steady progress.",
      keyPoints: [
        "Start with a simple working implementation before optimizing",
        "Use existing libraries and frameworks rather than building everything from scratch",
        "Write tests to ensure your implementation meets the requirements"
      ]
    },
    technologies: technologies.length > 0 ? technologies : ["JavaScript", "Web API"]
  };
}

function extractKeywords(text: string): string[] {
  const commonWords = new Set(["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "as", "of"]);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .slice(0, 5);
}

function determineLanguageFromInput(input: any): string {
  if (input.codeLanguage) return input.codeLanguage.toLowerCase();
  
  const content = input.content.toLowerCase();
  if (content.includes("javascript") || content.includes("js")) return "javascript";
  if (content.includes("typescript") || content.includes("ts")) return "typescript";
  if (content.includes("python")) return "python";
  if (content.includes("java ")) return "java";
  if (content.includes("c#")) return "csharp";
  
  return "javascript"; // default
}

function generateGenericCode(input: any, technologies: string[]): string {
  const language = determineLanguageFromInput(input);
  
  if (language === "javascript" || language === "typescript") {
    return `// Generic implementation based on the task
function processTask(input) {
  try {
    // Validate input
    if (!input || typeof input !== 'object') {
      throw new Error('Invalid input provided');
    }
    
    // Process the data
    const result = {
      status: 'success',
      data: {
        // Task-specific logic would go here
        processedInput: input,
        timestamp: new Date().toISOString()
      }
    };
    
    // Return the results
    return result;
  } catch (error) {
    console.error('Error processing task:', error);
    return {
      status: 'error',
      message: error.message
    };
  }
}`;
  } else if (language === "python") {
    return `# Generic implementation based on the task
def process_task(input_data):
    try:
        # Validate input
        if not input_data or not isinstance(input_data, dict):
            raise ValueError("Invalid input provided")
        
        # Process the data
        result = {
            "status": "success",
            "data": {
                # Task-specific logic would go here
                "processed_input": input_data,
                "timestamp": datetime.datetime.now().isoformat()
            }
        }
        
        # Return the results
        return result
    except Exception as e:
        print(f"Error processing task: {e}")
        return {
            "status": "error",
            "message": str(e)
        }`;
  } else {
    return `// Generic implementation for the task
// Customize this based on your requirements

function handleTask() {
  // 1. Gather required inputs
  // 2. Process the data
  // 3. Return results
  
  console.log("Implementing task: ${input.content.substring(0, 40)}...");
  
  // Main processing logic would go here
  
  return {
    success: true,
    message: "Task completed successfully"
  };
}`;
  }
}

function generateAnalogy(input: any, keywords: string[]): string {
  const analogies = [
    `Think of this task like building a puzzle - you need to understand how all the pieces fit together before you can see the complete picture.`,
    `This is similar to following a recipe - you need the right ingredients (technologies) and steps (implementation) to create the final dish.`,
    `Think of this like planning a road trip - you need to know your destination (requirements), map your route (architecture), and have emergency plans (error handling).`,
    `This task is like tending a garden - you plant the seeds (initial code), nurture them (testing), and eventually harvest the results (deployment).`,
    `Consider this like assembling furniture - you need to follow instructions, use the right tools, and sometimes improvise when things don't fit perfectly.`
  ];
  
  // Return a consistent analogy based on the content hash
  const contentHash = input.content.length % analogies.length;
  return analogies[contentHash];
}
