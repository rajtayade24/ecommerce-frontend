import { api } from "../service/api";

export async function waitForBackend({
  maxRetries = 20,
  retryDelay = 2000,
  timeout = 3000,
  onAttempt,
} = {}) {
  for (let i = 1; i <= maxRetries; i++) {
    onAttempt?.(i, maxRetries);

    const controller = new AbortController();

    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await api.get("/health", {
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timer);

      if (response.status === 200) {
        return true;
      }
    } catch {
      // ignore
    }

    clearTimeout(timer);

    await new Promise((resolve) =>
      setTimeout(resolve, retryDelay)
    );
  }

  return false;
}