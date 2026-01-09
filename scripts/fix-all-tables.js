#!/usr/bin/env node

/**
 * Script pour corriger toutes les tables avec des IDs INTEGER
 * Change le type de colonne id de INTEGER à BIGINT pour impacts et produits
 */

const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Erreur: DATABASE_URL ou DATABASE_PUBLIC_URL doit être défini');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function fixTable(tableName) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log(`\n🔧 Correction de la table ${tableName}...`);
    
    // Vérifier le type actuel
    const currentType = await client.query(`
      SELECT data_type
      FROM information_schema.columns
      WHERE table_name = $1 AND column_name = 'id'
    `, [tableName]);
    
    if (currentType.rows.length === 0) {
      console.log(`   ⚠️  Table ${tableName} non trouvée, ignorée`);
      await client.query('ROLLBACK');
      return;
    }
    
    if (currentType.rows[0].data_type === 'bigint') {
      console.log(`   ✅ Table ${tableName} utilise déjà BIGINT`);
      await client.query('ROLLBACK');
      return;
    }
    
    console.log(`   Type actuel: ${currentType.rows[0].data_type}`);
    
    // Sauvegarder les données
    const existingData = await client.query(`SELECT * FROM ${tableName}`);
    console.log(`   ${existingData.rows.length} enregistrement(s) trouvé(s)`);
    
    // Créer table temporaire
    let createTableQuery = '';
    if (tableName === 'impacts') {
      createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName}_new (
          id BIGSERIAL PRIMARY KEY,
          continent VARCHAR(255),
          pays VARCHAR(255),
          ville VARCHAR(255),
          description TEXT,
          image VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } else if (tableName === 'produits') {
      createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName}_new (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image VARCHAR(500),
          prix VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    }
    
    await client.query(createTableQuery);
    
    // Copier les données
    for (const row of existingData.rows) {
      if (tableName === 'impacts') {
        await client.query(
          `INSERT INTO ${tableName}_new (id, continent, pays, ville, description, image, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [row.id, row.continent, row.pays, row.ville, row.description, row.image, row.created_at, row.updated_at]
        );
      } else if (tableName === 'produits') {
        await client.query(
          `INSERT INTO ${tableName}_new (id, title, description, image, prix, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [row.id, row.title, row.description, row.image, row.prix, row.created_at, row.updated_at]
        );
      }
    }
    
    // Remplacer la table
    await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
    await client.query(`ALTER TABLE ${tableName}_new RENAME TO ${tableName}`);
    
    await client.query('COMMIT');
    console.log(`   ✅ Table ${tableName} corrigée!`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`   ❌ Erreur pour ${tableName}:`, error.message);
  } finally {
    client.release();
  }
}

async function fixAllTables() {
  console.log('🔧 Correction de toutes les tables avec IDs INTEGER...\n');
  
  const tables = ['impacts', 'produits'];
  
  for (const table of tables) {
    await fixTable(table);
  }
  
  console.log('\n✅ Toutes les tables ont été vérifiées et corrigées!');
  await pool.end();
}

fixAllTables().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

