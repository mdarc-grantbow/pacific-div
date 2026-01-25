import { Bell, MapPin, Radio, Store, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { useConference } from "@/hooks/useConference";
import { ConferenceSelectorDialog } from "@/components/ConferenceSelector";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { ConferenceImage } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const venueLocations = [
  { id: "1", name: "Registration Desk", icon: Users, color: "bg-blue-500" },
  { id: "2", name: "Contra Costa", icon: MapPin, color: "bg-green-500" },
  { id: "3", name: "Bishop Ranch", icon: Store, color: "bg-purple-500" },
  { id: "4", name: "W1AW/6 Station", icon: Radio, color: "bg-red-500" },
  { id: "5", name: "Conference Rooms", icon: MapPin, color: "bg-green-500" },
];

const imageModules = import.meta.glob('../../../attached_assets/*.{jpg,jpeg,png,gif,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

// Build a lookup map keyed by basename for reliable matching
const imagesByBasename: Record<string, string> = {};
for (const [key, url] of Object.entries(imageModules)) {
  const basename = key.split('/').pop() || '';
  if (basename) {
    imagesByBasename[basename] = url;
  }
}

function getImageUrl(imagePath: string): string {
  // imagePath from DB might be just the filename or include path segments
  const basename = imagePath.split('/').pop() || imagePath;
  // Return bundled URL if found, otherwise fallback to static path
  return imagesByBasename[basename] || `/attached_assets/${basename}`;
}

export default function MapPage() {
  const { currentConference } = useConference();
  const venueName = currentConference?.location ?? 'San Ramon Marriott';
  const conferenceSlug = currentConference?.slug ?? 'pacificon-2025';

  const { data: images, isLoading } = useQuery<ConferenceImage[]>({
    queryKey: ['/api/conferences', conferenceSlug, 'images'],
    queryFn: async () => {
      const res = await fetch(`/api/conferences/${conferenceSlug}/images`);
      if (!res.ok) throw new Error('Failed to fetch images');
      return res.json();
    },
    enabled: !!conferenceSlug,
  });

  const venueMapImages = images?.filter(img => img.imageType === 'venue-map') ?? [];
  const exhibitorMapImages = images?.filter(img => img.imageType === 'exhibitor-map') ?? [];

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/welcome" className="hover:opacity-80 transition-opacity flex items-center gap-2" data-testid="link-welcome">
            <Radio className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-medium text-foreground">Map</h1>
          </Link>
          <p className="text-sm text-muted-foreground">{venueName}</p>
          <Button size="icon" variant="ghost" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <ConferenceSelectorDialog />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        {isLoading ? (
          <Card className="p-2 mb-4 bg-muted/50">
            <Skeleton className="w-full h-48 rounded-md" />
            <Skeleton className="h-4 w-32 mx-auto mt-2" />
          </Card>
        ) : venueMapImages.length > 0 ? (
          venueMapImages.map((img) => (
            <Card key={img.id} className="p-2 mb-4 bg-muted/50">
              <img
                src={getImageUrl(img.imagePath)}
                alt={img.caption || "Venue Map"}
                className="w-full rounded-md"
                data-testid={`img-venue-map-${img.id}`}
              />
              {img.caption && (
                <p className="text-xs text-muted-foreground text-center mt-2">{img.caption}</p>
              )}
            </Card>
          ))
        ) : null}

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

        {isLoading ? (
          <Card className="p-2 bg-muted/50">
            <Skeleton className="w-full h-48 rounded-md" />
            <Skeleton className="h-4 w-32 mx-auto mt-2" />
          </Card>
        ) : exhibitorMapImages.length > 0 ? (
          exhibitorMapImages.map((img) => (
            <Card key={img.id} className="p-2 mb-4 bg-muted/50">
              <img
                src={getImageUrl(img.imagePath)}
                alt={img.caption || "Exhibitor Map"}
                className="w-full rounded-md"
                data-testid={`img-exhibitor-map-${img.id}`}
              />
              {img.caption && (
                <p className="text-xs text-muted-foreground text-center mt-2">{img.caption}</p>
              )}
            </Card>
          ))
        ) : null}
      </main>
    </div>
  );
}
