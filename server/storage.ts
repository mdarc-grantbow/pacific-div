import { 
  conferences,
  users,
  sessions,
  bookmarks,
  vendors,
  doorPrizes,
  tHuntingSchedule,
  tHuntingWinners,
  radioContacts,
  venueInfo,
  surveyResponses,
  type Conference,
  type User, 
  type UpsertUser,
  type Session,
  type Vendor,
  type DoorPrize,
  type THuntingSchedule,
  type THuntingWinner,
  type RadioContact,
  type VenueInfo,
  type SurveyResponse,
  type UserProfile
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";
import { withRetry, handleDatabaseError, DatabaseError } from "./dbUtils";

export interface IStorage {
  // Conference methods
  getConferences(): Promise<Conference[]>;
  getConferenceBySlug(slug: string): Promise<Conference | undefined>;
  createConference(conference: Omit<Conference, 'id' | 'createdAt'>): Promise<Conference>;
  updateConferenceBySlug(slug: string, patch: Partial<Conference>): Promise<Conference>;
  
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  getSessions(conferenceId?: string): Promise<Session[]>;
  getSessionById(id: string): Promise<Session | undefined>;
  
  getVendors(conferenceId?: string): Promise<Vendor[]>;
  getVendorById(id: string): Promise<Vendor | undefined>;
  
  getDoorPrizes(conferenceId?: string): Promise<DoorPrize[]>;
  addDoorPrize(prize: Omit<DoorPrize, 'id'>): Promise<DoorPrize>;
  
  getTHuntingSchedule(conferenceId?: string): Promise<THuntingSchedule[]>;
  getTHuntingWinners(conferenceId?: string): Promise<THuntingWinner[]>;
  addTHuntingWinner(winner: Omit<THuntingWinner, 'id'>): Promise<THuntingWinner>;
  
  getRadioContacts(conferenceId?: string): Promise<RadioContact[]>;
  getVenueInfo(conferenceId?: string): Promise<VenueInfo[]>;
  
  getUserBookmarks(userId: string, conferenceId?: string): Promise<string[]>;
  addBookmark(userId: string, conferenceId: string, sessionId: string): Promise<void>;
  removeBookmark(userId: string, conferenceId: string, sessionId: string): Promise<void>;
  
  getUserSurveyResponses(userId: string): Promise<SurveyResponse[]>;
  submitSurvey(response: Omit<SurveyResponse, 'id'>): Promise<SurveyResponse>;
  getSurveyResponse(userId: string, surveyType: string): Promise<SurveyResponse | undefined>;
  
  getUserProfile(userId: string): Promise<UserProfile>;
  
  seedDatabase(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getConferences(): Promise<Conference[]> {
    try {
      return await withRetry(async () => {
        return await db.select().from(conferences).where(eq(conferences.isActive, true));
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getConferences");
    }
  }

  async getConferenceBySlug(slug: string): Promise<Conference | undefined> {
    try {
      return await withRetry(async () => {
        const [conference] = await db.select().from(conferences).where(eq(conferences.slug, slug));
        return conference || undefined;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getConferenceBySlug");
    }
  }

  async createConference(conference: Omit<Conference, 'id' | 'createdAt'>): Promise<Conference> {
    try {
      return await withRetry(async () => {
        const [newConference] = await db.insert(conferences).values(conference).returning();
        return newConference;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "createConference");
    }
  }

  async updateConferenceBySlug(slug: string, patch: Partial<Conference>): Promise<Conference> {
    try {
      return await withRetry(async () => {
        const [updated] = await db.update(conferences).set(patch as any).where(eq(conferences.slug, slug)).returning();
        return updated;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "updateConferenceBySlug");
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      return await withRetry(async () => {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || undefined;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getUser");
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      return await withRetry(async () => {
        const [user] = await db
          .insert(users)
          .values(userData)
          .onConflictDoUpdate({
            target: users.id,
            set: {
              ...userData,
              updatedAt: new Date(),
            },
          })
          .returning();
        return user;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "upsertUser");
    }
  }

  async getSessions(conferenceId?: string): Promise<Session[]> {
    try {
      return await withRetry(async () => {
        if (conferenceId) {
          return await db.select().from(sessions).where(eq(sessions.conferenceId, conferenceId));
        }
        return await db.select().from(sessions);
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getSessions");
    }
  }

  async getSessionById(id: string): Promise<Session | undefined> {
    try {
      return await withRetry(async () => {
        const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
        return session || undefined;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getSessionById");
    }
  }

  async getVendors(conferenceId?: string): Promise<Vendor[]> {
    try {
      return await withRetry(async () => {
        if (conferenceId) {
          return await db.select().from(vendors).where(eq(vendors.conferenceId, conferenceId));
        }
        return await db.select().from(vendors);
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getVendors");
    }
  }

  async getVendorById(id: string): Promise<Vendor | undefined> {
    try {
      return await withRetry(async () => {
        const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
        return vendor || undefined;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getVendorById");
    }
  }

  async getDoorPrizes(conferenceId?: string): Promise<DoorPrize[]> {
    try {
      return await withRetry(async () => {
        if (conferenceId) {
          return await db.select().from(doorPrizes).where(eq(doorPrizes.conferenceId, conferenceId)).orderBy(desc(doorPrizes.timestamp));
        }
        return await db.select().from(doorPrizes).orderBy(desc(doorPrizes.timestamp));
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getDoorPrizes");
    }
  }

  async addDoorPrize(prize: Omit<DoorPrize, 'id'>): Promise<DoorPrize> {
    try {
      return await withRetry(async () => {
        const [newPrize] = await db.insert(doorPrizes).values(prize).returning();
        return newPrize;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "addDoorPrize");
    }
  }

  async getTHuntingSchedule(conferenceId?: string): Promise<THuntingSchedule[]> {
    try {
      return await withRetry(async () => {
        if (conferenceId) {
          return await db.select().from(tHuntingSchedule).where(eq(tHuntingSchedule.conferenceId, conferenceId));
        }
        return await db.select().from(tHuntingSchedule);
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getTHuntingSchedule");
    }
  }

  async getTHuntingWinners(conferenceId?: string): Promise<THuntingWinner[]> {
    try {
      return await withRetry(async () => {
        if (conferenceId) {
          return await db.select().from(tHuntingWinners).where(eq(tHuntingWinners.conferenceId, conferenceId)).orderBy(asc(tHuntingWinners.rank));
        }
        return await db.select().from(tHuntingWinners).orderBy(asc(tHuntingWinners.rank));
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getTHuntingWinners");
    }
  }

  async addTHuntingWinner(winner: Omit<THuntingWinner, 'id'>): Promise<THuntingWinner> {
    try {
      return await withRetry(async () => {
        const [newWinner] = await db.insert(tHuntingWinners).values(winner).returning();
        return newWinner;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "addTHuntingWinner");
    }
  }

  async getRadioContacts(conferenceId?: string): Promise<RadioContact[]> {
    try {
      return await withRetry(async () => {
        if (conferenceId) {
          return await db.select().from(radioContacts).where(eq(radioContacts.conferenceId, conferenceId));
        }
        return await db.select().from(radioContacts);
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getRadioContacts");
    }
  }

  async getVenueInfo(conferenceId?: string): Promise<VenueInfo[]> {
    try {
      return await withRetry(async () => {
        if (conferenceId) {
          return await db.select().from(venueInfo).where(eq(venueInfo.conferenceId, conferenceId));
        }
        return await db.select().from(venueInfo);
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getVenueInfo");
    }
  }

  async getUserBookmarks(userId: string, conferenceId?: string): Promise<string[]> {
    try {
      return await withRetry(async () => {
        const conditions = [eq(bookmarks.userId, userId)];
        if (conferenceId) {
          conditions.push(eq(bookmarks.conferenceId, conferenceId));
        }
        const results = await db.select().from(bookmarks).where(and(...conditions));
        return results.map(b => b.sessionId);
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getUserBookmarks");
    }
  }

  async addBookmark(userId: string, conferenceId: string, sessionId: string): Promise<void> {
    try {
      await withRetry(async () => {
        const existing = await db.select().from(bookmarks).where(
          and(eq(bookmarks.userId, userId), eq(bookmarks.conferenceId, conferenceId), eq(bookmarks.sessionId, sessionId))
        );
        if (existing.length === 0) {
          await db.insert(bookmarks).values({ userId, conferenceId, sessionId });
        }
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "addBookmark");
    }
  }

  async removeBookmark(userId: string, conferenceId: string, sessionId: string): Promise<void> {
    try {
      await withRetry(async () => {
        await db.delete(bookmarks).where(
          and(eq(bookmarks.userId, userId), eq(bookmarks.conferenceId, conferenceId), eq(bookmarks.sessionId, sessionId))
        );
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "removeBookmark");
    }
  }

  async getUserSurveyResponses(userId: string): Promise<SurveyResponse[]> {
    try {
      return await withRetry(async () => {
        return await db.select().from(surveyResponses).where(eq(surveyResponses.userId, userId));
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getUserSurveyResponses");
    }
  }

  async submitSurvey(response: Omit<SurveyResponse, 'id'>): Promise<SurveyResponse> {
    try {
      return await withRetry(async () => {
        const [newResponse] = await db.insert(surveyResponses).values(response).returning();
        return newResponse;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "submitSurvey");
    }
  }

  async getSurveyResponse(userId: string, surveyType: string): Promise<SurveyResponse | undefined> {
    try {
      return await withRetry(async () => {
        const [response] = await db.select().from(surveyResponses).where(
          and(eq(surveyResponses.userId, userId), eq(surveyResponses.surveyType, surveyType))
        );
        return response || undefined;
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getSurveyResponse");
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      return await withRetry(async () => {
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (user) {
          const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown User';
          return {
            callSign: user.callSign || "",
            name: displayName,
            badgeNumber: user.badgeNumber || "",
            licenseClass: user.licenseClass || "",
            isRegistered: user.isRegistered || false,
          };
        }
        return {
          callSign: "",
          name: "Unknown User",
          badgeNumber: "",
          licenseClass: "",
          isRegistered: false,
        };
      });
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      handleDatabaseError(error, "getUserProfile");
    }
  }

  async seedDatabase(): Promise<void> {
    try {
      // First, seed conferences independently (so it works even if sessions table has issues)
      await withRetry(async () => {
        const existingConferences = await db.select().from(conferences).limit(1);
        if (existingConferences.length === 0) {
          await db.insert(conferences).values({
            name: "Pacificon",
            year: 2025,
            location: "San Ramon Marriott",
            startDate: new Date("2025-10-10"),
            endDate: new Date("2025-10-12T23:59:59"),
            slug: "pacificon-2025",
            division: "Pacific",
            gridSquare: "CM87us",
            gps: "37.7631, -121.9736",
            locationAddress: "2600 Bishop Dr, San Ramon, CA 94583",
            // branding
            logoUrl: "https://raw.githubusercontent.com/pacificon/example-assets/main/pacificon-logo.png",
            faviconUrl: "/favicon-pacificon.ico",
            primaryColor: "#1e40af",
            accentColor: "#f97316",
            isActive: true,
          });
          console.log("Seeded Pacificon 2025 conference");
        }
      });

      // Then seed sessions and other data
      await withRetry(async () => {
        const existingSessions = await db.select().from(sessions).limit(1);
        if (existingSessions.length > 0) {
          return;
        }

        // Get the conference for linking
        const [conference] = await db.select().from(conferences).where(eq(conferences.slug, "pacificon-2025")).limit(1);
        if (!conference) {
          console.log("No conference found for seeding sessions");
          return;
        }

        const conferenceId = conference.id;

        await db.insert(sessions).values([
          {
            conferenceId,
            title: "Advanced Antenna Design for DX Communications",
            speaker: "John Smith, W6ABC",
            speakerBio: "John has been designing antennas for over 30 years and holds multiple patents.",
            abstract: "Learn advanced techniques for designing antennas optimized for long-distance communications.",
            day: "friday",
            startTime: "09:00",
            endTime: "10:30",
            room: "Grand Ballroom A",
            category: "Antennas",
          },
          {
            conferenceId,
            title: "Introduction to Digital Mode Operations",
            speaker: "Sarah Johnson, K6DEF",
            speakerBio: "Sarah specializes in digital communications and teaches classes at her local club.",
            abstract: "Get started with FT8, PSK31, and other popular digital modes.",
            day: "friday",
            startTime: "09:00",
            endTime: "10:00",
            room: "Conference Room 1",
            category: "Digital Modes",
          },
          {
            conferenceId,
            title: "ARRL Update and Legislative Matters",
            speaker: "Mike Davis, N6GHI",
            day: "friday",
            startTime: "11:00",
            endTime: "12:00",
            room: "Grand Ballroom B",
            category: "ARRL",
          },
          {
            conferenceId,
            title: "Building QRP Transceivers",
            speaker: "Tom Wilson, KJ6LMN",
            abstract: "Hands-on workshop building low-power radio equipment.",
            day: "saturday",
            startTime: "10:00",
            endTime: "11:30",
            room: "Workshop Area",
            category: "QRP",
          },
          {
            conferenceId,
            title: "Contest Operating Techniques",
            speaker: "Lisa Brown, W6OPQ",
            day: "saturday",
            startTime: "14:00",
            endTime: "15:30",
            room: "Grand Ballroom A",
            category: "Contesting",
          },
          {
            conferenceId,
            title: "Emergency Communications Fundamentals",
            speaker: "Robert Chen, WA6EMC",
            abstract: "Learn how amateur radio supports disaster relief and emergency services.",
            day: "sunday",
            startTime: "09:00",
            endTime: "10:30",
            room: "Grand Ballroom A",
            category: "Emergency Comms",
          },
        ]);

        await db.insert(vendors).values([
          {
            conferenceId,
            name: "Ham Radio Outlet",
            boothNumber: "12",
            category: "Equipment",
            description: "Complete line of amateur radio transceivers, antennas, and accessories",
            website: "https://www.hamradio.com",
          },
          {
            conferenceId,
            name: "DX Engineering",
            boothNumber: "15",
            category: "Antennas",
            description: "Premium antenna systems and tower accessories for serious operators",
            website: "https://www.dxengineering.com",
          },
          {
            conferenceId,
            name: "Elecraft",
            boothNumber: "8",
            category: "QRP Equipment",
            description: "High-performance portable and QRP transceivers and accessories",
            website: "https://www.elecraft.com",
          },
        ]);

        await db.insert(radioContacts).values([
          {
            conferenceId,
            type: "talk-in",
            frequency: "146.850 MHz",
            label: "Conference Talk-In",
            notes: "PL 100.0 Hz, -0.6 MHz offset",
          },
          {
            conferenceId,
            type: "simplex",
            frequency: "146.520 MHz",
            label: "National Simplex",
            notes: "Primary calling frequency",
          },
          {
            conferenceId,
            type: "qrp",
            frequency: "7.030 MHz",
            label: "QRP CW",
            notes: "40m band activity",
          },
          {
            conferenceId,
            type: "qrp",
            frequency: "14.060 MHz",
            label: "QRP SSB",
            notes: "20m band activity",
          },
        ]);

        await db.insert(venueInfo).values([
          {
            conferenceId,
            category: "hotel",
            title: "San Ramon Marriott",
            details: "2600 Bishop Drive, San Ramon, CA 94583 • (925) 867-9200",
            hours: "Check-in: 4:00 PM • Check-out: 12:00 PM",
          },
          {
            conferenceId,
            category: "parking",
            title: "Hotel Parking",
            details: "Free parking available for conference attendees who book at Pacificon rate",
          },
          {
            conferenceId,
            category: "registration",
            title: "Registration Desk",
            details: "Main lobby near Grand Ballroom entrance",
            hours: "Fri 7AM-5PM • Sat 6AM-4PM • Sun 7:30AM-11AM",
          },
          {
            conferenceId,
            category: "testing",
            title: "License Testing",
            details: "Conference Room 2 • Bring photo ID and $15 test fee",
            hours: "Saturday 10:00 AM - 2:00 PM",
          },
        ]);

        await db.insert(doorPrizes).values([
          {
            conferenceId,
            badgeNumber: "147",
            callSign: "W6ABC",
            prizeName: "Handheld VHF/UHF Transceiver",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            claimed: false,
          },
          {
            conferenceId,
            badgeNumber: "89",
            callSign: "K6DEF",
            prizeName: "Antenna Analyzer",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            claimed: true,
          },
          {
            conferenceId,
            badgeNumber: "256",
            callSign: "N6GHI",
            prizeName: "Power Supply 25A",
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            claimed: false,
          },
        ]);

        await db.insert(tHuntingWinners).values([
          {
            conferenceId,
            rank: 1,
            callSign: "K6XYZ",
            completionTime: "24:35",
            huntNumber: 1,
            prize: "Portable Antenna Kit",
          },
          {
            conferenceId,
            rank: 2,
            callSign: "W6LMN",
            completionTime: "28:42",
            huntNumber: 1,
            prize: "RF Attenuator Set",
          },
          {
            conferenceId,
            rank: 3,
            callSign: "N6OPQ",
            completionTime: "31:15",
            huntNumber: 1,
            prize: "Coax Cable Kit",
          },
          {
            conferenceId,
            rank: 4,
            callSign: "KJ6RST",
            completionTime: "35:20",
            huntNumber: 1,
          },
        ]);

        await db.insert(tHuntingSchedule).values([
          {
            conferenceId,
            huntNumber: 1,
            startTime: "Saturday 2:00 PM",
            location: "Hotel Parking Lot - South End",
            difficulty: "easy",
            registrationOpen: false,
          },
          {
            conferenceId,
            huntNumber: 2,
            startTime: "Saturday 4:00 PM",
            location: "Hotel Grounds",
            difficulty: "medium",
            registrationOpen: true,
          },
          {
            conferenceId,
            huntNumber: 3,
            startTime: "Sunday 10:00 AM",
            location: "TBD",
            difficulty: "hard",
            registrationOpen: true,
          },
        ]);
      });
    } catch (error) {
      console.error("Failed to seed database (non-fatal):", error);
    }
  }
}

export const storage = new DatabaseStorage();
