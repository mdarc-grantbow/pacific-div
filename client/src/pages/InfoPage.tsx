import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import RadioContactCard from "@/components/RadioContactCard";
import VenueInfoCard from "@/components/VenueInfoCard";
import VendorCard from "@/components/VendorCard";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/useAuth";
import type { RadioContact, VenueInfo, Vendor, UserProfile } from "@shared/schema";

export default function InfoPage() {
  const { isAuthenticated } = useAuthContext();
  
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
    enabled: isAuthenticated,
  });

  const isRegistered = isAuthenticated ? (userProfile?.isRegistered ?? false) : false;

  const { data: radioContacts = [], isLoading: contactsLoading } = useQuery<RadioContact[]>({
    queryKey: ['/api/radio-contacts'],
  });

  const { data: venueInfo = [], isLoading: venueLoading } = useQuery<VenueInfo[]>({
    queryKey: ['/api/venue-info'],
  });

  const { data: vendors = [], isLoading: vendorsLoading } = useQuery<Vendor[]>({
    queryKey: ['/api/vendors'],
  });

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <h1 className="text-xl font-medium text-foreground">Essential Info</h1>
      </header>

      {!isRegistered && (
        <Alert className="mx-4 mt-4 bg-primary/10 border-primary">
          <AlertDescription className="text-sm text-foreground">
            Haven't registered yet? Visit the registration pages to secure your spot!
          </AlertDescription>
        </Alert>
      )}

      <main className="flex-1 overflow-y-auto pb-20">
        <Tabs defaultValue="radio" className="w-full">
          <div className="sticky top-0 z-30 bg-background border-b border-border">
            <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
              <TabsTrigger 
                value="radio" 
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                data-testid="tab-radio"
              >
                Radio
              </TabsTrigger>
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
            {!isRegistered && (
              <Card className="p-4 mb-4 bg-muted/50">
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
          </TabsContent>

          <TabsContent value="vendors" className="px-4 py-4 mt-0">
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
