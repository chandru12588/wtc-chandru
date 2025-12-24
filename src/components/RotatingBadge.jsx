import { useEffect, useState } from "react";

const stayTypes = [
  "Verified Private Campsites",
  "Verified Family Campsites",
  "Verified Tent Stays",
  "Verified A-Frame Stays",
  "Verified Mudhouse Stays",
  "Verified Treehouse Stays",
  "Verified Backpack Camping"
];

export default function RotatingBadge() {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setI((prev) => (prev + 1) % stayTypes.length);
        setFade(true); // fade in
      }, 300); // fade-out duration
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="
      inline-flex items-center gap-2 bg-emerald-600 
      px-6 py-3 rounded-full text-sm md:text-base 
      font-semibold shadow-lg border border-white/20 
      transition-all duration-500
    ">
      <span className="text-white text-lg">✔</span>

      {/* Animated Text */}
      <span
        className={`
          text-white whitespace-nowrap block
          transition-all duration-500 
          ${fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        `}
      >
        {stayTypes[i]}
      </span>
    </div>
  );
}
