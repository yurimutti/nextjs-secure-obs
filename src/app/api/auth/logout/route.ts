import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { clearAuthCookies } from "@/shared/libs/session";

export async function POST() {
  try {
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