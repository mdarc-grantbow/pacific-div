import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import RadioContactCard from "@/components/RadioContactCard";
import VenueInfoCard from "@/components/VenueInfoCard";
import VendorCard from "@/components/VendorCard";
import type { RadioContact, VenueInfo, Vendor } from "@shared/schema";

// TODO: Remove mock data
const mockRadioContacts: RadioContact[] = [
  {
    id: "1",
    type: "talk-in",
    frequency: "146.850 MHz",
    label: "Conference Talk-In",
    notes: "PL 100.0 Hz, -0.6 MHz offset",
  },
  {
    id: "2",
    type: "simplex",
    frequency: "146.520 MHz",
    label: "National Simplex",
    notes: "Primary calling frequency",
  },
  {
    id: "3",
    type: "qrp",
    frequency: "7.030 MHz",
    label: "QRP CW",
    notes: "40m band activity",
  },
  {
    id: "4",
    type: "qrp",
    frequency: "14.060 MHz",
    label: "QRP SSB",
    notes: "20m band activity",
  },
];

const mockVenueInfo: VenueInfo[] = [
  {
    id: "1",
    category: "hotel",
    title: "San Ramon Marriott",
    details: "2600 Bishop Drive, San Ramon, CA 94583 • (925) 867-9200",
    hours: "Check-in: 4:00 PM • Check-out: 12:00 PM",
  },
  {
    id: "2",
    category: "parking",
    title: "Hotel Parking",
    details: "Free parking available for conference attendees who book at Pacificon rate",
  },
  {
    id: "3",
    category: "registration",
    title: "Registration Desk",
    details: "Main lobby near Grand Ballroom entrance",
    hours: "Fri 7AM-5PM • Sat 6AM-4PM • Sun 7:30AM-11AM",
  },
  {
    id: "4",
    category: "testing",
    title: "License Testing",
    details: "Conference Room 2 • Bring photo ID and $15 test fee",
    hours: "Saturday 10:00 AM - 2:00 PM",
  },
];

const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Ham Radio Outlet",
    boothNumber: "12",
    category: "Equipment",
    description: "Complete line of amateur radio transceivers, antennas, and accessories",
  },
  {
    id: "2",
    name: "DX Engineering",
    boothNumber: "15",
    category: "Antennas",
    description: "Premium antenna systems and tower accessories for serious operators",
  },
  {
    id: "3",
    name: "Elecraft",
    boothNumber: "8",
    category: "QRP Equipment",
    description: "High-performance portable and QRP transceivers and accessories",
  },
];

export default function InfoPage() {
  // TODO: Replace with actual registration status
  const isRegistered = false;

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
            <div className="space-y-3">
              {mockRadioContacts.map((contact) => (
                <RadioContactCard key={contact.id} contact={contact} />
              ))}
            </div>
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
            
            <div className="space-y-3">
              {mockVenueInfo.map((info) => (
                <VenueInfoCard key={info.id} info={info} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="px-4 py-4 mt-0">
            <div className="space-y-3">
              {mockVendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onViewDetails={(id) => console.log('View vendor:', id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
