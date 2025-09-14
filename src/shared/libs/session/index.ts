import "server-only";
import { cookies } from "next/headers";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import * as Sentry from "@sentry/nextjs";
import { SessionPayload } from "@/modules/auth/definitions";
import { SESSION_KEY } from "@/config/env";

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SESSION_KEY);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, SESSION_KEY, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    Sentry.captureException(error);
  }
}

export async function createSession(token: string): Promise<void> {
  const session = await encrypt({ token });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function getSession(): Promise<JWTPayload | undefined> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return;

  return await decrypt(session);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
