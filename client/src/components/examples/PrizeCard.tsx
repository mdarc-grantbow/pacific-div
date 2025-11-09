import PrizeCard from '../PrizeCard';

export default function PrizeCardExample() {
  const prize = {
    id: "1",
    badgeNumber: "42",
    callSign: "W6ABC",
    prizeName: "Handheld VHF/UHF Transceiver",
    timestamp: new Date().toISOString(),
    claimed: false,
  };

  return <PrizeCard prize={prize} isWinner={false} />;
}
