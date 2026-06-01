const KEY = "ab_variant_map";

function loadMap() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getAbVariant(testName, variants = ["A", "B"]) {
  const map = loadMap();
  if (map[testName] && variants.includes(map[testName])) {
    return map[testName];
  }
  const selected = variants[Math.floor(Math.random() * variants.length)] || variants[0];
  map[testName] = selected;
  localStorage.setItem(KEY, JSON.stringify(map));
  return selected;
}

