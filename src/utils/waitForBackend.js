import { api } from "@/service/api";

export async function waitForBackend({
  maxRetries = 60,
  retryDelay = 2000,
  timeout = 3000,
  onAttempt,
} = {}) {
  for (let i = 1; i <= maxRetries; i++) {
    if (typeof onAttempt === "function") {
      onAttempt(i, maxRetries);
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await api.get("/health", {
        signal: controller.signal,
      });

      if (res.status === 200) {
        return true;
      }
    } catch (error) {
      // Ignore network/timeout errors
    } finally {
      clearTimeout(id);
    }

    await new Promise((resolve) => setTimeout(resolve, retryDelay));
  }

  return false;
}