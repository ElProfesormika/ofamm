import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/data";
import { getAdminUser } from "@/lib/auth-helpers";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

// Handler OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Support à la fois PUT et POST pour compatibilité
export async function PUT(request: NextRequest) {
  return handleSaveRequest(request);
}

export async function POST(request: NextRequest) {
  return handleSaveRequest(request);
}

async function handleSaveRequest(request: NextRequest) {
  const method = request.method;
  console.log(`API /api/content ${method} - Request received`);
  
  try {
    const admin = await getAdminUser();
    if (!admin) {
      console.error(`API /api/content ${method} - Unauthorized`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let updatedContent;
    try {
      updatedContent = await request.json();
    } catch (jsonError) {
      console.error(`API /api/content ${method} - Error parsing request JSON:`, jsonError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    console.log(`API /api/content ${method} - Saving content...`);
    console.log("USE_DATABASE:", process.env.USE_DATABASE);
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Configurée" : "Non configurée");
    console.log("Content keys:", Object.keys(updatedContent));
    console.log("Distinctions count:", updatedContent.distinctions?.length || 0);
    
    await saveContent(updatedContent);
    console.log(`API /api/content ${method} - Content saved successfully`);
    
    return NextResponse.json(updatedContent, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
      },
    });
  } catch (error) {
    console.error(`API /api/content ${method} - Error:`, error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // S'assurer de toujours retourner du JSON valide avec détails
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error instanceof Error ? {
      message: errorMessage,
      name: error.name,
      code: (error as any)?.code,
      constraint: (error as any)?.constraint,
      detail: (error as any)?.detail,
    } : { message: errorMessage };
    
    console.error(`API /api/content ${method} - Full error object:`, errorDetails);
    
    return NextResponse.json(
      { 
        error: "Failed to update content",
        details: errorMessage,
        ...errorDetails,
      },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

