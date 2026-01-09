import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/data";
import { getAdminUser } from "@/lib/auth-helpers";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      console.error("API /api/content PUT - Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let updatedContent;
    try {
      updatedContent = await request.json();
    } catch (jsonError) {
      console.error("API /api/content PUT - Error parsing request JSON:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    console.log("API /api/content PUT - Saving content...");
    console.log("USE_DATABASE:", process.env.USE_DATABASE);
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Configurée" : "Non configurée");
    console.log("Content keys:", Object.keys(updatedContent));
    console.log("Distinctions count:", updatedContent.distinctions?.length || 0);
    
    await saveContent(updatedContent);
    console.log("API /api/content PUT - Content saved successfully");
    
    return NextResponse.json(updatedContent, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API /api/content PUT - Error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // S'assurer de toujours retourner du JSON valide
    return NextResponse.json(
      { 
        error: "Failed to update content",
        details: error instanceof Error ? error.message : String(error)
      },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

