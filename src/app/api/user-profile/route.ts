import { verifySession } from "@/shared/libs/dal";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      name: "Usuário Teste",
      email: "teste@email.com",
      memberSince: "2023-01-15",
    });
  } catch (error) {
    Sentry.captureException(error);
  }
}
