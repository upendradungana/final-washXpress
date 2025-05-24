import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect providers from home page to control center
    if (path === "/" && token?.role === "PROVIDER") {
      return NextResponse.redirect(new URL("/control-center", req.url));
    }

    // Redirect from dashboard if not authenticated
    if (path.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect providers from dashboard to control center
    if (path.startsWith("/dashboard") && token?.role === "PROVIDER") {
      return NextResponse.redirect(new URL("/control-center", req.url));
    }

    // Redirect from control-center if not a service provider or admin
    if (path.startsWith("/control-center") && token?.role !== "PROVIDER" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Prevent providers from accessing certain sections
    if (token?.role === "PROVIDER") {
      const restrictedPaths = ["/services", "/locations", "/testimonials"];
      if (restrictedPaths.some(p => path.startsWith(p))) {
        return NextResponse.redirect(new URL("/control-center", req.url));
      }
    }

    // Protect provider-contact route
    if (path === "/provider-contact" && token?.role !== "PROVIDER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/control-center/:path*",
    "/booking/:path*",
    "/provider-contact",
    "/services/:path*",
    "/locations/:path*",
    "/testimonials/:path*"
  ],
};