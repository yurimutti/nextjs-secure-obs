import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { SignJWT, jwtVerify } from "jose";
import { JWT_KEY } from "@/config/env";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session");

    if (!sessionCookie) {
      return NextResponse.json(
        { message: "No session found" },
        { status: 401 }
      );
    }

    const { getSession } = await import("@/shared/libs/session");
    const sessionPayload = await getSession();

    if (!sessionPayload || !sessionPayload.token) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    try {
      await jwtVerify(sessionPayload.token as string, JWT_KEY, {
        algorithms: ["HS256"],
      });
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      iat: Math.floor(Date.now() / 1000),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_KEY);

    const { createSession } = await import("@/shared/libs/session");
    await createSession(token);

    return NextResponse.json(
      {
        token,
        message: "Token refreshed successfully",
      },
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
