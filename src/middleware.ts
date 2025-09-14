import { NextRequest, NextResponse } from "next/server";
import { decryptAccessToken } from "@/shared/libs/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/logout", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;

  const payload = await decryptAccessToken(accessToken);

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !payload?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect authenticated users away from login page to dashboard
  if (isPublicRoute && payload?.userId && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
