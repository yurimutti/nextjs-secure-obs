import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Mock authentication logic
    if (email === "teste@email.com" && password === "123456") {
      // Mock JWT token
      const mockJWT =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ0ZXN0ZUBlbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.mock-signature";

      return NextResponse.json(
        {
          token: mockJWT,
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
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
