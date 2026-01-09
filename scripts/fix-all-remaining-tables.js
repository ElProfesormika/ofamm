#!/usr/bin/env node

/**
 * Script pour corriger toutes les tables restantes avec des IDs INTEGER
 * Change le type de colonne id de INTEGER à BIGINT pour :
 * - slides
 * - services
 * - realisations
 * - evenements
 * - galerie
 * - partenaires
 * - blog_pubs
 * - blog_articles
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

const tableSchemas = {
  slides: {
    columns: ['id', 'title', 'description', 'image', 'cta_text', 'cta_link', 'created_at', 'updated_at'],
    createQuery: `
      CREATE TABLE IF NOT EXISTS slides_new (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        cta_text VARCHAR(100),
        cta_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  services: {
    columns: ['id', 'title', 'description', 'created_at', 'updated_at'],
    createQuery: `
      CREATE TABLE IF NOT EXISTS services_new (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  realisations: {
    columns: ['id', 'title', 'description', 'image', 'date', 'created_at', 'updated_at'],
    createQuery: `
      CREATE TABLE IF NOT EXISTS realisations_new (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        date VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  evenements: {
    columns: ['id', 'title', 'description', 'image', 'date', 'location', 'created_at', 'updated_at'],
    createQuery: `
      CREATE TABLE IF NOT EXISTS evenements_new (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        date VARCHAR(100),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  galerie: {
    columns: ['id', 'title', 'image', 'created_at', 'updated_at'],
    createQuery: `
      CREATE TABLE IF NOT EXISTS galerie_new (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255),
        image VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  partenaires: {
    columns: ['id', 'name', 'description', 'logo', 'website', 'type', 'created_at', 'updated_at'],
    createQuery: `
      CREATE TABLE IF NOT EXISTS partenaires_new (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo VARCHAR(500),
        website VARCHAR(500),
        type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  blog_pubs: {
    columns: ['id', 'title', 'description', 'image', 'date', 'link', 'created_at', 'updated_at'],
    createQuery: `
      CREATE TABLE IF NOT EXISTS blog_pubs_new (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500),
        date VARCHAR(100),
        link VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  },
  blog_articles: {
    columns: ['id', 'title', 'description', 'excerpt', 'content', 'image', 'date', 'author', 'created_at', 'updated_at'],
    createQuery: `
      CREATE TABLE IF NOT EXISTS blog_articles_new (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        image VARCHAR(500),
        date VARCHAR(100),
        author VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  }
};

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
    const schema = tableSchemas[tableName];
    await client.query(schema.createQuery);
    
    // Copier les données
    for (const row of existingData.rows) {
      const values = schema.columns.map(col => row[col]);
      const placeholders = schema.columns.map((_, i) => `$${i + 1}`).join(', ');
      const columns = schema.columns.join(', ');
      
      await client.query(
        `INSERT INTO ${tableName}_new (${columns}) VALUES (${placeholders})`,
        values
      );
    }
    
    console.log(`   ✅ ${existingData.rows.length} enregistrement(s) copié(s)`);
    
    // Remplacer la table
    await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
    await client.query(`ALTER TABLE ${tableName}_new RENAME TO ${tableName}`);
    
    // Recréer les index si nécessaire
    await client.query(`CREATE INDEX IF NOT EXISTS idx_${tableName}_created_at ON ${tableName}(created_at DESC)`);
    
    await client.query('COMMIT');
    console.log(`   ✅ Table ${tableName} corrigée avec succès!`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`   ❌ Erreur pour ${tableName}:`, error.message);
    throw error;
  } finally {
    client.release();
  }
}

async function fixAllTables() {
  console.log('🔧 Correction de toutes les tables avec IDs INTEGER...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const tables = Object.keys(tableSchemas);
  
  for (const table of tables) {
    await fixTable(table);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Toutes les tables ont été vérifiées et corrigées!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  await pool.end();
}

fixAllTables().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

