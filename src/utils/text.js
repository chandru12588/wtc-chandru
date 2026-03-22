const REPLACEMENTS = [
  ["â‚¹", "₹"],
  ["â†’", "→"],
  ["â€¢", "•"],
  ["â€“", "–"],
  ["â€”", "—"],
  ["Ã—", "×"],
];

export function sanitizeText(value) {
  if (typeof value !== "string") return value ?? "";

  let out = value;
  for (const [bad, good] of REPLACEMENTS) {
    out = out.split(bad).join(good);
  }

  return out.replace(/\uFFFD/g, "").trim();
}

export function formatRupees(value) {
  const raw = String(value ?? "");
  const numeric = Number(raw.replace(/[^\d.-]/g, ""));

  if (Number.isFinite(numeric) && raw !== "") {
    return `Rs ${numeric.toLocaleString("en-IN")}`;
  }

  return `Rs ${sanitizeText(raw || "0")}`;
}
