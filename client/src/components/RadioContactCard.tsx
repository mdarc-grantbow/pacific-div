import { Radio, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RadioContact } from "@shared/schema";
import { useState } from "react";

interface RadioContactCardProps {
  contact: RadioContact;
}

const typeColors = {
  'talk-in': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  'simplex': 'bg-green-500/10 text-green-700 dark:text-green-400',
  'qrp': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
};

export default function RadioContactCard({ contact }: RadioContactCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.frequency);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-4" data-testid={`radio-contact-${contact.id}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-lg bg-muted">
            <Radio className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-foreground" data-testid={`contact-label-${contact.id}`}>
                {contact.label}
              </h3>
              <Badge className={`text-xs ${typeColors[contact.type]}`} data-testid={`contact-type-${contact.id}`}>
                {contact.type.toUpperCase()}
              </Badge>
            </div>
            
            <p className="text-xl font-mono font-medium text-foreground mb-1" data-testid={`contact-frequency-${contact.id}`}>
              {contact.frequency}
            </p>
            
            {contact.notes && (
              <p className="text-sm text-muted-foreground" data-testid={`contact-notes-${contact.id}`}>
                {contact.notes}
              </p>
            )}
          </div>
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCopy}
          data-testid={`button-copy-${contact.id}`}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}
