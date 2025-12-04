import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, Calendar, Map, Info, Award } from "lucide-react";
import { Link } from "wouter";

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
    path: "/info",
    icon: Info,
    title: "Info",
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
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Pacificon 2025</span>
          </div>
          <Button asChild data-testid="button-login">
            <a href="/api/login">Log In</a>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4" data-testid="text-hero-title">
            Welcome to Pacificon 2025
          </h1>
          <p className="text-muted-foreground text-lg mb-6" data-testid="text-hero-description">
            Your companion app for the annual amateur radio conference.
            October 10-12, 2025 at the San Ramon Marriott.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild data-testid="button-get-started">
              <Link href="/schedule">Browse Schedule</Link>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-login-hero">
              <a href="/api/login">Log In</a>
            </Button>
          </div>
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
          <p>Pacificon is sponsored by ARRL Pacific Division member clubs</p>
        </div>
      </footer>
    </div>
  );
}
