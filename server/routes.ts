import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware setup (required for Replit Auth)
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  await storage.seedDatabase();
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

  // Bookmarks (protected routes)
  app.get("/api/bookmarks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  });

  app.post("/api/bookmarks/:sessionId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.addBookmark(userId, req.params.sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to add bookmark" });
    }
  });

  app.delete("/api/bookmarks/:sessionId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.removeBookmark(userId, req.params.sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove bookmark" });
    }
  });

  // Survey/Feedback (protected routes)
  app.get("/api/surveys", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const responses = await storage.getUserSurveyResponses(userId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch survey responses" });
    }
  });

  app.post("/api/surveys/:surveyType", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { responses } = req.body;
      
      const surveyData = {
        userId,
        surveyType: req.params.surveyType,
        responses: responses || {},
        timestamp: new Date().toISOString(),
        completed: true,
      };
      
      const surveyResponse = await storage.submitSurvey(surveyData);
      res.json(surveyResponse);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit survey" });
    }
  });

  app.get("/api/surveys/:surveyType/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const response = await storage.getSurveyResponse(userId, req.params.surveyType);
      res.json({ completed: !!response });
    } catch (error) {
      res.status(500).json({ error: "Failed to check survey status" });
    }
  });

  // User Profile (protected route)
  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
