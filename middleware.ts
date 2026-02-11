import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for access_token in cookies
  const accessToken = request.cookies.get("access_token")?.value

  // Also check Authorization header (for API calls)
  const authHeader = request.headers.get("Authorization")

  const isAuthenticated = !!accessToken || !!authHeader

  if (!isAuthenticated) {
    const loginUrl = new URL("/login/student", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/student/:path*"],
}
