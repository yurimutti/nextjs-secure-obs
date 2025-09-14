interface AuthFetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export async function authFetch(
  url: string,
  options: AuthFetchOptions = {}
): Promise<Response> {
  const defaultOptions: RequestInit = {
    credentials: "include" as const,
    headers: {
      "Content-Type": "application/json" as const,
      ...(options.headers as Record<string, string>),
    },
  };

  const mergedOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers as Record<string, string>),
    },
  };

  const response = await fetch(url, mergedOptions);

  if (response.status === 401) {
    const refreshed = await fetch("/api/auth/refresh", {
      method: "POST" as const,
      credentials: "include" as const,
    });

    if (refreshed.ok) {
      return fetch(url, mergedOptions);
    } else {
      window.location.href = "/login";
      return response;
    }
  }

  return response;
}