import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCurrentUser } from "./utils/cookies";

const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Try to get user from both sources
  const nextAuthToken = await getToken({ req: request });
  
  // Get user from JWT cookie
  let jwtUser = null;
  try {
    jwtUser = await getCurrentUser();
  } catch (error) {
    console.error("Error getting current user from cookie:", error);
  }

  // Combine both authentication methods
  const user = nextAuthToken
    ? {
        id: nextAuthToken.sub,
        email: nextAuthToken.email,
        role: (nextAuthToken.role as string || "user").toLowerCase(),
      }
    : jwtUser
      ? {
          ...jwtUser,
          role: (jwtUser.role || "user").toLowerCase()
        }
      : null;

  // Allow public routes
  if (authRoutes.includes(pathname)) {
    if (user) {
      return NextResponse.redirect(
        new URL(
          user.role === "admin" ? "/admin" : "/user",
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
  if (pathname.startsWith("/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/user", request.url));
  }

  if (pathname.startsWith("/user") && user.role !== "user") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/user/:path*", "/admin/:path*"],
};