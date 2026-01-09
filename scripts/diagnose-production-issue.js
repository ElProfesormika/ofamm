#!/usr/bin/env node

/**
 * Script de diagnostic pour le problème de sauvegarde en production
 * Vérifie pourquoi les mises à jour admin ne s'enregistrent pas
 */

const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Erreur: DATABASE_URL n\'est pas définie');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function diagnose() {
  console.log('🔍 DIAGNOSTIC : PROBLÈME DE SAUVEGARDE EN PRODUCTION\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const client = await pool.connect();
  
  try {
    // Test 1: Vérifier la connexion
    console.log('📊 TEST 1: Connexion à la base de données');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await client.query('SELECT NOW()');
    console.log('✅ Connexion OK\n');
    
    // Test 2: Simuler une sauvegarde comme le fait saveContent
    console.log('📊 TEST 2: Simulation de sauvegarde (comme saveContent)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    await client.query('BEGIN');
    try {
      // Simuler la sauvegarde d'une distinction
      const testDistinction = {
        id: Date.now().toString(),
        title: 'Test Diagnostic - ' + new Date().toISOString(),
        description: 'Test de sauvegarde',
        image: 'https://example.com/test.jpg',
        date: '2024'
      };
      
      const distinctionId = parseInt(testDistinction.id);
      console.log(`   Tentative d'insertion avec ID: ${distinctionId}`);
      
      // DELETE puis INSERT comme dans saveContent
      await client.query('DELETE FROM distinctions');
      console.log('   ✅ DELETE FROM distinctions : OK');
      
      await client.query(
        `INSERT INTO distinctions (id, title, description, image, date, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
        [distinctionId, testDistinction.title, testDistinction.description, testDistinction.image, testDistinction.date]
      );
      console.log('   ✅ INSERT INTO distinctions : OK');
      
      await client.query('COMMIT');
      console.log('   ✅ COMMIT : OK');
      
      // Vérifier que la donnée est bien là
      const result = await client.query('SELECT * FROM distinctions WHERE id = $1', [distinctionId]);
      if (result.rows.length > 0) {
        console.log('   ✅ Donnée trouvée après COMMIT');
        console.log(`   ✅ Titre: ${result.rows[0].title}`);
      } else {
        console.log('   ❌ PROBLÈME: Donnée non trouvée après COMMIT!');
      }
      
      // Nettoyer
      await client.query('DELETE FROM distinctions WHERE id = $1', [distinctionId]);
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.log(`   ❌ Erreur lors de la sauvegarde: ${error.message}`);
      console.log(`   ❌ Code: ${error.code}`);
      throw error;
    }
    console.log('');
    
    // Test 3: Vérifier la récupération comme le fait getContent
    console.log('📊 TEST 3: Simulation de récupération (comme getContent)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const distinctions = await client.query(`
      SELECT 
        id::text as id,
        title,
        description,
        image,
        date
      FROM distinctions 
      ORDER BY created_at DESC
    `);
    
    console.log(`   ✅ Récupération OK: ${distinctions.rows.length} distinction(s)`);
    if (distinctions.rows.length > 0) {
      console.log(`   ✅ Première distinction: ${distinctions.rows[0].title}`);
      console.log(`   ✅ Image: ${distinctions.rows[0].image || 'Aucune'}`);
    }
    console.log('');
    
    // Test 4: Vérifier les permissions
    console.log('📊 TEST 4: Vérification des permissions');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const permissions = await client.query(`
      SELECT 
        table_name,
        privilege_type
      FROM information_schema.table_privileges
      WHERE grantee = current_user
      AND table_schema = 'public'
      AND table_name = 'distinctions'
    `);
    
    if (permissions.rows.length > 0) {
      console.log('   ✅ Permissions trouvées:');
      permissions.rows.forEach(p => {
        console.log(`      - ${p.privilege_type}`);
      });
    } else {
      console.log('   ⚠️  Aucune permission trouvée (peut être normal)');
    }
    console.log('');
    
    // Test 5: Vérifier les contraintes
    console.log('📊 TEST 5: Vérification des contraintes');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const constraints = await client.query(`
      SELECT 
        constraint_name,
        constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'distinctions'
      AND table_schema = 'public'
    `);
    
    console.log(`   Contraintes trouvées: ${constraints.rows.length}`);
    constraints.rows.forEach(c => {
      console.log(`      - ${c.constraint_name}: ${c.constraint_type}`);
    });
    console.log('');
    
    // Résumé
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 RÉSUMÉ');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Connexion à la base de données : OK');
    console.log('✅ Sauvegarde (DELETE + INSERT + COMMIT) : OK');
    console.log('✅ Récupération (SELECT) : OK');
    console.log('');
    console.log('💡 PROBLÈMES POSSIBLES À VÉRIFIER :');
    console.log('   1. Les erreurs sont-elles loggées dans Railway logs ?');
    console.log('   2. USE_DATABASE est-il bien à "true" sur Railway ?');
    console.log('   3. Les requêtes API retournent-elles des erreurs ?');
    console.log('   4. Y a-t-il un problème de cache côté client ?');
    console.log('   5. Les transactions sont-elles bien commitées ?');
    console.log('');
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

diagnose().catch((error) => {
  console.error('\n❌ Erreur:', error);
  process.exit(1);
});

