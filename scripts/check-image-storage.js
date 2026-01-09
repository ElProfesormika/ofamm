/**
 * Script pour vérifier comment les images sont stockées dans la DB
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

async function checkImageStorage() {
  const client = await pool.connect();
  
  try {
    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║  VÉRIFICATION DU STOCKAGE DES IMAGES                         ║");
    console.log("╚══════════════════════════════════════════════════════════════╝\n");

    // Vérifier les distinctions
    const distinctions = await client.query(`
      SELECT id, title, image, 
             LENGTH(image) as image_length,
             CASE 
               WHEN image LIKE 'data:image/%' THEN 'base64'
               WHEN image LIKE 'http%' THEN 'url_externe'
               WHEN image LIKE '/uploads/%' THEN 'chemin_local'
               ELSE 'autre'
             END as image_type
      FROM distinctions 
      WHERE image IS NOT NULL AND image != ''
      ORDER BY updated_at DESC 
      LIMIT 5
    `);
    
    console.log(`📸 Distinctions avec images (${distinctions.rows.length}):`);
    distinctions.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.title}`);
      console.log(`     Type: ${row.image_type}`);
      console.log(`     Longueur: ${row.image_length} caractères`);
      if (row.image_type === 'base64') {
        console.log(`     ✅ Image en base64 (stockée en DB)`);
      } else if (row.image_type === 'url_externe') {
        console.log(`     ✅ URL externe: ${row.image.substring(0, 50)}...`);
      } else if (row.image_type === 'chemin_local') {
        console.log(`     ⚠️  Chemin local: ${row.image} (ne persiste pas sur Railway)`);
      } else {
        console.log(`     ⚠️  Format inconnu: ${row.image.substring(0, 50)}...`);
      }
    });

    // Vérifier les impacts
    const impacts = await client.query(`
      SELECT id, continent, pays, image,
             CASE 
               WHEN image LIKE 'data:image/%' THEN 'base64'
               WHEN image LIKE 'http%' THEN 'url_externe'
               WHEN image LIKE '/uploads/%' THEN 'chemin_local'
               ELSE 'autre'
             END as image_type
      FROM impacts 
      WHERE image IS NOT NULL AND image != ''
      ORDER BY updated_at DESC 
      LIMIT 5
    `);
    
    console.log(`\n📸 Impacts avec images (${impacts.rows.length}):`);
    impacts.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.continent || row.pays || "N/A"}`);
      console.log(`     Type: ${row.image_type}`);
      if (row.image_type === 'base64') {
        console.log(`     ✅ Image en base64`);
      } else if (row.image_type === 'url_externe') {
        console.log(`     ✅ URL externe`);
      } else {
        console.log(`     ⚠️  ${row.image}`);
      }
    });

    // Vérifier les produits
    const produits = await client.query(`
      SELECT id, title, image,
             CASE 
               WHEN image LIKE 'data:image/%' THEN 'base64'
               WHEN image LIKE 'http%' THEN 'url_externe'
               WHEN image LIKE '/uploads/%' THEN 'chemin_local'
               ELSE 'autre'
             END as image_type
      FROM produits 
      WHERE image IS NOT NULL AND image != ''
      ORDER BY updated_at DESC 
      LIMIT 5
    `);
    
    console.log(`\n📸 Produits avec images (${produits.rows.length}):`);
    produits.rows.forEach((row, i) => {
      console.log(`  ${i + 1}. ${row.title}`);
      console.log(`     Type: ${row.image_type}`);
      if (row.image_type === 'base64') {
        console.log(`     ✅ Image en base64`);
      } else if (row.image_type === 'url_externe') {
        console.log(`     ✅ URL externe`);
      } else {
        console.log(`     ⚠️  ${row.image}`);
      }
    });

    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║  RÉSUMÉ                                                      ║");
    console.log("╚══════════════════════════════════════════════════════════════╝");
    console.log("\n💡 Si les images sont en base64, elles sont stockées en DB");
    console.log("💡 Si ce sont des URLs externes, elles fonctionnent");
    console.log("💡 Si ce sont des chemins /uploads/, elles ne persisteront pas sur Railway\n");

  } catch (error) {
    console.error("\n❌ Erreur:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkImageStorage().catch(console.error);

