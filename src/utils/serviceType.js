export function inferServiceType(item) {
  const normalize = (value) => String(value || "").trim().toLowerCase();

  // 🔥 1. Direct serviceType (highest priority)
  const explicit = normalize(item?.serviceType);
  if (explicit) return explicit;

  const category = normalize(item?.category);
  const stayType = normalize(item?.stayType);
  const title = normalize(item?.title);

  const tags = Array.isArray(item?.tags)
    ? item.tags.map((t) => normalize(t))
    : [];

  // 🏠 HOST
  if (item?.isHostListing) {
    return "host";
  }

  // 🏍 BIKE
  if (
    category.includes("bike") ||
    stayType.includes("bike") ||
    title.includes("bike") ||
    tags.includes("bike")
  ) {
    return "bike";
  }

  // 🧑‍🏫 GUIDE (🔥 YOUR MAIN FIX)
  if (
    category.includes("guide") ||
    title.includes("guide") ||
    category.includes("tour") ||   // 🔥 IMPORTANT
    title.includes("tour") ||      // 🔥 IMPORTANT
    tags.includes("guide")
  ) {
    return "guide";
  }

  // 🚗 DRIVER
  if (
    category.includes("driver") ||
    title.includes("driver") ||
    tags.includes("driver")
  ) {
    return "driver";
  }

  // 🧭 DEFAULT
  return "general";
}