export async function waitForBackend(
  url,
  { maxRetries = 20, retryDelay = 2000, timeout = 3000, onAttempt } = {}
) {
  const normalized = url?.replace(/\/+$/, "") || "";

  for (let i = 1; i <= maxRetries; i++) {
    if (typeof onAttempt === "function") onAttempt(i, maxRetries);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(`${normalized}/health`, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });

      if (res.ok) return true;
    } catch {
      // ignore network + timeout errors
    } finally {
      clearTimeout(id);
    }

    await new Promise((r) => setTimeout(r, retryDelay));
  }

  return false;
}
