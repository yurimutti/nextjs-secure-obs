interface AuthFetchOptions extends RequestInit {
  baseUrl?: string;
}

const buildFullUrl = (url: string, baseUrl: string) =>
  url.startsWith("http") ? url : `${baseUrl}${url}`;

export async function authFetch(url: string, options: AuthFetchOptions = {}) {
  const {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ...fetchOptions
  } = options;

  const requestOptions = {
    credentials: "include" as const,
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  };

  const fullUrl = buildFullUrl(url, baseUrl);
  const response = await fetch(fullUrl, requestOptions);

  // Handle token refresh if needed
  if (response.status === 401) {
    const refreshed = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshed.ok) {
      return fetch(fullUrl, requestOptions);
    } else {
      window.location.href = "/login";
      return response;
    }
  }

  return response;
}
