import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertChatMessageSchema } from "@shared/schema";
import axios from "axios";
import { z, ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/firebase/:firebaseUid", async (req: Request, res: Response) => {
    try {
      const { firebaseUid } = req.params;
      
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Chat messages routes
  app.get("/api/chat/:userId", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const messages = await storage.getChatMessages(parseInt(userId), limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const newMessage = await storage.createChatMessage(messageData);
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Groq API integration
  app.post("/api/chat/generate", async (req: Request, res: Response) => {
    try {
      const requestSchema = z.object({
        message: z.string().min(1),
        userId: z.number().optional()
      });
      
      const { message, userId } = requestSchema.parse(req.body);
      
      // Save the user message first if userId is provided
      if (userId) {
        await storage.createChatMessage({
          userId,
          content: message,
          role: "user"
        });
      }
      
      // Check environment variables for API key
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "Groq API key is not configured" });
      }
      
      // Make request to Groq API
      const groqResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are an AI educational assistant named EduAssistAI. You help users with educational questions, especially about cutoffs, scholarships, and career advice. Be helpful, accurate, and concise."
            },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 800
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      const aiResponse = groqResponse.data.choices[0].message.content;
      
      // Save the AI response if userId is provided
      if (userId) {
        await storage.createChatMessage({
          userId,
          content: aiResponse,
          role: "assistant"
        });
      }
      
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Error generating response:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      
      // Handle Groq API errors
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.error?.message || "Error processing request";
        return res.status(statusCode).json({ message: errorMessage });
      }
      
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
