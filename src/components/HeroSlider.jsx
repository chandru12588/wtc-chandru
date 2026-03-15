import React, { useEffect, useState } from "react";
import bg1 from "../assets/bg1.jpg";
import bg2 from "../assets/bg2.jpg";
import bg3 from "../assets/bg3.jpg";
import bg5 from "../assets/bg5.jpg";

const images = [bg1, bg2, bg3, bg5];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const goToSlide = (nextIndex) => {
    setIndex(nextIndex);
  };

  const showPrevious = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

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
      <div className="absolute inset-0 bg-black/0 z-[1]" />

      <div className="absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={showPrevious}
          aria-label="Show previous slide"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55"
        >
          &#8249;
        </button>

        <button
          type="button"
          onClick={showNext}
          aria-label="Show next slide"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55"
        >
          &#8250;
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToSlide(i)}
            aria-label={`Show slide ${i + 1}`}
            className={`h-3 w-3 rounded-full transition ${
              i === index ? "bg-white" : "bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
