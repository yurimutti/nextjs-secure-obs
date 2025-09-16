import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  encryptAccessToken,
  encryptRefreshToken,
  generateTokenId,
} from "@/shared/libs/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (email === "teste@email.com" && password === "123456") {
      const userId = "user-123";
      const jti = generateTokenId();

      const accessToken = await encryptAccessToken(userId);
      const refreshToken = await encryptRefreshToken(userId, jti);

      return NextResponse.json(
        {
          accessToken,
          refreshToken,
          message: "ok",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        component: "api",
        route: "auth/login",
      },
      extra: {
        method: request.method,
        url: request.url,
      },
    });

    Sentry.addBreadcrumb({
      message: "Login error",
      category: "auth",
      level: "error",
      data: {
        error: (error as Error).message,
      },
    });

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
