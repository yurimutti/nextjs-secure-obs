import "server-only";
import { cookies } from "next/headers";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import * as Sentry from "@sentry/nextjs";
import { SESSION_KEY } from "@/config/env";
import { randomUUID } from "crypto";

if (!SESSION_KEY || SESSION_KEY.length < 32) {
  throw new Error("SESSION_KEY must be at least 256 bits (32 bytes) long");
}

const blacklistedJTIs = new Set<string>();

export function blacklistJTI(jti: string): void {
  blacklistedJTIs.add(jti);
}

export function isJTIBlacklisted(jti: string): boolean {
  return blacklistedJTIs.has(jti);
}

export function generateTokenId(): string {
  return randomUUID();
}

export async function encryptAccessToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(SESSION_KEY);
}

export async function encryptRefreshToken(
  userId: string,
  jti: string
): Promise<string> {
  return new SignJWT({ userId, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SESSION_KEY);
}

export async function decryptAccessToken(
  token: string | undefined
): Promise<JWTPayload | undefined> {
  if (!token) return undefined;

  try {
    const { payload } = await jwtVerify(token, SESSION_KEY, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    Sentry.captureException(error);
    return undefined;
  }
}

export async function decryptRefreshToken(
  token: string | undefined
): Promise<JWTPayload | undefined> {
  if (!token) return undefined;

  try {
    const { payload } = await jwtVerify(token, SESSION_KEY, {
      algorithms: ["HS256"],
    });


    if (payload.jti && isJTIBlacklisted(payload.jti as string)) {
      return undefined;
    }

    return payload;
  } catch (error) {
    Sentry.captureException(error);
    return undefined;
  }
}

export async function setAccessCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("access-token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });
}

export async function setRefreshCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("refresh-token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("access-token");
  cookieStore.delete("refresh-token");
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access-token")?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh-token")?.value;
}

export async function refreshTokensServerSide(): Promise<boolean> {
  try {
    const { serverAuthFetch } = await import(
      "@/modules/auth/utils/server-auth-fetch"
    );
    const response = await serverAuthFetch("/api/auth/refresh", {
      method: "POST",
    });
    return response.ok;
  } catch (error) {
    Sentry.captureException(error);
    return false;
  }
}
