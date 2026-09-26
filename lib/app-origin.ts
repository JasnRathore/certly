import { headers } from "next/headers";

function configuredOrigin(): string | null {
  const raw = process.env.AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export async function getAppOrigin(): Promise<string> {
  const configured = configuredOrigin();
  if (configured) return configured;

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "";
  const forwardedProto = headerList.get("x-forwarded-proto");
  const proto = forwardedProto === "https" ? "https" : "http";

  if (/^[a-zA-Z0-9.-]+(:\d+)?$/.test(host)) {
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}
