import { Trophy, Medal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { THuntingWinner } from "@shared/schema";

interface THuntingCardProps {
  winner: THuntingWinner;
}

const rankColors = {
  1: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  2: 'bg-gray-400/10 text-gray-700 dark:text-gray-400',
  3: 'bg-orange-600/10 text-orange-700 dark:text-orange-400',
};

export default function THuntingCard({ winner }: THuntingCardProps) {
  const colorClass = rankColors[winner.rank as keyof typeof rankColors] || 'bg-muted text-muted-foreground';

  return (
    <Card className="p-4" data-testid={`thunting-card-${winner.id}`}>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${colorClass}`}>
          {winner.rank <= 3 ? (
            <Trophy className="w-6 h-6" />
          ) : (
            <Medal className="w-6 h-6" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-foreground" data-testid={`thunting-rank-${winner.id}`}>
              #{winner.rank}
            </span>
            <span className="font-mono font-medium text-foreground" data-testid={`thunting-callsign-${winner.id}`}>
              {winner.callSign}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-mono" data-testid={`thunting-time-${winner.id}`}>
              {winner.completionTime}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Hunt #{winner.huntNumber}
            </span>
          </div>
          
          {winner.prize && (
            <p className="text-sm font-medium text-foreground mt-1" data-testid={`thunting-prize-${winner.id}`}>
              Prize: {winner.prize}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
