import SessionCard from '../SessionCard';

export default function SessionCardExample() {
  const session = {
    id: "1",
    title: "Advanced Antenna Design for DX",
    speaker: "John Smith, W6ABC",
    day: "friday" as const,
    startTime: "09:00",
    endTime: "10:30",
    room: "Grand Ballroom A",
    category: "Antennas",
    isBookmarked: false,
  };

  return (
    <SessionCard 
      session={session}
      onBookmark={(id) => console.log('Bookmarked:', id)}
      onViewDetails={(id) => console.log('View details:', id)}
    />
  );
}
