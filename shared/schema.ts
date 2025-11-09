import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User Profile
export type UserProfile = {
  callSign: string;
  name: string;
  badgeNumber: string;
  licenseClass: string;
  isRegistered: boolean;
};

// Conference Session/Forum
export type Session = {
  id: string;
  title: string;
  speaker: string;
  speakerBio?: string;
  abstract?: string;
  day: 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  room: string;
  category: string;
  isBookmarked?: boolean;
};

// Vendor
export type Vendor = {
  id: string;
  name: string;
  boothNumber: string;
  category: string;
  description: string;
  website?: string;
};

// Door Prize Winner
export type DoorPrize = {
  id: string;
  badgeNumber: string;
  callSign: string;
  prizeName: string;
  timestamp: string;
  claimed: boolean;
};

// T-Hunting Schedule
export type THuntingSchedule = {
  id: string;
  huntNumber: number;
  startTime: string;
  location: string;
  difficulty: 'easy' | 'medium' | 'hard';
  registrationOpen: boolean;
};

// T-Hunting Winner
export type THuntingWinner = {
  id: string;
  rank: number;
  callSign: string;
  completionTime: string;
  huntNumber: number;
  prize?: string;
};

// Radio Contact Info
export type RadioContact = {
  id: string;
  type: 'talk-in' | 'simplex' | 'qrp';
  frequency: string;
  label: string;
  notes?: string;
};

// Venue Info
export type VenueInfo = {
  id: string;
  category: 'hotel' | 'parking' | 'registration' | 'testing';
  title: string;
  details: string;
  hours?: string;
};

// Survey Response
export type SurveyResponse = {
  id: string;
  userId: string;
  surveyType: 'attendee' | 'exhibitor' | 'speaker' | 'volunteer' | 'staff';
  responses: Record<string, any>;
  timestamp: string;
  completed: boolean;
};
