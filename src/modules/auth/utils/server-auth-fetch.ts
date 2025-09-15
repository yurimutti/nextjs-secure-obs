import "server-only";
import { headers, cookies } from "next/headers";

interface ServerAuthFetchOptions extends RequestInit {
  baseOrigin?: string;
}

export async function serverAuthFetch(
  input: string,
  init?: ServerAuthFetchOptions
): Promise<Response> {
  const headersList = await headers();
  const cookieStore = await cookies();

  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "localhost:3000";
  const origin = init?.baseOrigin || `${protocol}://${host}`;

  const url = input.startsWith("http") ? input : `${origin}${input}`;

  const cookieHeader = cookieStore
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const mergedHeaders = new Headers(init?.headers);
  if (!mergedHeaders.has("Cookie") && cookieHeader) {
    mergedHeaders.set("Cookie", cookieHeader);
  }

  const requestInit: RequestInit = {
    cache: "no-store",
    ...init,
    headers: mergedHeaders,
  };

  const response = await fetch(url, requestInit);

  if (response.status === 401) {
    const refreshResponse = await fetch(`${origin}/api/auth/refresh`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
    });

    if (refreshResponse.ok) {
      const updatedCookieStore = await cookies();
      const newCookieHeader = updatedCookieStore
        .getAll()
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const retryHeaders = new Headers(mergedHeaders);
      retryHeaders.set("Cookie", newCookieHeader);

      const retryResponse = await fetch(url, {
        ...requestInit,
        headers: retryHeaders,
      });

      if (retryResponse.status === 401) {
        throw new Error("Authentication failed after refresh");
      }

      return retryResponse;
    } else {
      throw new Error("Refresh token invalid");
    }
  }

  return response;
}