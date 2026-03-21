// frontend/src/components/PackageCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { loadFavorites, toggleFavorite } from "../utils/wishlist";

export default function PackageCard({ pkg }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const syncFavorite = async () => {
      try {
        const list = await loadFavorites();
        if (!mounted) return;
        setIsFavorite(list.some((fav) => String(fav.itemId) === String(pkg?._id)));
      } catch {
        if (!mounted) return;
        setIsFavorite(false);
      }
    };
    syncFavorite();
    return () => {
      mounted = false;
    };
  }, [pkg?._id]);

  const onFavorite = async (e) => {
    e.stopPropagation();
    try {
      const result = await toggleFavorite(pkg);
      setIsFavorite(Boolean(result?.favorite));
    } catch {
      alert("Unable to update favorite right now");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <button
          type="button"
          onClick={onFavorite}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-xl ring-1 ring-black/10 transition hover:scale-110"
        >
          <FaHeart className={isFavorite ? "text-red-500" : "text-gray-500"} />
        </button>
        <img
          src={pkg.images?.[0]}
          onError={(e) => (e.target.src = "/no-image.png")}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col">
        <h3 className="text-lg font-semibold">{pkg.title}</h3>
        <p className="text-xs text-gray-500">{pkg.region}</p>

        <div className="mt-3 text-indigo-600 font-bold">₹ {pkg.price}</div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate(`/booking/${pkg._id}`)}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
          >
            Book
          </button>

          <a
            href={`https://wa.me/918248579662?text=I want to book ${pkg.title}`}
            target="_blank"
            className="flex-1 bg-green-500 text-white py-2 rounded-lg text-center"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
