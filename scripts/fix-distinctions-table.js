#!/usr/bin/env node

/**
 * Script pour corriger la table distinctions sur Railway
 * Change le type de colonne id de INTEGER à BIGINT
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

async function fixTable() {
  console.log('🔧 Correction de la table distinctions...\n');
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. Vérifier la structure actuelle
    console.log('📊 1. Structure actuelle:');
    const currentStructure = await client.query(`
      SELECT 
        column_name,
        data_type
      FROM information_schema.columns
      WHERE table_name = 'distinctions' AND column_name = 'id'
    `);
    
    if (currentStructure.rows.length > 0) {
      console.log(`   Type actuel: ${currentStructure.rows[0].data_type}`);
    }
    
    // 2. Sauvegarder les données existantes
    console.log('\n💾 2. Sauvegarde des données existantes...');
    const existingData = await client.query('SELECT * FROM distinctions');
    console.log(`   ${existingData.rows.length} distinction(s) trouvée(s)`);
    
    // 3. Créer une table temporaire avec BIGINT
    console.log('\n🔨 3. Création de la table temporaire...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS distinctions_new (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        date VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 4. Copier les données
    console.log('📥 4. Copie des données...');
    for (const row of existingData.rows) {
      await client.query(
        `INSERT INTO distinctions_new (id, title, description, image, date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [row.id, row.title, row.description, row.image, row.date, row.created_at, row.updated_at]
      );
    }
    console.log(`   ✅ ${existingData.rows.length} distinction(s) copiée(s)`);
    
    // 5. Supprimer l'ancienne table et renommer la nouvelle
    console.log('\n🔄 5. Remplacement de la table...');
    await client.query('DROP TABLE IF EXISTS distinctions CASCADE');
    await client.query('ALTER TABLE distinctions_new RENAME TO distinctions');
    
    // 6. Recréer les index si nécessaire
    console.log('📋 6. Création des index...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_distinctions_created_at ON distinctions(created_at DESC)');
    
    await client.query('COMMIT');
    
    console.log('\n✅ Table distinctions corrigée avec succès!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Type de colonne id changé: INTEGER → BIGINT');
    console.log('✅ Les IDs générés par Date.now() fonctionneront maintenant');
    console.log('✅ Toutes les données existantes ont été préservées');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erreur lors de la correction:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixTable().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

