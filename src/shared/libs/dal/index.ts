import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { decrypt } from "@/shared/libs/session";

export const verifySession = cache(async () => {
  console.log('🔍 Verifying session...');

  const cookie = (await cookies()).get("session")?.value;
  console.log('Session cookie exists:', !!cookie);

  const session = await decrypt(cookie);
  console.log('Decrypted session:', session);

  if (!session?.token) {
    console.log('❌ No valid session token found');
    redirect("/login");
  }

  console.log('✅ Session verified successfully');
  // TODO: validate token with backend API
  return { isAuth: true };
});
