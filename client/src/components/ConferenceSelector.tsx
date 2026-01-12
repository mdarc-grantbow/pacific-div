import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Conference } from "@/hooks/useConference";

interface ConferenceSelectorProps {
  onSelect: (conference: Conference) => void;
}

export default function ConferenceSelector({ onSelect }: ConferenceSelectorProps) {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch("/api/conferences");
        if (!response.ok) {
          throw new Error("Failed to fetch conferences");
        }
        const data = await response.json();
        setConferences(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading conferences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Conference Companion</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Select a Conference</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Choose which conference you want to explore
          </p>
        </div>

        <div className="max-w-2xl mx-auto grid gap-4">
          {conferences.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Conferences Available</CardTitle>
                <CardDescription>
                  There are no active conferences at the moment.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            conferences.map((conference) => (
              <Card
                key={conference.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelect(conference)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-left">
                      <CardTitle className="text-xl mb-1">
                        {conference.name} {conference.year}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(conference.startDate).toLocaleDateString()} -{" "}
                        {new Date(conference.endDate).toLocaleDateString()}
                      </CardDescription>
                      <CardDescription className="mt-2">
                        📍 {conference.location}
                      </CardDescription>
                    </div>
                    <Button size="sm" onClick={(e) => {
                      e.stopPropagation();
                      onSelect(conference);
                    }}>
                      Select
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
