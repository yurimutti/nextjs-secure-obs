import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

class SentryExampleBackendError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SentryExampleBackendError";
  }
}

export async function GET() {
  try {
    const span = Sentry.startInactiveSpan({
      name: "Sentry Example Backend Span",
      op: "test",
    });

    span.end();

    // Throw an error to test Sentry
    throw new SentryExampleBackendError(
      "This error is raised on the backend of the sentry-example-api route."
    );
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Backend error for Sentry testing" },
      { status: 500 }
    );
  }
}
