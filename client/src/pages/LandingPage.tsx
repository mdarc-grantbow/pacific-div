import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, Calendar, MapPin, Gift, Users } from "lucide-react";

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
          <Button size="lg" asChild data-testid="button-get-started">
            <a href="/api/login">Get Started</a>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="hover-elevate">
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Conference Schedule</CardTitle>
              <CardDescription>
                Browse sessions, workshops, and speakers across all three days
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Venue Maps</CardTitle>
              <CardDescription>
                Navigate the hotel with floor plans and room locations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <Gift className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Door Prizes</CardTitle>
              <CardDescription>
                Stay updated on prize drawings and T-hunting competitions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Vendor Exhibit</CardTitle>
              <CardDescription>
                Explore vendors, radio frequencies, and venue information
              </CardDescription>
            </CardHeader>
          </Card>
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
