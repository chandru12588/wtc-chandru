import React from "react";
import HeroSlider from "./HeroSlider";
import SearchBar from "./SearchBar";
import Navbar from "./Navbar";
import RotatingBadge from "./RotatingBadge";   // ✅ Correct import

export default function HeroSection({ onSearch }) {
  return (
    <section className="relative w-full h-[520px] md:h-[600px] overflow-hidden">

      {/* Background Slider */}
      <HeroSlider />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar transparent />
      </div>

      {/* Content */}
      <div className="relative z-40 max-w-6xl mx-auto px-4 h-full flex flex-col justify-center text-white">

        <p className="text-xs font-semibold uppercase mb-3 text-emerald-200">
          Road Trips • Camping • Bike-Friendly Stays
        </p>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
          Camping in India
          <span className="block text-white/90">Made Easy & Safe</span>
        </h1>

        {/* 🔥 Rotating Badge Appears Here */}
        <div className="mt-2">
          <RotatingBadge />   {/* <-- NOW YOU WILL SEE ROTATING TEXT */}
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute left-1/2 -bottom-16 md:-bottom-20 w-full max-w-5xl px-4 -translate-x-1/2 z-50">
        <SearchBar onSearch={onSearch} />
      </div>

    </section>
  );
}
