const KEY = "recently_viewed_trips";
const MAX_ITEMS = 12;

export function loadRecentlyViewed() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(trip) {
  if (!trip?._id) return;
  const nextItem = {
    _id: String(trip._id),
    title: trip.title || "",
    location: trip.location || "",
    price: Number(trip.price || 0),
    image: Array.isArray(trip.images) ? trip.images[0] || "" : "",
    serviceType: trip.serviceType || "general",
    viewedAt: new Date().toISOString(),
  };

  const current = loadRecentlyViewed().filter((item) => item._id !== nextItem._id);
  const merged = [nextItem, ...current].slice(0, MAX_ITEMS);
  localStorage.setItem(KEY, JSON.stringify(merged));
}

