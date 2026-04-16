// Safe Image Component to prevent empty src attributes
import React from 'react';

export function SafeImage({ src, alt, className, fallback = null }) {
  // If src is empty, null, or undefined, don't render the img element
  if (!src || typeof src !== 'string' || src.trim() === '') {
    return fallback || null;
  }

  return React.createElement('img', { src, alt, className });
}

// Utility to get safe image array
export function getSafeImages(images) {
  if (!Array.isArray(images)) return [];
  return images.filter(img => img && typeof img === 'string' && img.trim() !== '');
}