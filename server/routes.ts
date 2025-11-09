import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sessions
  app.get("/api/sessions", async (_req, res) => {
    try {
      const sessions = await storage.getSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSessionById(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Vendors
  app.get("/api/vendors", async (_req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const vendor = await storage.getVendorById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendor" });
    }
  });

  // Door Prizes
  app.get("/api/door-prizes", async (_req, res) => {
    try {
      const prizes = await storage.getDoorPrizes();
      res.json(prizes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch door prizes" });
    }
  });

  // T-Hunting
  app.get("/api/thunting/winners", async (_req, res) => {
    try {
      const winners = await storage.getTHuntingWinners();
      res.json(winners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch T-hunting winners" });
    }
  });

  app.get("/api/thunting/schedule", async (_req, res) => {
    try {
      const schedule = await storage.getTHuntingSchedule();
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch T-hunting schedule" });
    }
  });

  // Radio Contacts
  app.get("/api/radio-contacts", async (_req, res) => {
    try {
      const contacts = await storage.getRadioContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch radio contacts" });
    }
  });

  // Venue Info
  app.get("/api/venue-info", async (_req, res) => {
    try {
      const info = await storage.getVenueInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch venue info" });
    }
  });

  // Bookmarks (TODO: Add authentication)
  app.get("/api/bookmarks", async (_req, res) => {
    try {
      // TODO: Get userId from session/auth
      const userId = "demo-user";
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  });

  app.post("/api/bookmarks/:sessionId", async (req, res) => {
    try {
      // TODO: Get userId from session/auth
      const userId = "demo-user";
      await storage.addBookmark(userId, req.params.sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to add bookmark" });
    }
  });

  app.delete("/api/bookmarks/:sessionId", async (req, res) => {
    try {
      // TODO: Get userId from session/auth
      const userId = "demo-user";
      await storage.removeBookmark(userId, req.params.sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove bookmark" });
    }
  });

  // Survey/Feedback
  app.get("/api/surveys", async (_req, res) => {
    try {
      // TODO: Get userId from session/auth
      const userId = "demo-user";
      const responses = await storage.getUserSurveyResponses(userId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch survey responses" });
    }
  });

  app.post("/api/surveys/:surveyType", async (req, res) => {
    try {
      // TODO: Get userId from session/auth
      const userId = "demo-user";
      const { responses } = req.body;
      
      const surveyResponse = {
        id: randomUUID(),
        userId,
        surveyType: req.params.surveyType as any,
        responses,
        timestamp: new Date().toISOString(),
        completed: true,
      };
      
      await storage.submitSurvey(surveyResponse);
      res.json(surveyResponse);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit survey" });
    }
  });

  app.get("/api/surveys/:surveyType/status", async (req, res) => {
    try {
      // TODO: Get userId from session/auth
      const userId = "demo-user";
      const response = await storage.getSurveyResponse(userId, req.params.surveyType);
      res.json({ completed: !!response });
    } catch (error) {
      res.status(500).json({ error: "Failed to check survey status" });
    }
  });

  // User Profile
  app.get("/api/profile", async (_req, res) => {
    try {
      // TODO: Get userId from session/auth
      const userId = "demo-user";
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
