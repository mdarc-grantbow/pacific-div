import { MapPin, Radio, Store, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useConference } from "@/hooks/useConference";
import venueMapImage from "@assets/venue_1764883580906.jpg";
import exhibitorsMapImage from "@assets/exhibitors_1764883755395.png";

const venueLocations = [
  { id: "1", name: "Registration Desk", icon: Users, color: "bg-blue-500" },
  { id: "2", name: "Contra Costa", icon: MapPin, color: "bg-green-500" },
  { id: "3", name: "Bishop Ranch", icon: Store, color: "bg-purple-500" },
  { id: "4", name: "W1AW/6 Station", icon: Radio, color: "bg-red-500" },
  { id: "5", name: "Conference Rooms", icon: MapPin, color: "bg-green-500" },
];

export default function MapPage() {
  const { currentConference } = useConference();
  
  const venueName = currentConference?.location ?? 'San Ramon Marriott';
  const venueAddress = currentConference?.locationAddress ?? '2600 Bishop Dr, San Ramon, CA 94583';
  const gridSquare = currentConference?.gridSquare ?? 'CM87us';
  const gps = currentConference?.gps ?? '37.7631, -121.9736';

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <Link href="/welcome" className="hover:opacity-80 transition-opacity flex items-center gap-2" data-testid="link-welcome">
          <Radio className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-medium text-foreground">Venue Map</h1>
        </Link>
        <p className="text-sm text-muted-foreground">{venueName}</p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        <Card className="p-2 mb-4 bg-muted/50">
          <img 
            src={venueMapImage}
            alt="Pacificon Hotel Layout Map"
            className="w-full rounded-md"
            data-testid="img-venue-map"
          />
          <p className="text-xs text-muted-foreground text-center mt-2">Pacificon Hotel Layout</p>
        </Card>

        <div className="mb-4">
          <h2 className="text-base font-medium text-foreground mb-3">Key Locations</h2>
          <div className="grid grid-cols-2 gap-3">
            {venueLocations.map((location) => {
              const Icon = location.icon;
              return (
                <Card 
                  key={location.id} 
                  className="p-4 hover-elevate cursor-pointer"
                  onClick={() => console.log('Navigate to:', location.name)}
                  data-testid={`location-${location.id}`}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`p-2 rounded-lg ${location.color} bg-opacity-10`}>
                      <Icon className={`w-5 h-5 ${location.color.replace('bg-', 'text-')}`} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{location.name}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="p-4 mb-4">
          <h3 className="font-medium text-foreground mb-2">Hotel Address</h3>
          <p className="text-sm text-muted-foreground mb-1">{venueName}</p>
          <p className="text-sm text-muted-foreground mb-2">{venueAddress}</p>
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded mb-3">
            <p><span className="font-medium">GPS:</span> {gps}</p>
            <p><span className="font-medium">Grid Square:</span> {gridSquare}</p>
          </div>
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(venueAddress)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
            data-testid="link-maps"
          >
            Open in Maps
          </a>
        </Card>

        <Card className="p-2 bg-muted/50">
          <img 
            src={exhibitorsMapImage}
            alt="Pacificon Exhibit Space Layout"
            className="w-full rounded-md"
            data-testid="img-exhibitors-map"
          />
          <p className="text-xs text-muted-foreground text-center mt-2">Exhibit Space Layout</p>
        </Card>
      </main>
    </div>
  );
}
