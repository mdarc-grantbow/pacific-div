import { useState } from "react";
import { Search, Bell, Clock, MapPin, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import DaySelector from "@/components/DaySelector";
import SessionCard from "@/components/SessionCard";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuthContext } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Session } from "@shared/schema";

interface ForumSession {
  time: string;
  sessions: {
    room: string;
    title: string;
    speaker?: string;
  }[];
}

interface EventItem {
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
        { room: "Salon E", title: "Antenna Seminar", speaker: "" }
      ]
    }
  ],
  saturday: [
    {
      time: "07:00 am - 07:50 am",
      sessions: [
        { room: "Salon E", title: "Breakfast with Gordo", speaker: "Gordon West, WB6NOA" }
      ]
    },
    {
      time: "08:00 am - 08:50 am",
      sessions: [
        { room: "Salon 2", title: "Getting Started With FreeDV digital voice", speaker: "Mooneer Salem, K6AQ" },
        { room: "Salon E", title: "Ham Instructor Academy", speaker: "Gordon West, WB6NOA" },
        { room: "Salons G/H", title: "Amateur Radio Ballooning in the Bay Area", speaker: "Martin Rothfield, W6MRR & Kazu Terasaki, AG6NS" },
        { room: "Pleasanton/Danville", title: "Working DX. DXCC is easy", speaker: "Don Minkoff, NK6A" }
      ]
    },
    {
      time: "09:00 am - 09:50 am",
      sessions: [
        { room: "Salon 2", title: "RADE - Machine Learning for Speech over HF Radio", speaker: "David Rowe, VK5DGR" },
        { room: "Salon E", title: "Building an amateur radio community Malawi & Comoros, Africa", speaker: "Don Jones, 7Q6M (K6ZO)" },
        { room: "Salons G/H", title: "CW Tube Transmitter for SOTA, A Project for the Decades", speaker: "Dan Koellen, AI6XG" },
        { room: "Pleasanton/Danville", title: "Adapting the Pico Receiver to a club project", speaker: "John Sutter, K6JDS" }
      ]
    },
    {
      time: "10:00 am - 10:50 am",
      sessions: [
        { room: "Salon 2", title: "Scouting Venture Crew 73... Radio & electronics Merit badges and STEM", speaker: "Darryl Paule, KI6MSP" },
        { room: "Salon E", title: "Elecraft K4 updates along with Q&A", speaker: "Eric Swartz, WA6HHQ" },
        { room: "Salons G/H", title: "SKYWARN volunteer program by National Weather Service", speaker: "Curt Kolovson, W6RQ" },
        { room: "Pleasanton/Danville", title: "Construction Techniques for Homebrew Projects for Hams", speaker: "Chuck Adams, AA7FO" }
      ]
    },
    {
      time: "11:00 am - 11:50 am",
      sessions: [
        { room: "Salon 2", title: "SOTA & POTA: A Next-Gen Toolkit", speaker: "Brian Mathews, AB6D" },
        { room: "Salon E", title: "Remote Operation of your Radio Station", speaker: "Mark Aaker, K6UFO" },
        { room: "Salons G/H", title: "An Overview of AREDN Networking Software", speaker: "Orv Beach, W6BI" },
        { room: "Pleasanton/Danville", title: "The Pacificon 40 radio, an update to a QRP Classic", speaker: "Yin Shih, N9YS" }
      ]
    },
    {
      time: "1:00 pm - 1:50 pm",
      sessions: [
        { room: "Salon 2", title: "Ham Radio 101a New Technician", speaker: "Jim Aspinwall, NO1PC & David Witkowski, W6DTW" },
        { room: "Salon E", title: "Multimode Digital Voice Modem (MMDVM) 10th Anniversary update", speaker: "Jim Mclaughlin, KI6ZUM" },
        { room: "Salons G/H", title: "AREDN Networking in 2025", speaker: "Tim Wilkinson, KN6PLV" },
        { room: "Pleasanton/Danville", title: "Upgrading the Tuna Tin S, A Synthesized Multi-band Transmitter", speaker: "Carol Milazzo, KP4MD" }
      ]
    },
    {
      time: "2:00 pm - 2:50 pm",
      sessions: [
        { room: "Salon 2", title: "Ham Radio 101b Intro to Digital Voice", speaker: "Jim Aspinwall, NO1PC & David Witkowski, W6DTW" },
        { room: "Salon E", title: "YLRL Forum (part 1)", speaker: "Deborah Johnson, WB6LVC" },
        { room: "Salons G/H", title: "Mentoring for fun in Public Service or ARES/RACES activities", speaker: "Brian Tanner, AG6GX" },
        { room: "Pleasanton/Danville", title: "Kit Building Techniques for Success", speaker: "Joe Eisenberg, K0NEB" }
      ]
    },
    {
      time: "3:00 pm - 3:50 pm",
      sessions: [
        { room: "Salon 2", title: "Ham Radio 201a HF Gear & Operating", speaker: "Jim Aspinwall, NO1PC & David Witkowski, W6DTW" },
        { room: "Salon E", title: "YLRL Forum (part 2)", speaker: "Deborah Johnson, WB6LVC" },
        { room: "Salons G/H", title: "Building a Ham Shack In Your RV", speaker: "Bruce Perens, K6BP" },
        { room: "Pleasanton/Danville", title: "Homebrewing Portable HF Antennas", speaker: "Hiroki Kato, AH6CY" }
      ]
    },
    {
      time: "4:00 pm - 4:50 pm",
      sessions: [
        { room: "Salon 2", title: "Ham Radio 201b HF Antennas", speaker: "Jim Aspinwall, NO1PC & David Witkowski, W6DTW" },
        { room: "Salon E", title: "MORE Technological Innovation in Amateur Radio", speaker: "Steve Stroh, N8GNJ" },
        { room: "Salons G/H", title: "Multi-County Aux Communication Functional Exercise panel discussion", speaker: "Greg Waters, KJ6OUI & Daniel Goldstein, KJ6KEU" },
        { room: "Pleasanton/Danville", title: "Summits On The Air - The What & How", speaker: "Christian Claborne, N1CLC" }
      ]
    }
  ],
  sunday: [
    {
      time: "10:00 am - 10:50 am",
      sessions: [
        { room: "Salon 2", title: "You Should Build a Bad Radio", speaker: "Justin Giorgi, AI6YM" },
        { room: "Salon E", title: "How AI is revolutionizing radio from a Google Researcher", speaker: "Erik Gross, KM6EOP" },
        { room: "Pleasanton/Danville", title: "Getting on the Microwave Bands", speaker: "Joel Wilhite, KD6W" }
      ]
    },
    {
      time: "11:00 am - 11:50 am",
      sessions: [
        { room: "Salon 2", title: "Responding to an accident on the route as a SAG", speaker: "Joan Acquistapace, KO6ATP" },
        { room: "Salon E", title: "Meshtastic (wireless off-grid mesh networking) is Hamtastic", speaker: "Benjamin Faershtein, KO6CNT" },
        { room: "Pleasanton/Danville", title: "Team Awareness Kit (TAK) for Amateur Radio", speaker: "Greg Albrecht, W2GMD" }
      ]
    },
    {
      time: "1:00 pm - 1:50 pm",
      sessions: [
        { room: "Salon E", title: "ARRL Forum", speaker: "Hosted by John Litz, NZ6Q - ARRL Pacific Division Director" }
      ]
    }
  ]
};

const eventsData: Record<string, EventItem[]> = {
  friday: [
    { time: "7:00 am - 5:00 pm", title: "Registration/Will Call Open", location: "Mt. Diablo/Lobby" },
    { time: "9:00 am - 5:00 pm", title: "Antenna Seminar", location: "Salon E" },
    { time: "11:30 am - 1:30 pm", title: "Cash Sales Lunch", location: "Contra Costa Patio" },
    { time: "12:00 pm Fri - 12:00 pm Sun", title: "Special Event Station W1AW/6", location: "Bishop Ranch Patio", note: "Hosted by PAARA" },
    { time: "9:00 am - 3:00 pm", title: "Vendor Setup (closed to public)", location: "Salon 1, Salons A-D" },
    { time: "3:00 pm - 5:00 pm", title: "Prize Booth", location: "Hotel Lobby" },
    { time: "3:00 pm - 6:00 pm", title: "ARRL Booth", location: "Salons A-D" },
    { time: "3:00 pm - 6:00 pm", title: "Vendor Exhibit Halls Open", location: "Salon 1, Salons A-D" },
    { time: "4:00 pm - 6:00 pm", title: "QRP No-host Dinner", location: "Meet in Hotel Lobby, then to Panera" },
    { time: "7:00 pm - 9:00 pm", title: "Mt. Diablo Amateur Radio Club Meeting", location: "Salon E", note: "Open to All" },
    { time: "7:00 pm - 10:00 pm", title: "QRP Open House", location: "Pleasanton/Danville" },
    { time: "After MDARC meeting", title: "Prize Drawing", location: "Salon E" }
  ],
  saturday: [
    { time: "6:00 am - 4:00 pm", title: "Registration/Will Call Open", location: "Mt. Diablo/Lobby" },
    { time: "7:00 am - 9:00 am", title: "Cash Sales Breakfast", location: "Contra Costa Patio" },
    { time: "7:00 am - 7:50 am", title: "Breakfast With Gordo", location: "Salon E" },
    { time: "8:00 am - 8:50 am", title: "Ham Instructor Academy by Gordon West", location: "Salon E" },
    { time: "8:00 am - 1:00 pm", title: "Ham License Testing", location: "Tri-Valley 2" },
    { time: "8:00 am - 3:00 pm", title: "Outside Displays", location: "Parking Lot" },
    { time: "8:00 am - 4:00 pm", title: "Technician One Day License Class (Exam follows)", location: "Tri-Valley 1" },
    { time: "8:00 am - 4:00 pm", title: "Scouting Activities & Merit Badges", location: "Salon F, San Ramon Boardroom" },
    { time: "8:00 am - 5:00 pm", title: "Forums", location: "See Forums Tab" },
    { time: "9:00 am - 3:00 pm", title: "Electronic Kit Building (youth & adults)", location: "Bishop Ranch Hallway Foyer" },
    { time: "9:00 am - 5:00 pm", title: "Prize Booth", location: "Hotel Lobby" },
    { time: "9:00 am - 5:00 pm", title: "ARRL Booth", location: "Salons A-D" },
    { time: "9:00 am - 5:00 pm", title: "Vendor Exhibit Halls Open", location: "Salon 1, Salons A-D" },
    { time: "11:00 am - 11:15 am", title: "Prize Drawing", location: "Prize Booth" },
    { time: "11:00 am - 1:00 pm", title: "T-Hunting", location: "FOXHUNT Canopy" },
    { time: "11:30 am - 1:30 pm", title: "Cash Sales Lunch", location: "Contra Costa Patio" },
    { time: "12:00 pm - 1:30 pm", title: "Private Summits-on-the-Air Lunch", location: "Rear Patio" },
    { time: "1:00 pm - 1:15 pm", title: "Prize Drawing", location: "Prize Booth" },
    { time: "2:00 pm - 4:00 pm", title: "QRP Stations Operating", location: "Hotel Front Lawn" },
    { time: "4:00 pm - 4:15 pm", title: "Prize Drawing", location: "Prize Booth" },
    { time: "4:00 pm - 6:00 pm", title: "Ham License Testing", location: "Tri-Valley 1" },
    { time: "7:00 pm - 10:00 pm", title: "Banquet Dinner", location: "Salon E" },
    { time: "7:00 pm - 10:00 pm", title: "QRP Open House", location: "Pleasanton/Danville" },
    { time: "11:35 pm - 1:00 am", title: "Wouff-Hong Initiation Ceremony", location: "Salon 2" }
  ],
  sunday: [
    { time: "6:00 am - 12:00 pm", title: "Swap Meet", location: "Parking Lot-Rear", note: "Hosted by LARK" },
    { time: "7:30 am - 11:00 am", title: "Registration/Will Call Open", location: "Mt. Diablo/Lobby" },
    { time: "8:00 am - 11:50 am", title: "Forums", location: "See Forums Tab" },
    { time: "9:00 am - 11:00 am", title: "Electronic Kit Building (youth & adults)", location: "Bishop Ranch Hallway Foyer" },
    { time: "9:00 am - 12:00 pm", title: "Ham License Testing", location: "Tri-Valley 2" },
    { time: "9:00 am - 12:15 pm", title: "Prize Booth", location: "Hotel Lobby" },
    { time: "9:00 am - 1:00 pm", title: "ARRL Booth", location: "Salons A-D" },
    { time: "9:00 am - 1:00 pm", title: "Vendor Exhibit Halls Open", location: "Salon 1, Salons A-D" },
    { time: "10:00 am - 10:15 am", title: "Prize Drawing", location: "Prize Booth" },
    { time: "11:00 am - 1:00 pm", title: "T-Hunting", location: "FOXHUNT Canopy" },
    { time: "11:30 am - 1:30 pm", title: "Cash Sales Lunch", location: "Contra Costa Patio" },
    { time: "1:00 pm - 3:00 pm", title: "ARRL Forum", location: "Salon E" },
    { time: "After ARRL Forum", title: "Final Prize Drawings & Grand Prize Drawing", location: "Salon E" }
  ]
};

function ForumCard({ session }: { session: ForumSession }) {
  return (
    <Card className="p-3 mb-3">
      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span className="font-medium">{session.time}</span>
      </div>
      <div className="space-y-2">
        {session.sessions.map((s, idx) => (
          <div key={idx} className="border-l-2 border-primary pl-3 py-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">{s.room}</Badge>
            </div>
            <p className="font-medium text-sm text-foreground">{s.title}</p>
            {s.speaker && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <User className="w-3 h-3" />
                {s.speaker}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <Card className="p-3 mb-2">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-xs text-muted-foreground w-28">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{event.time}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">{event.title}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {event.location}
          </p>
          {event.note && (
            <p className="text-xs text-primary mt-1">{event.note}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<'friday' | 'saturday' | 'sunday'>('friday');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'forums' | 'events'>('forums');
  const { isAuthenticated } = useAuthContext();
  const { toast } = useToast();

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: ['/api/sessions'],
  });

  const { data: bookmarks = [] } = useQuery<string[]>({
    queryKey: ['/api/bookmarks'],
    enabled: isAuthenticated,
  });

  const addBookmarkMutation = useMutation({
    mutationFn: (sessionId: string) => 
      apiRequest('POST', `/api/bookmarks/${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: (sessionId: string) => 
      apiRequest('DELETE', `/api/bookmarks/${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
    },
  });

  const handleBookmark = (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to bookmark sessions.",
        variant: "default",
      });
      return;
    }
    const isBookmarked = bookmarks.includes(id);
    if (isBookmarked) {
      removeBookmarkMutation.mutate(id);
    } else {
      addBookmarkMutation.mutate(id);
    }
  };

  const currentForums = forumsData[selectedDay] || [];
  const currentEvents = eventsData[selectedDay] || [];

  const filteredForums = searchQuery
    ? currentForums.filter(f => 
        f.sessions.some(s => 
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.speaker && s.speaker.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
    : currentForums;

  const filteredEvents = searchQuery
    ? currentEvents.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentEvents;

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <Link href="/welcome" className="hover:opacity-80 transition-opacity" data-testid="link-welcome">
            <h1 className="text-xl font-medium text-foreground">Pacificon 2025</h1>
          </Link>
          <Button size="icon" variant="ghost" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search forums, events..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search"
          />
        </div>
        
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
      </header>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'forums' | 'events')} className="flex-1 flex flex-col">
        <div className="sticky top-[140px] z-30 bg-background border-b border-border">
          <TabsList className="w-full justify-start rounded-none h-10 bg-transparent p-0">
            <TabsTrigger 
              value="forums" 
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              data-testid="tab-forums"
            >
              Forums
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              data-testid="tab-events"
            >
              Events
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="forums" className="flex-1 overflow-y-auto px-4 py-4 pb-20 mt-0">
          {filteredForums.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No forums scheduled for this day</p>
            </div>
          ) : (
            <div>
              {filteredForums.map((forum, idx) => (
                <ForumCard key={idx} session={forum} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="flex-1 overflow-y-auto px-4 py-4 pb-20 mt-0">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events scheduled for this day</p>
            </div>
          ) : (
            <div>
              {filteredEvents.map((event, idx) => (
                <EventCard key={idx} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
