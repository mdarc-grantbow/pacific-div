import VendorCard from '../VendorCard';

export default function VendorCardExample() {
  const vendor = {
    id: "1",
    name: "Ham Radio Outlet",
    boothNumber: "12",
    category: "Equipment",
    description: "Your one-stop shop for all amateur radio equipment and accessories.",
    website: "https://www.hamradio.com",
  };

  return (
    <VendorCard 
      vendor={vendor}
      onViewDetails={(id) => console.log('View vendor:', id)}
    />
  );
}
