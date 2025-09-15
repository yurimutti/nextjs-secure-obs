import { verifySession } from "@/shared/libs/dal";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Simulate server error to demonstrate Sentry error capture
    const shouldError = Math.random() > 0.7; // 30% chance of error
    if (shouldError) {
      throw new Error("Simulated server error - Failed to fetch user profile");
    }

    return NextResponse.json({
      name: "Usuário Teste",
      email: "teste@email.com",
      memberSince: "2023-01-15",
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
