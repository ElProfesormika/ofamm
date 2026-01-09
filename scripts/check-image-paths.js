/**
 * Script pour vérifier les chemins d'images dans la base de données
 */

const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL non configurée");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("railway") || DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : false,
});

async function checkImages() {
  const client = await pool.connect();
  
  try {
    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║  VÉRIFICATION DES CHEMINS D'IMAGES                          ║");
    console.log("╚══════════════════════════════════════════════════════════════╝\n");

    // Vérifier les distinctions
    const distinctions = await client.query("SELECT id, title, image FROM distinctions ORDER BY updated_at DESC LIMIT 10");
    console.log(`📸 Distinctions (${distinctions.rows.length}):`);
    distinctions.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.title}`);
      console.log(`     Image: ${row.image || "❌ Aucune image"}`);
      if (row.image) {
        if (row.image.startsWith("http")) {
          console.log(`     ✅ URL externe`);
        } else if (row.image.startsWith("/uploads/")) {
          console.log(`     ⚠️  Chemin local (ne persiste pas sur Railway)`);
        } else {
          console.log(`     ⚠️  Chemin: ${row.image}`);
        }
      }
    });

    // Vérifier les impacts
    const impacts = await client.query("SELECT id, continent, pays, image FROM impacts ORDER BY updated_at DESC LIMIT 10");
    console.log(`\n📸 Impacts (${impacts.rows.length}):`);
    impacts.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.continent || row.pays || "N/A"}`);
      console.log(`     Image: ${row.image || "❌ Aucune image"}`);
      if (row.image) {
        if (row.image.startsWith("http")) {
          console.log(`     ✅ URL externe`);
        } else if (row.image.startsWith("/uploads/")) {
          console.log(`     ⚠️  Chemin local (ne persiste pas sur Railway)`);
        }
      }
    });

    // Vérifier les produits
    const produits = await client.query("SELECT id, title, image FROM produits ORDER BY updated_at DESC LIMIT 10");
    console.log(`\n📸 Produits (${produits.rows.length}):`);
    produits.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.title}`);
      console.log(`     Image: ${row.image || "❌ Aucune image"}`);
      if (row.image) {
        if (row.image.startsWith("http")) {
          console.log(`     ✅ URL externe`);
        } else if (row.image.startsWith("/uploads/")) {
          console.log(`     ⚠️  Chemin local (ne persiste pas sur Railway)`);
        }
      }
    });

  } catch (error) {
    console.error("\n❌ Erreur:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkImages().catch(console.error);

