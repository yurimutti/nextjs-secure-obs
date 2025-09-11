"use server";

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

  // Call the provider or db to authenticate user...
  // For now, mock authentication
  const { email, password } = validatedFields.data;

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

  // Mock authentication logic
  if (response.ok) {
    const { redirect } = await import("next/navigation");
    redirect("/dashboard");
    return;
  } else {
    return {
      message: "Authentication failed",
    };
  }
}
