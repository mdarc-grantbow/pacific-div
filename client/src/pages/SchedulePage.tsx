import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DaySelector from "@/components/DaySelector";
import SessionCard from "@/components/SessionCard";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Session } from "@shared/schema";

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<'friday' | 'saturday' | 'sunday'>('friday');
  const [searchQuery, setSearchQuery] = useState("");

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: ['/api/sessions'],
  });

  const { data: bookmarks = [] } = useQuery<string[]>({
    queryKey: ['/api/bookmarks'],
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

  const sessionsWithBookmarks = sessions.map(session => ({
    ...session,
    isBookmarked: bookmarks.includes(session.id),
  }));

  const filteredSessions = sessionsWithBookmarks.filter(
    (session) =>
      session.day === selectedDay &&
      (searchQuery === "" ||
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBookmark = (id: string) => {
    const isBookmarked = bookmarks.includes(id);
    if (isBookmarked) {
      removeBookmarkMutation.mutate(id);
    } else {
      addBookmarkMutation.mutate(id);
    }
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
        {sessionsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading sessions...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
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
