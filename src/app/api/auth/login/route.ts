import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { SignJWT } from "jose";
import { env } from "@/config/env";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

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
        sub: "1234567890",
        email: email,
        iat: Math.floor(Date.now() / 1000),
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(JWT_SECRET);

      console.log("Generated JWT Token:", token);

      return NextResponse.json(
        {
          token,
          message: "Authentication successful",
        },
        { status: 200 }
      );
    }

    // Invalid credentials
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
