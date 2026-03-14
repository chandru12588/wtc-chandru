export function inferServiceType(item) {
  const normalize = (value) => String(value || "").trim().toLowerCase();

  const explicit = normalize(item?.serviceType);
  if (explicit) return explicit;

  const category = normalize(item?.category);
  const stayType = normalize(item?.stayType);

  if (category === "bike pillion tour" || stayType === "pillion bike tour") {
    return "bike";
  }

  return "general";
}
