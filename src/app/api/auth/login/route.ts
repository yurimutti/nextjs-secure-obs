import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import {
  encryptAccessToken,
  encryptRefreshToken,
  generateTokenId,
} from "@/shared/libs/session";

export async function POST(request: NextRequest) {
  try {
    // Add request context to Sentry
    Sentry.setContext("api_request", {
      url: request.url,
      method: request.method,
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    });

    Sentry.addBreadcrumb({
      message: "Processing login request",
      category: "auth",
      level: "info",
    });

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      Sentry.captureMessage("Invalid JSON in login request", {
        level: "warning",
        extra: { parseError: parseError instanceof Error ? parseError.message : String(parseError) },
      });
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      Sentry.addBreadcrumb({
        message: "Login attempt with missing credentials",
        category: "auth",
        level: "warning",
        data: { hasEmail: !!email, hasPassword: !!password },
      });
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

      Sentry.setUser({
        id: userId,
        email: email,
      });

      Sentry.addBreadcrumb({
        message: "Successful login",
        category: "auth",
        level: "info",
        data: { userId, email },
      });

      return NextResponse.json(
        {
          accessToken,
          refreshToken,
          message: "ok",
        },
        { status: 200 }
      );
    }

    Sentry.addBreadcrumb({
      message: "Failed login attempt",
      category: "auth",
      level: "warning",
      data: { email, reason: "invalid_credentials" },
    });

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
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
