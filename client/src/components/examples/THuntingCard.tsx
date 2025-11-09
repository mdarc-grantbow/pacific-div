import THuntingCard from '../THuntingCard';

export default function THuntingCardExample() {
  const winner = {
    id: "1",
    rank: 1,
    callSign: "K6XYZ",
    completionTime: "24:35",
    huntNumber: 1,
    prize: "Portable Antenna Kit",
  };

  return <THuntingCard winner={winner} />;
}
