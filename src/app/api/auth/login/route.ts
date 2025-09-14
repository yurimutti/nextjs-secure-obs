import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { SignJWT } from "jose";
import { JWT_KEY } from "@/config/env";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (email === "teste@email.com" && password === "123456") {
      const token = await new SignJWT({
        iat: Math.floor(Date.now() / 1000),
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_KEY);

      return NextResponse.json(
        {
          token,
          message: "Authentication successful",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
