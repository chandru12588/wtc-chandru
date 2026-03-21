export function inferServiceType(item) {
  const normalize = (value) => String(value || "").trim().toLowerCase();
  const hasAny = (value, keywords) =>
    keywords.some((keyword) => value.includes(keyword));

  const BIKE_KEYWORDS = ["bike", "biker", "pillion", "rider", "ride"];
  const GUIDE_KEYWORDS = ["guide", "tour guide", "local guide", "guided"];
  const DRIVER_KEYWORDS = ["driver", "acting driver", "chauffeur"];
  const HOST_KEYWORDS = ["host", "stay", "listing", "cabin", "camp"];
  const GENERAL_KEYWORDS = ["general", "package", "trip", "camping", "camp"];

  const explicit = normalize(item?.serviceType);
  if (explicit) {
    if (hasAny(explicit, BIKE_KEYWORDS)) return "bike";
    if (hasAny(explicit, GUIDE_KEYWORDS)) return "guide";
    if (hasAny(explicit, DRIVER_KEYWORDS)) return "driver";
    if (hasAny(explicit, HOST_KEYWORDS)) return "host";
    if (hasAny(explicit, GENERAL_KEYWORDS)) return "general";
  }

  const category = normalize(item?.category);
  const stayType = normalize(item?.stayType);
  const title = normalize(item?.title);
  const tags = Array.isArray(item?.tags)
    ? item.tags.map((tag) => normalize(tag))
    : [];
  const tagsText = tags.join(" ");

  if (item?.isHostListing) {
    return "host";
  }

  if (
    hasAny(category, BIKE_KEYWORDS) ||
    hasAny(stayType, BIKE_KEYWORDS) ||
    hasAny(title, BIKE_KEYWORDS) ||
    hasAny(tagsText, BIKE_KEYWORDS)
  ) {
    return "bike";
  }

  if (
    hasAny(category, GUIDE_KEYWORDS) ||
    hasAny(title, GUIDE_KEYWORDS) ||
    hasAny(tagsText, GUIDE_KEYWORDS)
  ) {
    return "guide";
  }

  if (
    hasAny(category, DRIVER_KEYWORDS) ||
    hasAny(title, DRIVER_KEYWORDS) ||
    hasAny(tagsText, DRIVER_KEYWORDS)
  ) {
    return "driver";
  }

  return "general";
}
