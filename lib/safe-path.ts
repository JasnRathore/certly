/** Keep post-login redirects on this app. Reject protocol-relative and absolute URLs. */
export function safeNextPath(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("\0")) {
    return fallback;
  }

  try {
    const url = new URL(value, "http://local");
    if (url.origin !== "http://local") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
