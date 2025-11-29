import { 
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
  type User, 
  type InsertUser,
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

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSessions(): Promise<Session[]>;
  getSessionById(id: string): Promise<Session | undefined>;
  
  getVendors(): Promise<Vendor[]>;
  getVendorById(id: string): Promise<Vendor | undefined>;
  
  getDoorPrizes(): Promise<DoorPrize[]>;
  addDoorPrize(prize: Omit<DoorPrize, 'id'>): Promise<DoorPrize>;
  
  getTHuntingSchedule(): Promise<THuntingSchedule[]>;
  getTHuntingWinners(): Promise<THuntingWinner[]>;
  addTHuntingWinner(winner: Omit<THuntingWinner, 'id'>): Promise<THuntingWinner>;
  
  getRadioContacts(): Promise<RadioContact[]>;
  getVenueInfo(): Promise<VenueInfo[]>;
  
  getUserBookmarks(userId: string): Promise<string[]>;
  addBookmark(userId: string, sessionId: string): Promise<void>;
  removeBookmark(userId: string, sessionId: string): Promise<void>;
  
  getUserSurveyResponses(userId: string): Promise<SurveyResponse[]>;
  submitSurvey(response: Omit<SurveyResponse, 'id'>): Promise<SurveyResponse>;
  getSurveyResponse(userId: string, surveyType: string): Promise<SurveyResponse | undefined>;
  
  getUserProfile(userId: string): Promise<UserProfile>;
  
  seedDatabase(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getSessions(): Promise<Session[]> {
    return await db.select().from(sessions);
  }

  async getSessionById(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async getVendors(): Promise<Vendor[]> {
    return await db.select().from(vendors);
  }

  async getVendorById(id: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  async getDoorPrizes(): Promise<DoorPrize[]> {
    return await db.select().from(doorPrizes).orderBy(desc(doorPrizes.timestamp));
  }

  async addDoorPrize(prize: Omit<DoorPrize, 'id'>): Promise<DoorPrize> {
    const [newPrize] = await db.insert(doorPrizes).values(prize).returning();
    return newPrize;
  }

  async getTHuntingSchedule(): Promise<THuntingSchedule[]> {
    return await db.select().from(tHuntingSchedule);
  }

  async getTHuntingWinners(): Promise<THuntingWinner[]> {
    return await db.select().from(tHuntingWinners).orderBy(asc(tHuntingWinners.rank));
  }

  async addTHuntingWinner(winner: Omit<THuntingWinner, 'id'>): Promise<THuntingWinner> {
    const [newWinner] = await db.insert(tHuntingWinners).values(winner).returning();
    return newWinner;
  }

  async getRadioContacts(): Promise<RadioContact[]> {
    return await db.select().from(radioContacts);
  }

  async getVenueInfo(): Promise<VenueInfo[]> {
    return await db.select().from(venueInfo);
  }

  async getUserBookmarks(userId: string): Promise<string[]> {
    const results = await db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
    return results.map(b => b.sessionId);
  }

  async addBookmark(userId: string, sessionId: string): Promise<void> {
    const existing = await db.select().from(bookmarks).where(
      and(eq(bookmarks.userId, userId), eq(bookmarks.sessionId, sessionId))
    );
    if (existing.length === 0) {
      await db.insert(bookmarks).values({ userId, sessionId });
    }
  }

  async removeBookmark(userId: string, sessionId: string): Promise<void> {
    await db.delete(bookmarks).where(
      and(eq(bookmarks.userId, userId), eq(bookmarks.sessionId, sessionId))
    );
  }

  async getUserSurveyResponses(userId: string): Promise<SurveyResponse[]> {
    return await db.select().from(surveyResponses).where(eq(surveyResponses.userId, userId));
  }

  async submitSurvey(response: Omit<SurveyResponse, 'id'>): Promise<SurveyResponse> {
    const [newResponse] = await db.insert(surveyResponses).values(response).returning();
    return newResponse;
  }

  async getSurveyResponse(userId: string, surveyType: string): Promise<SurveyResponse | undefined> {
    const [response] = await db.select().from(surveyResponses).where(
      and(eq(surveyResponses.userId, userId), eq(surveyResponses.surveyType, surveyType))
    );
    return response || undefined;
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user) {
      return {
        callSign: user.callSign || "W6ABC",
        name: user.name || "John Smith",
        badgeNumber: user.badgeNumber || "147",
        licenseClass: user.licenseClass || "Extra",
        isRegistered: user.isRegistered || false,
      };
    }
    return {
      callSign: "W6ABC",
      name: "John Smith",
      badgeNumber: "147",
      licenseClass: "Extra",
      isRegistered: true,
    };
  }

  async seedDatabase(): Promise<void> {
    const existingSessions = await db.select().from(sessions).limit(1);
    if (existingSessions.length > 0) {
      return;
    }

    await db.insert(sessions).values([
      {
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
        title: "ARRL Update and Legislative Matters",
        speaker: "Mike Davis, N6GHI",
        day: "friday",
        startTime: "11:00",
        endTime: "12:00",
        room: "Grand Ballroom B",
        category: "ARRL",
      },
      {
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
        title: "Contest Operating Techniques",
        speaker: "Lisa Brown, W6OPQ",
        day: "saturday",
        startTime: "14:00",
        endTime: "15:30",
        room: "Grand Ballroom A",
        category: "Contesting",
      },
      {
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
        name: "Ham Radio Outlet",
        boothNumber: "12",
        category: "Equipment",
        description: "Complete line of amateur radio transceivers, antennas, and accessories",
        website: "https://www.hamradio.com",
      },
      {
        name: "DX Engineering",
        boothNumber: "15",
        category: "Antennas",
        description: "Premium antenna systems and tower accessories for serious operators",
        website: "https://www.dxengineering.com",
      },
      {
        name: "Elecraft",
        boothNumber: "8",
        category: "QRP Equipment",
        description: "High-performance portable and QRP transceivers and accessories",
        website: "https://www.elecraft.com",
      },
    ]);

    await db.insert(radioContacts).values([
      {
        type: "talk-in",
        frequency: "146.850 MHz",
        label: "Conference Talk-In",
        notes: "PL 100.0 Hz, -0.6 MHz offset",
      },
      {
        type: "simplex",
        frequency: "146.520 MHz",
        label: "National Simplex",
        notes: "Primary calling frequency",
      },
      {
        type: "qrp",
        frequency: "7.030 MHz",
        label: "QRP CW",
        notes: "40m band activity",
      },
      {
        type: "qrp",
        frequency: "14.060 MHz",
        label: "QRP SSB",
        notes: "20m band activity",
      },
    ]);

    await db.insert(venueInfo).values([
      {
        category: "hotel",
        title: "San Ramon Marriott",
        details: "2600 Bishop Drive, San Ramon, CA 94583 • (925) 867-9200",
        hours: "Check-in: 4:00 PM • Check-out: 12:00 PM",
      },
      {
        category: "parking",
        title: "Hotel Parking",
        details: "Free parking available for conference attendees who book at Pacificon rate",
      },
      {
        category: "registration",
        title: "Registration Desk",
        details: "Main lobby near Grand Ballroom entrance",
        hours: "Fri 7AM-5PM • Sat 6AM-4PM • Sun 7:30AM-11AM",
      },
      {
        category: "testing",
        title: "License Testing",
        details: "Conference Room 2 • Bring photo ID and $15 test fee",
        hours: "Saturday 10:00 AM - 2:00 PM",
      },
    ]);

    await db.insert(doorPrizes).values([
      {
        badgeNumber: "147",
        callSign: "W6ABC",
        prizeName: "Handheld VHF/UHF Transceiver",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        claimed: false,
      },
      {
        badgeNumber: "89",
        callSign: "K6DEF",
        prizeName: "Antenna Analyzer",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        claimed: true,
      },
      {
        badgeNumber: "256",
        callSign: "N6GHI",
        prizeName: "Power Supply 25A",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        claimed: false,
      },
    ]);

    await db.insert(tHuntingWinners).values([
      {
        rank: 1,
        callSign: "K6XYZ",
        completionTime: "24:35",
        huntNumber: 1,
        prize: "Portable Antenna Kit",
      },
      {
        rank: 2,
        callSign: "W6LMN",
        completionTime: "28:42",
        huntNumber: 1,
        prize: "RF Attenuator Set",
      },
      {
        rank: 3,
        callSign: "N6OPQ",
        completionTime: "31:15",
        huntNumber: 1,
        prize: "Coax Cable Kit",
      },
      {
        rank: 4,
        callSign: "KJ6RST",
        completionTime: "35:20",
        huntNumber: 1,
      },
    ]);

    await db.insert(tHuntingSchedule).values([
      {
        huntNumber: 1,
        startTime: "Saturday 2:00 PM",
        location: "Hotel Parking Lot - South End",
        difficulty: "easy",
        registrationOpen: false,
      },
      {
        huntNumber: 2,
        startTime: "Saturday 4:00 PM",
        location: "Hotel Grounds",
        difficulty: "medium",
        registrationOpen: true,
      },
      {
        huntNumber: 3,
        startTime: "Sunday 10:00 AM",
        location: "TBD",
        difficulty: "hard",
        registrationOpen: true,
      },
    ]);

    await db.insert(users).values({
      username: "demo",
      password: "demo",
      callSign: "W6ABC",
      name: "John Smith",
      badgeNumber: "147",
      licenseClass: "Extra",
      isRegistered: true,
    });
  }
}

export const storage = new DatabaseStorage();
