import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const protectedRoutes = [
  { path: "/admin", role: "ADMIN" },
  { path: "/seller", role: "SELLER" },
  { path: "/buyer", role: "BUYER" },
]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const route = protectedRoutes.find(({ path }) => pathname.startsWith(path))

  if (!route) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token || token.role !== route.role) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/seller/:path*", "/buyer/:path*"],
}
