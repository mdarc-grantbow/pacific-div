import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Radio, Calendar, Map, Building2, Award } from "lucide-react";
import { Link } from "wouter";
import { useAuthContext } from "@/hooks/useAuth";
import { useConference } from "@/hooks/useConference";
import { ConferenceSelectorDialog } from "@/components/ConferenceSelector";
import { formatDateRangeInTimezone } from "@/lib/dateUtils";

const featureCards = [
  {
    path: "/schedule",
    icon: Calendar,
    title: "Schedule",
    description: "Browse forums, events, and speakers across all three days"
  },
  {
    path: "/map",
    icon: Map,
    title: "Map",
    description: "Navigate the hotel with floor plans and room locations"
  },
  {
    path: "/venue",
    icon: Building2,
    title: "Venue",
    description: "Explore vendors, radio frequencies, and venue information"
  },
  {
    path: "/prizes",
    icon: Award,
    title: "Prizes",
    description: "Stay updated on prize drawings and T-hunting competitions"
  }
];

export default function LandingPage() {
  const { isAuthenticated } = useAuthContext();
  const { currentConference } = useConference();

  const conferenceName = currentConference?.name ?? 'Pacificon';
  const conferenceYear = currentConference?.year ?? 2025;
  const conferenceDivision = currentConference?.division ?? 'Pacific';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentConference?.logoUrl ? (
              <img src={currentConference.logoUrl} alt={currentConference.name} className="h-8" />
            ) : (
              <Radio className="h-6 w-6 text-primary" />
            )}
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">{currentConference ? `${currentConference.name} ${currentConference.year}` : 'Conference'}</span>
            </div>
          </div>
          <Button size="icon" variant="ghost" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <ConferenceSelectorDialog />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4" data-testid="text-hero-title">
            {currentConference ? `Welcome to ${currentConference.name} ${currentConference.year}` : 'Welcome'}
          </h1>
          <p className="text-muted-foreground text-lg mb-6" data-testid="text-hero-description">
            {currentConference
              ? `${currentConference.location} • ${formatDateRangeInTimezone(currentConference.startDate, currentConference.endDate, currentConference.timezone ?? 'America/Los_Angeles')}`
              : 'Your companion app for the conference.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.path} href={card.path}>
                <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-${card.title.toLowerCase()}`}>
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="border-t bg-card py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{conferenceName} is sponsored by ARRL {conferenceDivision} Division member clubs</p>
        </div>
      </footer>
    </div>
  );
}
