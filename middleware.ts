import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  // Protect admin routes except the login page to avoid redirect loops
  const isAdminProtected =
    pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isAdminProtected) {
    console.log("\n=== MIDDLEWARE: Checking admin access ===");
    console.log("Path:", pathname);
    console.log("Request URL:", request.url);
    console.log("All cookies:", request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 20)}...`));
    console.log("Token present:", token ? "YES" : "NO");
    if (token) {
      console.log("Token value preview:", token.substring(0, 30) + "...");
      console.log("Token full length:", token.length);
    } else {
      console.log("❌ No admin_token cookie found!");
      console.log("Available cookies:", request.cookies.getAll().map(c => c.name).join(", "));
    }

    if (!token) {
      console.log("❌ No token found, redirecting to login");
      console.log("========================================\n");
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // verifyToken is now async (Edge Runtime compatible)
    const decoded = await verifyToken(token);
    console.log("Token decoded:", decoded ? "YES" : "NO");
    if (decoded) {
      console.log("User ID:", decoded.userId);
    }
    
    if (!decoded) {
      console.log("❌ Invalid or expired token, redirecting to login");
      console.log("Token verification error details logged above");
      console.log("========================================\n");
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      // Delete invalid cookie
      response.cookies.delete("admin_token");
      return response;
    }
    
    console.log("✅ Access granted to:", pathname);
    console.log("========================================\n");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

