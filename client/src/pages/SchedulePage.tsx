import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DaySelector from "@/components/DaySelector";
import SessionCard from "@/components/SessionCard";
import type { Session } from "@shared/schema";

// TODO: Remove mock data
const mockSessions: Session[] = [
  {
    id: "1",
    title: "Advanced Antenna Design for DX Communications",
    speaker: "John Smith, W6ABC",
    day: "friday",
    startTime: "09:00",
    endTime: "10:30",
    room: "Grand Ballroom A",
    category: "Antennas",
    isBookmarked: false,
  },
  {
    id: "2",
    title: "Introduction to Digital Mode Operations",
    speaker: "Sarah Johnson, K6DEF",
    day: "friday",
    startTime: "09:00",
    endTime: "10:00",
    room: "Conference Room 1",
    category: "Digital Modes",
    isBookmarked: true,
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
    isBookmarked: false,
  },
  {
    id: "4",
    title: "Building QRP Transceivers",
    speaker: "Tom Wilson, KJ6LMN",
    day: "saturday",
    startTime: "10:00",
    endTime: "11:30",
    room: "Workshop Area",
    category: "QRP",
    isBookmarked: false,
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
    isBookmarked: true,
  },
];

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<'friday' | 'saturday' | 'sunday'>('friday');
  const [searchQuery, setSearchQuery] = useState("");
  const [sessions, setSessions] = useState(mockSessions);

  const filteredSessions = sessions.filter(
    (session) =>
      session.day === selectedDay &&
      (searchQuery === "" ||
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBookmark = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isBookmarked: !s.isBookmarked } : s))
    );
  };

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-medium text-foreground">Pacificon 2025</h1>
          <Button size="icon" variant="ghost" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sessions, speakers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search"
          />
        </div>
        
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sessions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onBookmark={handleBookmark}
                onViewDetails={(id) => console.log('View session details:', id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
