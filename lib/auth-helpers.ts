import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export async function getAdminUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    console.log("=== SERVER: getAdminUser called ===");
    console.log("Token present:", token ? "YES" : "NO");
    console.log("Token value:", token ? token.substring(0, 20) + "..." : "none");

    if (!token) {
      console.log("No token found, returning null");
      return null;
    }

    const decoded = await verifyToken(token);
    console.log("Token decoded:", decoded ? "YES" : "NO");
    console.log("================================");
    
    return decoded ? { id: decoded.userId } : null;
  } catch (error) {
    console.error("Error in getAdminUser:", error);
    return null;
  }
}

