import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  getRefreshToken,
  decryptRefreshToken,
  encryptAccessToken,
  encryptRefreshToken,
  generateTokenId,
  setAccessCookie,
  setRefreshCookie,
} from "@/shared/libs/session";

export async function POST(request: NextRequest) {
  try {
    Sentry.addBreadcrumb({
      message: "Processing token refresh request",
      category: "auth",
      level: "info",
    });

    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      Sentry.addBreadcrumb({
        message: "No refresh token found in cookies",
        category: "auth",
        level: "warning",
      });
      return NextResponse.json(
        { message: "No refresh token found" },
        { status: 401 }
      );
    }

    const refreshPayload = await decryptRefreshToken(refreshToken);

    if (!refreshPayload || !refreshPayload.userId || !refreshPayload.jti) {
      Sentry.captureMessage("Invalid refresh token payload", {
        level: "warning",
        extra: {
          hasPayload: !!refreshPayload,
          hasUserId: !!(refreshPayload?.userId),
          hasJti: !!(refreshPayload?.jti),
          payloadKeys: refreshPayload ? Object.keys(refreshPayload) : [],
        },
      });
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const userId = refreshPayload.userId as string;
    const newJti = generateTokenId();

    Sentry.setUser({
      id: userId,
    });

    const newAccessToken = await encryptAccessToken(userId);
    const newRefreshToken = await encryptRefreshToken(userId, newJti);

    await setAccessCookie(newAccessToken);
    await setRefreshCookie(newRefreshToken);

    Sentry.addBreadcrumb({
      message: "Successfully refreshed tokens",
      category: "auth",
      level: "info",
      data: { userId },
    });

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        component: "api",
        route: "auth/refresh",
      },
      extra: {
        method: request.method,
        url: request.url,
        hasRefreshToken: !!(await getRefreshToken().catch(() => null)),
      },
    });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
