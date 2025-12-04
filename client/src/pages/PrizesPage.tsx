import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Radio } from "lucide-react";
import { Link } from "wouter";
import PrizeCard from "@/components/PrizeCard";
import THuntingCard from "@/components/THuntingCard";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/useAuth";
import type { DoorPrize, THuntingWinner, UserProfile } from "@shared/schema";

export default function PrizesPage() {
  const { isAuthenticated } = useAuthContext();
  
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
    enabled: isAuthenticated,
  });

  const userBadgeNumber = userProfile?.badgeNumber || "";

  const { data: doorPrizes = [], isLoading: prizesLoading } = useQuery<DoorPrize[]>({
    queryKey: ['/api/door-prizes'],
  });

  const { data: tHuntingWinners = [], isLoading: winnersLoading } = useQuery<THuntingWinner[]>({
    queryKey: ['/api/thunting/winners'],
  });

  const userHasWon = isAuthenticated && doorPrizes.some(p => p.badgeNumber === userBadgeNumber);

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <Link href="/welcome" className="hover:opacity-80 transition-opacity flex items-center gap-2" data-testid="link-welcome">
          <Radio className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-medium text-foreground">Prize Winners</h1>
        </Link>
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
            {prizesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : doorPrizes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No door prizes announced yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {doorPrizes.map((prize) => (
                  <PrizeCard 
                    key={prize.id} 
                    prize={prize}
                    isWinner={prize.badgeNumber === userBadgeNumber}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="thunting" className="px-4 py-4 mt-0">
            <div className="mb-4">
              <h2 className="text-base font-medium text-foreground mb-1">Hunt #1 Results</h2>
              <p className="text-sm text-muted-foreground">Saturday, 2:00 PM</p>
            </div>
            
            {winnersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : tHuntingWinners.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No T-hunting results available yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tHuntingWinners.map((winner) => (
                  <THuntingCard key={winner.id} winner={winner} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
