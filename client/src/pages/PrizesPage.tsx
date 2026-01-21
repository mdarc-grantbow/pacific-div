import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Sparkles, Radio } from "lucide-react";
import { Link } from "wouter";
//import AllCard from "@/components/AllCard";
import PrizeCard from "@/components/PrizeCard";
import THuntingCard from "@/components/THuntingCard";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/useAuth";
import { useConference } from "@/hooks/useConference";
import type { DoorPrize, THuntingWinner, UserProfile } from "@shared/schema";
import { ConferenceSelectorDialog } from "@/components/ConferenceSelector";
import { Button } from "@/components/ui/button";

export default function PrizesPage() {
  const { isAuthenticated } = useAuthContext();
  const { currentConference } = useConference();

  const conferenceName = currentConference?.name ?? 'Pacificon';
  const conferenceYear = currentConference?.year ?? 2025;
  const conferenceDivision = currentConference?.division ?? 'Pacific';
  const conferenceLocation = currentConference?.location ?? 'San Ramon Marriott';

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
    enabled: isAuthenticated,
  });

  const userBadgeNumber = userProfile?.badgeNumber || "";

  const { data: doorPrizes = [], isLoading: prizesLoading } = useQuery<DoorPrize[]>({
    queryKey: ['/api/conferences', currentConference?.slug, 'door-prizes'],
    queryFn: async () => {
      const response = await fetch(`/api/conferences/${currentConference?.slug}/door-prizes`);
      if (!response.ok) throw new Error('Failed to fetch door prizes');
      return response.json();
    },
    enabled: !!currentConference?.slug,
  });

  const { data: tHuntingWinners = [], isLoading: winnersLoading } = useQuery<THuntingWinner[]>({
    queryKey: ['/api/conferences', currentConference?.slug, 'thunting-winners'],
    queryFn: async () => {
      const response = await fetch(`/api/conferences/${currentConference?.slug}/thunting/winners`);
      if (!response.ok) throw new Error('Failed to fetch T-hunting winners');
      return response.json();
    },
    enabled: !!currentConference?.slug,
  });

  const userHasWon = isAuthenticated && doorPrizes.some(p => p.badgeNumber === userBadgeNumber);

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/welcome" className="hover:opacity-80 transition-opacity flex items-center gap-2" data-testid="link-welcome">
            <Radio className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-medium text-foreground">Prizes</h1>
          </Link>
          <Button size="icon" variant="ghost" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <ConferenceSelectorDialog />
          </div>
        </div>
      </header>

      {userHasWon && (
        <Alert className="mx-4 mt-4 bg-primary/10 border-primary">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground font-medium">
            Congratulations! You&apos;ve won a prize! Visit the registration desk to claim it.
          </AlertDescription>
        </Alert>
      )}

      <main className="flex-1 overflow-y-auto pb-20">
        <Tabs defaultValue="door" className="w-full">
          <div className="sticky top-0 z-30 bg-background border-b border-border">
            <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                data-testid="tab-all-prizes"
              >
                All Prizes
              </TabsTrigger>
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

          <TabsContent value="all" className="px-4 py-4 mt-0">
            {(prizesLoading || winnersLoading) ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (doorPrizes.length === 0 && tHuntingWinners.length === 0) ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No prizes announced yet</p>
              </div>
            ) : (
              <div>
                {doorPrizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Door Prizes</h3>
                    <div className="space-y-3">
                      {doorPrizes.map((prize) => (
                        <PrizeCard
                          key={prize.id}
                          prize={prize}
                          isWinner={prize.badgeNumber === userBadgeNumber}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {tHuntingWinners.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">T-Hunting Winners</h3>
                    <div className="space-y-3">
                      {tHuntingWinners.map((winner) => (
                        <THuntingCard key={winner.id} winner={winner} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

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
