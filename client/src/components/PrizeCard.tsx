import { Trophy, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DoorPrize } from "@shared/schema";

interface PrizeCardProps {
  prize: DoorPrize;
  isWinner?: boolean;
}

export default function PrizeCard({ prize, isWinner }: PrizeCardProps) {
  return (
    <Card 
      className={`p-4 ${isWinner ? 'bg-primary/5 border-primary' : ''}`}
      data-testid={`prize-card-${prize.id}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isWinner ? 'bg-primary/10' : 'bg-muted'}`}>
          <Trophy className={`w-5 h-5 ${isWinner ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-medium text-foreground" data-testid={`prize-callsign-${prize.id}`}>
              {prize.callSign}
            </span>
            <Badge variant="outline" className="text-xs" data-testid={`prize-badge-${prize.id}`}>
              #{prize.badgeNumber}
            </Badge>
            {prize.claimed && (
              <Badge variant="secondary" className="text-xs gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Claimed
              </Badge>
            )}
          </div>
          
          <p className="text-sm font-medium text-foreground mb-1" data-testid={`prize-name-${prize.id}`}>
            {prize.prizeName}
          </p>
          
          <p className="text-xs text-muted-foreground" data-testid={`prize-time-${prize.id}`}>
            {new Date(prize.timestamp).toLocaleString('en-US', { 
              weekday: 'short', 
              hour: 'numeric', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    </Card>
  );
}
