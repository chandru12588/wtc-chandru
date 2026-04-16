import React from "react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Pillion Rider Service",
    description:
      "Join curated ride routes, hill station loops, and road-trip experiences with local rider support.",
    cta: "Explore trips",
    to: "/trips?service=bike",
    accent: "from-orange-500 to-amber-400",
  },
  {
    title: "Tour Guide Service",
    description:
      "Discover guided local experiences, destination walkthroughs, and curated outdoor plans with on-ground experts.",
    cta: "Explore trips",
    to: "/trips?service=guide",
    accent: "from-emerald-500 to-lime-400",
  },
  {
    title: "Hosted Stays",
    description:
      "Book handpicked camps, cabins, tents, and adventure stays managed by verified hosts on the platform.",
    cta: "Browse stays",
    to: "/trips?service=host",
    accent: "from-sky-500 to-cyan-400",
  },
  {
    title: "Acting Driver Service",
    description:
      "Request experienced car and bike acting drivers for assisted travel, road trips, and destination transfers.",
    cta: "Explore trips",
    to: "/trips?service=driver",
    accent: "from-violet-500 to-fuchsia-400",
  },
  {
    title: "Roadside Assistance",
    description:
      "Get help with vehicle breakdowns and roadside assistance across Tamil Nadu and Karnataka with verified service providers.",
    cta: "Get assistance",
    to: "/roadside-assistance",
    accent: "from-red-500 to-pink-400",
  },
];

export default function ServicesHighlight() {
  return (
    <section id="services" className="bg-stone-50 py-14">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
            Additional Services
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            More than stays. Plan the full outdoor experience.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Customers can book trips, discover hosted stays, and connect with
            road-trip and guide services from one place.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
            >
              <div className={`h-2 bg-gradient-to-r ${service.accent}`} />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
                <Link
                  to={service.to}
                  className="mt-6 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
                >
                  {service.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
