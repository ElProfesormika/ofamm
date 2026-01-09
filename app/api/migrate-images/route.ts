import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Vérifier que c'est bien en production ou avec une clé secrète
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.MIGRATION_SECRET || "migration-temp-2024"}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getPool();
    const client = await db.connect();

    try {
      const imageColumnsToMigrate = [
        { table: "galerie", column: "image" },
        { table: "partenaires", column: "logo" },
        { table: "distinctions", column: "image" },
        { table: "impacts", column: "image" },
        { table: "produits", column: "image" },
        { table: "realisations", column: "image" },
        { table: "evenements", column: "image" },
        { table: "blog_pubs", column: "image" },
        { table: "blog_articles", column: "image" },
        { table: "slides", column: "image" },
      ];

      const results: any[] = [];

      for (const { table, column } of imageColumnsToMigrate) {
        try {
          // Vérifier le type actuel
          const checkResult = await client.query(`
            SELECT data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = $1 AND column_name = $2
          `, [table, column]);

          if (checkResult.rows.length === 0) {
            results.push({ table, column, status: "skipped", reason: "Column does not exist" });
            continue;
          }

          const currentType = checkResult.rows[0].data_type;
          const maxLength = checkResult.rows[0].character_maximum_length;

          if (currentType === "text" || (currentType === "character varying" && maxLength === null)) {
            results.push({ table, column, status: "already_text", currentType });
            continue;
          }

          // Modifier la colonne
          await client.query(`ALTER TABLE ${table} ALTER COLUMN ${column} TYPE TEXT`);
          results.push({ table, column, status: "migrated", from: `${currentType}(${maxLength || "?"})`, to: "TEXT" });
        } catch (error: any) {
          results.push({ table, column, status: "error", error: error.message });
        }
      }

      return NextResponse.json({
        success: true,
        message: "Migration completed",
        results,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Migration failed", details: error.message },
      { status: 500 }
    );
  }
}

