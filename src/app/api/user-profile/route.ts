import { ensureSession } from "@/shared/libs/dal";
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

// Local constant for error simulation
const ERROR_SIMULATION_THRESHOLD = 0.7; // 30% chance of error

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

    // Simulate server error to demonstrate Sentry error capture
    const shouldError = Math.random() > ERROR_SIMULATION_THRESHOLD;
    if (shouldError) {
      const simulatedError = new Error("Simulated server error - Failed to fetch user profile");

      Sentry.captureException(simulatedError, {
        tags: {
          component: "api",
          route: "user-profile",
          error_type: "simulated",
        },
        extra: {
          userId: session.userId,
          simulationThreshold: ERROR_SIMULATION_THRESHOLD,
          wasTriggered: true,
        },
      });

      throw simulatedError;
    }

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
