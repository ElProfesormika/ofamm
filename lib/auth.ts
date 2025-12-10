import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "OFAMM2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "obe@_001"; // Change this in production

// Convert secret to Uint8Array for jose (compatible with Edge Runtime)
function getSecretKey(): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(JWT_SECRET);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate token using jsonwebtoken (for API routes - Node.js runtime)
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

// Verify token - Edge Runtime compatible version (for middleware)
export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    if (!token) {
      console.log("verifyToken: No token provided");
      return null;
    }
    
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    
    if (payload.userId && typeof payload.userId === "string") {
      console.log("verifyToken: Token verified successfully, userId:", payload.userId);
      return { userId: payload.userId };
    }
    
    console.error("verifyToken: Token payload missing userId");
    return null;
  } catch (error: any) {
    console.error("verifyToken: Verification failed:", error.message);
    return null;
  }
}

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<boolean> {
  // Trim whitespace and compare
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();
  
  console.log("\n=== AUTHENTICATION DEBUG ===");
  console.log("Provided username:", JSON.stringify(trimmedUsername));
  console.log("Expected username:", JSON.stringify(ADMIN_USERNAME));
  console.log("Username match:", trimmedUsername === ADMIN_USERNAME);
  console.log("Provided password:", trimmedPassword ? "***" : "EMPTY");
  console.log("Expected password:", ADMIN_PASSWORD ? "***" : "EMPTY");
  console.log("Password length match:", trimmedPassword.length === ADMIN_PASSWORD.length);
  console.log("Password match:", trimmedPassword === ADMIN_PASSWORD);
  
  const usernameMatch = trimmedUsername === ADMIN_USERNAME;
  const passwordMatch = trimmedPassword === ADMIN_PASSWORD;
  const isValid = usernameMatch && passwordMatch;
  
  console.log("Username valid:", usernameMatch);
  console.log("Password valid:", passwordMatch);
  console.log("Final result:", isValid ? "✅ AUTHENTICATED" : "❌ REJECTED");
  console.log("===========================\n");
  
  return isValid;
}

