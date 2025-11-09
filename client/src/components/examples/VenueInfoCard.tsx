import VenueInfoCard from '../VenueInfoCard';

export default function VenueInfoCardExample() {
  const info = {
    id: "1",
    category: "hotel" as const,
    title: "San Ramon Marriott",
    details: "2600 Bishop Drive, San Ramon, CA 94583",
    hours: "Check-in: 4:00 PM",
  };

  return <VenueInfoCard info={info} />;
}
