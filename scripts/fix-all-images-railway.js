/**
 * Script pour corriger toutes les colonnes image via Railway
 * Utilise DATABASE_URL de Railway automatiquement
 */

// Essayer de charger dotenv si disponible (pour développement local)
try {
  require("dotenv").config({ path: ".env.local" });
} catch (e) {
  // dotenv non disponible, utiliser les variables d'environnement du système (Railway)
}

const { Pool } = require("pg");

// Utiliser DATABASE_PUBLIC_URL si disponible (pour connexions externes), sinon DATABASE_URL
const connectionString = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL ou DATABASE_PUBLIC_URL non défini");
  process.exit(1);
}

const connectionConfig = {
  connectionString: connectionString,
};

// Configuration SSL pour Railway
if (process.env.NODE_ENV === "production" || process.env.DATABASE_URL?.includes("railway")) {
  connectionConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(connectionConfig);

const tablesToFix = [
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

async function fixAllImageColumns() {
  const client = await pool.connect();
  
  try {
    console.log("🔧 Début de la migration de toutes les colonnes image...");
    console.log(`📡 Connexion à: ${process.env.DATABASE_URL?.substring(0, 30)}...`);
    console.log("");
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const { table, column } of tablesToFix) {
      try {
        // Vérifier si la table existe
        const tableExists = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = $1
          )
        `, [table]);
        
        if (!tableExists.rows[0].exists) {
          console.log(`⚠️  Table ${table} n'existe pas, ignorée`);
          skipCount++;
          continue;
        }
        
        // Vérifier le type actuel
        const checkQuery = `
          SELECT data_type, character_maximum_length
          FROM information_schema.columns
          WHERE table_name = $1 AND column_name = $2
        `;
        const checkResult = await client.query(checkQuery, [table, column]);
        
        if (checkResult.rows.length === 0) {
          console.log(`⚠️  Table ${table} n'a pas de colonne ${column}, ignorée`);
          skipCount++;
          continue;
        }
        
        const currentType = checkResult.rows[0].data_type;
        const maxLength = checkResult.rows[0].character_maximum_length;
        
        if (currentType === "text" || (currentType === "character varying" && maxLength === null)) {
          console.log(`✅ ${table}.${column} : Déjà en TEXT`);
          skipCount++;
          continue;
        }
        
        // Modifier la colonne
        const alterQuery = `ALTER TABLE ${table} ALTER COLUMN ${column} TYPE TEXT`;
        await client.query(alterQuery);
        console.log(`✅ ${table}.${column} : VARCHAR(${maxLength || '?'}) → TEXT`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Erreur ${table}.${column}:`, error.message);
        errorCount++;
      }
    }
    
    console.log("");
    console.log("📊 Résumé:");
    console.log(`   ✅ Modifiées: ${successCount}`);
    console.log(`   ⏭️  Ignorées: ${skipCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log("");
    console.log("✅ Migration terminée !");
    
  } catch (error) {
    console.error("❌ Erreur générale:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixAllImageColumns()
  .then(() => {
    console.log("\n🎉 Script terminé avec succès");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Erreur fatale:", error);
    process.exit(1);
  });
