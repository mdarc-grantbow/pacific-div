import { useEffect, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
//import { Bell, Moon, Sun, Info, MessageSquare, CheckCircle2, ExternalLink, LogOut, LogIn, Radio, MapPin, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useConference, useConferencesList, Conference } from "@/hooks/useConference";
import { useToast } from "@/hooks/use-toast";

interface ConferenceSelectorProps {
  onSelect: (conference: Conference) => void;
}

const { toast } = useToast();
const { currentConference, setCurrentConference } = useConference();
const { conferencesList, setConferencesList } = useConferencesList();
const [conferenceDialogOpen, setConferenceDialogOpen] = useState(false);

const conferenceName = currentConference?.name ?? 'Pacificon';
const conferenceYear = currentConference?.year ?? 2025;
const conferenceDivision = currentConference?.division ?? 'Pacific';
const conferenceLocation = currentConference?.location ?? 'San Ramon Marriott';
const conferenceAddress = currentConference?.locationAddress ?? '2600 Bishop Dr, San Ramon, CA 94583';


export const ConferenceSelectorDialog = () => (
  <Dialog open={conferenceDialogOpen} onOpenChange={setConferenceDialogOpen}>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" className="gap-1" data-testid="button-change-conference">
        {conferenceName} {conferenceYear}
        <ChevronDown className="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Select Conference</DialogTitle>
      </DialogHeader>
      <div className="space-y-2 mt-4">
        {conferencesList && conferencesList.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No conferences available</p>
        ) : (
          conferencesList && conferencesList.map((conf) => (
            <Card
              key={conf.id}
              className={`p-3 cursor-pointer hover-elevate ${currentConference?.id === conf.id ? 'border-primary' : ''}`}
              onClick={() => handleConferenceChange(conf)}
              data-testid={`conference-option-${conf.slug}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{conf.name} {conf.year}</p>
                  <p className="text-xs text-muted-foreground">{conf.location}</p>
                </div>
                {currentConference?.id === conf.id && (
                  <Badge variant="secondary">Current</Badge>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </DialogContent>
  </Dialog>
);

export const handleConferenceChange = (conference: Conference) => {
  setCurrentConference(conference);
  setConferenceDialogOpen(false);
  toast({
    title: "Conference changed",
    description: `Switched to ${conference.name} ${conference.year}`,
  });
};

export const formatConferenceDates = () => {
  if (currentConference?.startDate && currentConference?.endDate) {
    const start = new Date(currentConference.startDate);
    const end = new Date(currentConference.endDate);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const startMonth = months[start.getUTCMonth()];
    const startDay = start.getUTCDate();
    const endMonth = months[end.getUTCMonth()];
    const endDay = end.getUTCDate();
    const endYear = end.getUTCFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${endYear}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
    }
  }
  return 'October 10-12, 2025';
};

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
