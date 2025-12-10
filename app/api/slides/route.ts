import { NextRequest, NextResponse } from "next/server";
import { getSlides, saveSlides } from "@/lib/data";
import { getAdminUser } from "@/lib/auth-helpers";

export async function GET() {
  const slides = await getSlides();
  return NextResponse.json(slides);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const slide = await request.json();
    const slides = await getSlides();
    
    const newSlide = {
      ...slide,
      id: slide.id || Date.now().toString(),
    };

    const updatedSlides = [...slides, newSlide];
    await saveSlides(updatedSlides);

    return NextResponse.json(newSlide);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create slide" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updatedSlide = await request.json();
    const slides = await getSlides();
    
    const updatedSlides = slides.map((slide: any) =>
      slide.id === updatedSlide.id ? updatedSlide : slide
    );
    
    await saveSlides(updatedSlides);

    return NextResponse.json(updatedSlide);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update slide" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Slide ID is required" },
        { status: 400 }
      );
    }

    const slides = await getSlides();
    const updatedSlides = slides.filter((slide: any) => slide.id !== id);
    
    await saveSlides(updatedSlides);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete slide" },
      { status: 500 }
    );
  }
}

