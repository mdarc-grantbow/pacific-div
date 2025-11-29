import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { DatabaseError, isDatabaseConnectionError } from "./dbUtils";

function handleApiError(res: any, error: unknown, defaultMessage: string) {
  console.error(defaultMessage, error);
  
  if (error instanceof DatabaseError && error.isConnectionError) {
    return res.status(503).json({ 
      error: "Service temporarily unavailable. Please try again.",
      retryable: true 
    });
  }
  
  if (isDatabaseConnectionError(error)) {
    return res.status(503).json({ 
      error: "Service temporarily unavailable. Please try again.",
      retryable: true 
    });
  }
  
  return res.status(500).json({ error: defaultMessage });
}

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    await setupAuth(app);
  } catch (error) {
    console.error("Failed to setup auth (non-fatal):", error);
  }

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const claims = req.user.claims;
      const userId = claims.sub;
      
      // Try to get user from database first
      try {
        const user = await storage.getUser(userId);
        if (user) {
          return res.json(user);
        }
      } catch (dbError) {
        // Database unavailable - fall back to session claims
        console.warn("Database unavailable, using session claims for user data");
      }
      
      // Fall back to session claims (works when database is unavailable)
      res.json({
        id: userId,
        email: claims.email || null,
        firstName: claims.first_name || null,
        lastName: claims.last_name || null,
        profileImageUrl: claims.profile_image_url || null,
      });
    } catch (error) {
      handleApiError(res, error, "Failed to fetch user");
    }
  });

  try {
    await storage.seedDatabase();
  } catch (error) {
    console.error("Failed to seed database (non-fatal):", error);
  }
  // Sessions
  app.get("/api/sessions", async (_req, res) => {
    try {
      const sessions = await storage.getSessions();
      res.json(sessions);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch sessions");
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
      handleApiError(res, error, "Failed to fetch session");
    }
  });

  // Vendors
  app.get("/api/vendors", async (_req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch vendors");
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
      handleApiError(res, error, "Failed to fetch vendor");
    }
  });

  // Door Prizes
  app.get("/api/door-prizes", async (_req, res) => {
    try {
      const prizes = await storage.getDoorPrizes();
      res.json(prizes);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch door prizes");
    }
  });

  // T-Hunting
  app.get("/api/thunting/winners", async (_req, res) => {
    try {
      const winners = await storage.getTHuntingWinners();
      res.json(winners);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch T-hunting winners");
    }
  });

  app.get("/api/thunting/schedule", async (_req, res) => {
    try {
      const schedule = await storage.getTHuntingSchedule();
      res.json(schedule);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch T-hunting schedule");
    }
  });

  // Radio Contacts
  app.get("/api/radio-contacts", async (_req, res) => {
    try {
      const contacts = await storage.getRadioContacts();
      res.json(contacts);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch radio contacts");
    }
  });

  // Venue Info
  app.get("/api/venue-info", async (_req, res) => {
    try {
      const info = await storage.getVenueInfo();
      res.json(info);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch venue info");
    }
  });

  // Bookmarks (protected routes)
  app.get("/api/bookmarks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch bookmarks");
    }
  });

  app.post("/api/bookmarks/:sessionId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.addBookmark(userId, req.params.sessionId);
      res.json({ success: true });
    } catch (error) {
      handleApiError(res, error, "Failed to add bookmark");
    }
  });

  app.delete("/api/bookmarks/:sessionId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.removeBookmark(userId, req.params.sessionId);
      res.json({ success: true });
    } catch (error) {
      handleApiError(res, error, "Failed to remove bookmark");
    }
  });

  // Survey/Feedback (protected routes)
  app.get("/api/surveys", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const responses = await storage.getUserSurveyResponses(userId);
      res.json(responses);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch survey responses");
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
      handleApiError(res, error, "Failed to submit survey");
    }
  });

  app.get("/api/surveys/:surveyType/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const response = await storage.getSurveyResponse(userId, req.params.surveyType);
      res.json({ completed: !!response });
    } catch (error) {
      handleApiError(res, error, "Failed to check survey status");
    }
  });

  // User Profile (protected route)
  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch profile");
    }
  });

  // Health check endpoint
  app.get("/api/health", async (_req, res) => {
    try {
      await storage.getSessions();
      res.json({ status: "healthy", database: "connected" });
    } catch (error) {
      res.status(503).json({ status: "unhealthy", database: "disconnected" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
