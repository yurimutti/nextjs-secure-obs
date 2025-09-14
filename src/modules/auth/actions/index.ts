"use server";

import { deleteSession } from "@/shared/libs/session";
import { redirect } from "next/navigation";
import { FormState, SigninFormSchema } from "../definitions";
import { env } from "@/config/env";

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

  const response = await fetch(
    `${env.API_BASE_URL}/api/auth/login`,
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
    const { createSession } = await import("@/shared/libs/session");
    await createSession(data.token);

    redirect("/dashboard");
  }

  return {
    message: data.message || "Authentication failed",
  };
}

export async function logout() {
  await deleteSession();
  redirect("/logout");
}
