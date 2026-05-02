import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TripCard from "../components/TripCard";
import { useSeo } from "../utils/seo";

const API = import.meta.env.VITE_API_URL;

const PLACE_CONTENT = {
  mannavanur: {
    title: "Mannavanur Packages",
    placeName: "Mannavanur",
    aliases: ["mannavanur", "mannavanur, kodaikanal", "kodaikanal mannavanur"],
    intro:
      "Mannavanur is a calm high-altitude village near Kodaikanal known for meadows, lake views, and farm landscapes. It suits travelers looking for less-crowded nature experiences.",
    highlights: [
      "Peaceful grasslands and village roads for slow travel",
      "Ideal for photography, sunrise drives, and family-friendly trips",
      "Commonly paired with Kodaikanal town sightseeing in one package",
    ],
    faqs: [
      {
        q: "Is Mannavanur suitable for a one-day trip from Kodaikanal?",
        a: "Yes. Many travelers visit Mannavanur as a scenic day circuit from Kodaikanal with nearby spots and return by evening.",
      },
      {
        q: "What type of trips are best for Mannavanur?",
        a: "Nature-focused trips, family tours, and relaxed weekend plans work best due to the area’s calm environment.",
      },
    ],
  },
  poondi: {
    title: "Poondi Packages",
    placeName: "Poondi",
    aliases: ["poondi", "poondi kodaikanal", "kodaikanal poondi"],
    intro:
      "Poondi near Kodaikanal is known for scenic backroads, green valleys, and peaceful viewpoints. It is popular for weekend escapes and customized sightseeing plans.",
    highlights: [
      "Clean air, lesser crowd, and wide valley views",
      "Good add-on destination in multi-spot Kodaikanal itineraries",
      "Suitable for couples, families, and private road trip groups",
    ],
    faqs: [
      {
        q: "Can Poondi be covered along with Kodaikanal main spots?",
        a: "Yes. Most itineraries include Poondi as part of an extended Kodaikanal route based on available time.",
      },
      {
        q: "Is Poondi better for short trips or long stays?",
        a: "It is commonly included in short and medium itineraries, especially for travelers who prefer quieter surroundings.",
      },
    ],
  },
  kookal: {
    title: "Kookal Packages",
    placeName: "Kookal",
    aliases: ["kookal", "kookal kodaikanal", "kodaikanal kookal"],
    intro:
      "Kookal is a scenic village region near Kodaikanal with forest roads, misty weather, and offbeat natural surroundings. It is preferred by travelers who like raw hill-station landscapes.",
    highlights: [
      "Offbeat destination with greenery and cool weather",
      "Popular among photographers and weekend explorers",
      "Best experienced with local route planning and guided packages",
    ],
    faqs: [
      {
        q: "Is Kookal part of Kodaikanal travel packages?",
        a: "Yes. Many Kodaikanal packages include Kookal as an offbeat destination option.",
      },
      {
        q: "Who should choose Kookal packages?",
        a: "Travelers looking for calm nature routes, less crowded locations, and photo-friendly landscapes.",
      },
    ],
  },
};

function matchesPlace(location, aliases) {
  const value = String(location || "").trim().toLowerCase();
  if (!value) return false;
  return aliases.some((alias) => value.includes(alias));
}

export default function KodaikanalPlacePage() {
  const { placeSlug } = useParams();
  const navigate = useNavigate();
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const content = PLACE_CONTENT[String(placeSlug || "").toLowerCase()] || null;

  const filtered = useMemo(() => {
    if (!content) return [];
    return allPackages.filter((item) => matchesPlace(item?.location, content.aliases));
  }, [allPackages, content]);

  useSeo({
    title: content
      ? `${content.placeName}, Kodaikanal Tour Packages | Trippolama`
      : "Kodaikanal Place Packages | Trippolama",
    description: content
      ? `${content.placeName} packages under Kodaikanal with curated stays, sightseeing, and road trip options.`
      : "Explore Kodaikanal place-based travel packages.",
    canonical: content
      ? `https://trippolama.com/kodaikanal/${String(placeSlug || "").toLowerCase()}`
      : "https://trippolama.com/kodaikanal",
    jsonLdId: "kodaikanal-place-page",
    jsonLd: content
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null,
  });

  useEffect(() => {
    if (!content) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/api/packages`);
        setAllPackages(Array.isArray(res.data) ? res.data : []);
      } catch {
        setAllPackages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [content]);

  if (!content) {
    return (
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-24">
        <h1 className="text-3xl font-bold">Place Not Found</h1>
        <p className="mt-2 text-gray-600">This Kodaikanal place page is not available.</p>
        <button
          type="button"
          onClick={() => navigate("/kodaikanal")}
          className="mt-4 rounded-full border px-4 py-2 text-sm font-semibold"
        >
          Back to Kodaikanal
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24">
      <div className="mb-6">
        <p className="text-sm font-semibold text-emerald-700">Kodaikanal Sub-Destination</p>
        <h1 className="mt-1 text-3xl font-bold">{content.title}</h1>
        <p className="mt-2 text-gray-700">{content.intro}</p>
      </div>

      <div className="mb-8 rounded-2xl border bg-white p-4">
        <h2 className="text-xl font-semibold">Why choose {content.placeName}?</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          {content.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link to="/kodaikanal" className="rounded-full border px-4 py-2 text-sm font-semibold">
          Kodaikanal Main
        </Link>
        <Link to="/kodaikanal/mannavanur" className="rounded-full border px-4 py-2 text-sm font-semibold">
          Mannavanur
        </Link>
        <Link to="/kodaikanal/poondi" className="rounded-full border px-4 py-2 text-sm font-semibold">
          Poondi
        </Link>
        <Link to="/kodaikanal/kookal" className="rounded-full border px-4 py-2 text-sm font-semibold">
          Kookal
        </Link>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">{content.placeName} Packages</h2>
        {loading ? <p className="text-sm text-gray-500">Loading packages...</p> : null}
        {!loading && !filtered.length ? (
          <p className="text-sm text-gray-500">
            No direct packages found now. Explore all <Link to="/kodaikanal" className="text-emerald-700 underline">Kodaikanal packages</Link>.
          </p>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((pkg) => (
            <TripCard key={pkg._id} trip={pkg} />
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border bg-white p-5">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          {content.faqs.map((item) => (
            <div key={item.q}>
              <h3 className="font-semibold text-slate-900">{item.q}</h3>
              <p className="text-sm text-slate-700">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

