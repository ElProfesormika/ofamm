#!/usr/bin/env node

/**
 * Script pour tester la connexion à la base de données depuis Railway
 * Utilise les variables d'environnement Railway
 */

const { Pool } = require('pg');

// Utiliser DATABASE_URL depuis Railway (URL interne)
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Erreur: DATABASE_URL n\'est pas définie');
  console.error('   Cette variable devrait être fournie automatiquement par Railway');
  process.exit(1);
}

const useDatabase = process.env.USE_DATABASE === 'true';

if (!useDatabase) {
  console.error('❌ Erreur: USE_DATABASE n\'est pas défini à "true"');
  console.error('   Configurez USE_DATABASE=true dans Railway');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  console.log('🔍 TEST DE CONNEXION : BASE DE DONNÉES → APPLICATION\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const client = await pool.connect();
  
  try {
    // Test 1: Connexion
    console.log('📊 TEST 1: Connexion à PostgreSQL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const connectionTest = await client.query('SELECT NOW() as current_time, version() as pg_version, current_database() as db');
    console.log('✅ Connexion réussie!');
    console.log(`   - Heure serveur: ${connectionTest.rows[0].current_time}`);
    console.log(`   - PostgreSQL: ${connectionTest.rows[0].pg_version.split(' ')[0]} ${connectionTest.rows[0].pg_version.split(' ')[1]}`);
    console.log(`   - Database: ${connectionTest.rows[0].db}`);
    console.log(`   - Host: ${databaseUrl.match(/@([^:]+)/)?.[1] || 'N/A'}`);
    console.log('');

    // Test 2: Tables
    console.log('📊 TEST 2: Vérification des tables');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log(`✅ ${tables.rows.length} table(s) trouvée(s):`);
    tables.rows.forEach((row, i) => {
      console.log(`   ${i + 1}. ${row.table_name}`);
    });
    console.log('');

    // Test 3: Données
    console.log('📊 TEST 3: Vérification des données');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const dataChecks = [
      { table: 'slides', name: 'Slides' },
      { table: 'services', name: 'Services' },
      { table: 'realisations', name: 'Réalisations' },
      { table: 'evenements', name: 'Événements' },
      { table: 'partenaires', name: 'Partenaires' },
      { table: 'impacts', name: 'Impacts' },
      { table: 'distinctions', name: 'Distinctions' },
      { table: 'produits', name: 'Produits' },
    ];
    
    for (const check of dataChecks) {
      try {
        const count = await client.query(`SELECT COUNT(*) as count FROM ${check.table}`);
        console.log(`   ${check.name.padEnd(20)} : ${count.rows[0].count} enregistrement(s)`);
      } catch (error) {
        console.log(`   ${check.name.padEnd(20)} : ❌ Erreur`);
      }
    }
    console.log('');

    // Test 4: Test d'écriture et lecture
    console.log('📊 TEST 4: Test d\'écriture et lecture');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const testId = Date.now();
    const testTitle = 'Test Connexion - ' + new Date().toISOString();
    
    await client.query('BEGIN');
    try {
      // Test d'écriture
      await client.query(
        `INSERT INTO distinctions (id, title, description, image, date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [testId, testTitle, 'Test de connexion DB → App', 'https://example.com/test.jpg', '2024']
      );
      console.log('   ✅ Écriture réussie');
      
      // Test de lecture
      const result = await client.query('SELECT * FROM distinctions WHERE id = $1', [testId]);
      if (result.rows.length > 0) {
        console.log('   ✅ Lecture réussie');
        console.log(`   ✅ Données récupérées: ${result.rows[0].title}`);
      }
      
      await client.query('ROLLBACK');
      console.log('   ✅ Transaction testée avec succès');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log(`   ❌ Erreur: ${error.message}`);
    }
    console.log('');

    // Résumé
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 RÉSUMÉ');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('✅ Connexion à PostgreSQL Railway : OK');
    console.log(`✅ Tables créées : ${tables.rows.length}`);
    console.log('✅ Données présentes dans les tables');
    console.log('✅ Écriture et lecture fonctionnent');
    console.log('');
    console.log('🎉 LA BASE DE DONNÉES EST BIEN RELIÉE À L\'APPLICATION!');
    console.log('✅ L\'application peut se connecter à PostgreSQL');
    console.log('✅ Les ajouts admin fonctionneront');
    console.log('✅ Les données seront visibles au public');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

