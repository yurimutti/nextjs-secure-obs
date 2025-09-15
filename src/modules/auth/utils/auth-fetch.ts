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
    const refreshResponse = await fetch("/api/auth/refresh", {
      method: "POST" as const,
      credentials: "include" as const,
    });

    if (refreshResponse.ok) {
      const retryResponse = await fetch(url, mergedOptions);

      if (retryResponse.status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return retryResponse;
      }

      return retryResponse;
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return response;
    }
  }

  return response;
}
