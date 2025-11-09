import RadioContactCard from '../RadioContactCard';

export default function RadioContactCardExample() {
  const contact = {
    id: "1",
    type: "talk-in" as const,
    frequency: "146.850 MHz",
    label: "Conference Talk-In",
    notes: "PL 100.0 Hz",
  };

  return <RadioContactCard contact={contact} />;
}
