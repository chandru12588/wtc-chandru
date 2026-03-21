import { api } from "../api.js";

const LOCAL_KEY = "wishlist";
let favoritesCache = null;
let favoritesInFlight = null;
let serverFavoritesSupported = true;

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
  if (!token) {
    favoritesCache = loadWishlistLocal();
    return favoritesCache;
  }

  if (!serverFavoritesSupported) {
    favoritesCache = loadWishlistLocal();
    return favoritesCache;
  }

  if (favoritesCache) return favoritesCache;
  if (favoritesInFlight) return favoritesInFlight;

  favoritesInFlight = api
    .get("/api/auth/favorites")
    .then((res) => {
      favoritesCache = res.data?.favorites || [];
      return favoritesCache;
    })
    .catch((err) => {
      if (err?.response?.status === 404) {
        serverFavoritesSupported = false;
      }
      favoritesCache = loadWishlistLocal();
      return favoritesCache;
    })
    .finally(() => {
      favoritesInFlight = null;
    });

  return favoritesInFlight;
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
    serviceType: trip?.isHostListing ? "host" : trip?.serviceType || "general",
  };

  if (!item.itemId) return { favorite: false, favorites: [] };

  if (!token) {
    const current = loadWishlistLocal();
    const exists = current.some((fav) => fav.itemId === item.itemId);
    const next = exists
      ? current.filter((fav) => fav.itemId !== item.itemId)
      : [...current, { ...item, addedAt: new Date().toISOString() }];
    saveWishlistLocal(next);
    favoritesCache = next;
    return { favorite: !exists, favorites: next };
  }

  if (!serverFavoritesSupported) {
    const current = loadWishlistLocal();
    const exists = current.some((fav) => fav.itemId === item.itemId);
    const next = exists
      ? current.filter((fav) => fav.itemId !== item.itemId)
      : [...current, { ...item, addedAt: new Date().toISOString() }];
    saveWishlistLocal(next);
    favoritesCache = next;
    return { favorite: !exists, favorites: next };
  }

  try {
    const res = await api.post("/api/auth/favorites/toggle", item);
    favoritesCache = res.data?.favorites || [];
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      serverFavoritesSupported = false;
      const current = loadWishlistLocal();
      const exists = current.some((fav) => fav.itemId === item.itemId);
      const next = exists
        ? current.filter((fav) => fav.itemId !== item.itemId)
        : [...current, { ...item, addedAt: new Date().toISOString() }];
      saveWishlistLocal(next);
      favoritesCache = next;
      return { favorite: !exists, favorites: next };
    }
    throw err;
  }
};
