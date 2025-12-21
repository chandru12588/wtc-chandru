import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HostBookingForm from "../components/HostBookingForm"; // ⭐ ADD THIS

const API = import.meta.env.VITE_API_URL;

export default function HostListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListing = async () => {
      try {
        // ⭐ Correct public endpoint
        const res = await axios.get(`${API}/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("❌ Host listing details load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id]);

  if (loading)
    return (
      <div className="pt-24 text-center text-gray-500 text-lg">
        Loading listing…
      </div>
    );

  if (!listing)
    return (
      <div className="pt-24 text-center text-red-500 text-lg">
        Listing not found.
      </div>
    );

  const host = listing.hostId || {};
  const hostPhone =
    host.phoneNumber || host.phone || host.mobile || "";

  return (
    <div className="max-w-6xl mx-auto pt-24 px-4 pb-20">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">{listing.title}</h1>
      <p className="text-gray-600 mt-1">{listing.location}</p>

      {/* IMAGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {listing.images?.length > 0 ? (
          listing.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`listing-${i}`}
              className="rounded-xl w-full h-80 object-cover shadow"
            />
          ))
        ) : (
          <p className="text-gray-400">No images available.</p>
        )}
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        {listing.description}
      </p>

      {/* PRICE */}
      <div className="text-2xl font-semibold mb-6">
        Price: <span className="text-emerald-600">₹ {listing.price}</span>
      </div>

      {/* HOST INFO */}
      <div className="bg-gray-100 p-5 rounded-xl mb-8 shadow-sm">
        <h3 className="text-xl font-bold mb-2">Host Information</h3>
        <p><strong>Name:</strong> {host.name || "Not available"}</p>
        <p><strong>Email:</strong> {host.email || "Not available"}</p>
        <p><strong>Phone:</strong> {hostPhone || "Not available"}</p>
      </div>

      {/* ⭐ BOOKING FORM (NEW) */}
      <HostBookingForm listing={listing} />

      {/* WHATSAPP BUTTON */}
      <a
        href={`https://wa.me/${8248579662}?text=Hi%2C%20I%20want%20to%20book%20${encodeURIComponent(
          listing.title
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow transition-all block text-center mt-6"
      >
        Chat with Host on WhatsApp
      </a>
    </div>
  );
}
