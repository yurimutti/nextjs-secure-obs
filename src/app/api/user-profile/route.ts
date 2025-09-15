import { ensureSession } from "@/shared/libs/dal";
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(request: NextRequest) {
  try {
    Sentry.addBreadcrumb({
      message: "Processing user profile request",
      category: "api",
      level: "info",
    });

    const session = await ensureSession();

    if (!session) {
      Sentry.addBreadcrumb({
        message: "User profile request without valid session",
        category: "api",
        level: "warning",
      });
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    Sentry.setUser({
      id: session.userId,
      email: session.email,
    });

    Sentry.addBreadcrumb({
      message: "Successfully retrieved user profile",
      category: "api",
      level: "info",
      data: { userId: session.userId },
    });

    return NextResponse.json({
      name: "Usuário Teste",
      email: "teste@email.com",
      memberSince: "2023-01-15",
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        component: "api",
        route: "user-profile",
      },
      extra: {
        method: request.method,
        url: request.url,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
