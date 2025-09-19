"use server";

import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { FormState, SigninFormSchema } from "../definitions";
import {
  clearAuthCookies,
  setAccessCookie,
  setRefreshCookie,
} from "@/shared/libs/session";
import { getRequestUrl } from "@/shared/libs/request-url";

export async function signin(state: FormState, formData: FormData) {
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const { url, headers: requestHeaders } = await getRequestUrl('/api/auth/login');


  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...requestHeaders,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      Sentry.addBreadcrumb({
        message: "Login request failed",
        category: "auth",
        level: "warning",
        data: {
          status: response.status,
          statusText: response.statusText,
        },
      });

      return {
        message:
          response.status >= 500
            ? "Server error. Please try again later."
            : "Authentication failed",
      };
    }

    const data = await response.json();

    if (data.message === "ok") {
      await setAccessCookie(data.accessToken);
      await setRefreshCookie(data.refreshToken);

      return redirect("/dashboard");
    }

    return {
      message: data.message || "Authentication failed",
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    Sentry.captureException(error, {
      tags: {
        component: "auth-actions",
        action: "signin",
      },
      extra: {
        apiUrl: url,
      },
    });

    return {
      message: "Network error. Please try again later.",
    };
  }
}

export async function logout() {
  const { url, headers: requestHeaders } = await getRequestUrl('/api/auth/logout');

  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: requestHeaders,
    });

    if (!response.ok) {
      Sentry.addBreadcrumb({
        message: "Logout request failed",
        category: "auth",
        level: "warning",
        data: {
          status: response.status,
          statusText: response.statusText,
        },
      });
    }

    await clearAuthCookies();

    redirect("/logout");
  } catch (error) {
    // Don't capture Next.js redirect as an error
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    Sentry.captureException(error, {
      tags: {
        component: "auth-actions",
        action: "logout",
      },
      extra: {
        apiUrl: url,
      },
    });
  }
}
