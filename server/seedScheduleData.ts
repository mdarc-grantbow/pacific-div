import { db } from "./db";
import { sessions, conferences } from "@shared/schema";
import { eq } from "drizzle-orm";

interface ForumSessionItem {
  id: string;
  room: string;
  title: string;
  speaker?: string;
}

interface ForumSession {
  time: string;
  sessions: ForumSessionItem[];
}

interface EventItem {
  id: string;
  time: string;
  title: string;
  location: string;
  note?: string;
}

const forumsData: Record<string, ForumSession[]> = {
  friday: [
    {
      time: "09:00 am - 05:00 pm",
      sessions: [
        { id: "fri-f1", room: "Salon E", title: "Antenna Seminar", speaker: "" }
      ]
    }
  ],
  saturday: [
    {
      time: "07:00 am - 07:50 am",
      sessions: [
        { id: "sat-f1", room: "Salon E", title: "Breakfast with Gordo", speaker: "Gordon West, WB6NOA" }
      ]
    },
    {
      time: "08:00 am - 08:50 am",
      sessions: [
        { id: "sat-f2", room: "Salon 2", title: "Getting Started With FreeDV digital voice", speaker: "Mooneer Salem, K6AQ" },
        { id: "sat-f3", room: "Salon E", title: "Ham Instructor Academy", speaker: "Gordon West, WB6NOA" },
        { id: "sat-f4", room: "Salons G/H", title: "Amateur Radio Ballooning in the Bay Area", speaker: "Martin Rothfield, W6MRR & Kazu Terasaki, AG6NS" },
        { id: "sat-f5", room: "Pleasanton/Danville", title: "Working DX. DXCC is easy", speaker: "Don Minkoff, NK6A" }
      ]
    },
    {
      time: "09:00 am - 09:50 am",
      sessions: [
        { id: "sat-f6", room: "Salon 2", title: "RADE - Machine Learning for Speech over HF Radio", speaker: "David Rowe, VK5DGR" },
        { id: "sat-f7", room: "Salon E", title: "Building an amateur radio community Malawi & Comoros, Africa", speaker: "Don Jones, 7Q6M (K6ZO)" },
        { id: "sat-f8", room: "Salons G/H", title: "CW Tube Transmitter for SOTA, A Project for the Decades", speaker: "Dan Koellen, AI6XG" },
        { id: "sat-f9", room: "Pleasanton/Danville", title: "Adapting the Pico Receiver to a club project", speaker: "John Sutter, K6JDS" }
      ]
    },
    {
      time: "10:00 am - 10:50 am",
      sessions: [
        { id: "sat-f10", room: "Salon 2", title: "Scouting Venture Crew 73... Radio & electronics Merit badges and STEM", speaker: "Darryl Paule, KI6MSP" },
        { id: "sat-f11", room: "Salon E", title: "Elecraft K4 updates along with Q&A", speaker: "Eric Swartz, WA6HHQ" },
        { id: "sat-f12", room: "Salons G/H", title: "SKYWARN volunteer program by National Weather Service", speaker: "Curt Kolovson, W6RQ" },
        { id: "sat-f13", room: "Pleasanton/Danville", title: "Construction Techniques for Homebrew Projects for Hams", speaker: "Chuck Adams, AA7FO" }
      ]
    },
    {
      time: "11:00 am - 11:50 am",
      sessions: [
        { id: "sat-f14", room: "Salon 2", title: "SOTA & POTA: A Next-Gen Toolkit", speaker: "Brian Mathews, AB6D" },
        { id: "sat-f15", room: "Salon E", title: "Remote Operation of your Radio Station", speaker: "Mark Aaker, K6UFO" },
        { id: "sat-f16", room: "Salons G/H", title: "An Overview of AREDN Networking Software", speaker: "Orv Beach, W6BI" },
        { id: "sat-f17", room: "Pleasanton/Danville", title: "The Pacificon 40 radio, an update to a QRP Classic", speaker: "Yin Shih, N9YS" }
      ]
    },
    {
      time: "1:00 pm - 1:50 pm",
      sessions: [
        { id: "sat-f18", room: "Salon 2", title: "Ham Radio 101a New Technician", speaker: "Jim Aspinwall, NO1PC & David Witkowski, W6DTW" },
        { id: "sat-f19", room: "Salon E", title: "Multimode Digital Voice Modem (MMDVM) 10th Anniversary update", speaker: "Jim Mclaughlin, KI6ZUM" },
        { id: "sat-f20", room: "Salons G/H", title: "AREDN Networking in 2025", speaker: "Tim Wilkinson, KN6PLV" },
        { id: "sat-f21", room: "Pleasanton/Danville", title: "Upgrading the Tuna Tin S, A Synthesized Multi-band Transmitter", speaker: "Carol Milazzo, KP4MD" }
      ]
    },
    {
      time: "2:00 pm - 2:50 pm",
      sessions: [
        { id: "sat-f22", room: "Salon 2", title: "Ham Radio 101b Intro to Digital Voice", speaker: "Jim Aspinwall, NO1PC & David Witkowski, W6DTW" },
        { id: "sat-f23", room: "Salon E", title: "YLRL Forum (part 1)", speaker: "Deborah Johnson, WB6LVC" },
        { id: "sat-f24", room: "Salons G/H", title: "Mentoring for fun in Public Service or ARES/RACES activities", speaker: "Brian Tanner, AG6GX" },
        { id: "sat-f25", room: "Pleasanton/Danville", title: "Kit Building Techniques for Success", speaker: "Joe Eisenberg, K0NEB" }
      ]
    },
    {
      time: "3:00 pm - 3:50 pm",
      sessions: [
        { id: "sat-f26", room: "Salon 2", title: "Ham Radio 201a HF Gear & Operating", speaker: "Jim Aspinwall, NO1PC & David Witkowski, W6DTW" },
        { id: "sat-f27", room: "Salon E", title: "YLRL Forum (part 2)", speaker: "Deborah Johnson, WB6LVC" },
        { id: "sat-f28", room: "Salons G/H", title: "Building a Ham Shack In Your RV", speaker: "Bruce Perens, K6BP" },
        { id: "sat-f29", room: "Pleasanton/Danville", title: "Homebrewing Portable HF Antennas", speaker: "Hiroki Kato, AH6CY" }
      ]
    },
    {
      time: "4:00 pm - 4:50 pm",
      sessions: [
        { id: "sat-f30", room: "Salon 2", title: "Ham Radio 201b HF Antennas", speaker: "Jim Aspinwall, NO1PC & David Witkowski, W6DTW" },
        { id: "sat-f31", room: "Salon E", title: "MORE Technological Innovation in Amateur Radio", speaker: "Steve Stroh, N8GNJ" },
        { id: "sat-f32", room: "Salons G/H", title: "Multi-County Aux Communication Functional Exercise panel discussion", speaker: "Greg Waters, KJ6OUI & Daniel Goldstein, KJ6KEU" },
        { id: "sat-f33", room: "Pleasanton/Danville", title: "Summits On The Air - The What & How", speaker: "Christian Claborne, N1CLC" }
      ]
    }
  ],
  sunday: [
    {
      time: "10:00 am - 10:50 am",
      sessions: [
        { id: "sun-f1", room: "Salon 2", title: "You Should Build a Bad Radio", speaker: "Justin Giorgi, AI6YM" },
        { id: "sun-f2", room: "Salon E", title: "How AI is revolutionizing radio from a Google Researcher", speaker: "Erik Gross, KM6EOP" },
        { id: "sun-f3", room: "Pleasanton/Danville", title: "Getting on the Microwave Bands", speaker: "Joel Wilhite, KD6W" }
      ]
    },
    {
      time: "11:00 am - 11:50 am",
      sessions: [
        { id: "sun-f4", room: "Salon 2", title: "Responding to an accident on the route as a SAG", speaker: "Joan Acquistapace, KO6ATP" },
        { id: "sun-f5", room: "Salon E", title: "Meshtastic (wireless off-grid mesh networking) is Hamtastic", speaker: "Benjamin Faershtein, KO6CNT" },
        { id: "sun-f6", room: "Pleasanton/Danville", title: "Team Awareness Kit (TAK) for Amateur Radio", speaker: "Greg Albrecht, W2GMD" }
      ]
    },
    {
      time: "1:00 pm - 1:50 pm",
      sessions: [
        { id: "sun-f7", room: "Salon E", title: "ARRL Forum", speaker: "Hosted by John Litz, NZ6Q - ARRL Pacific Division Director" }
      ]
    }
  ]
};

const eventsData: Record<string, EventItem[]> = {
  friday: [
    { id: "fri-e1", time: "7:00 am - 5:00 pm", title: "Registration/Will Call Open", location: "Mt. Diablo/Lobby" },
    { id: "fri-e2", time: "9:00 am - 5:00 pm", title: "Antenna Seminar", location: "Salon E" },
    { id: "fri-e3", time: "11:30 am - 1:30 pm", title: "Cash Sales Lunch", location: "Contra Costa Patio" },
    { id: "fri-e4", time: "12:00 pm Fri - 12:00 pm Sun", title: "Special Event Station W1AW/6", location: "Bishop Ranch Patio", note: "Hosted by PAARA" },
    { id: "fri-e5", time: "9:00 am - 3:00 pm", title: "Vendor Setup (closed to public)", location: "Salon 1, Salons A-D" },
    { id: "fri-e6", time: "3:00 pm - 5:00 pm", title: "Prize Booth", location: "Hotel Lobby" },
    { id: "fri-e7", time: "3:00 pm - 6:00 pm", title: "ARRL Booth", location: "Salons A-D" },
    { id: "fri-e8", time: "3:00 pm - 6:00 pm", title: "Vendor Exhibit Halls Open", location: "Salon 1, Salons A-D" },
    { id: "fri-e9", time: "4:00 pm - 6:00 pm", title: "QRP No-host Dinner", location: "Meet in Hotel Lobby, then to Panera" },
    { id: "fri-e10", time: "7:00 pm - 9:00 pm", title: "Mt. Diablo Amateur Radio Club Meeting", location: "Salon E", note: "Open to All" },
    { id: "fri-e11", time: "7:00 pm - 10:00 pm", title: "QRP Open House", location: "Pleasanton/Danville" },
    { id: "fri-e12", time: "After MDARC meeting", title: "Prize Drawing", location: "Salon E" }
  ],
  saturday: [
    { id: "sat-e1", time: "6:00 am - 4:00 pm", title: "Registration/Will Call Open", location: "Mt. Diablo/Lobby" },
    { id: "sat-e2", time: "7:00 am - 9:00 am", title: "Cash Sales Breakfast", location: "Contra Costa Patio" },
    { id: "sat-e3", time: "7:00 am - 7:50 am", title: "Breakfast With Gordo", location: "Salon E" },
    { id: "sat-e4", time: "8:00 am - 8:50 am", title: "Ham Instructor Academy by Gordon West", location: "Salon E" },
    { id: "sat-e5", time: "8:00 am - 1:00 pm", title: "Ham License Testing", location: "Tri-Valley 2" },
    { id: "sat-e6", time: "8:00 am - 3:00 pm", title: "Outside Displays", location: "Parking Lot" },
    { id: "sat-e7", time: "8:00 am - 4:00 pm", title: "Technician One Day License Class (Exam follows)", location: "Tri-Valley 1" },
    { id: "sat-e8", time: "8:00 am - 4:00 pm", title: "Scouting Activities & Merit Badges", location: "Salon F, San Ramon Boardroom" },
    { id: "sat-e9", time: "8:00 am - 5:00 pm", title: "Forums", location: "See Forums Tab" },
    { id: "sat-e10", time: "9:00 am - 3:00 pm", title: "Electronic Kit Building (youth & adults)", location: "Bishop Ranch Hallway Foyer" },
    { id: "sat-e11", time: "9:00 am - 5:00 pm", title: "Prize Booth", location: "Hotel Lobby" },
    { id: "sat-e12", time: "9:00 am - 5:00 pm", title: "ARRL Booth", location: "Salons A-D" },
    { id: "sat-e13", time: "9:00 am - 5:00 pm", title: "Vendor Exhibit Halls Open", location: "Salon 1, Salons A-D" },
    { id: "sat-e14", time: "11:00 am - 11:15 am", title: "Prize Drawing", location: "Prize Booth" },
    { id: "sat-e15", time: "11:00 am - 1:00 pm", title: "T-Hunting", location: "FOXHUNT Canopy" },
    { id: "sat-e16", time: "11:30 am - 1:30 pm", title: "Cash Sales Lunch", location: "Contra Costa Patio" },
    { id: "sat-e17", time: "12:00 pm - 1:30 pm", title: "Private Summits-on-the-Air Lunch", location: "Rear Patio" },
    { id: "sat-e18", time: "1:00 pm - 1:15 pm", title: "Prize Drawing", location: "Prize Booth" },
    { id: "sat-e19", time: "2:00 pm - 4:00 pm", title: "QRP Stations Operating", location: "Hotel Front Lawn" },
    { id: "sat-e20", time: "4:00 pm - 4:15 pm", title: "Prize Drawing", location: "Prize Booth" },
    { id: "sat-e21", time: "4:00 pm - 6:00 pm", title: "Ham License Testing", location: "Tri-Valley 1" },
    { id: "sat-e22", time: "7:00 pm - 10:00 pm", title: "Banquet Dinner", location: "Salon E" },
    { id: "sat-e23", time: "7:00 pm - 10:00 pm", title: "QRP Open House", location: "Pleasanton/Danville" },
    { id: "sat-e24", time: "11:35 pm - 1:00 am", title: "Wouff-Hong Initiation Ceremony", location: "Salon 2" }
  ],
  sunday: [
    { id: "sun-e1", time: "6:00 am - 12:00 pm", title: "Swap Meet", location: "Parking Lot-Rear", note: "Hosted by LARK" },
    { id: "sun-e2", time: "7:30 am - 11:00 am", title: "Registration/Will Call Open", location: "Mt. Diablo/Lobby" },
    { id: "sun-e3", time: "8:00 am - 11:50 am", title: "Forums", location: "See Forums Tab" },
    { id: "sun-e4", time: "9:00 am - 11:00 am", title: "Electronic Kit Building (youth & adults)", location: "Bishop Ranch Hallway Foyer" },
    { id: "sun-e5", time: "9:00 am - 12:00 pm", title: "Ham License Testing", location: "Tri-Valley 2" },
    { id: "sun-e6", time: "9:00 am - 12:15 pm", title: "Prize Booth", location: "Hotel Lobby" },
    { id: "sun-e7", time: "9:00 am - 1:00 pm", title: "ARRL Booth", location: "Salons A-D" },
    { id: "sun-e8", time: "9:00 am - 1:00 pm", title: "Vendor Exhibit Halls Open", location: "Salon 1, Salons A-D" },
    { id: "sun-e9", time: "10:00 am - 10:15 am", title: "Prize Drawing", location: "Prize Booth" },
    { id: "sun-e10", time: "11:00 am - 1:00 pm", title: "T-Hunting", location: "FOXHUNT Canopy" },
    { id: "sun-e11", time: "11:30 am - 1:30 pm", title: "Cash Sales Lunch", location: "Contra Costa Patio" },
    { id: "sun-e12", time: "1:00 pm - 3:00 pm", title: "ARRL Forum", location: "Salon E" },
    { id: "sun-e13", time: "After ARRL Forum", title: "Final Prize Drawings & Grand Prize Drawing", location: "Salon E" }
  ]
};

function parseTimeRange(timeStr: string): { startTime: string; endTime: string } {
  const parts = timeStr.split(" - ");
  if (parts.length === 2) {
    return { startTime: parts[0].trim(), endTime: parts[1].trim() };
  }
  return { startTime: timeStr.trim(), endTime: "" };
}

export async function seedScheduleData(): Promise<void> {
  console.log("Seeding schedule data (forums and events)...");
  
  const [conference] = await db.select().from(conferences).where(eq(conferences.slug, "pacificon-2025")).limit(1);
  if (!conference) {
    console.log("No conference found for seeding schedule data");
    return;
  }

  const conferenceId = conference.id;

  const existingSessions = await db.select().from(sessions).where(eq(sessions.conferenceId, conferenceId));
  const hasForumsOrEvents = existingSessions.some(s => s.category === "forum" || s.category === "event");
  
  if (hasForumsOrEvents) {
    console.log("Schedule data (forums/events) already seeded, skipping...");
    return;
  }

  const sessionsToInsert: Array<{
    conferenceId: string;
    title: string;
    speaker: string;
    day: string;
    startTime: string;
    endTime: string;
    room: string;
    category: string;
    abstract?: string;
  }> = [];

  for (const [day, forumSessions] of Object.entries(forumsData)) {
    for (const forumSession of forumSessions) {
      const { startTime, endTime } = parseTimeRange(forumSession.time);
      for (const session of forumSession.sessions) {
        sessionsToInsert.push({
          conferenceId,
          title: session.title,
          speaker: session.speaker || "",
          day,
          startTime,
          endTime,
          room: session.room,
          category: "forum",
        });
      }
    }
  }

  for (const [day, events] of Object.entries(eventsData)) {
    for (const event of events) {
      const { startTime, endTime } = parseTimeRange(event.time);
      sessionsToInsert.push({
        conferenceId,
        title: event.title,
        speaker: "",
        day,
        startTime,
        endTime,
        room: event.location,
        category: "event",
        abstract: event.note || undefined,
      });
    }
  }

  if (sessionsToInsert.length > 0) {
    await db.insert(sessions).values(sessionsToInsert);
    console.log(`Seeded ${sessionsToInsert.length} schedule items (forums and events)`);
  }
}
