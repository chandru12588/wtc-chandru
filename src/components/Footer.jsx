import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, MapPin, Star } from "lucide-react";

import insta1 from "../assets/insta1.avif";
import insta2 from "../assets/insta2.jpeg";
import insta3 from "../assets/insta3.jpg";
import insta4 from "../assets/insta4.avif";
import insta5 from "../assets/insta5.jpg";
import insta6 from "../assets/insta6.webp";

export default function Footer() {
  const instaImages = [insta1, insta2, insta3, insta4, insta5, insta6];

  return (
    <footer className="bg-[#0f172a] text-gray-300">

      {/* ================= TOP GRID ================= */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10 grid gap-10 md:grid-cols-4">

        {/* BRAND */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">
            Trippolama
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Curated road trips, camping & bike-friendly stays for travellers
            who believe the best memories are found on the Trippolama.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-5">
            <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">
              <Instagram size={18} />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
              <Facebook size={18} />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition">
              <Youtube size={18} />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">
              <MapPin size={18} />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="text-white font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/trips" className="hover:text-white transition">Trips</Link></li>
            <li><Link to="/host/register" className="hover:text-white transition">Become a Host</Link></li>
            <li><Link to="/guide/register" className="hover:text-white transition">Become a Guide</Link></li>
            <li><Link to="/acting-driver/register" className="hover:text-white transition">Become an Acting Driver</Link></li>
            <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
            <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/trips?service=bike" className="hover:text-white transition">Pillion Rider Service</Link></li>
            <li><Link to="/trips?service=guide" className="hover:text-white transition">Tour Guide Service</Link></li>
            <li><Link to="/trips?service=host" className="hover:text-white transition">Hosted Stays</Link></li>
            <li><Link to="/trips?service=driver" className="hover:text-white transition">Acting Driver Service</Link></li>
            <li><Link to="/#services" className="hover:text-white transition">View All Services</Link></li>
          </ul>
        </div>

        {/* GOOGLE REVIEWS */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Star size={16} className="text-yellow-400" />
            Google Reviews
          </h4>

          <iframe
            title=""
            src=""
            className="w-full h-48 rounded-xl border border-white/10 shadow-lg"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* INSTAGRAM PREVIEW */}
        <div>
          <h4 className="text-white font-semibold mb-3">Instagram</h4>

          <div className="grid grid-cols-3 gap-2">
            {instaImages.map((img, i) => (
              <a
                key={i}
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-lg"
              >
                <img
                  src={img}
                  alt="Wrong Turn Club Instagram"
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white text-xs font-medium">View</span>
                </div>
              </a>
            ))}
          </div>

          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm text-emerald-400 hover:underline"
          >
            View on Instagram →
          </a>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Trippolama · All rights reserved
      </div>
    </footer>
  );
}
