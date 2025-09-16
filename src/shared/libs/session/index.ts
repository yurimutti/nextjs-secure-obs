import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import * as Sentry from "@sentry/nextjs";
import { SESSION_KEY } from "@/config/env";

import {
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/shared/constants";

import type { TokenPayload } from "@/shared/types";

if (!SESSION_KEY || SESSION_KEY.length < 32) {
  Sentry.captureException(new Error("Invalid SESSION_KEY"));
  throw new Error("SESSION_KEY must be at least 256 bits (32 bytes) long");
}

export function generateTokenId(): string {
  return crypto.randomUUID();
}

export async function encryptAccessToken(userId: string): Promise<string> {
  const payload = { userId };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_DURATION)
    .sign(SESSION_KEY);
}

export async function encryptRefreshToken(
  userId: string,
  jti: string
): Promise<string> {
  return new SignJWT({ userId, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_DURATION)
    .sign(SESSION_KEY);
}

export async function decryptAccessToken(
  token: string | undefined
): Promise<TokenPayload | undefined> {
  if (!token) return undefined;

  try {
    const { payload } = await jwtVerify<TokenPayload>(token, SESSION_KEY, {
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
): Promise<TokenPayload | undefined> {
  if (!token) return undefined;

  try {
    const { payload } = await jwtVerify<TokenPayload>(token, SESSION_KEY, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    Sentry.captureException(error);
    return undefined;
  }
}

export async function setAccessCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  const payload = await decryptAccessToken(token);
  const expiresAt = payload?.exp ? new Date(payload.exp * 1000) : undefined;

  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
    maxAge: 15 * 60,
  });
}

export async function setRefreshCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  const payload = await decryptRefreshToken(token);
  const expiresAt = payload?.exp ? new Date(payload.exp * 1000) : undefined;

  cookieStore.set(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth/refresh",
    expires: expiresAt,
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
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
