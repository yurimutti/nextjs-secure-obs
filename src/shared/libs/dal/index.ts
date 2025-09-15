import "server-only";
import { cache } from "react";
import { getAccessToken, decryptAccessToken } from "@/shared/libs/session";
import * as Sentry from "@sentry/nextjs";
import { serverAuthFetch } from "@/modules/auth";

interface UserProfile {
  name: string | null;
  email: string | null;
  memberSince: string | null;
}

export const verifySession = cache(async () => {
  const accessToken = await getAccessToken();
  const payload = await decryptAccessToken(accessToken);

  if (payload?.userId) {
    return { isAuth: true, userId: payload.userId };
  }
});

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const session = await verifySession();
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
