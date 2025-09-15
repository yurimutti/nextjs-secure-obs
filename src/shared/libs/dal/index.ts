import "server-only";
import { cache } from "react";

import {
  getAccessToken,
  getRefreshToken,
  decryptAccessToken,
  decryptRefreshToken,
  encryptAccessToken,
  encryptRefreshToken,
  generateTokenId,
  setAccessCookie,
  setRefreshCookie,
} from "@/shared/libs/session";

import * as Sentry from "@sentry/nextjs";
import { serverAuthFetch } from "@/modules/auth";
import { redirect } from "next/navigation";
import type { UserProfile, SessionData } from "@/shared/types";

export async function getValidAccessToken(): Promise<string | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const accessPayload = await decryptAccessToken(accessToken);
    if (accessPayload?.userId) {
      return accessToken;
    }

    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const refreshPayload = await decryptRefreshToken(refreshToken);

    const userId = refreshPayload?.userId;
    const newJti = generateTokenId();
    const newAccessToken = await encryptAccessToken(userId || "");
    const newRefreshToken = await encryptRefreshToken(userId || "", newJti);

    await setAccessCookie(newAccessToken);
    await setRefreshCookie(newRefreshToken);

    return newAccessToken;
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

export const verifySession = cache(async (): Promise<SessionData | null> => {
  try {
    const validToken = await getValidAccessToken();
    if (!validToken) return null;

    const payload = await decryptAccessToken(validToken);
    if (!payload?.userId) return null;

    return {
      isAuth: true,
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
});

export async function ensureSession(): Promise<SessionData> {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const session = await ensureSession();
  if (!session) return null;

  try {
    const response = await serverAuthFetch("/api/user-profile");

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      name: data.name || null,
      email: data.email || null,
      memberSince: data.memberSince || null,
    };
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
};
