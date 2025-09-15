import { NextRequest, NextResponse } from "next/server";
import { ensureSession } from "@/shared/libs/dal";
import * as Sentry from "@sentry/nextjs";

type Activity = {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  status: "success" | "warning" | "error";
  user?: string;
};

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

  return Array.from({ length: 20 }, (_, i) => ({
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
    await ensureSession();

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
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Failed to fetch recent activities" },
      { status: 500 }
    );
  }
}
