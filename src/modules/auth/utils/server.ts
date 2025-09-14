import "server-only";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/shared/libs/session";
import { env } from "@/config/env";

interface AuthFetchOptions extends RequestInit {
  baseUrl?: string;
}

const buildFullUrl = (url: string, baseUrl: string) =>
  url.startsWith("http") ? url : `${baseUrl}${url}`;

export async function authFetchServer(url: string, options: AuthFetchOptions = {}) {
  const {
    baseUrl = env.API_BASE_URL,
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