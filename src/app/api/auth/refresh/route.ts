import { NextResponse } from "next/server";
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

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token found" },
        { status: 401 }
      );
    }

    const refreshPayload = await decryptRefreshToken(refreshToken);

    if (!refreshPayload || !refreshPayload.userId || !refreshPayload.jti) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const userId = refreshPayload.userId as string;
    const newJti = generateTokenId();

    const newAccessToken = await encryptAccessToken(userId);
    const newRefreshToken = await encryptRefreshToken(userId, newJti);

    await setAccessCookie(newAccessToken);
    await setRefreshCookie(newRefreshToken);

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
