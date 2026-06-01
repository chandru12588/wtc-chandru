const loadedScripts = new Map();

export function loadScript(src) {
  if (!src) return Promise.reject(new Error("Script src is required"));

  if (loadedScripts.has(src)) return loadedScripts.get(src);

  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    const resolved = Promise.resolve(existing);
    loadedScripts.set(src, resolved);
    return resolved;
  }

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(script);
    script.onerror = () =>
      reject(new Error(`Failed to load external script: ${src}`));
    document.head.appendChild(script);
  });

  loadedScripts.set(src, promise);
  return promise;
}

