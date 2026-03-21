import { api } from "../api.js";

const LOCAL_KEY = "wishlist";

export const saveWishlistLocal = (list) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list || []));
};

export const loadWishlistLocal = () => {
  const raw = localStorage.getItem(LOCAL_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const loadFavorites = async () => {
  const token = localStorage.getItem("wtc_token");
  if (!token) return loadWishlistLocal();

  const res = await api.get("/api/auth/favorites");
  return res.data?.favorites || [];
};

export const toggleFavorite = async (trip) => {
  const token = localStorage.getItem("wtc_token");
  const item = {
    itemId: String(trip?._id || ""),
    itemType: trip?.isHostListing ? "listing" : "package",
    title: trip?.title || "",
    location: trip?.location || "",
    image: Array.isArray(trip?.images) ? trip.images[0] || "" : "",
    price: Number(trip?.price || 0),
    serviceType: trip?.serviceType || "general",
  };

  if (!item.itemId) return { favorite: false, favorites: [] };

  if (!token) {
    const current = loadWishlistLocal();
    const exists = current.some((fav) => fav.itemId === item.itemId);
    const next = exists
      ? current.filter((fav) => fav.itemId !== item.itemId)
      : [...current, { ...item, addedAt: new Date().toISOString() }];
    saveWishlistLocal(next);
    return { favorite: !exists, favorites: next };
  }

  const res = await api.post("/api/auth/favorites/toggle", item);
  return res.data;
};
