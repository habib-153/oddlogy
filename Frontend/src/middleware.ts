// export { default } from "next-auth/middleware";

// export const config = { matcher: ["/dashboard"] };

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCurrentUser } from "./utils/cookies";

const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Try to get user from both sources
  const nextAuthToken = await getToken({ req: request });
  const jwtUser = await getCurrentUser();

  // Combine both authentication methods
  const user = nextAuthToken
    ? {
        id: nextAuthToken.sub,
        email: nextAuthToken.email,
        role: nextAuthToken.role || "USER",
      }
    : jwtUser;

    console.log(user)
  // Allow public routes
  if (authRoutes.includes(pathname)) {
    if (user) {
      return NextResponse.redirect(
        new URL(
          user.role === "ADMIN" ? "/admin" : "/user",
          request.url
        )
      );
    }
    return NextResponse.next();
  }

  // Check for authenticated routes
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Handle role-based access
  if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/user", request.url));
  }

  if (pathname.startsWith("/user") && user.role !== "USER") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/user/:path*", "/admin/:path*"],
};