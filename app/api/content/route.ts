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
    await saveContent(updatedContent);
    return NextResponse.json(updatedContent);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}

