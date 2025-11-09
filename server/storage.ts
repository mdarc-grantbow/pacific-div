import { 
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
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSessions(): Promise<Session[]>;
  getSessionById(id: string): Promise<Session | undefined>;
  
  getVendors(): Promise<Vendor[]>;
  getVendorById(id: string): Promise<Vendor | undefined>;
  
  getDoorPrizes(): Promise<DoorPrize[]>;
  addDoorPrize(prize: DoorPrize): Promise<DoorPrize>;
  
  getTHuntingSchedule(): Promise<THuntingSchedule[]>;
  getTHuntingWinners(): Promise<THuntingWinner[]>;
  addTHuntingWinner(winner: THuntingWinner): Promise<THuntingWinner>;
  
  getRadioContacts(): Promise<RadioContact[]>;
  getVenueInfo(): Promise<VenueInfo[]>;
  
  getUserBookmarks(userId: string): Promise<string[]>;
  addBookmark(userId: string, sessionId: string): Promise<void>;
  removeBookmark(userId: string, sessionId: string): Promise<void>;
  
  getUserSurveyResponses(userId: string): Promise<SurveyResponse[]>;
  submitSurvey(response: SurveyResponse): Promise<SurveyResponse>;
  getSurveyResponse(userId: string, surveyType: string): Promise<SurveyResponse | undefined>;
  
  getUserProfile(userId: string): Promise<UserProfile>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, Session>;
  private vendors: Map<string, Vendor>;
  private doorPrizes: Map<string, DoorPrize>;
  private tHuntingSchedule: Map<string, THuntingSchedule>;
  private tHuntingWinners: Map<string, THuntingWinner>;
  private radioContacts: Map<string, RadioContact>;
  private venueInfo: Map<string, VenueInfo>;
  private userBookmarks: Map<string, Set<string>>;
  private surveyResponses: Map<string, SurveyResponse>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.vendors = new Map();
    this.doorPrizes = new Map();
    this.tHuntingSchedule = new Map();
    this.tHuntingWinners = new Map();
    this.radioContacts = new Map();
    this.venueInfo = new Map();
    this.userBookmarks = new Map();
    this.surveyResponses = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed sessions
    const sessions: Session[] = [
      {
        id: "1",
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
        id: "2",
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
        id: "3",
        title: "ARRL Update and Legislative Matters",
        speaker: "Mike Davis, N6GHI",
        day: "friday",
        startTime: "11:00",
        endTime: "12:00",
        room: "Grand Ballroom B",
        category: "ARRL",
      },
      {
        id: "4",
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
        id: "5",
        title: "Contest Operating Techniques",
        speaker: "Lisa Brown, W6OPQ",
        day: "saturday",
        startTime: "14:00",
        endTime: "15:30",
        room: "Grand Ballroom A",
        category: "Contesting",
      },
    ];
    sessions.forEach(s => this.sessions.set(s.id, s));

    // Seed vendors
    const vendors: Vendor[] = [
      {
        id: "1",
        name: "Ham Radio Outlet",
        boothNumber: "12",
        category: "Equipment",
        description: "Complete line of amateur radio transceivers, antennas, and accessories",
        website: "https://www.hamradio.com",
      },
      {
        id: "2",
        name: "DX Engineering",
        boothNumber: "15",
        category: "Antennas",
        description: "Premium antenna systems and tower accessories for serious operators",
        website: "https://www.dxengineering.com",
      },
      {
        id: "3",
        name: "Elecraft",
        boothNumber: "8",
        category: "QRP Equipment",
        description: "High-performance portable and QRP transceivers and accessories",
        website: "https://www.elecraft.com",
      },
    ];
    vendors.forEach(v => this.vendors.set(v.id, v));

    // Seed radio contacts
    const radioContacts: RadioContact[] = [
      {
        id: "1",
        type: "talk-in",
        frequency: "146.850 MHz",
        label: "Conference Talk-In",
        notes: "PL 100.0 Hz, -0.6 MHz offset",
      },
      {
        id: "2",
        type: "simplex",
        frequency: "146.520 MHz",
        label: "National Simplex",
        notes: "Primary calling frequency",
      },
      {
        id: "3",
        type: "qrp",
        frequency: "7.030 MHz",
        label: "QRP CW",
        notes: "40m band activity",
      },
      {
        id: "4",
        type: "qrp",
        frequency: "14.060 MHz",
        label: "QRP SSB",
        notes: "20m band activity",
      },
    ];
    radioContacts.forEach(r => this.radioContacts.set(r.id, r));

    // Seed venue info
    const venueInfo: VenueInfo[] = [
      {
        id: "1",
        category: "hotel",
        title: "San Ramon Marriott",
        details: "2600 Bishop Drive, San Ramon, CA 94583 • (925) 867-9200",
        hours: "Check-in: 4:00 PM • Check-out: 12:00 PM",
      },
      {
        id: "2",
        category: "parking",
        title: "Hotel Parking",
        details: "Free parking available for conference attendees who book at Pacificon rate",
      },
      {
        id: "3",
        category: "registration",
        title: "Registration Desk",
        details: "Main lobby near Grand Ballroom entrance",
        hours: "Fri 7AM-5PM • Sat 6AM-4PM • Sun 7:30AM-11AM",
      },
      {
        id: "4",
        category: "testing",
        title: "License Testing",
        details: "Conference Room 2 • Bring photo ID and $15 test fee",
        hours: "Saturday 10:00 AM - 2:00 PM",
      },
    ];
    venueInfo.forEach(v => this.venueInfo.set(v.id, v));

    // Seed door prizes
    const doorPrizes: DoorPrize[] = [
      {
        id: "1",
        badgeNumber: "147",
        callSign: "W6ABC",
        prizeName: "Handheld VHF/UHF Transceiver",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        claimed: false,
      },
      {
        id: "2",
        badgeNumber: "89",
        callSign: "K6DEF",
        prizeName: "Antenna Analyzer",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        claimed: true,
      },
      {
        id: "3",
        badgeNumber: "256",
        callSign: "N6GHI",
        prizeName: "Power Supply 25A",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        claimed: false,
      },
    ];
    doorPrizes.forEach(p => this.doorPrizes.set(p.id, p));

    // Seed T-hunting winners
    const tHuntingWinners: THuntingWinner[] = [
      {
        id: "1",
        rank: 1,
        callSign: "K6XYZ",
        completionTime: "24:35",
        huntNumber: 1,
        prize: "Portable Antenna Kit",
      },
      {
        id: "2",
        rank: 2,
        callSign: "W6LMN",
        completionTime: "28:42",
        huntNumber: 1,
        prize: "RF Attenuator Set",
      },
      {
        id: "3",
        rank: 3,
        callSign: "N6OPQ",
        completionTime: "31:15",
        huntNumber: 1,
        prize: "Coax Cable Kit",
      },
      {
        id: "4",
        rank: 4,
        callSign: "KJ6RST",
        completionTime: "35:20",
        huntNumber: 1,
      },
    ];
    tHuntingWinners.forEach(w => this.tHuntingWinners.set(w.id, w));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values());
  }

  async getSessionById(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendorById(id: string): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async getDoorPrizes(): Promise<DoorPrize[]> {
    return Array.from(this.doorPrizes.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async addDoorPrize(prize: DoorPrize): Promise<DoorPrize> {
    this.doorPrizes.set(prize.id, prize);
    return prize;
  }

  async getTHuntingSchedule(): Promise<THuntingSchedule[]> {
    return Array.from(this.tHuntingSchedule.values());
  }

  async getTHuntingWinners(): Promise<THuntingWinner[]> {
    return Array.from(this.tHuntingWinners.values()).sort(
      (a, b) => a.rank - b.rank
    );
  }

  async addTHuntingWinner(winner: THuntingWinner): Promise<THuntingWinner> {
    this.tHuntingWinners.set(winner.id, winner);
    return winner;
  }

  async getRadioContacts(): Promise<RadioContact[]> {
    return Array.from(this.radioContacts.values());
  }

  async getVenueInfo(): Promise<VenueInfo[]> {
    return Array.from(this.venueInfo.values());
  }

  async getUserBookmarks(userId: string): Promise<string[]> {
    const bookmarks = this.userBookmarks.get(userId);
    return bookmarks ? Array.from(bookmarks) : [];
  }

  async addBookmark(userId: string, sessionId: string): Promise<void> {
    if (!this.userBookmarks.has(userId)) {
      this.userBookmarks.set(userId, new Set());
    }
    this.userBookmarks.get(userId)!.add(sessionId);
  }

  async removeBookmark(userId: string, sessionId: string): Promise<void> {
    const bookmarks = this.userBookmarks.get(userId);
    if (bookmarks) {
      bookmarks.delete(sessionId);
    }
  }

  async getUserSurveyResponses(userId: string): Promise<SurveyResponse[]> {
    return Array.from(this.surveyResponses.values()).filter(
      (response) => response.userId === userId
    );
  }

  async submitSurvey(response: SurveyResponse): Promise<SurveyResponse> {
    this.surveyResponses.set(response.id, response);
    return response;
  }

  async getSurveyResponse(userId: string, surveyType: string): Promise<SurveyResponse | undefined> {
    return Array.from(this.surveyResponses.values()).find(
      (response) => response.userId === userId && response.surveyType === surveyType
    );
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    return {
      callSign: "W6ABC",
      name: "John Smith",
      badgeNumber: "147",
      licenseClass: "Extra",
      isRegistered: true,
    };
  }
}

export const storage = new MemStorage();
