/**
 * Script pour convertir toutes les colonnes image de VARCHAR(500) à TEXT
 * Nécessaire car les images base64 peuvent être très longues
 */

require("dotenv").config({ path: ".env.local" });
const { Pool } = require("pg");

const connectionConfig = {
  connectionString: process.env.DATABASE_URL,
};

// Configuration SSL pour Railway
if (process.env.NODE_ENV === "production" || process.env.DATABASE_URL?.includes("railway")) {
  connectionConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(connectionConfig);

const tablesWithImageColumns = [
  "slides",
  "realisations",
  "evenements",
  "galerie",
  "partenaires", // colonne "logo"
  "blog_pubs",
  "blog_articles",
  "impacts",
  "distinctions",
  "produits",
];

async function fixImageColumns() {
  const client = await pool.connect();
  
  try {
    console.log("🔧 Début de la migration des colonnes image...");
    
    for (const table of tablesWithImageColumns) {
      const columnName = table === "partenaires" ? "logo" : "image";
      
      try {
        // Vérifier le type actuel de la colonne
        const checkQuery = `
          SELECT data_type, character_maximum_length
          FROM information_schema.columns
          WHERE table_name = $1 AND column_name = $2
        `;
        const checkResult = await client.query(checkQuery, [table, columnName]);
        
        if (checkResult.rows.length === 0) {
          console.log(`⚠️  Table ${table} n'a pas de colonne ${columnName}, ignorée`);
          continue;
        }
        
        const currentType = checkResult.rows[0].data_type;
        const maxLength = checkResult.rows[0].character_maximum_length;
        
        console.log(`\n📋 Table: ${table}, Colonne: ${columnName}`);
        console.log(`   Type actuel: ${currentType}${maxLength ? `(${maxLength})` : ""}`);
        
        if (currentType === "text" || (currentType === "character varying" && maxLength === null)) {
          console.log(`   ✅ Déjà en TEXT, pas de modification nécessaire`);
          continue;
        }
        
        // Modifier la colonne en TEXT
        const alterQuery = `ALTER TABLE ${table} ALTER COLUMN ${columnName} TYPE TEXT`;
        console.log(`   🔄 Modification en cours...`);
        await client.query(alterQuery);
        console.log(`   ✅ Colonne ${columnName} modifiée en TEXT avec succès`);
        
      } catch (error) {
        console.error(`   ❌ Erreur lors de la modification de ${table}.${columnName}:`, error.message);
        // Continuer avec les autres tables
      }
    }
    
    console.log("\n✅ Migration terminée !");
    
  } catch (error) {
    console.error("❌ Erreur générale:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixImageColumns()
  .then(() => {
    console.log("\n🎉 Script terminé avec succès");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Erreur fatale:", error);
    process.exit(1);
  });

