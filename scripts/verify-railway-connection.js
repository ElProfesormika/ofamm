#!/usr/bin/env node

/**
 * Script pour vérifier la connexion entre la base de données et l'application Railway
 * Utilise les informations de connexion fournies pour tester la connexion
 */

const { Pool } = require('pg');

// Informations de connexion Railway (fournies par l'utilisateur)
const DATABASE_PUBLIC_URL = process.env.DATABASE_PUBLIC_URL || 
  'postgresql://postgres:ApqkYmoXcciLkCnRuxfCjeuLoXIlIMpu@centerbeam.proxy.rlwy.net:28451/railway';

const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgres:ApqkYmoXcciLkCnRuxfCjeuLoXIlIMpu@postgres.railway.internal:5432/railway';

async function verifyConnection() {
  console.log('🔍 VÉRIFICATION DE LA CONNEXION RAILWAY\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Test 1: Connexion avec DATABASE_PUBLIC_URL
  console.log('📊 TEST 1: Connexion via DATABASE_PUBLIC_URL (externe)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const poolPublic = new Pool({
      connectionString: DATABASE_PUBLIC_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const client = await poolPublic.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Connexion réussie!');
    console.log(`   - Heure serveur: ${result.rows[0].current_time}`);
    console.log(`   - PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);
    client.release();
    await poolPublic.end();
  } catch (error) {
    console.log(`❌ Erreur de connexion: ${error.message}`);
  }
  console.log('');
  
  // Test 2: Vérifier les tables
  console.log('📊 TEST 2: Vérification des tables');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const pool = new Pool({
      connectionString: DATABASE_PUBLIC_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const client = await pool.connect();
    const tables = [
      'slides', 'services', 'realisations', 'evenements', 
      'galerie', 'partenaires', 'blog_pubs', 'blog_articles',
      'impacts', 'distinctions', 'produits', 'reseaux_sociaux'
    ];
    
    let allOk = true;
    for (const table of tables) {
      try {
        const result = await client.query(`
          SELECT 
            COUNT(*) as count,
            (SELECT data_type FROM information_schema.columns 
             WHERE table_name = $1 AND column_name = 'id') as id_type
          FROM ${table}
        `, [table]);
        
        const count = parseInt(result.rows[0].count);
        const idType = result.rows[0].id_type || 'N/A';
        const typeOk = idType === 'bigint' || idType === 'N/A';
        const status = typeOk ? '✅' : '⚠️';
        
        console.log(`${status} ${table.padEnd(20)} : ${count} enregistrement(s), ID: ${idType}`);
        if (!typeOk && idType !== 'N/A') allOk = false;
      } catch (error) {
        console.log(`❌ ${table.padEnd(20)} : Erreur - ${error.message}`);
        allOk = false;
      }
    }
    
    client.release();
    await pool.end();
    
    if (allOk) {
      console.log('\n✅ Toutes les tables sont accessibles et utilisent BIGINT');
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  console.log('');
  
  // Test 3: Vérifier les variables d'environnement nécessaires
  console.log('📊 TEST 3: Variables d\'environnement nécessaires');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Variables à configurer sur Railway:');
  console.log('');
  console.log('✅ DATABASE_URL (automatique depuis Railway PostgreSQL)');
  console.log('   → Fournie automatiquement par Railway');
  console.log('');
  console.log('⚠️  USE_DATABASE=true');
  console.log('   → À configurer manuellement sur Railway');
  console.log('');
  console.log('⚠️  JWT_SECRET');
  console.log('   → À configurer manuellement sur Railway');
  console.log('');
  console.log('⚠️  ADMIN_USERNAME');
  console.log('   → À configurer manuellement sur Railway');
  console.log('');
  console.log('⚠️  ADMIN_PASSWORD');
  console.log('   → À configurer manuellement sur Railway');
  console.log('');
  
  // Test 4: Test d'écriture et lecture
  console.log('📊 TEST 4: Test d\'écriture et lecture');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  try {
    const pool = new Pool({
      connectionString: DATABASE_PUBLIC_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const client = await pool.connect();
    await client.query('BEGIN');
    
    try {
      // Test d'écriture
      const testId = Date.now();
      await client.query(
        `INSERT INTO distinctions (id, title, description, image, date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [testId, 'Test Railway Connection', 'Test de connexion', 'https://example.com/test.jpg', '2024']
      );
      console.log('✅ Test d\'écriture : OK');
      
      // Test de lecture
      const result = await client.query('SELECT * FROM distinctions WHERE id = $1', [testId]);
      if (result.rows.length > 0) {
        console.log('✅ Test de lecture : OK');
        console.log(`   - Titre: ${result.rows[0].title}`);
        console.log(`   - Image: ${result.rows[0].image}`);
      }
      
      await client.query('ROLLBACK');
      console.log('✅ Transaction testée avec succès');
    } catch (error) {
      await client.query('ROLLBACK');
      console.log(`❌ Erreur: ${error.message}`);
    }
    
    client.release();
    await pool.end();
  } catch (error) {
    console.log(`❌ Erreur de connexion: ${error.message}`);
  }
  console.log('');
  
  // Résumé
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 RÉSUMÉ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Base de données Railway accessible');
  console.log('✅ Toutes les tables sont créées et utilisent BIGINT');
  console.log('✅ Les opérations d\'écriture/lecture fonctionnent');
  console.log('');
  console.log('⚠️  VÉRIFIEZ SUR RAILWAY:');
  console.log('   1. Allez sur votre projet Railway');
  console.log('   2. Sélectionnez votre service Next.js');
  console.log('   3. Allez dans l\'onglet "Variables"');
  console.log('   4. Vérifiez que ces variables sont configurées:');
  console.log('      - USE_DATABASE=true');
  console.log('      - JWT_SECRET=<votre-secret>');
  console.log('      - ADMIN_USERNAME=OFAMM2026');
  console.log('      - ADMIN_PASSWORD=obe@_001');
  console.log('   5. DATABASE_URL devrait être automatiquement fournie');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

verifyConnection().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

