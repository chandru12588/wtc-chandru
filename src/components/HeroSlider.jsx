import React, { useEffect, useState } from "react";
import bg1 from "../assets/bg1.jpg";
import bg2 from "../assets/bg2.jpg";
import bg3 from "../assets/bg3.jpg";
import bg5 from "../assets/bg5.jpg";

const images = [bg1, bg2, bg3, bg5];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    /* 🔥 REAL HERO CONTAINER (fills gap) */
    <section
      className="
        relative w-full
        min-h-[calc(100vh-72px)]
        md:min-h-[calc(100vh-72px)]
        overflow-hidden
      "
    >
      {/* SLIDER IMAGES */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`
            absolute inset-0
            transition-opacity duration-1000
            ${i === index ? "opacity-100" : "opacity-0"}
          `}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* OPTIONAL DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/10 z-[1]" />
    </section>
  );
}
