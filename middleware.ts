import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;

    // Restrict access to /api/admin/*
    if (req.nextUrl.pathname.startsWith("/api/dashboard")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.rewrite(new URL("/api/auth/unauthorized", req.url));
      }
    }

    // Restrict access to /dashboard/* only for ADMINs
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/forbidden", req.url)); // or /auth/signin
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*",'/bookings','/contact'],
};
