import { Hotel, Car, ClipboardCheck, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { VenueInfo } from "@shared/schema";

interface VenueInfoCardProps {
  info: VenueInfo;
}

const iconMap = {
  hotel: Hotel,
  parking: Car,
  registration: ClipboardCheck,
  testing: GraduationCap,
};

export default function VenueInfoCard({ info }: VenueInfoCardProps) {
  const Icon = iconMap[info.category];

  return (
    <Card className="p-4" data-testid={`venue-info-${info.id}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground mb-1" data-testid={`venue-title-${info.id}`}>
            {info.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-2" data-testid={`venue-details-${info.id}`}>
            {info.details}
          </p>
          
          {info.hours && (
            <p className="text-sm font-medium text-foreground" data-testid={`venue-hours-${info.id}`}>
              Hours: {info.hours}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
