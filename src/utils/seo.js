import { useEffect } from "react";

function upsertMeta(name, content, attr = "name") {
  if (!content) return;
  const selector = `meta[${attr}="${name}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(url) {
  if (!url) return;
  let tag = document.head.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", url);
}

function upsertJsonLd(id, data) {
  if (!id || !data) return;
  let script = document.head.querySelector(`script[data-seo-id="${id}"]`);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-id", id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function useSeo({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogType = "website",
  ogImage = "https://trippolama.com/founder-photo.jpg",
  noIndex = false,
  jsonLd,
  jsonLdId,
}) {
  useEffect(() => {
    const resolvedCanonical =
      canonical ||
      (typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : undefined);

    if (title) document.title = title;
    upsertMeta("description", description);
    upsertMeta("og:title", ogTitle || title, "property");
    upsertMeta("og:description", ogDescription || description, "property");
    upsertMeta("og:type", ogType, "property");
    upsertMeta("og:url", resolvedCanonical, "property");
    upsertMeta("og:image", ogImage, "property");
    upsertMeta("og:site_name", "Trippolama", "property");
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", ogTitle || title);
    upsertMeta("twitter:description", ogDescription || description);
    upsertMeta("twitter:image", ogImage);
    upsertMeta("robots", noIndex ? "noindex,nofollow" : "index,follow");
    upsertCanonical(resolvedCanonical);
    if (jsonLd && jsonLdId) upsertJsonLd(jsonLdId, jsonLd);
  }, [
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogType,
    ogImage,
    noIndex,
    jsonLd,
    jsonLdId,
  ]);
}
