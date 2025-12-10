import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Debug log - SERVEUR
    console.log("\n========== LOGIN ATTEMPT ==========");
    console.log("Username reçu:", username || "MANQUANT");
    console.log("Password reçu:", password ? "***" : "MANQUANT");
    console.log("===================================\n");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Identifiants requis" },
        { status: 400 }
      );
    }

    const isValid = await authenticateAdmin(username, password);

    if (!isValid) {
      console.log("Authentication failed");
      return NextResponse.json(
        { error: "Identifiants invalides. Vérifiez votre identifiant et mot de passe." },
        { status: 401 }
      );
    }

    console.log("✅ Authentication successful");

    const token = generateToken("admin");
    console.log("Token generated, length:", token.length);

    // SIMPLE APPROACH: Manually set Set-Cookie header directly
    // This is the most reliable way to ensure the cookie is sent
    const secureFlag = process.env.NODE_ENV === "production" ? " Secure" : "";
    const setCookieValue = `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secureFlag}`;
    
    console.log("\n=== SETTING COOKIE (MANUAL) ===");
    console.log("Set-Cookie value preview:", setCookieValue.substring(0, 100) + "...");

    // Create response with Set-Cookie header in headers
    const response = NextResponse.json(
      { 
        success: true,
        message: "Connexion réussie"
      },
      {
        headers: {
          "Set-Cookie": setCookieValue,
        },
      }
    );
    
    // Also try setting via cookies API as backup
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Verify header is set
    const verifyHeader = response.headers.get("set-cookie");
    console.log("Set-Cookie header verification:", verifyHeader ? "PRESENT ✅" : "MISSING ❌");
    if (verifyHeader) {
      console.log("Set-Cookie contains admin_token:", verifyHeader.includes("admin_token") ? "YES ✅" : "NO ❌");
    }

    console.log("✅ Response created with cookie");
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

