import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

// Define protected routes
const protectedRoutes = ["/dashboard", "/profile", "/ride", "/alerts", "/blockchain"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get("Authorization")
    let token = null

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    } else {
      // Fallback to cookie if no Authorization header
      token = request.cookies.get("trust-ride-token")?.value
    }

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    try {
      // Verify the token
      const payload = await verifyToken(token)
      if (!payload) {
        // Redirect to login if token is invalid
        return NextResponse.redirect(new URL("/auth/login", request.url))
      }

      // Add user info to headers for use in API routes
      const response = NextResponse.next()
      response.headers.set("x-user-id", payload.userId.toString())
      response.headers.set("x-user-email", payload.email)
      return response
    } catch (error) {
      // Redirect to login if token verification fails
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
