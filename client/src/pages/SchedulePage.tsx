import React from "react";
import { useState, useMemo, useEffect } from "react";
import { Search, Bell, Clock, MapPin, User, Radio, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import DaySelector from "@/components/DaySelector";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuthContext } from "@/hooks/useAuth";
import { useConference } from "@/hooks/useConference";
import { useToast } from "@/hooks/useToast";
import type { Session } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { ConferenceSelectorDialog } from "@/components/ConferenceSelector";

interface GroupedForum {
  time: string;
  startMinutes: number;
  sessions: Session[];
}

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/^(\d{1,2}):?(\d{2})?\s*(am|pm)?$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3]?.toLowerCase();

  if (period === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period === 'am' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

function groupForumsByTime(forums: Session[]): GroupedForum[] {
  const timeMap = new Map<string, { sessions: Session[]; startMinutes: number }>();

  for (const forum of forums) {
    const timeKey = forum.endTime
      ? `${forum.startTime} - ${forum.endTime}`
      : forum.startTime;

    if (!timeMap.has(timeKey)) {
      timeMap.set(timeKey, {
        sessions: [],
        startMinutes: parseTimeToMinutes(forum.startTime)
      });
    }
    timeMap.get(timeKey)!.sessions.push(forum);
  }

  return Array.from(timeMap.entries())
    .map(([time, data]) => ({ time, sessions: data.sessions, startMinutes: data.startMinutes }))
    .sort((a, b) => a.startMinutes - b.startMinutes);
}

interface ForumCardProps {
  groupedForum: GroupedForum;
  bookmarks: string[];
  onBookmark: (id: string) => void;
}

function ForumCard({ groupedForum, bookmarks, onBookmark }: ForumCardProps) {
  return (
    <Card className="p-3 mb-3">
      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span className="font-medium">{groupedForum.time}</span>
      </div>
      <div className="space-y-2">
        {groupedForum.sessions.map((session) => {
          const isBookmarked = bookmarks.includes(session.id);
          return (
            <div key={session.id} className="border-l-2 border-primary pl-3 py-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">{session.room}</Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => onBookmark(session.id)}
                  data-testid={`button-bookmark-${session.id}`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                  />
                </Button>
              </div>
              <p className="font-medium text-sm text-foreground">{session.title}</p>
              {session.speaker && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <User className="w-3 h-3" />
                  {session.speaker}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

interface EventCardProps {
  event: Session;
  bookmarks: string[];
  onBookmark: (id: string) => void;
}

function EventCard({ event, bookmarks, onBookmark }: EventCardProps) {
  const isBookmarked = bookmarks.includes(event.id);
  const timeDisplay = event.endTime
    ? `${event.startTime} - ${event.endTime}`
    : event.startTime;

  return (
    <Card className="p-3 mb-2">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-xs text-muted-foreground w-28">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{timeDisplay}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-sm text-foreground">{event.title}</p>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 flex-shrink-0"
              onClick={() => onBookmark(event.id)}
              data-testid={`button-bookmark-${event.id}`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
              />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {event.room}
          </p>
          {event.abstract && (
            <p className="text-xs text-primary mt-1">{event.abstract}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-3">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-5 w-full mb-1" />
          <Skeleton className="h-4 w-48" />
        </Card>
      ))}
    </div>
  );
}

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<'all' | 'friday' | 'saturday' | 'sunday'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'forums' | 'events'>('all');
  const { isAuthenticated } = useAuthContext();
  const { currentConference } = useConference();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const { toast } = useToast();

  const { data: forums = [], isLoading: forumsLoading } = useQuery<Session[]>({
    queryKey: ['/api/conferences', currentConference?.slug, 'sessions', 'forum', selectedDay],
    queryFn: async () => {
      const dayParam = selectedDay === 'all' ? '' : `&day=${selectedDay}`;
      const response = await fetch(`/api/conferences/${currentConference?.slug}/sessions?category=forum${dayParam}`);
      if (!response.ok) throw new Error('Failed to fetch forums');
      return response.json();
    },
    enabled: !!currentConference?.slug,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<Session[]>({
    queryKey: ['/api/conferences', currentConference?.slug, 'sessions', 'event', selectedDay],
    queryFn: async () => {
      const dayParam = selectedDay === 'all' ? '' : `&day=${selectedDay}`;
      const response = await fetch(`/api/conferences/${currentConference?.slug}/sessions?category=event${dayParam}`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
    enabled: !!currentConference?.slug,
  });

  const { data: bookmarksData } = useQuery<string[]>({
    queryKey: ['/api/bookmarks', currentConference?.slug],
    queryFn: async () => {
      const response = await fetch(`/api/bookmarks?conference=${currentConference?.slug}`);
      if (!response.ok) throw new Error('Failed to fetch bookmarks');
      return response.json();
    },
    enabled: isAuthenticated && !!currentConference?.slug,
  });
  const bookmarks = bookmarksData ?? [];

  const addBookmarkMutation = useMutation({
    mutationFn: (sessionId: string) =>
      apiRequest('POST', `/api/bookmarks/${sessionId}`, { conference: currentConference?.slug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks', currentConference?.slug] });
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: (sessionId: string) =>
      apiRequest('DELETE', `/api/bookmarks/${sessionId}?conference=${currentConference?.slug}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks', currentConference?.slug] });
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

  const groupedForums = useMemo(() => groupForumsByTime(forums), [forums]);

  const filteredForums = useMemo(() => {
    if (!searchQuery) return groupedForums;
    return groupedForums
      .map(group => ({
        ...group,
        sessions: group.sessions.filter(s =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.speaker && s.speaker.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }))
      .filter(group => group.sessions.length > 0);
  }, [groupedForums, searchQuery]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    return events.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.room.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <Link href="/welcome" className="hover:opacity-80 transition-opacity flex items-center gap-2" data-testid="link-welcome">
            <Radio className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-medium text-foreground">Schedule</h1>
          </Link>
          <Button size="icon" variant="ghost" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <ConferenceSelectorDialog />
          </div>
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

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'forums' | 'events')} className="flex-1 flex flex-col">
        <div className="sticky top-[140px] z-30 bg-background border-b border-border">
          <TabsList className="w-full justify-start rounded-none h-10 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              data-testid="tab-all"
            >
              All
            </TabsTrigger>
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

        <TabsContent value="all" className="flex-1 overflow-y-auto px-4 py-4 pb-20 mt-0">
          {(forumsLoading || eventsLoading) ? (
            <LoadingSkeleton />
          ) : (filteredForums.length === 0 && filteredEvents.length === 0) ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sessions scheduled for this day</p>
            </div>
          ) : (
            <div>
              {filteredForums.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Forums</h3>
                  {filteredForums.map((groupedForum, idx) => (
                    <ForumCard
                      key={idx}
                      groupedForum={groupedForum}
                      bookmarks={bookmarks}
                      onBookmark={handleBookmark}
                    />
                  ))}
                </div>
              )}
              {filteredEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Events</h3>
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      bookmarks={bookmarks}
                      onBookmark={handleBookmark}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="forums" className="flex-1 overflow-y-auto px-4 py-4 pb-20 mt-0">
          {forumsLoading ? (
            <LoadingSkeleton />
          ) : filteredForums.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No forums scheduled for this day</p>
            </div>
          ) : (
            <div>
              {filteredForums.map((groupedForum, idx) => (
                <ForumCard
                  key={idx}
                  groupedForum={groupedForum}
                  bookmarks={bookmarks}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="flex-1 overflow-y-auto px-4 py-4 pb-20 mt-0">
          {eventsLoading ? (
            <LoadingSkeleton />
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events scheduled for this day</p>
            </div>
          ) : (
            <div>
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  bookmarks={bookmarks}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
