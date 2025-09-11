"use server";

import { deleteSession } from "@/shared/libs/session";
import { redirect } from "next/navigation";
import { FormState, SigninFormSchema } from "../definitions";

export async function signin(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Call the auth API to authenticate user
  const { email, password } = validatedFields.data;

  // TODO: improve this setup to avoid hardcoding the base URL
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await response.json();

  if (response.ok && data.token) {
    // Create session with the JWT token from API
    const { createSession } = await import("@/shared/libs/session");
    await createSession(data.token);

    // Redirect to dashboard
    const { redirect } = await import("next/navigation");
    redirect("/dashboard");
  } else {
    return {
      message: data.message || "Authentication failed",
    };
  }

  return {
    message: "Network error. Please try again.",
  };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
