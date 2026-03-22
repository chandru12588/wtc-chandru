import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, MapPin, Star } from "lucide-react";

export default function Footer() {
  const instaImages = [];

  return (
    <footer className="bg-[#0f172a] text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-10 pt-14 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <h3 className="mb-3 text-xl font-semibold text-white">Trippolama</h3>
          <p className="max-w-sm text-sm leading-relaxed text-gray-400">
            Curated road trips, camping and bike-friendly stays for travellers who believe the best memories are found
            on the road.
          </p>

          <div className="mt-5 flex gap-4">
            <a href="" target="_blank" rel="noopener noreferrer" className="transition hover:text-pink-400">
              <Instagram size={18} />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" className="transition hover:text-blue-400">
              <Facebook size={18} />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" className="transition hover:text-red-400">
              <Youtube size={18} />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer" className="transition hover:text-emerald-400">
              <MapPin size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/trips" className="transition hover:text-white">
                Trips
              </Link>
            </li>
            <li>
              <Link to="/host/register" className="transition hover:text-white">
                Become a Host
              </Link>
            </li>
            <li>
              <Link to="/guide/register" className="transition hover:text-white">
                Become a Guide
              </Link>
            </li>
            <li>
              <Link to="/acting-driver/register" className="transition hover:text-white">
                Become an Acting Driver
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/blog" className="transition hover:text-white">
                Blogs
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition hover:text-white">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Services</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/trips?service=bike" className="transition hover:text-white">
                Pillion Rider Service
              </Link>
            </li>
            <li>
              <Link to="/trips?service=guide" className="transition hover:text-white">
                Tour Guide Service
              </Link>
            </li>
            <li>
              <Link to="/trips?service=host" className="transition hover:text-white">
                Hosted Stays
              </Link>
            </li>
            <li>
              <Link to="/trips?service=driver" className="transition hover:text-white">
                Acting Driver Service
              </Link>
            </li>
            <li>
              <Link to="/#services" className="transition hover:text-white">
                View All Services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <Star size={16} className="text-yellow-400" />
            Google Reviews
          </h4>
          <iframe
            title="Google Reviews"
            src=""
            className="h-48 w-full rounded-xl border border-white/10 shadow-lg"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Instagram</h4>
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
                  alt="Trippolama Instagram"
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <span className="text-xs font-medium text-white">View</span>
                </div>
              </a>
            ))}
          </div>

          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-emerald-400 hover:underline"
          >
            View on Instagram -
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        Copyright {new Date().getFullYear()} Trippolama. All rights reserved.
      </div>
    </footer>
  );
}
