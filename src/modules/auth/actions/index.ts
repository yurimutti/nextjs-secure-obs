"use server";

import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { FormState, SigninFormSchema } from "../definitions";
import { env } from "@/config/env";
import {
  clearAuthCookies,
  setAccessCookie,
  setRefreshCookie,
} from "@/shared/libs/session";

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

  const response = await fetch(`${env.API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.message === "ok") {
    await setAccessCookie(data.accessToken);
    await setRefreshCookie(data.refreshToken);

    redirect("/dashboard");
  }

  return {
    message: data.message || "Authentication failed",
  };
}

export async function logout() {
  // Call logout API to blacklist refresh token
  try {
    await fetch(`${env.API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Logout API call failed:", error);
  }

  await clearAuthCookies();
  redirect("/logout");
}
