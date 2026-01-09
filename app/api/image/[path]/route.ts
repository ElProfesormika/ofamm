/**
 * Route API pour servir les images depuis la base de données
 * Si l'image est stockée en base64, on la retourne directement
 * Sinon, on essaie de la servir depuis le système de fichiers
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getPool } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string } }
) {
  try {
    const imagePath = params.path;
    
    // Si c'est une URL externe, rediriger
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return NextResponse.redirect(imagePath);
    }

    // Si c'est une image base64, la décoder et la retourner
    if (imagePath.startsWith("data:image/")) {
      const base64Data = imagePath.split(",")[1];
      const mimeType = imagePath.match(/data:image\/([^;]+)/)?.[1] || "jpeg";
      const buffer = Buffer.from(base64Data, "base64");
      
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": `image/${mimeType}`,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Si c'est un chemin local /uploads/, essayer de le servir
    if (imagePath.startsWith("uploads/") || imagePath.startsWith("/uploads/")) {
      const cleanPath = imagePath.replace(/^\/+/, "");
      const filePath = path.join(process.cwd(), "public", cleanPath);
      
      if (existsSync(filePath)) {
        const fileBuffer = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase().slice(1);
        const mimeTypes: Record<string, string> = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          webp: "image/webp",
          gif: "image/gif",
        };
        
        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": mimeTypes[ext] || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    // Si l'image n'est pas trouvée, retourner une image placeholder
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

