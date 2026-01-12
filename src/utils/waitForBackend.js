// src/utils/waitForBackend.js
export async function waitForBackend(url, { maxRetries = 30, retryDelay = 1500, onAttempt } = {}) {
  // normalize URL (no trailing slash)
  const normalized = url?.replace(/\/+$/, "") || "";

  for (let i = 1; i <= maxRetries; i++) {
    if (typeof onAttempt === "function") onAttempt(i, maxRetries);
    try {
      // change path if your health endpoint is different (e.g. /actuator/health or /api/health)
      const res = await fetch(`${normalized}/health`, { method: "GET", cache: "no-store" });
      // only treat 2xx as ready
      if (res.ok) return true;
    } catch (e) {
      // network error - ignore and retry
    }
    // wait
    await new Promise((r) => setTimeout(r, retryDelay));
  }
  return false;
}
