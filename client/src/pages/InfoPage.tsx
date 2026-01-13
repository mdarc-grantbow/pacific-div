import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { ExternalLink, MapPin, Navigation, Phone, Radio } from "lucide-react";
import { Link } from "wouter";
import RadioContactCard from "@/components/RadioContactCard";
import VenueInfoCard from "@/components/VenueInfoCard";
import VendorCard from "@/components/VendorCard";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/useAuth";
import { useConference } from "@/hooks/useConference";
import type { RadioContact, VenueInfo, Vendor, UserProfile } from "@shared/schema";
import exhibitorsMapImage from "@assets/exhibitors_1764883755395.png";

export default function InfoPage() {
  const { isAuthenticated } = useAuthContext();
  const { currentConference } = useConference();
  
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
    enabled: isAuthenticated,
  });

  const isRegistered = isAuthenticated ? (userProfile?.isRegistered ?? false) : false;

  const { data: radioContacts = [], isLoading: contactsLoading } = useQuery<RadioContact[]>({
    queryKey: ['/api/conferences', currentConference?.slug, 'radio-contacts'],
    queryFn: async () => {
      const response = await fetch(`/api/conferences/${currentConference?.slug}/radio-contacts`);
      if (!response.ok) throw new Error('Failed to fetch radio contacts');
      return response.json();
    },
    enabled: !!currentConference?.slug,
  });

  const { data: venueInfo = [], isLoading: venueLoading } = useQuery<VenueInfo[]>({
    queryKey: ['/api/conferences', currentConference?.slug, 'venue-info'],
    queryFn: async () => {
      const response = await fetch(`/api/conferences/${currentConference?.slug}/venue-info`);
      if (!response.ok) throw new Error('Failed to fetch venue info');
      return response.json();
    },
    enabled: !!currentConference?.slug,
  });

  const { data: vendors = [], isLoading: vendorsLoading } = useQuery<Vendor[]>({
    queryKey: ['/api/conferences', currentConference?.slug, 'vendors'],
    queryFn: async () => {
      const response = await fetch(`/api/conferences/${currentConference?.slug}/vendors`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      return response.json();
    },
    enabled: !!currentConference?.slug,
  });

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <Link href="/welcome" className="hover:opacity-80 transition-opacity flex items-center gap-2" data-testid="link-welcome">
          <Radio className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-medium text-foreground">Essential Info</h1>
        </Link>
      </header>

      {!isRegistered && (
        <Alert className="mx-4 mt-4 bg-primary/10 border-primary">
          <AlertDescription className="text-sm text-foreground">
            Haven't registered yet? Visit the registration pages to secure your spot!
          </AlertDescription>
        </Alert>
      )}

      <main className="flex-1 overflow-y-auto pb-20">
        <Tabs defaultValue="venue" className="w-full">
          <div className="sticky top-0 z-30 bg-background border-b border-border">
            <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
              <TabsTrigger 
                value="venue" 
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                data-testid="tab-venue"
              >
                Venue
              </TabsTrigger>
              <TabsTrigger 
                value="vendors" 
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                data-testid="tab-vendors"
              >
                Vendors
              </TabsTrigger>
              <TabsTrigger 
                value="radio" 
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                data-testid="tab-radio"
              >
                Radio
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="radio" className="px-4 py-4 mt-0">
            {contactsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : radioContacts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No radio contacts available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {radioContacts.map((contact) => (
                  <RadioContactCard key={contact.id} contact={contact} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="venue" className="px-4 py-4 mt-0">
            {venueLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : venueInfo.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No venue information available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {venueInfo.map((info) => (
                  <VenueInfoCard key={info.id} info={info} />
                ))}
              </div>
            )}

            <Card className="p-4 mt-4" data-testid="card-directions">
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Directions & Map
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">San Ramon Marriott</p>
                    <p className="text-sm text-muted-foreground">2600 Bishop Drive</p>
                    <p className="text-sm text-muted-foreground">San Ramon, CA 94583</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a href="tel:925-867-9200" className="text-sm text-primary hover:underline">
                    925-867-9200
                  </a>
                </div>
                
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  <p><span className="font-medium">GPS:</span> 37° 45.784' N, 121° 57.927' W</p>
                  <p><span className="font-medium">Grid Square:</span> CM97as</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-foreground mb-2">From I-680:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Exit at Bollinger Canyon Road</li>
                  <li>Turn east (right if northbound, left if southbound)</li>
                  <li>Turn left at first light (Sunset Dr/Chevron Dr)</li>
                  <li>Pass shopping center, turn left at Bishop Drive</li>
                  <li>Hotel entrance is 0.1 miles on the left</li>
                </ol>
              </div>

              <div className="rounded-md overflow-hidden border border-border mb-3">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3156.8!2d-121.965!3d37.763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808ff2e66c2b0f0d%3A0x2e1c4f0c9b7c8c8d!2sSan%20Ramon%20Marriott!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="San Ramon Marriott Map"
                  data-testid="map-iframe"
                />
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href="https://www.pacificon.org/resources/parking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  data-testid="link-parking"
                >
                  Parking Information
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.marriott.com/en-us/hotels/oaksr-san-ramon-marriott/overview/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  data-testid="link-hotel-website"
                >
                  Hotel Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>

            {!isRegistered && (
              <Card className="p-4 mt-4 bg-muted/50">
                <h3 className="font-medium text-foreground mb-3">Conference Registration</h3>
                
                <div className="space-y-3 mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      Attendees & Exhibitors
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      For attendees, vendors, and non-profit exhibitors
                    </p>
                    <a
                      href="https://www.pacificon.org/registration/attendees"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      data-testid="link-attendee-registration"
                    >
                      Register via Constant Contact
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      Volunteers & Speakers
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      For volunteers and conference presenters
                    </p>
                    <a
                      href="https://www.pacificon.org/registration/volunteers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      data-testid="link-volunteer-registration"
                    >
                      Register via Google Forms
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="vendors" className="px-4 py-4 mt-0">
            <Card className="p-2 mb-4 bg-muted/50">
              <img 
                src={exhibitorsMapImage}
                alt="Pacificon Exhibit Space Layout"
                className="w-full rounded-md"
                data-testid="img-exhibitors-map"
              />
              <p className="text-xs text-muted-foreground text-center mt-2">Exhibit Space Layout</p>
            </Card>

            {vendorsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No vendors available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onViewDetails={(id) => console.log('View vendor:', id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
