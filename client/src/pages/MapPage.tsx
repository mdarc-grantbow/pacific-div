import { MapPin, Radio, Store, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

const venueLocations = [
  { id: "1", name: "Registration Desk", icon: Users, color: "bg-blue-500" },
  { id: "2", name: "Contra Costa", icon: MapPin, color: "bg-green-500" },
  { id: "3", name: "Bishop Ranch", icon: Store, color: "bg-purple-500" },
  { id: "4", name: "W1AW/6 Station", icon: Radio, color: "bg-red-500" },
  { id: "5", name: "Conference Rooms", icon: MapPin, color: "bg-green-500" },
];

export default function MapPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <Link href="/welcome" className="hover:opacity-80 transition-opacity" data-testid="link-welcome">
          <h1 className="text-xl font-medium text-foreground">Venue Map</h1>
        </Link>
        <p className="text-sm text-muted-foreground">San Ramon Marriott</p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        <Card className="p-2 mb-4 bg-muted/50">
          <img 
            src="https://lh3.googleusercontent.com/sitesv/AAzXCkefxPQL7_TtrL9-qLJhY8AsSadqdCWgwSTCTFH3ZyCi48N8yY_l3aSr7Bocn0VGDVYB0tTs2S87B2gFmU0Z8SNY5R5p5gNp-6cXt4io1ikeMnKaFVmxfPFYm56cd4BKx-Sw48ALhjSZ4EOVL9OunUxcTvsH1D3l9Rkcj8EOnbvUj6LEGU5hONRBtZ7Q78Ew6D7ME1BuT-mh9g-XoFX40XBJpQk93h3Fw_g8=w1280"
            alt="Pacificon Venue Map"
            className="w-full rounded-md"
            data-testid="img-venue-map"
          />
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

        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-2">Hotel Address</h3>
          <p className="text-sm text-muted-foreground mb-2">
            San Ramon Marriott<br />
            2600 Bishop Drive<br />
            San Ramon, CA 94583
          </p>
          <a 
            href="https://maps.google.com/?q=San+Ramon+Marriott" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
            data-testid="link-maps"
          >
            Open in Maps →
          </a>
        </Card>
      </main>
    </div>
  );
}
