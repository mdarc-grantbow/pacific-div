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

  // Conferences
  app.get("/api/conferences", async (_req, res) => {
    try {
      const conferences = await storage.getConferences();
      res.json(conferences);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch conferences");
    }
  });

  app.get("/api/conferences/:slug", async (req, res) => {
    try {
      const conference = await storage.getConferenceBySlug(req.params.slug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      res.json(conference);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch conference");
    }
  });

  // Update conference branding/details (protected)
  app.put("/api/conferences/:slug", isAuthenticated, async (req: any, res) => {
    try {
      const patch = req.body || {};
      const updated = await storage.updateConferenceBySlug(req.params.slug, patch);
      res.json(updated);
    } catch (error) {
      handleApiError(res, error, "Failed to update conference");
    }
  });

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
  
  // Sessions (conference-scoped with optional category and day filters)
  app.get("/api/conferences/:conferenceSlug/sessions", async (req, res) => {
    try {
      const conference = await storage.getConferenceBySlug(req.params.conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      const filters: { category?: string; day?: string } = {};
      if (req.query.category) {
        filters.category = req.query.category as string;
      }
      if (req.query.day) {
        filters.day = req.query.day as string;
      }
      const sessions = await storage.getSessions(conference.id, Object.keys(filters).length > 0 ? filters : undefined);
      res.json(sessions);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch sessions");
    }
  });

  // Sessions (legacy)
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
  app.get("/api/conferences/:conferenceSlug/vendors", async (req, res) => {
    try {
      const conference = await storage.getConferenceBySlug(req.params.conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      const vendors = await storage.getVendors(conference.id);
      res.json(vendors);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch vendors");
    }
  });

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
  app.get("/api/conferences/:conferenceSlug/door-prizes", async (req, res) => {
    try {
      const conference = await storage.getConferenceBySlug(req.params.conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      const prizes = await storage.getDoorPrizes(conference.id);
      res.json(prizes);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch door prizes");
    }
  });

  app.get("/api/door-prizes", async (_req, res) => {
    try {
      const prizes = await storage.getDoorPrizes();
      res.json(prizes);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch door prizes");
    }
  });

  // T-Hunting (conference-scoped)
  app.get("/api/conferences/:conferenceSlug/thunting/winners", async (req, res) => {
    try {
      const conference = await storage.getConferenceBySlug(req.params.conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      const winners = await storage.getTHuntingWinners(conference.id);
      res.json(winners);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch T-hunting winners");
    }
  });

  app.get("/api/conferences/:conferenceSlug/thunting/schedule", async (req, res) => {
    try {
      const conference = await storage.getConferenceBySlug(req.params.conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      const schedule = await storage.getTHuntingSchedule(conference.id);
      res.json(schedule);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch T-hunting schedule");
    }
  });

  // T-Hunting (legacy endpoints for backwards compatibility)
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

  // Radio Contacts (conference-scoped)
  app.get("/api/conferences/:conferenceSlug/radio-contacts", async (req, res) => {
    try {
      const conference = await storage.getConferenceBySlug(req.params.conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      const contacts = await storage.getRadioContacts(conference.id);
      res.json(contacts);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch radio contacts");
    }
  });

  // Radio Contacts (legacy)
  app.get("/api/radio-contacts", async (_req, res) => {
    try {
      const contacts = await storage.getRadioContacts();
      res.json(contacts);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch radio contacts");
    }
  });

  // Venue Info (conference-scoped)
  app.get("/api/conferences/:conferenceSlug/venue-info", async (req, res) => {
    try {
      const conference = await storage.getConferenceBySlug(req.params.conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      const info = await storage.getVenueInfo(conference.id);
      res.json(info);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch venue info");
    }
  });

  // Venue Info (legacy)
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
      const conferenceSlug = req.query.conference;
      
      let conferenceId: string | undefined;
      if (conferenceSlug) {
        const conference = await storage.getConferenceBySlug(conferenceSlug);
        if (!conference) {
          return res.status(404).json({ error: "Conference not found" });
        }
        conferenceId = conference.id;
      }
      
      const bookmarks = await storage.getUserBookmarks(userId, conferenceId);
      res.json(bookmarks);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch bookmarks");
    }
  });

  app.post("/api/bookmarks/:sessionId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conferenceSlug = req.body.conference;
      
      if (!conferenceSlug) {
        return res.status(400).json({ error: "Conference slug is required" });
      }
      
      const conference = await storage.getConferenceBySlug(conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      
      await storage.addBookmark(userId, conference.id, req.params.sessionId);
      res.json({ success: true });
    } catch (error) {
      handleApiError(res, error, "Failed to add bookmark");
    }
  });

  app.delete("/api/bookmarks/:sessionId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conferenceSlug = req.query.conference;
      
      if (!conferenceSlug) {
        return res.status(400).json({ error: "Conference slug is required" });
      }
      
      const conference = await storage.getConferenceBySlug(conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      
      await storage.removeBookmark(userId, conference.id, req.params.sessionId);
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
      const { responses, conference: conferenceSlug } = req.body;
      
      if (!conferenceSlug) {
        return res.status(400).json({ error: "Conference slug is required" });
      }
      
      const conference = await storage.getConferenceBySlug(conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      
      const surveyData = {
        userId,
        conferenceId: conference.id,
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

  // Conference Images (for maps, banners, etc.)
  app.get("/api/conferences/:conferenceSlug/images", async (req, res) => {
    try {
      const conference = await storage.getConferenceBySlug(req.params.conferenceSlug);
      if (!conference) {
        return res.status(404).json({ error: "Conference not found" });
      }
      const imageType = req.query.type as string | undefined;
      const images = await storage.getConferenceImages(conference.id, imageType);
      res.json(images);
    } catch (error) {
      handleApiError(res, error, "Failed to fetch conference images");
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
