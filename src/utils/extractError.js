// Standardized helper to unwrap axios errors into a string
export function extractError(err, fallback = "Request failed") {
  return (
    err.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    fallback
  );
}
