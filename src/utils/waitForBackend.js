// src/utils/waitForBackend.js
export async function waitForBackend(
  url,
  { maxRetries = 30, retryDelay = 1500, onAttempt } = {}
) {
  const normalized = url?.replace(/\/+$/, "") || "";

  for (let i = 1; i <= maxRetries; i++) {
    if (typeof onAttempt === "function") onAttempt(i, maxRetries);

    try {
      const res = await fetch(`${normalized}/health`, {
        method: "GET",
        cache: "no-store",
      });

      if (res.ok) return true;
    } catch {
      // ignore network errors
    }

    await new Promise((r) => setTimeout(r, retryDelay));
  }

  return false;
}
