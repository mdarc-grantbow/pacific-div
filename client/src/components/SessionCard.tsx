import { Clock, MapPin, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Session } from "@shared/schema";

interface SessionCardProps {
  session: Session;
  onBookmark?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export default function SessionCard({ session, onBookmark, onViewDetails }: SessionCardProps) {
  return (
    <Card 
      className={`p-4 hover-elevate cursor-pointer ${session.isBookmarked ? 'border-l-4 border-l-primary' : ''}`}
      onClick={() => onViewDetails?.(session.id)}
      data-testid={`session-card-${session.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs font-mono" data-testid={`session-time-${session.id}`}>
              {session.startTime}
            </Badge>
            <Badge variant="outline" className="text-xs" data-testid={`session-category-${session.id}`}>
              {session.category}
            </Badge>
          </div>
          
          <h3 className="font-medium text-base mb-1 text-foreground" data-testid={`session-title-${session.id}`}>
            {session.title}
          </h3>
          
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span data-testid={`session-speaker-${session.id}`}>{session.speaker}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span data-testid={`session-room-${session.id}`}>{session.room}</span>
            </div>
          </div>
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.(session.id);
          }}
          data-testid={`button-bookmark-${session.id}`}
        >
          <Bookmark 
            className={`w-5 h-5 ${session.isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
          />
        </Button>
      </div>
    </Card>
  );
}
