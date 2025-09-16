import * as Sentry from "@sentry/nextjs";

interface AuthFetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export async function authFetch(
  url: string,
  options: AuthFetchOptions = {}
): Promise<Response> {
  try {
    Sentry.addBreadcrumb({
      message: "Making authenticated client request",
      category: "http",
      level: "info",
      data: { url, method: options.method || "GET" },
    });

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
      Sentry.addBreadcrumb({
        message: "Received 401, attempting client-side token refresh",
        category: "auth",
        level: "info",
        data: { originalUrl: url },
      });

      const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST" as const,
        credentials: "include" as const,
      });

      if (refreshResponse.ok) {
        Sentry.addBreadcrumb({
          message: "Client token refresh successful, retrying request",
          category: "auth",
          level: "info",
          data: { url },
        });

        const retryResponse = await fetch(url, mergedOptions);

        if (retryResponse.status === 401) {
          Sentry.captureMessage(
            "Request still unauthorized after token refresh",
            {
              level: "warning",
              extra: {
                url,
                method: options.method || "GET",
              },
            }
          );

          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return retryResponse;
        }

        return retryResponse;
      } else {
        Sentry.captureMessage(
          "Client token refresh failed, redirecting to login",
          {
            level: "warning",
            extra: {
              refreshStatus: refreshResponse.status,
              refreshStatusText: refreshResponse.statusText,
              originalUrl: url,
            },
          }
        );

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return response;
      }
    }

    if (!response.ok) {
      Sentry.addBreadcrumb({
        message: "Client HTTP request failed",
        category: "http",
        level: "warning",
        data: {
          url,
          method: options.method || "GET",
          status: response.status,
          statusText: response.statusText,
        },
      });
    }

    return response;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        component: "auth-fetch",
        function: "authFetch",
        environment: "client",
      },
      extra: {
        url,
        method: options.method || "GET",
      },
    });
    throw error;
  }
}
