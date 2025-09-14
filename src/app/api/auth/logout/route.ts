import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  getRefreshToken,
  decryptRefreshToken,
  blacklistJTI,
  clearAuthCookies,
} from "@/shared/libs/session";

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      const refreshPayload = await decryptRefreshToken(refreshToken);

      // Blacklist the refresh token's JTI to prevent reuse
      if (refreshPayload?.jti) {
        blacklistJTI(refreshPayload.jti as string);
      }
    }

    // Clear all authentication cookies
    await clearAuthCookies();

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}