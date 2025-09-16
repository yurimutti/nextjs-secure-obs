import { NextRequest, NextResponse } from "next/server";
import { ensureSession } from "@/shared/libs/dal";
import * as Sentry from "@sentry/nextjs";
import type { Activity } from "./types";

const MOCK_ACTIVITIES_COUNT = 20;
const ERROR_SIMULATION_THRESHOLD = 0.8; // 20% chance of error

const generateMockActivities = (): Activity[] => {
  const actions = [
    "Fez login",
    "Atualizou perfil",
    "Alterou senha",
    "Fez upload de arquivo",
    "Exportou dados",
    "Modificou configurações",
    "Renovou sessão",
    "Verificou conta",
  ];

  const statuses: ("success" | "warning" | "error")[] = [
    "success",
    "warning",
    "error",
  ];

  return Array.from({ length: MOCK_ACTIVITIES_COUNT }, (_, i) => ({
    id: `${i + 1}`,
    action: actions[Math.floor(Math.random() * actions.length)],
    timestamp: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    details: `Ação executada com sucesso - ID ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    user: `user-${Math.floor(Math.random() * 5) + 1}`,
  })).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export async function GET(request: NextRequest) {
  try {
    const session = await ensureSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    Sentry.setUser({
      id: session.userId,
    });

    const shouldError = Math.random() > ERROR_SIMULATION_THRESHOLD;
    if (shouldError) {
      const simulatedError = new Error(
        "Simulated database timeout error for testing purposes"
      );
      simulatedError.name = "DatabaseTimeoutError";

      Sentry.captureException(simulatedError, {
        tags: {
          component: "api",
          route: "recent-activities",
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const activities = generateMockActivities();
    const paginatedActivities = activities.slice(offset, offset + limit);

    return NextResponse.json({
      activities: paginatedActivities,
      total: activities.length,
      hasMore: offset + limit < activities.length,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        component: "api",
        route: "recent-activities",
      },
      extra: {
        method: request.method,
        url: request.url,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
