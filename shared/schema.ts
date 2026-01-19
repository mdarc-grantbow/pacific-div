import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Conferences table
export const conferences = pgTable("conferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  slug: varchar("slug").unique().notNull(),
  division: text("division"),
  gridsquare: text("grid_square"),
  gps: text("gps"),
  locationAddress: text("location_address"),
  // Branding
  logoUrl: varchar("logo_url"),
  faviconUrl: varchar("favicon_url"),
  primaryColor: varchar("primary_color"),
  accentColor: varchar("accent_color"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Conference = typeof conferences.$inferSelect;
export type InsertConference = typeof conferences.$inferInsert;

// Auth Sessions table for Replit Auth
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const authSessions = pgTable(
  "auth_sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_auth_session_expire").on(table.expire)],
);

// Users table with Replit Auth fields
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Ham radio profile fields
  callSign: text("call_sign"),
  badgeNumber: text("badge_number"),
  licenseClass: text("license_class"),
  isRegistered: boolean("is_registered").default(false),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// User Profile type (for API responses)
export type UserProfile = {
  callSign: string;
  name: string;
  badgeNumber: string;
  licenseClass: string;
  isRegistered: boolean;
};

// Sessions table
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conferenceId: varchar("conference_id").notNull(),
  title: text("title").notNull(),
  speaker: text("speaker").notNull(),
  speakerBio: text("speaker_bio"),
  abstract: text("abstract"),
  day: text("day").notNull(), // 'friday' | 'saturday' | 'sunday'
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  room: text("room").notNull(),
  category: text("category").notNull(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({ id: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect & { isBookmarked?: boolean };

// Bookmarks table
export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  conferenceId: varchar("conference_id").notNull(),
  sessionId: varchar("session_id").notNull(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({ id: true });
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;

// Vendors table
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conferenceId: varchar("conference_id").notNull(),
  name: text("name").notNull(),
  boothNumber: text("booth_number").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  website: text("website"),
});

export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true });
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

// Door Prizes table
export const doorPrizes = pgTable("door_prizes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conferenceId: varchar("conference_id").notNull(),
  badgeNumber: text("badge_number").notNull(),
  callSign: text("call_sign").notNull(),
  prizeName: text("prize_name").notNull(),
  timestamp: text("timestamp").notNull(),
  claimed: boolean("claimed").default(false),
  typePrize: varchar("type_prize").notNull(),
});

export const insertDoorPrizeSchema = createInsertSchema(doorPrizes).omit({ id: true });
export type InsertDoorPrize = z.infer<typeof insertDoorPrizeSchema>;
export type DoorPrize = typeof doorPrizes.$inferSelect;

// T-Hunting Schedule table
export const tHuntingSchedule = pgTable("t_hunting_schedule", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conferenceId: varchar("conference_id").notNull(),
  huntNumber: integer("hunt_number").notNull(),
  startTime: text("start_time").notNull(),
  location: text("location").notNull(),
  difficulty: text("difficulty").notNull(), // 'easy' | 'medium' | 'hard'
  registrationOpen: boolean("registration_open").default(true),
});

export const insertTHuntingScheduleSchema = createInsertSchema(tHuntingSchedule).omit({ id: true });
export type InsertTHuntingSchedule = z.infer<typeof insertTHuntingScheduleSchema>;
export type THuntingSchedule = typeof tHuntingSchedule.$inferSelect;

// T-Hunting Winners table
export const tHuntingWinners = pgTable("t_hunting_winners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conferenceId: varchar("conference_id").notNull(),
  rank: integer("rank").notNull(),
  callSign: text("call_sign").notNull(),
  completionTime: text("completion_time").notNull(),
  huntNumber: integer("hunt_number").notNull(),
  prize: text("prize"),
});

export const insertTHuntingWinnerSchema = createInsertSchema(tHuntingWinners).omit({ id: true });
export type InsertTHuntingWinner = z.infer<typeof insertTHuntingWinnerSchema>;
export type THuntingWinner = typeof tHuntingWinners.$inferSelect;

// Radio Contacts table
export const radioContacts = pgTable("radio_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conferenceId: varchar("conference_id").notNull(),
  type: text("type").notNull(), // 'talk-in' | 'simplex' | 'qrp'
  frequency: text("frequency").notNull(),
  label: text("label").notNull(),
  notes: text("notes"),
});

export const insertRadioContactSchema = createInsertSchema(radioContacts).omit({ id: true });
export type InsertRadioContact = z.infer<typeof insertRadioContactSchema>;
export type RadioContact = typeof radioContacts.$inferSelect;

// Venue Info table
export const venueInfo = pgTable("venue_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conferenceId: varchar("conference_id").notNull(),
  category: text("category").notNull(), // 'hotel' | 'parking' | 'registration' | 'testing'
  title: text("title").notNull(),
  details: text("details").notNull(),
  hours: text("hours"),
});

export const insertVenueInfoSchema = createInsertSchema(venueInfo).omit({ id: true });
export type InsertVenueInfo = z.infer<typeof insertVenueInfoSchema>;
export type VenueInfo = typeof venueInfo.$inferSelect;

// Survey Responses table
export const surveyResponses = pgTable("survey_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conferenceId: varchar("conference_id").notNull(),
  userId: varchar("user_id").notNull(),
  surveyType: text("survey_type").notNull(), // 'attendee' | 'exhibitor' | 'speaker' | 'volunteer' | 'staff'
  responses: json("responses").$type<Record<string, any>>().default({}),
  timestamp: text("timestamp").notNull(),
  completed: boolean("completed").default(true),
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({ id: true });
export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
