import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    // Parse the authorized emails from your .env
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const userEmail = req.nextauth.token?.email || "";

    // If they aren't on the list, kick them to the homepage
    if (!adminEmails.includes(userEmail)) {
      return NextResponse.redirect(new URL("/", req.url)); 
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Requires them to be logged in first
    },
  }
);

// This ensures the middleware ONLY runs on admin routes
export const config = { matcher: ["/admin/:path*"] };
