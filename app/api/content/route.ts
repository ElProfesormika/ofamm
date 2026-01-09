import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/data";
import { getAdminUser } from "@/lib/auth-helpers";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedContent = await request.json();
    console.log("API /api/content PUT - Saving content...");
    console.log("USE_DATABASE:", process.env.USE_DATABASE);
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Configurée" : "Non configurée");
    
    await saveContent(updatedContent);
    console.log("API /api/content PUT - Content saved successfully");
    
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("API /api/content PUT - Error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { 
        error: "Failed to update content",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

