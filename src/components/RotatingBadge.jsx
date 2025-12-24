import { useEffect, useState } from "react";

const stayTypes = [
  "Verified Family Campsites",
  "Verified Tent Stays",
  "Verified A-Frame Stays",
  "Verified Mudhouse Stays",
  "Verified Treehouse Stays",
  "Verified Backpack Camping"
];

export default function RotatingBadge() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setI((prev) => (prev + 1) % stayTypes.length);
    }, 2000); // Change text every 2 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-500">
      ✔ {stayTypes[i]}
    </div>
  );
}
