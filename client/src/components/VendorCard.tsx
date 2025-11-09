import { Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Vendor } from "@shared/schema";

interface VendorCardProps {
  vendor: Vendor;
  onViewDetails?: (id: string) => void;
}

export default function VendorCard({ vendor, onViewDetails }: VendorCardProps) {
  return (
    <Card 
      className="p-4 hover-elevate cursor-pointer"
      onClick={() => onViewDetails?.(vendor.id)}
      data-testid={`vendor-card-${vendor.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Store className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground" data-testid={`vendor-name-${vendor.id}`}>
              {vendor.name}
            </h3>
            <Badge variant="secondary" className="text-xs" data-testid={`vendor-booth-${vendor.id}`}>
              Booth {vendor.boothNumber}
            </Badge>
          </div>
          
          <Badge variant="outline" className="text-xs mb-2" data-testid={`vendor-category-${vendor.id}`}>
            {vendor.category}
          </Badge>
          
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`vendor-description-${vendor.id}`}>
            {vendor.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
