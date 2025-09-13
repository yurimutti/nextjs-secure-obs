import "server-only";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/shared/libs/session";

interface AuthFetchOptions extends RequestInit {
  baseUrl?: string;
}

const buildFullUrl = (url: string, baseUrl: string) =>
  url.startsWith("http") ? url : `${baseUrl}${url}`;

export async function authFetchServer(url: string, options: AuthFetchOptions = {}) {
  const {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ...fetchOptions
  } = options;

  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  const requestOptions = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      Cookie: sessionCookie
        ? `${sessionCookie.name}=${sessionCookie.value}`
        : "",
      ...fetchOptions.headers,
    },
  };

  const fullUrl = buildFullUrl(url, baseUrl);
  const response = await fetch(fullUrl, requestOptions);

  if (response.status === 401) {
    redirect("/login");
  }

  return response;
}