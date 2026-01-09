import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getAdminUser } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Option 1: Stocker en base64 dans la DB (recommandé pour Railway)
    // Convertir l'image en base64
    const base64Image = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    // Option 2: Stocker dans le système de fichiers (pour développement local)
    // Créer le dossier uploads si nécessaire
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${originalName}`;
    const filepath = path.join(uploadsDir, filename);

    // Écrire le fichier (pour développement local)
    try {
      await writeFile(filepath, buffer);
    } catch (error) {
      console.warn("Could not write file to filesystem (this is OK on Railway):", error);
    }

    // En production (Railway), utiliser base64 stocké en DB
    // En développement, on peut utiliser le chemin local
    const useBase64 = process.env.NODE_ENV === "production" || process.env.USE_BASE64_IMAGES === "true";
    
    if (useBase64) {
      // Retourner l'URL base64 pour stockage en DB
      return NextResponse.json({ 
        url: dataUrl, 
        filename: filename,
        storage: "base64"
      });
    } else {
      // Retourner le chemin local pour développement
      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({ 
        url: publicUrl, 
        filename: filename,
        storage: "filesystem"
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

