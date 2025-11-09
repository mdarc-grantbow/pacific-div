import { Button } from "@/components/ui/button";

interface DaySelectorProps {
  selectedDay: 'friday' | 'saturday' | 'sunday';
  onSelectDay: (day: 'friday' | 'saturday' | 'sunday') => void;
}

const days = [
  { value: 'friday' as const, label: 'Fri, Oct 10' },
  { value: 'saturday' as const, label: 'Sat, Oct 11' },
  { value: 'sunday' as const, label: 'Sun, Oct 12' },
];

export default function DaySelector({ selectedDay, onSelectDay }: DaySelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {days.map((day) => (
        <Button
          key={day.value}
          variant={selectedDay === day.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectDay(day.value)}
          className="whitespace-nowrap"
          data-testid={`button-day-${day.value}`}
        >
          {day.label}
        </Button>
      ))}
    </div>
  );
}
