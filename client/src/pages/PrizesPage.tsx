import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles } from "lucide-react";
import PrizeCard from "@/components/PrizeCard";
import THuntingCard from "@/components/THuntingCard";
import type { DoorPrize, THuntingWinner } from "@shared/schema";

// TODO: Remove mock data
const mockDoorPrizes: DoorPrize[] = [
  {
    id: "1",
    badgeNumber: "147",
    callSign: "W6ABC",
    prizeName: "Handheld VHF/UHF Transceiver",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    claimed: false,
  },
  {
    id: "2",
    badgeNumber: "89",
    callSign: "K6DEF",
    prizeName: "Antenna Analyzer",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    claimed: true,
  },
  {
    id: "3",
    badgeNumber: "256",
    callSign: "N6GHI",
    prizeName: "Power Supply 25A",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    claimed: false,
  },
];

const mockTHuntingWinners: THuntingWinner[] = [
  {
    id: "1",
    rank: 1,
    callSign: "K6XYZ",
    completionTime: "24:35",
    huntNumber: 1,
    prize: "Portable Antenna Kit",
  },
  {
    id: "2",
    rank: 2,
    callSign: "W6LMN",
    completionTime: "28:42",
    huntNumber: 1,
    prize: "RF Attenuator Set",
  },
  {
    id: "3",
    rank: 3,
    callSign: "N6OPQ",
    completionTime: "31:15",
    huntNumber: 1,
    prize: "Coax Cable Kit",
  },
  {
    id: "4",
    rank: 4,
    callSign: "KJ6RST",
    completionTime: "35:20",
    huntNumber: 1,
  },
];

export default function PrizesPage() {
  // TODO: Replace with actual user badge number
  const userBadgeNumber = "147";
  const userHasWon = mockDoorPrizes.some(p => p.badgeNumber === userBadgeNumber);

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <h1 className="text-xl font-medium text-foreground">Prize Winners</h1>
      </header>

      {userHasWon && (
        <Alert className="mx-4 mt-4 bg-primary/10 border-primary">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground font-medium">
            Congratulations! You've won a prize! Visit the registration desk to claim it.
          </AlertDescription>
        </Alert>
      )}

      <main className="flex-1 overflow-y-auto pb-20">
        <Tabs defaultValue="door" className="w-full">
          <div className="sticky top-0 z-30 bg-background border-b border-border">
            <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
              <TabsTrigger 
                value="door" 
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                data-testid="tab-door-prizes"
              >
                Door Prizes
              </TabsTrigger>
              <TabsTrigger 
                value="thunting" 
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                data-testid="tab-thunting"
              >
                T-Hunting
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="door" className="px-4 py-4 mt-0">
            <div className="space-y-3">
              {mockDoorPrizes.map((prize) => (
                <PrizeCard 
                  key={prize.id} 
                  prize={prize}
                  isWinner={prize.badgeNumber === userBadgeNumber}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="thunting" className="px-4 py-4 mt-0">
            <div className="mb-4">
              <h2 className="text-base font-medium text-foreground mb-1">Hunt #1 Results</h2>
              <p className="text-sm text-muted-foreground">Saturday, 2:00 PM</p>
            </div>
            
            <div className="space-y-3">
              {mockTHuntingWinners.map((winner) => (
                <THuntingCard key={winner.id} winner={winner} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
